import { PenLine, ShieldCheck } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { ABOUT_PROMISE } from "../data/site";

export default function About() {
  return (
    <>
      <PageHero
        kicker="About Future Ride"
        title="Moving Ghana forward, one ride at a time."
        sub="Future Ride is the exclusive distributor of Spiro electric motorcycles in Ghana. We exist to put reliable, affordable, clean transport in the hands of Ghanaians who work for a living: riders, delivery agents, small businesses and fleets."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl bg-navy p-8 text-white md:p-10">
                <h2 className="font-display text-2xl font-bold">Our name says it all.</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  The <strong className="text-brand-bright">F</strong> is for speed and forward
                  motion, the <strong className="text-brand-bright">R</strong> is for the road
                  ahead, and the plug in our logo is for the clean power that will carry it. We
                  believe the next generation of Ghanaian mobility should cost less, pollute less
                  and earn more.
                </p>
              </div>
              <h2 className="mt-10 font-display text-2xl font-bold text-navy">Our promise</h2>
              <ul className="mt-4 space-y-3">
                {ABOUT_PROMISE.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm font-medium text-ink">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-line bg-cloud p-8 md:p-10">
                <PenLine className="size-6 text-brand" />
                <h2 className="mt-4 font-display text-2xl font-bold text-navy">A note from our founder</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate">
                  Coming soon: our founder's story — why we chose electric mobility, and what we
                  want for riders in Ghana.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  In the meantime, talk to us directly. We answer every call and message, and we
                  would rather show you the bike than tell you about it.
                </p>
                <div className="mt-auto overflow-hidden rounded-2xl pt-8">
                  <img src="/images/hero-accra.jpg" alt="Accra street scene" className="h-56 w-full rounded-2xl object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
