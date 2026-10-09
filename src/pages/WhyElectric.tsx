import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { SPIRO_SCALE, WHY_ELECTRIC } from "../data/site";

export default function WhyElectric() {
  return (
    <>
      <PageHero
        kicker="Why go electric"
        title="Your petrol bike is costing you more than you think."
        sub="Fuel, engine oil, filters, spark plugs, clutch repairs, chain adjustments, gearbox problems. Every one of these is a cost that eats into what you earn. An electric motorcycle removes most of them."
      />

      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {WHY_ELECTRIC.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 0.07}>
                <div className="h-full rounded-3xl border border-line bg-cloud p-7 transition hover:border-brand/50">
                  <span className="font-display text-sm font-bold text-brand">{i + 1}</span>
                  <h2 className="mt-1 font-display text-xl font-bold text-navy">{w.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-3xl bg-navy p-8 text-white md:p-12">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Backed by a company that works at scale.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">
                Spiro is one of Africa's leading electric-mobility companies, with bikes running
                daily across cities in 9 countries and recognition on the TIME100 Most Influential
                Companies list (2024).*
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {SPIRO_SCALE.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl font-bold text-brand-bright md:text-4xl">{s.value}</p>
                    <p className="mt-1 text-xs text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[11px] text-white/45">
                *Figures subject to written confirmation from Spiro before launch.
              </p>
              <Link
                to="/calculator"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark"
              >
                See your own numbers <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
