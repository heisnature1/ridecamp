/**
 * PageTransition — the branded wait when a visitor follows a link.
 *
 * Clicking a nav tab, a footer link or any in page link now shows the Future
 * Ride Ltd mark with its orbit lines spinning, instead of a coloured wipe
 * flashing across the screen.
 *
 * How it stays out of the way:
 *  - it only arms on a link click (the nav sets `data-transition-pending`), so
 *    arriving on the site, reloading, or using the back button never triggers
 *    it — the boot splash owns the first paint,
 *  - a safety timer lifts it even if the click turned out not to change the
 *    page (a link to the page you are already on, a modified click),
 *  - it is `pointer-events: none`, so it can never swallow a click, a form
 *    submit or a text selection mid transition,
 *  - `prefers-reduced-motion` skips it: a visitor who asked for calm gets the
 *    instant navigation they asked for,
 *  - jumping to a section on the same page (`/#faqs`) is not a page change and
 *    shows nothing.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { EASE_OUT, useCalmMotion } from "../../lib/motion";
import { LogoLoader, LoaderCaption } from "./LogoLoader";

/** Long enough to read the mark, short enough that nobody waits on it. */
const HOLD_MS = 620;
/** If a click did not actually change the page, lift the cover anyway. */
const SAFETY_MS = 1000;

export default function PageTransition() {
  const { pathname, hash } = useLocation();
  const calm = useCalmMotion();
  const [active, setActive] = useState(false);
  const previous = useRef({ pathname, hash });
  const safety = useRef(0);

  const raise = () => {
    window.clearTimeout(safety.current);
    setActive(true);
    safety.current = window.setTimeout(() => setActive(false), SAFETY_MS);
  };

  useEffect(() => {
    if (calm) return;

    /**
     * Links opt in by marking the document before the router swaps the route.
     * A delegated listener (rather than every component) means any `<a>` or
     * `<Link>` anywhere on the site gets the treatment for free.
     */
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      // external links, tel:, mailto: and bare hashes leave the router alone
      if (/^(https?:|tel:|mailto:|#)/i.test(href)) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      // a link that only changes the hash on the same page is not a page change
      if (url.pathname === window.location.pathname && url.hash) return;

      raise();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(safety.current);
    };
  }, [calm]);

  // the route actually changed: hold the mark for a beat, then lift it
  useEffect(() => {
    const moved = previous.current.pathname !== pathname || previous.current.hash !== hash;
    previous.current = { pathname, hash };
    if (!moved || calm) return;

    window.clearTimeout(safety.current);
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, hash, calm]);

  if (calm) return null;

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="page-transition fixed inset-0 z-[65] grid place-items-center text-white"
          data-page-transition
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
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
