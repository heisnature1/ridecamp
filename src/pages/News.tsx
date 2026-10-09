import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { NEWS } from "../data/site";

export default function News() {
  return (
    <>
      <PageHero
        kicker="Newsroom"
        title="Stories from the network."
        sub="Launches, milestones and reports from across the Future Ride ecosystem."
      />
      <section className="bg-ink pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
          {NEWS.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal">
                <img src={n.image} alt="" className="h-52 w-full object-cover" loading="lazy" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-ash">{n.source} · {n.date}</p>
                  <h2 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h2>
                  <p className="mt-3 text-sm text-ash">{n.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
