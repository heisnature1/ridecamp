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
    
    // Start immediately - parent handles scroll reveal via framer-motion
    if (started.current) return;
    started.current = true;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setDisplay(value * easeOutExpo(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration, autoStart]);

  const text = decimals > 0 ? display.toFixed(decimals) : fmtInt(display);

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}
