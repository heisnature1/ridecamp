/**
 * Shared motion vocabulary.
 *
 * Every animation on the site pulls its timing from here so the whole thing
 * moves like one object rather than a pile of unrelated effects. Three rules:
 *
 * 1. `prefers-reduced-motion` wins. `useCalmMotion()` is checked by every
 *    component that moves something, and the CSS blanket rule in `index.css`
 *    covers anything that slips through.
 * 2. Nothing blocks reading. Motion is on the way in, never in the way of the
 *    content; no element starts invisible without a guarantee it will appear.
 * 3. Touch devices get the cheap version. Tilt and pointer effects are skipped
 *    when there is no fine pointer, and parallax is skipped outright.
 */
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* easing                                                              */
/* ------------------------------------------------------------------ */

/** Long, decelerating — the house curve for entrances. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** Symmetric, for things that move through the middle of the screen. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
/** Snappy, for hover and press feedback. */
export const EASE_SPRING = { type: "spring" as const, stiffness: 420, damping: 26 };
/** GSAP equivalent of `EASE_OUT`, for the GSAP powered bits. */
export const GSAP_EASE = "power3.out";

/* ------------------------------------------------------------------ */
/* durations (seconds)                                                 */
/* ------------------------------------------------------------------ */

export const DUR = {
  fast: 0.24,
  base: 0.55,
  slow: 0.9,
  hero: 1.15,
} as const;

/* ------------------------------------------------------------------ */
/* variants                                                            */
/* ------------------------------------------------------------------ */

/** Container that releases its children one after another. */
export const staggerParent = (stagger = 0.07, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
};

/** Rises out of its own clipped box — used for headings. */
export const riseFromMask = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE_OUT } },
};

/* ------------------------------------------------------------------ */
/* media queries                                                       */
/* ------------------------------------------------------------------ */

function useMedia(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return fallback;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the visitor asked the system to tone motion down. */
export function useCalmMotion(): boolean {
  return useMedia("(prefers-reduced-motion: reduce)");
}

/** True on a real pointer (mouse/trackpad) — touch and pen get no tilt. */
export function useFinePointer(): boolean {
  return useMedia("(hover: hover) and (pointer: fine)");
}

/** Everything a decorative animation should ask before it starts. */
export function useMotionAllowed(): boolean {
  const calm = useCalmMotion();
  const fine = useFinePointer();
  return !calm && fine;
}

/**
 * Clamp a value into a range. Used by the pointer tilt maths so a cursor
 * parked in a corner cannot spin a card past the intended few degrees.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Normalised pointer position inside an element: -1 at the top/left edge,
 * +1 at the bottom/right edge, 0 in the middle.
 */
export function pointerPosition(
  event: { clientX: number; clientY: number },
  element: HTMLElement,
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
  const y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  return { x, y };
}

/**
 * Depth scaled pointer parallax for a whole scene.
 *
 * Writes `--px` / `--py` (−1…1) onto the host element once per frame; children
 * read them through CSS `translate3d` at whatever strength their own depth
 * deserves, e.g. `translate3d(calc(var(--px) * 26px), calc(var(--py) * 18px), 0)`.
 * One listener for the entire scene, no React renders while the pointer moves.
 */
export function useSceneParallax<T extends HTMLElement>() {
  const allowed = useMotionAllowed();
  const ref = useRef<T | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const host = ref.current;
    if (!allowed || !host) return;

    const write = (clientX: number, clientY: number) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const { x, y } = pointerPosition({ clientX, clientY }, host);
        host.style.setProperty("--px", x.toFixed(3));
        host.style.setProperty("--py", y.toFixed(3));
      });
    };

    const onMove = (event: PointerEvent) => write(event.clientX, event.clientY);
    const onLeave = () => {
      host.style.setProperty("--px", "0");
      host.style.setProperty("--py", "0");
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame.current);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [allowed]);

  return ref;
}
