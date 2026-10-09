import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CtaRow from "../components/CtaRow";
import { FAQS } from "../data/site";

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        kicker="FAQs"
        title="Questions, answered straight."
        sub="Everything riders ask us before booking a test ride."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => (
              <Reveal key={q} delay={Math.min(i, 6) * 0.04}>
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
    </>
  );
}
