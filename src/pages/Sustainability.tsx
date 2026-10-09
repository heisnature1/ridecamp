import { Leaf, Recycle, SunMedium, Users } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import CallbackForm from "../components/CallbackForm";

const POINTS = [
  { icon: SunMedium, title: "Charged with the sun", text: "Over 60% of network energy is sourced from solar and hydro across our markets, climbing every quarter." },
  { icon: Recycle, title: "Second-life batteries", text: "Retired packs power cabinet backup and microgrids before final recycling with certified partners." },
  { icon: Users, title: "Local livelihoods", text: "12,000+ riders earn on the network; 900 technicians and station staff hired locally." },
  { icon: Leaf, title: "Measured, not guessed", text: "Impact is metered per kilometre and published annually in our Sustainability Report." },
];

export default function Sustainability() {
  return (
    <>
      <PageHero
        kicker="Sustainability"
        title="Clean kilometres, counted."
        sub="Our 2026 report confirms the economic, social and climate value of every swap on the network."
      />

      <section className="bg-ink pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { v: 222.4, s: " K", d: 1, l: "Tonnes of CO₂ avoided" },
              { v: 113.5, s: " GWh", d: 1, l: "Clean energy delivered" },
              { v: 12000, s: "+", d: 0, l: "Riders earning on the network" },
            ].map((k, i) => (
              <Reveal key={k.l} delay={i * 0.08}>
                <div className="rounded-3xl border border-white/10 bg-coal p-8 text-center">
                  <p className="font-display text-4xl font-bold tabular-nums text-volt">
                    <CountUp value={k.v} decimals={k.d} suffix={k.s} />
                  </p>
                  <p className="mt-2 text-sm text-ash">{k.l}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-coal p-8">
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
