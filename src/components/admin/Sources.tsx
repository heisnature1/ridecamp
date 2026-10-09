import { motion } from "framer-motion";
import { ArrowUpRight, Info, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import { PUBLIC_FORMS } from "../../data/forms";
import { normalizePath } from "../../lib/format";
import { kindMeta } from "../../lib/leadKinds";
import type { LeadRecord } from "../../lib/leadsStore";
import { EASE, KindChip, Panel } from "./ui";

/**
 * Answers the question “what exactly will I see from the public site?” —
 * every public form, every field it captures, and how many leads it has sent.
 */
export default function Sources({
  leads,
  onViewLeads,
}: {
  leads: LeadRecord[];
  onViewLeads: (route: string) => void;
}) {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-brand" />
          <div className="text-sm leading-relaxed text-slate">
            <p className="font-semibold text-navy">Every public form writes to this dashboard.</p>
            <p className="mt-1">
              The cards below list each form and the exact fields it captures — those labels are the
              rows you will see under “What they entered” on a lead. Nothing a visitor types is
              dropped; blank optional fields are simply left out. Chats that happen directly on
              WhatsApp or over the phone are not captured here.
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        {PUBLIC_FORMS.map((form, i) => {
          const path = form.route;
          // Two forms can share a page (fleet quote + financing both live on
          // /fleet), so an anchored form only counts leads carrying its anchor.
          const anchoredElsewhere = PUBLIC_FORMS.filter((f) => f.route === path && f.anchor).map(
            (f) => f.anchor!.replace("#", ""),
          );
          const count = leads.filter((l) => {
            if (normalizePath(l.source) !== path) return false;
            const hash = String(l.source).split("#")[1] ?? "";
            if (form.anchor) return hash === form.anchor.replace("#", "");
            return !hash || !anchoredElsewhere.includes(hash);
          }).length;
          return (
            <motion.section
              key={form.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
                    {form.pageLabel}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold text-navy">{form.title}</h2>
                </div>
                <span className="shrink-0 rounded-full bg-navy px-3 py-1.5 text-xs font-bold tabular-nums text-white">
                  {count} {count === 1 ? "lead" : "leads"}
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate">{form.blurb}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {form.kinds.map((k) => (
                  <KindChip key={k} chipClass={kindMeta(k).chip}>
                    {kindMeta(k).label}
                  </KindChip>
                ))}
              </div>

              <h3 className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
                <NotebookPen className="size-3.5" /> Fields captured
              </h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {form.fields.map((field, j) => (
                  <motion.li
                    key={field.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.07 + j * 0.03 }}
                    className="flex items-center gap-2 rounded-xl bg-cloud px-3 py-2 text-xs font-semibold text-navy"
                  >
                    <span className={`size-1.5 shrink-0 rounded-full ${field.required ? "bg-brand" : "bg-slate/40"}`} />
                    <span className="truncate">{field.label}</span>
                    {!field.required && <span className="ml-auto shrink-0 text-[10px] font-medium text-slate">optional</span>}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                <Link
                  to={`${form.route}${form.anchor ?? ""}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy transition hover:text-brand"
                >
                  Open the form <ArrowUpRight className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => onViewLeads(path)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-4 py-2 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-brand"
                >
                  View its {count} {count === 1 ? "lead" : "leads"}
                </button>
                <code className="ml-auto font-mono text-[11px] text-slate">{form.route}</code>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
