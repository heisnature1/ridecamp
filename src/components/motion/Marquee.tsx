/**
 * Marquee — an infinite horizontal ribbon.
 *
 * Pure CSS animation on a duplicated track (no JS per frame, no layout work),
 * paused on hover so a visitor can actually read it, and frozen entirely under
 * `prefers-reduced-motion`. The duplicate is hidden from assistive tech so the
 * wording is announced once.
 */
import type { ReactNode } from "react";

export default function Marquee({
  children,
  className = "",
  speed = 38,
}: {
  children: ReactNode;
  className?: string;
  /** seconds for one full loop */
  speed?: number;
}) {
  return (
    <div className={`marquee-host group relative overflow-hidden ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
      {/* soft edges so the ribbon fades instead of being chopped */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cloud to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cloud to-transparent" />
    </div>
  );
}
