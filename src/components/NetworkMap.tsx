import { useMemo, useState } from "react";
import { Zap, Wrench } from "lucide-react";
import { COUNTRIES, getCountry } from "../data/site";
import { africaDots, project } from "../lib/geo";

const W = 720;
const H = 740;

export default function NetworkMap() {
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code);
  const [cityIdx, setCityIdx] = useState(0);
  const country = getCountry(countryCode);
  const city = country.cities[Math.min(cityIdx, country.cities.length - 1)];

  const dots = useMemo(() => africaDots(W, H), []);
  const pins = useMemo(
    () => country.cities.map((c) => ({ ...c, ...project(c.lon, c.lat, W, H) })),
    [country],
  );
  const selected = pins[Math.min(cityIdx, pins.length - 1)];

  const totals = useMemo(
    () =>
      country.cities.reduce(
        (acc, c) => ({ s: acc.s + c.swapStations, v: acc.v + c.serviceCentres }),
        { s: 0, v: 0 },
      ),
    [country],
  );

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-volt">Coverage</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
          The largest EV ecosystem on the continent.
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCountryCode(c.code);
                  setCityIdx(0);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  c.code === countryCode
                    ? "border-volt bg-volt text-ink"
                    : "border-white/15 text-cream/75 hover:border-white/40"
                }`}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-5 text-xs text-ash">
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-volt" /> Swap Station
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="size-3.5 text-cream/70" /> Service Centre
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-coal">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Future Ride network map for ${country.name}`}>
              {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={1.7} className="fill-moss" />
              ))}
              {pins.map((p) => (
                <g
                  key={p.name}
                  transform={`translate(${p.x} ${p.y})`}
                  className="cursor-pointer"
                  onClick={() => setCityIdx(country.cities.findIndex((c) => c.name === p.name))}
                >
                  {p.name === selected.name && (
                    <circle
                      r={10}
                      className="fill-volt/25 animate-pulse-ring"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  )}
                  <circle r={7} className={p.name === selected.name ? "fill-volt" : "fill-slate stroke-volt/60"} strokeWidth={1.5} />
                  <path d="M1.5 -4 -1.8 1h1.9l-.9 3.4 3.6-4.6H2.8l1-3.8z" className={p.name === selected.name ? "fill-ink" : "fill-volt"} />
                </g>
              ))}
            </svg>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-coal p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">{city?.name ?? country.name}</h3>
                <span className="text-2xl">{country.flag}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-moss/50 p-4">
                  <Zap className="size-5 text-volt" />
                  <p className="mt-2 font-display text-3xl font-bold tabular-nums">{totals.s}</p>
                  <p className="text-xs text-ash">Swap stations</p>
                </div>
                <div className="rounded-2xl bg-moss/50 p-4">
                  <Wrench className="size-5 text-cream/70" />
                  <p className="mt-2 font-display text-3xl font-bold tabular-nums">{totals.v}</p>
                  <p className="text-xs text-ash">Service centres</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-coal p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ash">Select city</p>
              <div className="mt-3 flex flex-col gap-1.5">
                {country.cities.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setCityIdx(i)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                      i === cityIdx ? "bg-volt text-ink font-semibold" : "bg-moss/40 text-cream/80 hover:bg-moss"
                    }`}
                  >
                    {c.name}
                    <span className="tabular-nums text-xs opacity-70">
                      ⚡{c.swapStations} · 🔧{c.serviceCentres}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
