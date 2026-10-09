import { Cpu, Lock, Radio, ThermometerSun } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CallbackForm from "../components/CallbackForm";

const PILLARS = [
  {
    icon: Cpu,
    title: "FR-1 swappable pack",
    text: "A rugged 1.8 kWh LFP pack with an on-board BMS, rated for 2,000 swap cycles and sealed to IP67 against dust, rain and washdowns.",
  },
  {
    icon: ThermometerSun,
    title: "Thermal discipline",
    text: "Cell-level temperature monitoring and passive cooling keep packs in their sweet spot from coastal humidity to highland heat.",
  },
  {
    icon: Radio,
    title: "Always-on telemetry",
    text: "Every bike streams health, location and energy data over 4G, so maintenance happens before breakdowns do.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    text: "Packs cryptographically paired to their bike. Remote immobilisation and cabinet-level authentication protect riders and assets.",
  },
];

const NUMBERS = [
  { v: "20 s", l: "Average swap time" },
  { v: "2,000", l: "Pack cycle life" },
  { v: "IP67", l: "Ingress protection" },
  { v: "4G", l: "Fleet connectivity" },
];

export default function Technology() {
  return (
    <>
      <PageHero
        kicker="Technology"
        title="Hardware and software, built as one."
        sub="From the pack in the frame to the cabinet on the corner — one system, one network, one account."
      />

      <section className="bg-ink pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img src="/images/battery-tech.jpg" alt="FR-1 swappable battery pack" className="h-[380px] w-full object-cover md:h-[460px]" />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-2 bg-gradient-to-t from-ink/95 to-transparent p-6 md:grid-cols-4">
                {NUMBERS.map((n) => (
                  <div key={n.l}>
                    <p className="font-display text-2xl font-bold text-volt">{n.v}</p>
                    <p className="text-xs text-cream/70">{n.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-coal p-8 transition-colors hover:border-volt/40">
                  <p.icon className="size-6 text-volt" />
                  <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallbackForm />
    </>
  );
}
