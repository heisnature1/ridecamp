import { Zap } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import TiltCard from "../components/motion/TiltCard";
import { useParallax } from "../lib/scrollFx";
import SplitHeading from "../components/SplitHeading";
import CtaRow from "../components/CtaRow";
import Calculator from "../components/Calculator";
import { EKON_FEATURES } from "../data/site";
import EkonStage from "../components/motion/EkonStage";

export default function Ekon() {
  useParallax();
  return (
    <>
      <PageHero
        kicker="The motorcycle"
        title="Africa's most capable boda, now in Ghana."
        sub="The Ekon 450 M1 is the electric motorcycle designed by Spiro for the realities of African roads: rough surfaces, heavy loads, long hours and tight budgets. It is built to work as hard as you do, and cost far less to keep working."
      />

      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-navy">
              <img
                src="/images/motor.jpg"
                alt="Spiro Ekon 450 M1 on the road"
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
          <Reveal>
            <EkonStage />
          </Reveal>

          <Reveal delay={0.05}>
            <details className="group mt-4 rounded-2xl border border-line bg-white">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-navy">
                <span className="flex items-center justify-between gap-3">
                  See the manufacturer poster
                  <span className="text-xs font-semibold text-slate group-open:hidden">Open</span>
                  <span className="hidden text-xs font-semibold text-slate group-open:inline">Close</span>
                </span>
              </summary>
              <div className="border-t border-line p-4">
                <img
                  src="/images/specification.jpg"
                  alt="Spiro Ekon 450 M1 V3 manufacturer specification poster"
                  className="mx-auto w-full max-w-md rounded-xl"
                  loading="lazy"
                />
                <p className="mt-3 text-[11px] leading-relaxed text-slate">
                  Manufacturer artwork, reproduced at its supplied resolution. The stage above carries
                  the readable version of the same data.
                </p>
              </div>
            </details>
            <p className="mt-3 text-[11px] text-slate">
              *Coverage varies by component. Terms, mileage limits and exclusions apply. Specifications
              are indicative and tested under standard test conditions.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8">
              <Calculator />
            </div>
          </Reveal>


              <Reveal delay={0.15}>
                <SplitHeading
                  as="h2"
                  text="What makes it work"
                  className="mt-12 font-display text-2xl font-bold leading-[1.15] text-navy md:text-3xl"
                />
              </Reveal>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {EKON_FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={(i % 2) * 0.06} className="h-full">
                    <TiltCard max={6} lift={10} className="h-full rounded-2xl" surfaceClassName="h-full">
                      <div className="h-full rounded-2xl border border-line bg-cloud p-5">
                        <Zap className="depth-1 size-4 text-brand" />
                        <h3 className="mt-2 font-display text-[15px] font-bold text-navy">{f.title}</h3>
                        <p className="mt-1 text-sm text-slate">{f.text}</p>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Reveal delay={0.1}>
                <div className="rounded-3xl bg-navy p-8 text-white">
                  <h3 className="font-display text-2xl font-bold">Try it yourself.</h3>
                  <p className="mt-3 text-sm text-white/75">
                    Thirty minutes on real Ghanaian roads says more than any spec sheet. Colours:
                    green, black, yellow, red and blue.
                  </p>
                  <div className="mt-5 flex gap-2" aria-label="Available colours">
                    {["#16a34a", "#111111", "#eab308", "#dc2626", "#2563eb"].map((c) => (
                      <span key={c} className="size-7 rounded-full ring-2 ring-white/30" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="mt-7 flex flex-col gap-3">
                    <CtaRow specSheet />
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
