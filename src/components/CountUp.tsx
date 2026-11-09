import { useEffect, useRef, useState } from "react";
import { easeOutExpo, fmtInt } from "../lib/format";

export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
  duration = 2200,
  className,
  autoStart = true,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
  autoStart?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!autoStart) return;

    const el = ref.current;
    if (!el) return;
    if (started.current) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setDisplay(value * easeOutExpo(p));
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };

    // Count up when the number actually scrolls into view. If it is already on
    // screen (or IntersectionObserver is unavailable) start straight away so a
    // stat is never left sitting at 0.
    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);

    // Safety net: if the observer never fires (e.g. the element is inside a
    // transformed/hidden subtree), still land on the real value.
    const fallback = window.setTimeout(run, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [value, duration, autoStart]);

  const text = decimals > 0 ? display.toFixed(decimals) : fmtInt(display);

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}
