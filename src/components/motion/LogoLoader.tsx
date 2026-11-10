/**
 * LogoLoader — the brand's waiting state.
 *
 * The Future Ride Ltd mark sits still in the middle while three dashed orbits
 * spin around it at different speeds and directions, plus a soft gradient sweep
 * that completes each revolution. It is used in two places:
 *
 *  - `BootSplash`, the full screen cover shown on first load while the initial
 *    route chunk arrives,
 *  - the `<Suspense>` fallback, so navigating to a page that has not downloaded
 *    yet shows the same thing rather than a bare spinner.
 *
 * Behaviour rules:
 *  - it always goes away. `BootSplash` races the real load against a hard cap,
 *    so a slow or failed chunk cannot leave a visitor staring at it.
 *  - `prefers-reduced-motion` freezes the orbits (they are drawn statically) and
 *    keeps the label, so the screen still communicates "loading".
 *  - it announces itself once to assistive tech and hides the decoration.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT, useCalmMotion } from "../../lib/motion";

/** The rings + mark, with no overlay. Reused by the splash and the fallback. */
export function LogoLoader({ label = "Loading", size = 180 }: { label?: string; size?: number }) {
  const calm = useCalmMotion();

  return (
    <div
      className="logo-loader relative grid place-items-center"
      style={{ width: size, height: size }}
      role="status"
      aria-live="polite"
    >
      {/* the halo behind the mark */}
      <span className="logo-halo" aria-hidden="true" />

      {/* three arcs, each on its own tempo and direction */}
      <svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
        data-orbits
      >
        <defs>
          <linearGradient id="fr-orbit-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0" />
            <stop offset="45%" stopColor="#4ade80" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fr-orbit-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* the track the arcs appear to run on */}
        <circle
          cx="100"
          cy="100"
          r="94"
          stroke="#ffffff"
          strokeOpacity="0.1"
          strokeWidth="1.5"
          strokeDasharray="1 7"
        />

        <g className={calm ? undefined : "orbit orbit-a"}>
          <circle
            cx="100"
            cy="100"
            r="94"
            stroke="url(#fr-orbit-a)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="170 420"
          />
        </g>
        <g className={calm ? undefined : "orbit orbit-b"}>
          <circle
            cx="100"
            cy="100"
            r="82"
            stroke="url(#fr-orbit-b)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="86 400"
          />
        </g>
        <g className={calm ? undefined : "orbit orbit-c"}>
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="#4ade80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="34 370"
            opacity="0.9"
          />
        </g>
      </svg>

      {/* the mark */}
      <img
        src="/brand/mark-512.png"
        alt=""
        width={Math.round(size * 0.52)}
        height={Math.round(size * 0.52)}
        className={`relative z-10 select-none ${calm ? "" : "mark-arrive"}`}
        draggable={false}
      />

      <span className="sr-only">{label}</span>
    </div>
  );
}

/** The visible wordmark + label that sits under the loader. */
export function LoaderCaption({ label = "Loading" }: { label?: string }) {
  const calm = useCalmMotion();
  return (
    <div className="mt-6 text-center">
      <p className="font-display text-sm font-bold tracking-tight text-white">Future Ride Ltd</p>
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
        {label}
        {calm ? null : <span className="loader-dots" aria-hidden="true" />}
      </p>
    </div>
  );
}

/**
 * Full screen first paint cover.
 *
 * It waits for the window `load` event *and* a short minimum so the mark is not
 * a one frame flash, but never longer than `MAX_MS`. If the bundle or an image
 * errors, the cap still releases the page — the loader is never a gate.
 */
const MIN_MS = 650;
const MAX_MS = 4200;

/**
 * Remove the static cover in `index.html`.
 *
 * That cover is plain HTML so it paints before the bundle does, and it carries a
 * CSS only fail safe that lifts it after six seconds regardless. React normally
 * gets there first, which is why this runs before the first paint effect.
 */export default function BootSplash() {
  const [visible, setVisible] = useState(true);
  const calm = useCalmMotion();

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    // the React loader is already painted underneath; drop the static one now
    document.getElementById("boot-splash")?.remove();

    const release = () => {
      const elapsed = Date.now() - started;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, wait);
    };

    const cap = window.setTimeout(() => {
      if (!cancelled) setVisible(false);
    }, MAX_MS);

    if (document.readyState === "complete") {
      release();
    } else {
      window.addEventListener("load", release, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      window.removeEventListener("load", release);
    };
  }, []);

  // keep the page from scrolling behind the cover
  useEffect(() => {
    document.getElementById("boot-splash")?.remove();
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="boot-splash fixed inset-0 z-[70] grid place-items-center bg-navy"
          data-boot-splash
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: calm ? 0.01 : 0.6, ease: EASE_OUT }}
          aria-label="Loading Future Ride Ltd"
        >
          {/* the same depth field the hero uses, so the brand feels continuous */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/4 top-1/4 size-[28rem] rounded-full bg-brand/20 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-cyan-500/15 blur-[90px]" />
            <div className="hero-grid absolute inset-x-0 bottom-0 h-1/2 opacity-20" />
          </div>

          <div className="relative flex flex-col items-center">
            <LogoLoader />
            <LoaderCaption />
            {calm ? null : (
              <div className="mt-6 h-0.5 w-40 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full w-1/2 rounded-full bg-gradient-to-r from-brand to-brand-bright"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
