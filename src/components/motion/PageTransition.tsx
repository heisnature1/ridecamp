/**
 * PageTransition — the branded wait when a visitor follows a link.
 *
 * Clicking a nav tab, a footer link or any in page link shows the Future Ride
 * Ltd mark with its orbit lines spinning. Crucially it is **load driven, not
 * time driven**: it stays up while the destination is still arriving, and only
 * leaves once the page the visitor asked for has actually downloaded and
 * painted. On a fast page that is imperceptible; on a slow one the visitor sees
 * a spinning brand instead of a frozen page.
 *
 * When it lifts is decided by `lib/cover.ts`:
 *  - the route chunk has downloaded (the lazy imports report it),
 *  - the route has committed and survived two animation frames (painted),
 *  - or `CEILING_MS` has passed, because a loading screen must never trap.
 *
 * How it stays out of the way:
 *  - it only arms on a link click, so arriving on the site or going back never
 *    triggers it — the boot splash owns the first paint,
 *  - it is `pointer-events: none`, so it can never swallow a click, a form
 *    submit or a text selection,
 *  - `prefers-reduced-motion` skips it entirely,
 *  - jumping to a section on the same page (`/#faqs`) is not a page change.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { EASE_OUT, useCalmMotion } from "../../lib/motion";
import {
  CEILING_MS,
  coverSnapshot,
  dropCover,
  raiseCover,
  setCoverCalm,
  subscribeToCover,
} from "../../lib/cover";
import { LogoLoader, LoaderCaption } from "./LogoLoader";

export default function PageTransition() {
  const { pathname } = useLocation();
  const calm = useCalmMotion();
  const cover = useSyncExternalStore(subscribeToCover, coverSnapshot, coverSnapshot);
  const [visible, setVisible] = useState(false);
  /** the route that was on screen when the cover went up */
  const raisedOn = useRef(pathname);

  useEffect(() => {
    setCoverCalm(calm);
  }, [calm]);

  /* ---- raise on a link click ---- */
  useEffect(() => {
    if (calm) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (/^(https?:|tel:|mailto:|#)/i.test(href)) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      // a link that only changes the hash on the same page is not a page change
      if (url.pathname === window.location.pathname && url.hash) return;

      raiseCover();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [calm]);

  /* ---- raise while a link is being followed ---- */
  useEffect(() => {
    if (calm) {
      setVisible(false);
      dropCover();
      return;
    }
    if (!cover.pending) {
      setVisible(false);
      return;
    }
    // remember the page being left, so the lift below can tell a real change
    // from a click that went nowhere. Only captured on the way up: once the
    // route commits this must not be overwritten with the new pathname.
    if (!visible) raisedOn.current = pathname;
    setVisible(true);
  }, [calm, cover.pending, visible, pathname]);

  /* ---- lift once the page is here, and only then ---- */
  useEffect(() => {
    if (!cover.pending || calm) return;

    const finish = () => {
      setVisible(false);
      dropCover();
    };

    // still downloading: hold, but never past the ceiling
    if (!cover.loaded) {
      const ceiling = window.setTimeout(finish, CEILING_MS);
      return () => window.clearTimeout(ceiling);
    }

    /**
     * The chunk is in. Lift only once the route has actually committed and the
     * new page has painted — two frames: one for layout, one for paint. If the
     * route has not changed yet (a link to the page you are already on) the
     * ceiling below is what releases the cover.
     */
    if (pathname === raisedOn.current) return;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(finish);
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [calm, cover.pending, cover.loaded, pathname]);

  /* ---- safety: a click that never changes the page must not strand the cover ---- */
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(
      () => {
        setVisible(false);
        dropCover();
      },
      CEILING_MS + 500,
    );
    return () => window.clearTimeout(timer);
  }, [visible]);


  if (calm) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="page-transition fixed inset-0 z-[65] grid place-items-center text-white"
          data-page-transition
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          aria-hidden="true"
        >
          {/* the field the hero and the boot splash use, so the brand is continuous */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/3 top-1/3 size-[26rem] rounded-full bg-brand/20 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/15 blur-[90px]" />
          </div>

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.94, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 1.02 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <LogoLoader size={132} />
            <LoaderCaption label="Loading" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
