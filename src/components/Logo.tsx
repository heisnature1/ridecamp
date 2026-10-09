import { Link } from "react-router-dom";

/**
 * Future Ride mark: the F leans forward for speed, the R is the road ahead,
 * the plug is the clean power that carries it (per brand brief).
 */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Future Ride home">
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="14" className={light ? "fill-white" : "fill-navy"} />
        {/* forward-leaning F */}
        <path d="M20 14h20l-3 8H28l-2 7h12l-3 8H24l-4 13h-8l8-36z" className={light ? "fill-navy" : "fill-white"} transform="skewX(-6)" />
        {/* plug / clean power */}
        <path d="M42 30v-6h4v6h5v-6h4v6h3a2 2 0 0 1 2 2v5a9 9 0 0 1-7 8.8V52h-4v-6.2A9 9 0 0 1 42 37v-5a2 2 0 0 1 2-2h-2z" className="fill-brand-bright" transform="translate(-6 0) scale(0.92)" />
      </svg>
      <span className="leading-none">
        <span className={`block font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy"}`}>
          Future Ride
        </span>
        <span className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/70" : "text-slate"}`}>
          Spiro distributor · Ghana
        </span>
      </span>
    </Link>
  );
}
