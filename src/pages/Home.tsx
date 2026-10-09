import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, BatteryCharging, Bike, MapPinned, Route, ShieldCheck, Wrench } from "lucide-react";
import SplitHeading from "../components/SplitHeading";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import CtaRow from "../components/CtaRow";
import Calculator from "../components/Calculator";
import { GLANCE, HOW_IT_WORKS, TESTIMONIALS, TRUST_STRIP, WHY_GHANA, WAYS_TO_OWN, FAQS } from "../data/site";
import { dispatchLead } from "../lib/leads";
import { formatGhanaPhone } from "../lib/leadKinds";

const TRUST_ICONS = [Route, BatteryCharging, ShieldCheck, MapPinned];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0">
        <img
          src="/images/hero-accra.jpg"
          alt="Rider on a Spiro Ekon electric motorcycle in Accra"
          className="size-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/30" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-28">
        <SplitHeading
          as="h1"
          text="The smarter way to ride and earn."
          className="max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-7xl"
        />
        <Reveal delay={0.3}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Future Ride brings Spiro's Africa-built electric motorcycle to Ghana. No petrol. No oil
            changes. Far fewer repairs. More money in your pocket every single day.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-8">
            <CtaRow />
          </div>
        </Reveal>
      </div>

      {/* trust strip */}
      <div className="relative border-t border-white/10 bg-navy-deep/80 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4 md:px-8">
          {TRUST_STRIP.map((t, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <p key={t} className="flex items-center gap-2.5 text-[13px] font-semibold text-white/85">
                <Icon className="size-5 shrink-0 text-brand-bright" /> {t}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyGhana() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">The sales case</p>
          <SplitHeading
            as="h2"
            text="Why Ghanaians are switching to electric."
            className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_GHANA.map((w, i) => (
            <Reveal key={w.title} delay={(i % 4) * 0.08}>
              <div className="h-full rounded-2xl border border-line bg-cloud p-6 transition hover:border-brand/50 hover:bg-mint">
                <span className="font-display text-2xl font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Glance() {
  return (
    <section className="bg-navy py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src="/images/bike-studio.jpg"
                alt="Spiro Ekon 450 M1 electric motorcycle"
                className="w-full rounded-3xl object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white">
                Ekon 450 M1
              </span>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <SplitHeading
              as="h2"
              text="The Ekon 450 M1 at a glance."
              className="font-display text-3xl font-bold leading-[1.1] md:text-5xl"
            />
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {GLANCE.map((g, i) => (
                <Reveal key={g.label} delay={i * 0.08}>
                  <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                    <p className="font-display text-4xl font-bold tabular-nums text-brand-bright">
                      <CountUp value={g.value} duration={1200} />
                      <span className="ml-1 text-lg text-white/60">{g.unit}</span>
                    </p>
                    <p className="mt-1.5 text-sm text-white/70">{g.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.25}>
              <p className="mt-5 text-[11px] text-white/50">
                Specifications are indicative and tested under standard test conditions.
              </p>
              <Link
                to="/ekon"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-bright hover:underline"
              >
                Explore the full bike <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const icons = [Bike, MapPinned, BatteryCharging];
  return (
    <section className="bg-cloud py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SplitHeading
            as="h2"
            text="How it works."
            className="font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((s, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative h-full rounded-3xl border border-line bg-white p-8">
                  <span className="absolute right-6 top-6 font-display text-5xl font-bold text-line">0{i + 1}</span>
                  <Icon className="size-8 text-brand" />
                  <h3 className="mt-5 font-display text-xl font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WaysToOwn() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SplitHeading
            as="h2"
            text="Ways to own."
            className="font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {WAYS_TO_OWN.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-line bg-cloud p-8">
                <h3 className="font-display text-xl font-bold text-navy">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <Link to="/fleet#financing" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">
            Learn about financing <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-mint py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SplitHeading
            as="h2"
            text="Real riders, real results."
            className="font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
          <p className="mt-3 text-sm text-slate">Rider stories from our pilot programme.</p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="h-full rounded-3xl border border-line bg-white p-7">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-navy font-display text-sm font-bold text-brand-bright">
                    {t.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <div>
                    <figcaption className="font-display text-sm font-bold text-navy">{t.name}</figcaption>
                    <p className="text-xs text-slate">{t.role}</p>
                  </div>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-ink">“{t.quote}”</blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <Reveal>
          <SplitHeading
            as="h2"
            text="Questions, answered straight."
            className="font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
          <p className="mt-3 text-sm text-slate">Everything riders ask us before booking a test ride.</p>
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} delay={Math.min(i, 5) * 0.04}>
              <div className="overflow-hidden rounded-2xl border border-line bg-cloud">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-display text-[15px] font-bold text-navy">{q}</span>
                  <ChevronDown className={`size-5 shrink-0 text-brand transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-slate">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl bg-mint p-8 text-center">
            <h2 className="font-display text-xl font-bold text-navy">Still wondering about something?</h2>
            <p className="mt-2 text-sm text-slate">The fastest answer is a test ride — or a WhatsApp message.</p>
            <div className="mt-6 flex justify-center">
              <CtaRow />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-navy py-16 text-white md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <SplitHeading
          as="h2"
          text="Ready to make the switch?"
          className="font-display text-3xl font-bold leading-[1.1] md:text-5xl"
        />
        <p className="mt-4 text-white/75">
          Leave your number and a Future Ride advisor will call you today.
        </p>
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mt-8 max-w-md rounded-2xl bg-white/10 px-6 py-5 text-sm font-semibold"
          >
            Medaase, {form.name.split(" ")[0] || "rider"}! Your request is in — an advisor will call you today.
          </motion.div>
        ) : (
          <form
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              dispatchLead("callback", {
                Name: form.name,
                Phone: formatGhanaPhone(form.phone),
                City: form.city,
                Interest: "Call me back",
              });
            }}
          >
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              aria-label="Name"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm outline-none placeholder:text-white/50 focus:border-brand-bright"
            />
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+233 24 000 0000"
              aria-label="Phone"
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm outline-none placeholder:text-white/50 focus:border-brand-bright"
            />
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="City"
              aria-label="City"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm outline-none placeholder:text-white/50 focus:border-brand-bright"
            />
            <button className="rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white hover:bg-brand-dark">
              I'm Interested
            </button>
          </form>
        )}
        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/50">
          <Wrench className="size-3.5" /> Genuine Spiro bikes · full manufacturer backing
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <WhyGhana />
      <Glance />
      <HowItWorks />
      <section className="bg-cloud py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Calculator />
        </div>
      </section>
      <WaysToOwn />
      <Testimonials />
      <Faqs />
      <FinalCta />
    </>
  );
}
