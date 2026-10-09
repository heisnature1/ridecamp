import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Download, Inbox, Search, SlidersHorizontal } from "lucide-react";
import { filterLeads, type LeadFilters } from "../../lib/leadStats";
import {
  LEAD_KINDS,
  LEAD_STATUSES,
  kindMeta,
  statusMeta,
  type LeadKind,
  type LeadStatus,
} from "../../lib/leadKinds";
import { leadCity, leadName, leadOrg, leadPhone, type LeadRecord } from "../../lib/leadsStore";
import { fmtShortDateTime, sourceLabel, timeAgo } from "../../lib/format";
import { Chip, EASE, EmptyState, KindChip, Panel } from "./ui";

type SortKey = "newest" | "oldest" | "kind";

function sortLeads(leads: LeadRecord[], sort: SortKey): LeadRecord[] {
  const copy = [...leads];
  if (sort === "oldest") return copy.reverse();
  if (sort === "kind") {
    return copy.sort(
      (a, b) =>
        a.kind.localeCompare(b.kind) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return copy;
}

const NO_FILTERS: LeadFilters = { kinds: [], statuses: [], query: "", source: "" };

export default function LeadsTable({
  leads,
  filters,
  onFilters,
  onOpen,
  onExportCsv,
}: {
  leads: LeadRecord[];
  filters: LeadFilters;
  onFilters: (next: LeadFilters) => void;
  onOpen: (id: string) => void;
  onExportCsv: () => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const visible = sortLeads(filterLeads(leads, filters), sortKey);
  const filterKey = `${filters.kinds.join("+")}|${filters.statuses.join("+")}|${filters.query}|${sortKey}`;

  const toggleKind = (id: LeadKind) =>
    onFilters({
      ...filters,
      kinds: filters.kinds.includes(id) ? filters.kinds.filter((k) => k !== id) : [...filters.kinds, id],
    });

  return (
    <Panel>
      {/* type filters — one merged table, filtered rather than split into per-type tables */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          active={filters.kinds.length === 0}
          onClick={() => onFilters({ ...filters, kinds: [] })}
          count={leads.length}
        >
          All leads
        </Chip>
        {LEAD_KINDS.map((k) => (
          <Chip
            key={k.id}
            active={filters.kinds.includes(k.id)}
            onClick={() => toggleKind(k.id)}
            dotClass={k.dot}
            count={leads.filter((l) => l.kind === k.id).length}
          >
            {k.plural}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2.5 focus-within:border-brand">
          <Search className="size-4 shrink-0 text-slate" />
          <input
            value={filters.query}
            onChange={(e) => onFilters({ ...filters, query: e.target.value })}
            placeholder="Search name, phone, email, city, notes…"
            aria-label="Search leads"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate/70"
          />
        </label>

        <label className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm">
          <SlidersHorizontal className="size-4 shrink-0 text-slate" />
          <select
            value={filters.statuses[0] ?? ""}
            onChange={(e) =>
              onFilters({ ...filters, statuses: e.target.value ? [e.target.value as LeadStatus] : [] })
            }
            aria-label="Filter by status"
            className="bg-transparent text-sm font-semibold text-navy outline-none"
          >
            <option value="">Any status</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="Sort leads"
          className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="kind">Grouped by type</option>
        </select>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-soft active:scale-95"
        >
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate">
        Showing <span className="text-navy">{visible.length}</span> of {leads.length} leads
        {(filters.kinds.length > 0 || filters.statuses.length > 0 || filters.query) && (
          <button
            type="button"
            onClick={() => onFilters(NO_FILTERS)}
            className="ml-3 text-brand underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={<Inbox className="size-6" />}
            title={leads.length === 0 ? "No leads yet" : "Nothing matches those filters"}
            body={
              leads.length === 0
                ? "Every form on the public site writes here the moment a visitor submits it. Open any page, fill in a form, and the row appears without a refresh."
                : "Try a different lead type, status or search term."
            }
            action={
              leads.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onFilters(NO_FILTERS)}
                  className="rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-navy-soft active:scale-95"
                >
                  Reset filters
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* desktop: one merged table for every lead type */}
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-line md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-cloud text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <motion.tbody
                key={filterKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {visible.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3), ease: EASE }}
                    onClick={() => onOpen(lead.id)}
                    className="cursor-pointer border-t border-line bg-white transition-colors hover:bg-mint/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="block font-semibold text-navy">{fmtShortDateTime(lead.createdAt)}</span>
                      <span className="block text-[11px] text-slate">{timeAgo(lead.createdAt)}</span>
                    </td>
                    <td className="max-w-[16rem] px-4 py-3">
                      <span className="flex items-center gap-2">
                        {lead.status === "new" && (
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                            <span className="relative inline-flex size-2 rounded-full bg-brand" />
                          </span>
                        )}
                        <span className="truncate font-bold text-navy">{leadName(lead)}</span>
                      </span>
                      <span className="block truncate text-xs text-slate">
                        {[leadOrg(lead), leadPhone(lead)].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <KindChip chipClass={kindMeta(lead.kind).chip}>{kindMeta(lead.kind).label}</KindChip>
                    </td>
                    <td className="px-4 py-3 text-slate">{leadCity(lead)}</td>
                    <td className="max-w-[13rem] px-4 py-3">
                      <span className="block truncate text-xs text-slate">{sourceLabel(lead.source)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <KindChip chipClass={statusMeta(lead.status).chip}>{statusMeta(lead.status).label}</KindChip>
                    </td>
                    <td className="px-2 py-3 text-slate">
                      <ChevronRight className="size-4" />
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {/* mobile: the same leads, as cards */}
          <ul className="mt-5 space-y-3 md:hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((lead, i) => (
                <motion.li
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <button
                    type="button"
                    onClick={() => onOpen(lead.id)}
                    className="w-full rounded-2xl border border-line bg-white p-4 text-left transition hover:border-brand/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-navy">{leadName(lead)}</p>
                        <p className="truncate text-xs text-slate">
                          {[leadOrg(lead), leadPhone(lead)].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>
                      <KindChip chipClass={kindMeta(lead.kind).chip}>{kindMeta(lead.kind).label}</KindChip>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate">
                      <span>{fmtShortDateTime(lead.createdAt)}</span>
                      <span>·</span>
                      <span>{leadCity(lead)}</span>
                      <span>·</span>
                      <KindChip chipClass={statusMeta(lead.status).chip}>{statusMeta(lead.status).label}</KindChip>
                    </div>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </Panel>
  );
}
