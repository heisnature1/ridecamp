import { Link } from "react-router-dom";

/**
 * Future Ride mark — rendered from the raster artwork in `public/brand/` so the
 * navigation, footer and admin page all show the same mark the photographer
 * stamped onto the site photography.
 *
 *   `light = false` → navy ink on white  (Nav, SpecSheet, light pages)
 *   `light = true`  → white ink on navy  (Footer, dark sections)
 *
 * The mark is the cropped tile (navy square, forward-leaning F, green plug); the
 * "Future Ride" wordmark beside it is the site name, kept in type so it stays
 * readable at every breakpoint.
 */
export default function Logo({ light = false }: { light?: boolean }) {
  const src = light ? "/brand/logo-mark-only-white.png" : "/brand/logo-mark-only.png";

  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Future Ride home">
      <img
        src={src}
        alt="Future Ride mark"
        className="size-12 shrink-0"
        loading="eager"
        decoding="async"
      />
      <span className="leading-none">
        <span
          className={`block font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-navy"}`}
        >
          Future Ride
        </span>
        <span
          className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/70" : "text-slate"}`}
        >
          Spiro distributor · Ghana
        </span>
      </span>
    </Link>
  );
}