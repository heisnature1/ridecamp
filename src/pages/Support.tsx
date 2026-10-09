import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail, Phone } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

const FAQS: [string, string][] = [
  ["Do I own the battery?", "No — batteries stay on the network. You pay a simple per-swap tariff that always includes a charged, healthy pack."],
  ["What happens if a station is offline?", "The rider app shows live cabinet status and the nearest alternative. Your swap credit works at every station on the network."],
  ["Can I buy the bike outright?", "Yes. Outright purchase, asset financing and rent-to-own plans are available in every market."],
  ["How far can I really ride on one swap?", "Around 110 km with a rider and typical cargo. Heavy loads and steep routes reduce this; the app shows a live estimate."],
  ["Who services the bike?", "Future Ride service centres and certified local workshops. Most wear parts are covered under the maintenance plan."],
  ["How do I become a rider?", "Book a test ride, bring your licence and ID, and choose a plan. Most riders are on the road the same week."],
];

export default function Support() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        kicker="Support"
        title="Help, when you need it."
        sub="Answers for riders, fleets and partners — and a human on the line when you need one."
      />

      <section className="bg-ink pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => (
              <Reveal key={q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-coal">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    aria-expanded={open === i}
                  >
                    <span className="pr-4 font-display text-base font-semibold">{q}</span>
                    <ChevronDown className={`size-5 shrink-0 text-volt transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-ash">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-coal p-8">
              <h2 className="font-display text-xl font-bold">Contact</h2>
              <div className="mt-6 space-y-4 text-sm">
                <a href="tel:+254700000000" className="flex items-center gap-3 text-cream/85 hover:text-volt">
                  <Phone className="size-4 text-volt" /> +254 700 000 000
                </a>
                <a href="mailto:hello@futureride.example" className="flex items-center gap-3 text-cream/85 hover:text-volt">
                  <Mail className="size-4 text-volt" /> hello@futureride.example
                </a>
              </div>
              <p className="mt-6 text-xs text-ash">
                Rider hotline is open 06:00–23:00 EAT, seven days a week.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
