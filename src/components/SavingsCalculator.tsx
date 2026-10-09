import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Bike, Fuel } from "lucide-react";
import { Link } from "react-router-dom";
import { getCountry, ASSUMPTIONS } from "../data/site";
import { fmtInt } from "../lib/format";
import CountUp from "./CountUp";

const RIDING_DAYS = 330;
const L_PER_KM = 0.025; // 2.5 L / 100 km

export default function SavingsCalculator({ countryCode }: { countryCode: string }) {
  const country = getCountry(countryCode);
  const [km, setKm] = useState(100);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const calc = useMemo(() => {
    const petrolPerKm = country.petrolPerLitre * L_PER_KM;
    const evPerKm = country.evPerKm;
    const daily = Math.max(0, (petrolPerKm - evPerKm) * km);
    const yearly = daily * RIDING_DAYS;
    const petrolDaily = petrolPerKm * km;
    const evDaily = evPerKm * km;
    return { daily, yearly, petrolDaily, evDaily };
  }, [country, km]);

  const maxDaily = (country.petrolPerLitre * L_PER_KM - country.evPerKm) * 250;

  return (
    <section className="relative overflow-hidden bg-coal py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 20%, rgba(200,240,75,0.10), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-volt">Savings calculator</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            Ride more,
            <br />
            save more.
          </h2>
          <p className="mt-4 max-w-md text-ash">
            Compare the cost of {country.name} petrol riding against the Future Ride network.
          </p>

          <label className="mt-10 block">
            <span className="flex items-baseline justify-between text-sm font-medium text-cream/80">
              How much do you ride each day?
              <span className="font-display text-2xl font-bold text-volt tabular-nums">{km} km</span>
            </span>
            <input
              type="range"
              min={20}
              max={250}
              step={5}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="fr-range mt-4"
              aria-label="Kilometres ridden per day"
            />
          </label>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <Fuel className="size-4 shrink-0 text-ash" />
              <div className="h-3 rounded-full bg-moss" style={{ width: "100%" }}>
                <div
                  className="h-full rounded-full bg-ash/70 transition-all duration-300"
                  style={{ width: `${Math.min(100, (calc.petrolDaily / Math.max(1, maxDaily)) * 100 * (250 / Math.max(km, 1)))}%` }}
                />
              </div>
              <span className="w-28 text-right text-sm tabular-nums text-cream/70">
                {country.currency} {fmtInt(calc.petrolDaily)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Bike className="size-4 shrink-0 text-volt" />
              <div className="h-3 rounded-full bg-moss" style={{ width: "100%" }}>
                <div
                  className="h-full rounded-full bg-volt transition-all duration-300"
                  style={{ width: `${Math.max(4, Math.min(100, (calc.evDaily / Math.max(1, maxDaily)) * 100 * (250 / Math.max(km, 1))))}%` }}
                />
              </div>
              <span className="w-28 text-right text-sm tabular-nums text-volt">
                {country.currency} {fmtInt(calc.evDaily)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAssumptions((v) => !v)}
            className="mt-6 flex items-center gap-1 text-xs text-ash hover:text-cream"
          >
            Full breakdown
            <ChevronDown className={`size-3.5 transition-transform ${showAssumptions ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showAssumptions && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-1.5 overflow-hidden text-xs text-ash"
              >
                {ASSUMPTIONS.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-volt">—</span> {a}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <p className="mt-4 text-[11px] text-ash/70">
            Indicative figures based on typical rider usage. Actual savings vary by city, route and financing path.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-ink/60 p-8 md:p-10">
          <p className="text-sm text-ash">Extra savings when you ride daily with Future Ride</p>
          <p className="mt-3 font-display text-5xl font-bold tabular-nums text-volt md:text-6xl">
            {country.currency} <CountUp value={calc.daily} duration={600} key={`${country.code}-${km}`} />
          </p>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-ash">Over a year, that’s</p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-cream md:text-4xl">
              {country.currency} <CountUp value={calc.yearly} duration={600} key={`y-${country.code}-${km}`} />
              <span className="text-volt"> extra saved</span>
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/book-test-ride"
              className="inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-ink hover:brightness-110"
            >
              Book Test Ride <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/bike"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-cream hover:border-volt hover:text-volt"
            >
              Explore the bike
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
