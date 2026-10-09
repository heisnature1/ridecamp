import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { CALC } from "../data/site";
import { fmtInt } from "../lib/format";
import { WA_DEFAULT } from "../lib/leads";

function Num({
  label,
  value,
  onChange,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="flex justify-between font-semibold text-navy">
        {label}
        {suffix && <em className="not-italic text-slate">{suffix}</em>}
      </span>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-2.5 font-semibold text-navy outline-none focus:border-brand"
      />
    </label>
  );
}

export default function Calculator() {
  const [kmPerDay, setKmPerDay] = useState(100);
  const [days, setDays] = useState(CALC.daysPerMonthDefault);
  const [kmPerLitre, setKmPerLitre] = useState(CALC.kmPerLitreDefault);
  const [petrolPrice, setPetrolPrice] = useState(CALC.petrolPriceDefault);
  const [maintenance, setMaintenance] = useState(CALC.maintenanceDefault);

  const r = useMemo(() => {
    const monthlyKm = kmPerDay * days;
    const petrolCost = kmPerLitre > 0 ? (monthlyKm / kmPerLitre) * petrolPrice : 0;
    const evCost = monthlyKm * CALC.evCostPerKm;
    const maintenanceSaving = Math.max(0, maintenance - CALC.evMaintenancePerMonth);
    const monthly = petrolCost + maintenance - (evCost + CALC.evMaintenancePerMonth);
    return { petrolCost, evCost, maintenanceSaving, monthly, yearly: monthly * 12 };
  }, [kmPerDay, days, kmPerLitre, petrolPrice, maintenance]);

  return (
    <div className="grid gap-8 rounded-3xl border border-line bg-white p-6 shadow-sm md:p-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h3 className="font-display text-2xl font-bold text-navy">See how much you could save</h3>
        <p className="mt-2 text-sm text-slate">
          Move the sliders to match your riding. All figures in Ghana cedis (GH₵).
        </p>

        <label className="mt-8 block text-sm">
          <span className="flex justify-between font-semibold text-navy">
            Kilometres ridden per day
            <span className="font-display text-xl font-bold text-brand tabular-nums">{kmPerDay} km</span>
          </span>
          <input
            type="range"
            min={10}
            max={250}
            step={5}
            value={kmPerDay}
            onChange={(e) => setKmPerDay(Number(e.target.value))}
            className="fr-range mt-3"
            aria-label="Kilometres ridden per day"
          />
        </label>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Num label="Days ridden per month" value={days} onChange={setDays} />
          <Num label="Current bike fuel use" suffix="km per litre" value={kmPerLitre} onChange={setKmPerLitre} />
          <Num label="Petrol price" suffix="GH₵ / litre" value={petrolPrice} onChange={setPetrolPrice} step={0.5} />
          <Num label="Maintenance spend (optional)" suffix="GH₵ / month" value={maintenance} onChange={setMaintenance} step={10} />
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-slate">
          Indicative figures based on typical usage. Actual savings vary by city, route, load and
          financing path. Electric cost per km uses the standard swap tariff.
        </p>
      </div>

      <div className="flex flex-col justify-center rounded-2xl bg-navy p-7 text-white md:p-9">
        <p className="text-sm text-white/70">Your estimated monthly saving</p>
        <p className="mt-1 font-display text-3xl font-bold tabular-nums text-brand-bright">
          GH₵ {fmtInt(Math.max(0, r.monthly))}
        </p>
        <div className="my-5 h-px bg-white/15" />
        <p className="font-display text-2xl font-bold leading-snug md:text-3xl">
          Over a year, you could save{" "}
          <span className="text-brand-bright tabular-nums">GH₵ {fmtInt(Math.max(0, r.yearly))}.</span>
        </p>
        <div className="mt-5 space-y-1.5 text-xs text-white/70">
          <p>Petrol bike: GH₵ {fmtInt(r.petrolCost)} fuel + GH₵ {fmtInt(maintenance)} care / month</p>
          <p>Ekon 450 M1: GH₵ {fmtInt(r.evCost)} energy + GH₵ {fmtInt(CALC.evMaintenancePerMonth)} care / month</p>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark"
          >
            Book a Test Ride <ArrowRight className="size-4" />
          </Link>
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-105"
          >
            <MessageCircle className="size-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
