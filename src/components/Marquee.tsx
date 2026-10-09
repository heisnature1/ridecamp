import { PRESS } from "../data/site";

export default function Marquee() {
  const row = [...PRESS, ...PRESS];
  return (
    <div className="overflow-hidden border-y border-white/5 bg-ink py-5" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-14">
        {row.map((p, i) => (
          <span key={i} className="flex items-center gap-14 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.3em] text-ash/70">
            {p} <span className="size-1 rounded-full bg-volt/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
