import { Link } from "react-router-dom";
import { Zap, FileSpreadsheet, Download, Database } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SplitHeading from "../components/SplitHeading";
import CtaRow from "../components/CtaRow";
import { EKON_FEATURES, EKON_SPECS } from "../data/site";

export default function Ekon() {
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
                src="/images/bike-studio.jpg"
                alt="Spiro Ekon 450 M1 side profile"
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <Reveal>
                <SplitHeading
                  as="h2"
                  text="Key specifications"
                  className="font-display text-2xl font-bold leading-[1.15] text-navy md:text-3xl"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <dl className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
                  {EKON_SPECS.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] gap-4 px-6 py-4 text-sm sm:grid-cols-[180px_1fr]">
                      <dt className="font-semibold text-slate">{k}</dt>
                      <dd className="font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[11px] text-slate">
                  *Coverage varies by component. Terms, mileage limits and exclusions apply.
                  Specifications are indicative and tested under standard test conditions.
                </p>
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
                  <Reveal key={f.title} delay={(i % 2) * 0.06}>
                    <div className="h-full rounded-2xl border border-line bg-cloud p-5">
                      <Zap className="size-4 text-brand" />
                      <h3 className="mt-2 font-display text-[15px] font-bold text-navy">{f.title}</h3>
                      <p className="mt-1 text-sm text-slate">{f.text}</p>
                    </div>
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

              <Reveal delay={0.16}>
                <div className="mt-6 rounded-3xl border border-line bg-white p-6">
                  <h3 className="font-display text-lg font-bold text-navy">Internal: data & export</h3>
                  <p className="mt-1 text-sm text-slate">
                    Leads captured by every public form on this device. Sign in to the admin
                    dashboard to review, annotate and export them.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-soft active:scale-95"
                    >
                      Open admin dashboard
                    </Link>
                    <Link
                      to="/spec-sheet"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy ring-1 ring-line transition hover:ring-navy active:scale-95"
                    >
                      <FileSpreadsheet className="size-4" /> Download spec sheet
                    </Link>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-cloud p-3">
                      <Download className="mx-auto size-4 text-brand" />
                      <p className="mt-1 text-[11px] font-bold text-navy">CSV export</p>
                    </div>
                    <div className="rounded-2xl bg-cloud p-3">
                      <Database className="mx-auto size-4 text-brand" />
                      <p className="mt-1 text-[11px] font-bold text-navy">Local storage</p>
                    </div>
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
