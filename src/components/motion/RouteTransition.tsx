/**
 * Route transition + scroll progress.
 *
 * The page change is a two stage wipe: a brand coloured veil sweeps up over the
 * old page, the new page is already mounted underneath, the veil leaves. Doing
 * it with a separate fixed layer (rather than cross fading the routes) means
 * the incoming page is never mid fade when a visitor lands on it — reading
 * starts immediately and the animation stays decorative.
 *
 * The progress bar is GSAP scrubbed (`useScrollProgress`) so it tracks the real
 * scroll position instead of guessing from React state.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { EASE_IN_OUT, useCalmMotion } from "../../lib/motion";
import { useScrollProgress } from "../../lib/scrollFx";

export function ScrollProgress() {
  useScrollProgress();
  return <div className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}

export function RouteVeil() {
  const { pathname } = useLocation();
  const calm = useCalmMotion();
  const [phase, setPhase] = useState<"idle" | "wiping">("idle");
  const first = useRef(true);

  useEffect(() => {
    // never wipe the very first paint — the hero has its own entrance
    if (first.current) {
      first.current = false;
      return;
    }
    if (calm) return;
    setPhase("wiping");
    const timer = window.setTimeout(() => setPhase("idle"), 520);
    return () => window.clearTimeout(timer);
  }, [pathname, calm]);

  if (calm) return null;

  return (
    <AnimatePresence>
      {phase === "wiping" ? (
        <motion.div
          key={pathname}
          className="route-veil"
          initial={{ scaleY: 0, transformOrigin: "top" }}
          animate={{ scaleY: [0, 1, 1, 0], transformOrigin: ["top", "top", "bottom", "bottom"] }}
          transition={{ duration: 0.52, times: [0, 0.4, 0.55, 1], ease: EASE_IN_OUT }}
          aria-hidden="true"
        />
      ) : null}
    </AnimatePresence>
  );
}
