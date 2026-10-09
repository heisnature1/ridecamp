import SplitHeading from "./SplitHeading";
import Reveal from "./Reveal";

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
    <section className="relative overflow-hidden bg-ink pt-40 pb-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(200,240,75,0.08), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-volt">{kicker}</p>
        </Reveal>
        <SplitHeading
          as="h1"
          text={title}
          className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.05] md:text-7xl"
        />
        {sub && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-ash">{sub}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
