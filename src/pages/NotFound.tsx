import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

/**
 * 404 — shown for any URL that is not a real page.
 *
 * Previously every unknown path silently redirected to the home page, which is
 * bad for visitors following a stale link (and for search engines). This page
 * keeps the site chrome, returns the visitor to a useful place, and is marked
 * `noindex`.
 */
export default function NotFound() {
  // keep search engines from indexing a dead URL
  if (typeof document !== "undefined") {
    document.title = "Page not found | Future Ride Ltd";
    let tag = document.querySelector('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "robots");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", "noindex, nofollow");
  }

  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 hero-bg-pattern" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/20 blur-3xl animate-float"
          style={{ animationDelay: "-2s" }}
        />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-bright">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
          This road does not exist.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
          The page you were looking for has moved or never existed. Everything else is a click
          away — or call the team on 055 894 1297 and we will point you the right way.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/25 transition hover:bg-brand-dark"
          >
            Back to the home page <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
          >
            <Compass className="size-4" /> Book a test ride
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/60">
          {[
            { to: "/ekon", label: "Ekon 450 M1" },
            { to: "/battery-swap", label: "Battery swap" },
            { to: "/fleet", label: "Fleet and business" },
            { to: "/gallery", label: "Gallery" },
            { to: "/faqs", label: "FAQs" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="transition-colors hover:text-brand-bright">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
