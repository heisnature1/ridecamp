/**
 * PageHero — the banner every inner page shares.
 *
 * Deliberately restrained compared with the home hero: a soft depth field
 * behind the type, a slow drift, and a word by word heading. Inner pages are
 * where people read, so nothing here moves once it has arrived.
 */
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import SplitHeading from "./SplitHeading";
import { EASE_OUT, useSceneParallax } from "../lib/motion";

export default function PageHero({
  kicker,
  title,
  sub,
  children,
}: {
  kicker: string;
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  const sceneRef = useSceneParallax<HTMLElement>();

  return (
    <section className="scene-3d relative overflow-hidden bg-white" ref={sceneRef}>
      {/* depth field: two slow blooms that lean with the pointer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -right-20 -top-24 size-96 rounded-full bg-brand/10 blur-[80px]"
          style={{ transform: "translate3d(calc(var(--px) * 24px), calc(var(--py) * 18px), 0)" }}
        />
        <div
          className="absolute -bottom-32 left-1/4 size-80 rounded-full bg-cyan-500/10 blur-[80px]"
          style={{ transform: "translate3d(calc(var(--px) * -32px), calc(var(--py) * 14px), 0)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="text-xs font-bold uppercase tracking-[0.24em] text-brand"
        >
          {kicker}
        </motion.p>
        <SplitHeading
          as="h1"
          text={title}
          className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.05] text-navy md:text-6xl"
        />
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-slate md:text-lg"
          >
            {sub}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
