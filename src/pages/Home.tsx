import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, BatteryCharging, Bike, MapPinned, Route, ShieldCheck, Wrench, Sparkles } from "lucide-react";
import SplitHeading from "../components/SplitHeading";
import Reveal from "../components/Reveal";
import TiltCard from "../components/motion/TiltCard";
import CountUp from "../components/CountUp";
import CtaRow from "../components/CtaRow";
import Calculator from "../components/Calculator";
import { GLANCE, HOW_IT_WORKS, TESTIMONIALS, TRUST_STRIP, WHY_GHANA, WAYS_TO_OWN, FAQS } from "../data/site";
import { EASE_OUT, useSceneParallax } from "../lib/motion";
import { useParallax, useScrollRevealGroup } from "../lib/scrollFx";
import Marquee from "../components/motion/Marquee";
import { dispatchLead } from "../lib/leads";
import { RULES } from "../lib/validate";
import { formatGhanaPhone } from "../lib/leadKinds";

const TRUST_ICONS = [Route, BatteryCharging, ShieldCheck, MapPinned];

function Hero() {
  const sceneRef = useSceneParallax<HTMLElement>();

  return (
    <section className="hero-scene relative overflow-hidden bg-navy text-white" ref={sceneRef}>
      {/* ---------------- background scene, in real depth layers ---------------- */}
      <div className="absolute inset-0 hero-bg-pattern" aria-hidden="true" />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* far layer: the photograph drifts least */}
        <div
          className="hero-sheen absolute inset-[-6%]"
          style={{ transform: "translate3d(calc(var(--px) * 10px), calc(var(--py) * 8px), 0) scale(1.06)" }}
        >
          <img
            src="/images/motor.jpg"
            alt=""
            className="size-full object-cover opacity-45"
            loading="eager"
          />
        </div>

        {/* vignette keeps the type legible over any part of the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />

        {/* mid layer: light blooms that respond more strongly */}
        <div
          className="absolute -left-16 top-1/4 size-[26rem] rounded-full bg-brand/25 blur-[90px] animate-float"
          style={{ transform: "translate3d(calc(var(--px) * 34px), calc(var(--py) * 26px), 0)" }}
        />
        <div
          className="absolute -right-10 bottom-1/4 size-80 rounded-full bg-cyan-500/20 blur-[80px] animate-float"
          style={{
            animationDelay: "-2s",
            transform: "translate3d(calc(var(--px) * -46px), calc(var(--py) * 30px), 0)",
          }}
        />

        {/* near layer: a faint grid that moves the most, giving the scene a floor */}
        <div
          className="hero-grid absolute inset-x-0 bottom-0 h-1/2 opacity-40"
          style={{ transform: "translate3d(calc(var(--px) * 18px), calc(var(--py) * 12px), 0)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-bright backdrop-blur-md"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-bright opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-bright" />
          </span>
          Now delivering in Accra
        </motion.div>

        {/* the headline is split into two depth planes: words sit above the rule */}
        <div
          className="mt-6"
          style={{ transform: "translate3d(calc(var(--px) * -8px), calc(var(--py) * -5px), 0)" }}
        >
          <SplitHeading
            as="h1"
            text="The smarter way to ride and earn."
            className="max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-7xl"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
          style={{ transform: "translate3d(calc(var(--px) * 5px), calc(var(--py) * 4px), 0)" }}
        >
          Future Ride Ltd brings Spiro's Africa built electric motorcycle to Ghana. No petrol. No oil
          changes. Far fewer repairs. More money in your pocket every single day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <CtaRow />
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:bg-white/20"
          >
            <Sparkles className="size-4 transition-transform duration-500 group-hover:rotate-[18deg]" />
            View Gallery
          </Link>
        </motion.div>
      </div>

      {/* trust strip: the cards lift and glow individually */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: EASE_OUT }}
        className="relative border-t border-white/10 bg-navy-deep/50 backdrop-blur-xl"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 md:px-8">
          {TRUST_STRIP.map((t, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 + i * 0.09, ease: EASE_OUT }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors duration-300 hover:border-brand-bright/30 hover:bg-white/10"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-brand-bright/25 transition-all duration-500 group-hover:rotate-6 group-hover:from-brand/40 group-hover:to-brand-bright/40">
                  <Icon className="size-6 text-brand-bright" />
                </span>
                <p className="mt-3 text-[13px] font-semibold text-white/90">{t}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 10, 0], opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-6 text-white/70" />
      </motion.div>
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
            <Reveal key={w.title} delay={(i % 4) * 0.08} className="h-full">
              <TiltCard max={7} lift={12} className="h-full rounded-2xl" surfaceClassName="h-full">
                <div className="depth-1 h-full rounded-2xl border border-line bg-cloud p-6 transition-colors duration-300 hover:border-brand/50 hover:bg-mint">
                  <span className="font-display text-2xl font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{w.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Glance() {
  return (
    <section className="relative bg-navy py-16 text-white md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div data-parallax="60" className="absolute top-0 right-1/4 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div data-parallax="-60" className="absolute bottom-0 left-1/4 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="perspective-1000"
          >
            <TiltCard max={10} lift={20} className="rounded-2xl" surfaceClassName="rounded-2xl">
              <img
                src="/images/motor.jpg"
                alt="Spiro Ekon 450 M1 electric motorcycle"
                className="w-full rounded-2xl object-cover"
              />
              <span className="depth-3 absolute left-4 top-4 rounded-full bg-gradient-to-r from-brand to-brand-bright px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-brand/30">
                Ekon 450 M1
              </span>
              <div className="depth-2 absolute bottom-4 right-4 flex gap-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="size-3 rounded-full bg-brand/50"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="size-3 rounded-full bg-brand-bright/50"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="size-3 rounded-full bg-cyan-500/50"
                />
              </div>
            </TiltCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <SplitHeading
              as="h2"
              text="The Ekon 450 M1 at a glance."
              className="font-display text-3xl font-bold leading-[1.1] md:text-5xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {GLANCE.map((g, i) => (
                <motion.div
                  key={g.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                  className="card-3d group"
                >
                  <div className="card-3d-inner p-6">
                    <div className="flex items-center gap-2 mb-3" style={{ transform: "translateZ(20px)" }}>
                      <motion.div
                        className="size-2 rounded-full bg-brand"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                      <span className="text-xs font-bold uppercase tracking-wide text-brand-bright">{g.unit}</span>
                    </div>
                    <p
                      className="font-display text-4xl font-bold leading-none tabular-nums text-navy"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      <CountUp value={g.value} duration={1500} />
                    </p>
                    <p className="mt-2 text-sm leading-snug text-slate" style={{ transform: "translateZ(10px)" }}>{g.label}</p>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-left"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="mt-5 text-[11px] text-white/50">
                Specifications are indicative and tested under standard test conditions.
              </p>
              <Link
                to="/ekon"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-bright hover:text-white transition-colors group"
              >
                Explore the full bike
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const icons = [Bike, MapPinned, BatteryCharging];
  return (
    <section className="relative bg-cloud py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div data-parallax="70" className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div data-parallax="-90" className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Simple as 1 2 3</p>
          <SplitHeading
            as="h2"
            text="How it works."
            className="mt-3 font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {HOW_IT_WORKS.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40, rotateX: -10, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="perspective-1000"
              >
                <TiltCard max={6} lift={10} className="h-full rounded-3xl" surfaceClassName="h-full">
                  <div className="group relative h-full rounded-3xl bg-white p-8">
                    <div className="depth-1 flex items-center justify-between mb-6">
                      <span className="font-display text-5xl font-bold text-line/30">0{i + 1}</span>
                      <motion.div
                        className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/10 to-brand-bright/10 group-hover:from-brand/20 group-hover:to-brand-bright/20 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        style={{ transform: "translateZ(30px)" }}
                      >
                        <Icon className="size-8 text-brand" />
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand to-brand-bright opacity-0"
                          whileHover={{ opacity: 0.1 }}
                        />
                      </motion.div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-navy" style={{ transform: "translateZ(15px)" }}>{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate" style={{ transform: "translateZ(10px)" }}>{s.text}</p>
                    <motion.div
                      className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                      style={{ transform: "translateZ(5px)" }}
                    />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function WaysToOwn() {
  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div data-parallax="70" className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div data-parallax="-90" className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Flexible ownership</p>
          <SplitHeading
            as="h2"
            text="Ways to own."
            className="mt-3 font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {WAYS_TO_OWN.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 40, rotateX: -10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="perspective-1000"
            >
              <TiltCard max={6} lift={10} className="h-full rounded-3xl" surfaceClassName="h-full">
                <div className="group flex h-full flex-col rounded-3xl bg-white p-8">
                  <div className="depth-1 mb-6">
                    <span className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-brand/10 to-brand-bright/10">
                      <span className="font-display text-2xl font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-3" style={{ transform: "translateZ(15px)" }}>{w.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate" style={{ transform: "translateZ(10px)" }}>{w.text}</p>
                  <motion.div
                    className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                    style={{ transform: "translateZ(5px)" }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link
            to="/fleet#financing"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark transition-colors group"
          >
            Learn about financing
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ArrowRight className="size-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative bg-mint py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div data-parallax="80" className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/15 blur-3xl" />
        <div data-parallax="-70" className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Rider stories</p>
          <SplitHeading
            as="h2"
            text="Real riders, real results."
            className="mt-3 font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
          <p className="mt-3 text-sm text-slate">Rider stories from our pilot programme.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40, rotateX: -10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="perspective-1000"
            >
              <TiltCard max={6} lift={10} className="h-full rounded-3xl" surfaceClassName="h-full">
                <div className="group relative h-full rounded-3xl bg-white p-7">
                  <div className="depth-1 flex items-center gap-3 mb-4">
                    <motion.div
                      className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-brand/10 to-brand-bright/10 group-hover:from-brand/20 group-hover:to-brand-bright/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                    >
                      <span className="font-display text-sm font-bold text-brand">
                        {t.name.split(" ").map((p) => p[0]).join("")}
                      </span>
                    </motion.div>
                    <div style={{ transform: "translateZ(15px)" }}>
                      <figcaption className="font-display text-sm font-bold text-navy">{t.name}</figcaption>
                      <p className="text-xs text-slate">{t.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-sm leading-relaxed text-ink relative" style={{ transform: "translateZ(10px)" }}>
                    <span className="text-brand text-2xl font-bold">“</span>{t.quote}<span className="text-brand text-2xl font-bold">”</span>
                  </blockquote>
                  <motion.div
                    className="absolute bottom-0 left-7 right-7 h-0.5 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                    style={{ transform: "translateZ(5px)" }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Faqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="relative bg-white py-16 md:py-24 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div data-parallax="70" className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/10 blur-3xl" />
        <div data-parallax="-90" className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">FAQ</p>
          <SplitHeading
            as="h2"
            text="Questions, answered straight."
            className="mt-3 font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
          <p className="mt-3 text-sm text-slate">Everything riders ask us before booking a test ride.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mt-8 space-y-3"
        >
          {FAQS.map(([q, a], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + Math.min(i, 5) * 0.06, ease: [0.23, 1, 0.32, 1] }}
              className="perspective-1000"
            >
              <div className="card-3d group overflow-hidden rounded-2xl border border-line bg-white">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-display text-[15px] font-bold text-navy" style={{ transform: "translateZ(10px)" }}>{q}</span>
                  <motion.div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/10 to-brand-bright/10 text-brand transition-all duration-300"
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <ChevronDown className="size-5" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, rotateX: -10 }}
                      animate={{ height: "auto", opacity: 1, rotateX: 0 }}
                      exit={{ height: 0, opacity: 0, rotateX: 10 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="px-6 pb-6 text-sm leading-relaxed text-slate"
                      style={{ transform: "translateZ(5px)" }}
                    >
                      {a}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
                  style={{ transform: "translateZ(2px)" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mt-12"
        >
          <div className="card-3d group relative rounded-3xl bg-gradient-to-br from-mint to-white p-8 text-center">
            <div className="card-3d-inner p-4 relative">
              <h2 className="font-display text-xl font-bold text-navy" style={{ transform: "translateZ(20px)" }}>Still wondering about something?</h2>
              <p className="mt-2 text-sm text-slate" style={{ transform: "translateZ(15px)" }}>The fastest answer is a test ride — or a WhatsApp message.</p>
              <motion.div
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                className="mt-6 flex justify-center"
              >
                <CtaRow />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-700"
                style={{ transform: "translateZ(2px)" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCta() {
  const [form, setForm] = useState({ name: "", phone: "", city: "", website: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const mountedAt = useRef(Date.now());

  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div data-parallax="80" className="absolute left-1/4 top-1/4 size-96 rounded-full bg-brand/20 blur-3xl" />
        <div data-parallax="-110" className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-64 rounded-full bg-brand-bright/15 blur-3xl animate-float" style={{ animationDelay: "-4s" }} />
        <div className="hero-grid absolute inset-x-0 bottom-0 h-2/3 opacity-30" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <SplitHeading
            as="h2"
            text="Ready to make the switch?"
            className="font-display text-3xl font-bold leading-[1.1] md:text-5xl"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mt-4 text-white/75"
        >
          Leave your number and a Future Ride Ltd advisor will call you today.
        </motion.p>
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className="mx-auto mt-8 max-w-md rounded-2xl bg-white/10 px-6 py-5 text-sm font-semibold"
          >
            Medaase, {form.name.split(" ")[0] || "rider"}! Your request is in — an advisor will call you today.
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              (async () => {
                setSending(true);
                try {
                  await dispatchLead(
                    "callback",
                    {
                      Name: form.name,
                      Phone: formatGhanaPhone(form.phone),
                      City: form.city,
                      Interest: "Call me back",
                    },
                    undefined,
                    {
                      honeypot: form.website,
                      elapsedMs: Date.now() - mountedAt.current,
                      rules: {
                        Name: RULES.name,
                        Phone: { ...RULES.phone, label: "Phone number" },
                        City: RULES.city,
                      },
                    },
                  );
                  setSent(true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Could not send that. Please try again.");
                } finally {
                  setSending(false);
                }
              })();
            }}
          >
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <div className="flex-1 relative" style={{ transform: "translateZ(20px)" }}>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                aria-label="Name"
                className="input-3d w-full rounded-full px-5 py-3.5 text-sm"
              />
            </div>
            <div className="flex-1 relative" style={{ transform: "translateZ(15px)" }}>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="055 894 1297"
                aria-label="Phone"
                className="input-3d w-full rounded-full px-5 py-3.5 text-sm"
              />
            </div>
            <div className="relative" style={{ transform: "translateZ(10px)" }}>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                aria-label="City"
                className="input-3d w-full rounded-full px-5 py-3.5 text-sm"
              />
            </div>
            <div className="relative" style={{ transform: "translateZ(30px)" }}>
              <button
                disabled={sending}
                className="btn-3d w-full rounded-full px-8 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {sending ? "Sending…" : "I'm Interested"}
              </button>
            </div>
            {error && (
              <p role="alert" className="w-full rounded-xl bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200">
                {error}
              </p>
            )}
          </motion.form>
        )}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/50"
        >
          <Wrench className="size-3.5" /> Genuine Spiro bikes · full manufacturer backing
        </motion.p>
      </div>
    </section>
  );
}

/** A ribbon of proof points that drifts past, between the two heavy sections. */
function ProofRibbon() {
  const items = [
    "No petrol, ever",
    "Battery swap in under a minute",
    "Serviced by our own technicians",
    "Financing from 30 percent down",
    "Built for Ghana's roads",
    "Delivered anywhere in Accra",
  ];
  return (
    <section className="relative border-y border-line bg-cloud py-5">
      <Marquee speed={42}>
        {items.map((item) => (
          <span key={item} className="flex items-center gap-6 px-6">
            <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-navy/80">
              {item}
            </span>
            <Sparkles className="size-3.5 shrink-0 text-brand" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

export default function Home() {
  useParallax();
  useScrollRevealGroup("[data-reveal-group]");

  return (
    <>
      <Hero />
      <WhyGhana />
      <Glance />
      <ProofRibbon />
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
