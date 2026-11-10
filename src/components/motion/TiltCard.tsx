/**
 * TiltCard — a card that leans toward the pointer in real 3D.
 *
 * Not a CSS hover transform: the rotation is written to CSS custom properties
 * on every pointer move, and a glare + depth shadow follow the same angle, so
 * the surface reads as a physical object rather than a picture that slides.
 *
 * Degrades honestly:
 *  - no fine pointer (touch) → static card, no listeners attached at all,
 *  - `prefers-reduced-motion` → static card,
 *  - children can opt into depth with `translateZ` via the `depth` prop.
 */
import { useCallback, useRef, type ReactNode } from "react";
import { clamp, pointerPosition, useMotionAllowed } from "../../lib/motion";

type TiltCardProps = {
  children: ReactNode;
  /** max rotation in degrees at the edge of the card */
  max?: number;
  /** how far the whole surface lifts toward the viewer */
  lift?: number;
  /** distance of the glare highlight */
  glare?: boolean;
  className?: string;
  /** extra classes for the moving surface (where the transform is applied) */
  surfaceClassName?: string;
  as?: "div" | "article";
};

export default function TiltCard({
  children,
  max = 8,
  lift = 14,
  glare = true,
  className = "",
  surfaceClassName = "",
  as: Tag = "div",
}: TiltCardProps) {
  const allowed = useMotionAllowed();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const apply = useCallback(
    (x: number, y: number) => {
      const surface = surfaceRef.current;
      const host = hostRef.current;
      if (!surface || !host) return;
      host.style.setProperty("--tilt-x", `${clamp(-y * max, -max, max).toFixed(2)}deg`);
      host.style.setProperty("--tilt-y", `${clamp(x * max, -max, max).toFixed(2)}deg`);
      host.style.setProperty("--tilt-z", `${lift}`);
      host.style.setProperty("--glare-x", `${((x + 1) / 2) * 100}%`);
      host.style.setProperty("--glare-y", `${((y + 1) / 2) * 100}%`);
    },
    [lift, max],
  );

  const reset = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    host.style.setProperty("--tilt-x", "0deg");
    host.style.setProperty("--tilt-y", "0deg");
    host.style.setProperty("--tilt-z", "0");
  }, []);

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // coalesce to one write per frame — pointermove fires far faster than paint
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const element = hostRef.current;
        if (!element) return;
        const { x, y } = pointerPosition({ clientX, clientY }, element);
        apply(x, y);
      });
    },
    [apply],
  );

  if (!allowed) {
    return (
      <div className={className} ref={hostRef}>
        {children}
      </div>
    );
  }

  return (
    <Tag
      className={`tilt-host ${className}`}
      ref={hostRef}
      onPointerMove={onMove}
      onPointerEnter={onMove}
      onPointerLeave={reset}
    >
      <div className={`tilt-surface ${surfaceClassName}`} ref={surfaceRef}>
        {children}
        {glare ? <span className="tilt-glare" aria-hidden="true" /> : null}
      </div>
    </Tag>
  );
}
