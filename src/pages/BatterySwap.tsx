import { CheckCircle2 } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SplitHeading from "../components/SplitHeading";
import GhanaMap from "../components/GhanaMap";
import { SWAP_STEPS, SWAP_WHY } from "../data/site";

export default function BatterySwap() {
  return (
    <>
      <PageHero
        kicker="Battery swap"
        title="Swap. Pay. Ride."
        sub="Forget waiting hours for a battery to charge. With Spiro's battery-swap system, you ride in, swap your low battery for a fully charged one, pay and ride out. Swaps take just minutes, so you spend your day earning, not waiting."
      />

      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {SWAP_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative h-full rounded-3xl border border-line bg-cloud p-8">
                  <span className="absolute right-6 top-6 font-display text-5xl font-bold text-line">0{i + 1}</span>
                  <h2 className="font-display text-xl font-bold text-navy">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/images/swap-station.jpg"
                  alt="Battery swap station at night"
                  className="h-[380px] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SplitHeading
                as="h2"
                text="Why swapping beats plug-in charging."
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
                We are rolling out swap points city by city. Addresses, opening hours and cost per
                swap will be published here at launch — starting with Accra and Tema.
              </p>
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
