import { Link } from "react-router-dom";
import { ArrowRight, BatteryCharging, Gauge, Package, ShieldCheck, Wifi, Zap } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import CallbackForm from "../components/CallbackForm";
import { BIKE_SPECS, MODEL } from "../data/site";

const FEATURES = [
  { icon: Zap, title: "Swap-ready in 20 s", text: "Two removable FR-1 packs exchange at any station on the network — no waiting for a charge." },
  { icon: Gauge, title: "Torque for traffic", text: "Instant 12 kW peak power and a top speed tuned for dense urban routes." },
  { icon: Package, title: "Built to carry", text: "Reinforced rack and frame rated for 320 kg of cargo, passenger or produce." },
  { icon: BatteryCharging, title: "2,000-cycle packs", text: "LFP chemistry managed by an on-board BMS, engineered for years of daily swaps." },
  { icon: Wifi, title: "Connected fleet", text: "Live telemetry, geofencing and pay-as-you-ride billing from the rider app." },
  { icon: ShieldCheck, title: "Tough by design", text: "IP67 electrics, 180 mm ground clearance and dual-channel braking as standard." },
];

const SPECS_TABLE: [string, string][] = [
  ["Motor", "Mid-drive, 6 kW rated / 12 kW peak"],
  ["Battery", "2 × FR-1 swappable LFP packs (3.6 kWh total)"],
  ["Range per swap", "110 km (WMTC)"],
  ["Top speed", "95 km/h"],
  ["Payload", "320 kg"],
  ["Brakes", "Disc front & rear, combined braking"],
  ["Suspension", "Telescopic front, twin adjustable rear"],
  ["Charging", "Swap-only — batteries included in network plan"],
  ["Weight (no packs)", "98 kg"],
  ["Warranty", "3 years / 60,000 km"],
];

export default function Bike() {
  return (
    <>
      <PageHero
        kicker="The motorcycle"
        title="FR Volt 450."
        sub={`${MODEL.tagline} ${MODEL.blurb} ${MODEL.priceNote}`}
      />

      <section className="bg-coal pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img src="/images/bike-studio.jpg" alt={`${MODEL.name} side profile`} className="w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-3 bg-gradient-to-t from-ink/95 to-transparent p-6">
                {BIKE_SPECS.map((s) => (
                  <span key={s.label} className="rounded-full border border-white/15 bg-ink/60 px-4 py-2 text-xs font-semibold text-cream backdrop-blur">
                    <CountUp value={s.value} duration={900} /> {s.unit} · {s.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="h-full rounded-3xl border border-white/10 bg-ink p-7 transition-colors hover:border-volt/40">
                  <f.icon className="size-6 text-volt" />
                  <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-ash">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_360px]">
            <Reveal>
              <h2 className="font-display text-2xl font-bold">Full specifications</h2>
              <dl className="mt-6 divide-y divide-white/5 rounded-3xl border border-white/10 bg-ink">
                {SPECS_TABLE.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[140px_1fr] gap-4 px-6 py-4 text-sm">
                    <dt className="text-ash">{k}</dt>
                    <dd className="text-cream/90">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-volt/30 bg-volt/10 p-8">
                <h3 className="font-display text-xl font-bold">Try it on your route.</h3>
                <p className="mt-3 text-sm text-cream/80">
                  Test rides take 30 minutes at any service centre. Bring your licence — we’ll bring a charged bike.
                </p>
                <Link
                  to="/book-test-ride"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-ink hover:brightness-110"
                >
                  Book test ride <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CallbackForm />
    </>
  );
}
