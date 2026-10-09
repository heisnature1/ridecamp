import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { NEWS } from "../data/site";
import Reveal from "./Reveal";

export default function NewsGrid() {
  return (
    <section className="bg-coal py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-volt">In the press</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
              Making headlines.
            </h2>
          </div>
          <Link to="/news" className="hidden items-center gap-2 text-sm font-semibold text-cream/80 hover:text-volt md:flex">
            All news <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.12}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={n.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-ash">
                    {n.source} · {n.date}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h3>
                  <p className="mt-3 text-sm text-ash">{n.excerpt}</p>
                  <Link to="/news" className="mt-auto pt-5 text-sm font-semibold text-volt">
                    Read More →
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
