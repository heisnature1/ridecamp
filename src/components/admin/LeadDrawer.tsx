import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  ExternalLink,
  FileWarning,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import {
  LEAD_STATUSES,
  kindMeta,
  statusMeta,
  type LeadStatus,
} from "../../lib/leadKinds";
import {
  leadEmailLink,
  leadName,
  leadOrg,
  leadPhone,
  leadWhatsAppLink,
  type LeadRecord,
} from "../../lib/leadsStore";
import { fmtDateTime, sourceLabel, timeAgo } from "../../lib/format";
import { EASE, KindChip } from "./ui";

export default function LeadDrawer({
  lead,
  onClose,
  onStatus,
  onDelete,
}: {
  lead: LeadRecord | null;
  onClose: () => void;
  onStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  const wa = lead ? leadWhatsAppLink(lead) : null;
  const mail = lead ? leadEmailLink(lead) : null;
  const tel = lead && leadPhone(lead) ? `tel:${leadPhone(lead).replace(/\s/g, "")}` : null;

  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 z-[60] bg-navy/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-label={`${kindMeta(lead.kind).label} lead details`}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <KindChip chipClass={kindMeta(lead.kind).chip}>{kindMeta(lead.kind).label}</KindChip>
                  <KindChip chipClass={statusMeta(lead.status).chip}>{statusMeta(lead.status).label}</KindChip>
                </div>
                <h2 className="mt-2 truncate font-display text-xl font-bold text-navy">{leadName(lead)}</h2>
                {leadOrg(lead) && <p className="truncate text-xs font-semibold text-slate">{leadOrg(lead)}</p>}
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate">
                  <CalendarClock className="size-3.5" /> {fmtDateTime(lead.createdAt)} · {timeAgo(lead.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close lead details"
                className="rounded-full p-2 text-slate transition hover:bg-cloud hover:text-navy active:scale-90"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">Follow up</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-105 active:scale-95"
                    >
                      <MessageCircle className="size-4" /> WhatsApp
                    </a>
                  )}
                  {tel && (
                    <a
                      href={tel}
                      className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-soft active:scale-95"
                    >
                      <Phone className="size-4" /> Call
                    </a>
                  )}
                  {mail && (
                    <a
                      href={mail}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-navy active:scale-95"
                    >
                      <Mail className="size-4" /> Email
                    </a>
                  )}
                  {!wa && !tel && !mail && (
                    <p className="flex items-center gap-2 text-xs text-slate">
                      <FileWarning className="size-4 text-amber-500" /> No contact details on this lead.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
                  What they entered
                </h3>
                <dl className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cloud/50">
                  {Object.entries(lead.data).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 + i * 0.04, ease: EASE }}
                      className="flex items-start justify-between gap-4 px-4 py-3"
                    >
                      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate">{key}</dt>
                      <dd className="text-right text-sm font-semibold break-words text-navy">{value}</dd>
                    </motion.div>
                  ))}
                  {Object.keys(lead.data).length === 0 && (
                    <p className="px-4 py-3 text-sm text-slate">This submission captured no fields.</p>
                  )}
                </dl>
              </section>

              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">Status</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LEAD_STATUSES.map((s) => {
                    const active = s.id === lead.status;
                    return (
                      <motion.button
                        key={s.id}
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => onStatus(lead.id, s.id)}
                        className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                          active ? s.chip : "bg-white text-navy ring-1 ring-line hover:ring-navy/40"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${active ? "bg-current" : s.dot}`} />
                        {s.label}
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl bg-cloud p-4 text-xs text-slate">
                <p className="flex items-start justify-between gap-3">
                  <span>Source</span>
                  <a
                    href={lead.source.split("?")[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-navy hover:text-brand"
                  >
                    {sourceLabel(lead.source)} <ExternalLink className="size-3" />
                  </a>
                </p>
                <p className="mt-2 flex items-center justify-between gap-3">
                  <span>Raw path</span>
                  <code className="font-mono text-[11px] text-navy">{lead.source}</code>
                </p>
                <p className="mt-2 flex items-center justify-between gap-3">
                  <span>Lead ID</span>
                  <code className="font-mono text-[11px] text-navy">{lead.id}</code>
                </p>
              </section>
            </div>

            <footer className="border-t border-line px-5 py-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onDelete(lead.id)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
              >
                <Trash2 className="size-4" /> Delete this lead
              </motion.button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
