import { CheckCircle2 } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SplitHeading from "../components/SplitHeading";
import GhanaMap from "../components/GhanaMap";
import { SWAP_STEPS, SWAP_WHY } from "../data/site";
import TiltCard from "../components/motion/TiltCard";

export default function BatterySwap() {
  return (
    <>
      <PageHero
        kicker="Battery swap"
        title="Swap. Pay. Ride."
        sub="Forget waiting hours for a battery to charge. With Spiro's battery swap system, you ride in, swap your low battery for a fully charged one, pay and ride out. Swaps take just minutes, so you spend your day earning, not waiting."
      />

      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {SWAP_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1} className="h-full">
                <TiltCard max={7} lift={12} className="h-full rounded-3xl" surfaceClassName="h-full">
                  <div className="relative h-full rounded-3xl border border-line bg-cloud p-8">
                    <span className="depth-1 absolute right-6 top-6 font-display text-5xl font-bold text-line">0{i + 1}</span>
                    <h2 className="font-display text-xl font-bold text-navy">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{s.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <TiltCard max={8} lift={16} className="rounded-3xl" surfaceClassName="overflow-hidden rounded-3xl">
                <img
                  src="/images/swap-station.jpg"
                  alt="Battery swap station at night"
                  className="h-[380px] w-full object-cover"
                />
              </TiltCard>
            </Reveal>
            <Reveal delay={0.1}>
              <SplitHeading
                as="h2"
                text="Why swapping beats plug in charging."
                className="font-display text-2xl font-bold leading-[1.15] text-navy md:text-3xl"
              />
              <ul className="mt-6 space-y-3">
                {SWAP_WHY.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-sm font-medium text-ink">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" /> {w}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="mt-16">
            <Reveal>
              <SplitHeading
                as="h2"
                text="Our Ghana swap network."
                className="font-display text-2xl font-bold leading-[1.15] text-navy md:text-3xl"
              />
              <p className="mt-2 max-w-2xl text-sm text-slate">
                Where you swap matters more than a headline range figure: a swap point on your route
                turns a 40 minute charge into a two minute stop. Our live network is in{" "}
                <strong className="font-semibold text-navy">Accra</strong> today. Tema, Kumasi,
                Takoradi, Cape Coast and Tamale are on the rollout.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    figure: "120 km",
                    label: "Spiro's quoted range",
                    detail: "Eco mode, ideal conditions, no load. The headline on the spec sheet.",
                  },
                  {
                    figure: "80 to 100 km",
                    label: "A working day in Accra",
                    detail: "Loaded, stop start traffic, Normal mode. Plan your swaps around this.",
                  },
                  {
                    figure: "2 minutes",
                    label: "Time to swap",
                    detail: "The number that actually decides your day, not the range.",
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-line bg-cloud p-6">
                    <p className="font-display text-2xl font-bold text-brand">{item.figure}</p>
                    <p className="mt-1 text-sm font-bold text-navy">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <div className="mt-8">
              <GhanaMap />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
