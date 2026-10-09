import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { GHANA_CITIES, ghanaDots, project } from "../lib/geo";

const W = 560;
const H = 700;

export default function GhanaMap() {
  const dots = useMemo(() => ghanaDots(W, H), []);
  const pins = useMemo(() => GHANA_CITIES.map((c) => ({ ...c, ...project(c.lon, c.lat, W, H) })), []);
  const [active, setActive] = useState("Accra");
  const current = pins.find((p) => p.name === active) ?? pins[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-3xl bg-navy p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Future Ride swap network map of Ghana">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.1} className="fill-white/12" />
          ))}
          {pins.map((p) => {
            const launch = p.status === "Launch city";
            const on = p.name === active;
            return (
              <g
                key={p.name}
                transform={`translate(${p.x} ${p.y})`}
                className="cursor-pointer"
                onClick={() => setActive(p.name)}
              >
                {on && (
                  <circle
                    r={11}
                    className={launch ? "fill-brand-bright/30 animate-pulse-ring" : "fill-white/20 animate-pulse-ring"}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                )}
                <circle
                  r={7}
                  className={launch ? "fill-brand-bright" : "fill-navy stroke-white/70"}
                  strokeWidth={2}
                />
                <text
                  y={-13}
                  textAnchor="middle"
                  className={`fill-white font-semibold ${on ? "text-[15px]" : "text-[12px] opacity-70"}`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="flex flex-col gap-3">
        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-navy">{current.name}</h3>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                current.status === "Launch city" ? "bg-mint text-brand-dark" : "bg-cloud text-slate"
              }`}
            >
              {current.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate">
            {current.status === "Launch city"
              ? "First swap points open here. Addresses and opening hours will be published at launch."
              : "On the rollout plan. Join the waitlist and we'll message you when swapping goes live."}
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-white p-4">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate">Ghana network</p>
          <div className="flex flex-col gap-1.5">
            {pins.map((p) => (
              <button
                key={p.name}
                onClick={() => setActive(p.name)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                  p.name === active ? "bg-navy text-white" : "bg-cloud text-navy hover:bg-mint"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className={`size-4 ${p.status === "Launch city" ? "text-brand-bright" : "text-slate"}`} />
                  {p.name}
                </span>
                <span className={`text-[11px] font-medium ${p.name === active ? "text-white/70" : "text-slate"}`}>
                  {p.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
