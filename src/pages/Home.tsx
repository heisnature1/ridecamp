import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import SplitHeading from "../components/SplitHeading";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import SavingsCalculator from "../components/SavingsCalculator";
import NetworkMap from "../components/NetworkMap";
import Marquee from "../components/Marquee";
import NewsGrid from "../components/NewsGrid";
import CallbackForm from "../components/CallbackForm";
import { useCountry } from "../components/CountryGate";
import { BIKE_SPECS, HERO_STATS, MODEL } from "../data/site";

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/hero-rider.jpg"
          alt="Rider on a Future Ride electric motorcycle at sunset"
          className="size-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/60" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-40 md:px-8">
        <SplitHeading
          as="h1"
          text="The road to earning, electrified."
          className="max-w-4xl font-display text-5xl font-bold leading-[1.02] md:text-7xl lg:text-8xl"
        />
        <Reveal delay={0.35}>
          <p className="mt-6 max-w-xl text-lg text-cream/85">
            The electric motorcycle built for the riders who keep Africa’s cities moving.
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/bike"
              className="inline-flex items-center gap-2 rounded-full bg-volt px-7 py-3.5 text-sm font-semibold text-ink hover:brightness-110"
            >
              Know more <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/book-test-ride"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur hover:border-volt hover:text-volt"
            >
              Book test ride
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream/70">
        <p className="text-center text-[10px] uppercase tracking-[0.3em]">Scroll to explore</p>
        <ChevronDown className="mx-auto mt-1 size-5 animate-bob" />
      </div>
    </section>
  );
}

function ImpactStats() {
  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="max-w-2xl font-display text-2xl font-semibold leading-snug text-cream/90 md:text-3xl">
            Future Ride is driving the EV revolution across the continent.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="rounded-3xl border border-white/10 bg-coal p-7 transition-colors hover:border-volt/40">
                <p className="font-display text-3xl font-bold tabular-nums text-volt xl:text-4xl">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-sm text-ash">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BikeShowcase() {
  return (
    <section className="relative overflow-hidden bg-coal py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SplitHeading
          text={MODEL.tagline}
          className="font-display text-4xl font-bold leading-tight md:text-6xl"
        />
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute inset-x-10 bottom-4 h-10 rounded-full bg-volt/10 blur-2xl" />
              <img
                src="/images/bike-studio.jpg"
                alt={`${MODEL.name} electric motorcycle studio shot`}
                className="relative w-full rounded-3xl object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="font-display text-xl font-semibold text-volt">{MODEL.name}</p>
              <p className="mt-2 text-ash">{MODEL.blurb}</p>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {BIKE_SPECS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div className="rounded-2xl border border-white/10 bg-ink p-5">
                    <p className="font-display text-3xl font-bold tabular-nums text-cream">
                      <CountUp value={s.value} duration={1200} />
                      <span className="ml-1 text-base text-ash">{s.unit}</span>
                    </p>
                    <p className="mt-1.5 text-xs text-ash">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/bike"
                  className="inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-ink hover:brightness-110"
                >
                  Explore {MODEL.name.split(" ")[1]} <ArrowRight className="size-4" />
                </Link>
                <p className="text-[11px] text-ash">
                  Specifications are indicative and tested under standard conditions.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { code } = useCountry();
  return (
    <>
      <Hero />
      <Marquee />
      <ImpactStats />
      <BikeShowcase />
      <SavingsCalculator countryCode={code} />
      <NetworkMap />
      <NewsGrid />
      <CallbackForm />
    </>
  );
}
