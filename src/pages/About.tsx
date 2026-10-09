import { Globe2, HeartHandshake, Leaf, Wrench } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CallbackForm from "../components/CallbackForm";

const VALUES = [
  { icon: HeartHandshake, title: "Riders first", text: "Every product decision starts with a rider’s daily income, not a spreadsheet." },
  { icon: Leaf, title: "Clean by default", text: "Zero tailpipe, zero noise, and batteries that live a full second life." },
  { icon: Wrench, title: "Built to be fixed", text: "Modular parts and local technicians keep bikes earning for years." },
  { icon: Globe2, title: "Local everywhere", text: "Hiring, assembling and servicing in every market we enter." },
];

const TEAM = [
  { name: "Amara Diallo", role: "Chief Executive Officer", bg: "from-volt/40 to-moss" },
  { name: "Kwame Mensah", role: "Chief Technology Officer", bg: "from-moss to-slate" },
  { name: "Nia Wanjiru", role: "Chief Operations Officer", bg: "from-slate to-moss" },
  { name: "Tunde Okafor", role: "VP, Energy Network", bg: "from-moss to-volt/30" },
  { name: "Aline Uwase", role: "VP, Rider Finance", bg: "from-volt/30 to-slate" },
  { name: "Samuel Kiptoo", role: "VP, Engineering", bg: "from-slate to-volt/40" },
];

const MILESTONES: [string, string][] = [
  ["2021", "Founded with ten prototype bikes and one swap cabinet in Nairobi."],
  ["2022", "First 1,000 riders onboarded; Kigali network goes live."],
  ["2023", "West Africa launch — Lagos, Cotonou and Lomé join the grid."],
  ["2024", "One millionth battery swap completed."],
  ["2025", "FR Volt 450 enters production; 100th swap station opens."],
  ["2026", "Seven markets, 12,000+ riders, first Sustainability Report published."],
];

export default function About() {
  return (
    <>
      <PageHero
        kicker="About us"
        title="We exist to make riders more money, more cleanly."
        sub="Future Ride builds electric motorcycles and the battery-swap network behind them — designed with, and for, commercial riders."
      />

      <section className="bg-ink pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-coal p-7">
                  <v.icon className="size-6 text-volt" />
                  <h3 className="mt-4 font-display text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-ash">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-2xl font-bold">The road so far</h2>
              <ol className="mt-6 space-y-0">
                {MILESTONES.map(([y, t], i) => (
                  <li key={y} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < MILESTONES.length - 1 && (
                      <span className="absolute left-[27px] top-8 bottom-0 w-px bg-white/10" />
                    )}
                    <span className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-volt/40 bg-coal font-display text-sm font-bold text-volt">
                      {y}
                    </span>
                    <p className="pt-3.5 text-sm text-cream/85">{t}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <div>
              <Reveal>
                <h2 className="font-display text-2xl font-bold">Leadership</h2>
              </Reveal>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {TEAM.map((m, i) => (
                  <Reveal key={m.name} delay={i * 0.06}>
                    <div className="rounded-3xl border border-white/10 bg-coal p-5">
                      <div className={`flex h-24 items-end rounded-2xl bg-gradient-to-br ${m.bg} p-3`}>
                        <span className="font-display text-2xl font-bold text-ink/80">
                          {m.name.split(" ").map((p) => p[0]).join("")}
                        </span>
                      </div>
                      <p className="mt-3 font-display text-sm font-bold">{m.name}</p>
                      <p className="text-xs text-ash">{m.role}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallbackForm />
    </>
  );
}
