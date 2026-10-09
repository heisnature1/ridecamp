import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

export default function PageHero({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">{kicker}</p>
        </Reveal>
        <SplitHeading
          as="h1"
          text={title}
          className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.05] text-navy md:text-6xl"
        />
        {sub && (
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate md:text-lg">{sub}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
