import { Wrench } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { SERVICE_ITEMS } from "../data/site";
import CtaRow from "../components/CtaRow";

export default function Service() {
  return (
    <>
      <PageHero
        kicker="Service & warranty"
        title="Support that keeps you moving."
        sub="Genuine parts, authorised service and in-app support — because a bike in the workshop is money out of your pocket."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_ITEMS.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-cloud p-7">
                  <Wrench className="size-5 text-brand" />
                  <h2 className="mt-3 font-display text-lg font-bold text-navy">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-12 rounded-3xl bg-mint p-8 md:p-10">
              <h2 className="font-display text-xl font-bold text-navy">Need help right now?</h2>
              <p className="mt-2 max-w-xl text-sm text-slate">
                Call, WhatsApp or book a visit — our Accra team responds the same day.
              </p>
              <div className="mt-6">
                <CtaRow />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
