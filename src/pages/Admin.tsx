import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Inbox,
  LayoutDashboard,
  NotebookPen,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import LeadDrawer from "../components/admin/LeadDrawer";
import LeadsTable from "../components/admin/LeadsTable";
import Overview from "../components/admin/Overview";
import Sources from "../components/admin/Sources";
import SettingsPanel from "../components/admin/Settings";
import { Toasts, type ToastMessage } from "../components/admin/ui";
import useLeads from "../lib/useLeads";
import { EMPTY_FILTERS, type LeadFilters } from "../lib/leadStats";
import { kindMeta, normalizeKind, type LeadStatus } from "../lib/leadKinds";
import {
  addMany,
  deleteLead,
  downloadFile,
  exportFileName,
  leadsToCsv,
  leadName,
  removeMany,
  updateLead,
} from "../lib/leadsStore";
import { buildSampleLeads } from "../data/sampleLeads";

type TabId = "overview" | "leads" | "sources" | "settings";

const TABS: { id: TabId; label: string; icon: typeof Inbox }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "leads", label: "All leads", icon: Inbox },
  { id: "sources", label: "Public forms", icon: NotebookPen },
  { id: "settings", label: "Data & export", icon: Settings2 },
];

export default function Admin() {
  const leads = useLeads();
  const [tab, setTab] = useState<TabId>("overview");
  const [filters, setFilters] = useState<LeadFilters>(EMPTY_FILTERS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const prevCount = useRef(leads.length);
  const seenIds = useRef<string[]>(leads.map((l) => l.id));

  const toast = useCallback((text: string, tone: "ok" | "warn" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  /* Live feed: announce anything the public side submits while we are watching. */
  useEffect(() => {
    if (leads.length > prevCount.current) {
      const seen = new Set(seenIds.current);
      const fresh = leads
        .filter((l) => !seen.has(l.id) && !l.id.startsWith("sample-"))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const newest = fresh[0];
      if (newest) {
        toast(
          fresh.length > 1
            ? `${fresh.length} new leads — latest from ${leadName(newest)}`
            : `New ${kindMeta(newest.kind).label.toLowerCase()} lead — ${leadName(newest)}`,
        );
      }
    }
    seenIds.current = leads.map((l) => l.id);
    prevCount.current = leads.length;
  }, [leads, toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeLead = useMemo(() => leads.find((l) => l.id === activeId) ?? null, [leads, activeId]);
  const newCount = leads.filter((l) => l.status === "new").length;

  const goToLeads = useCallback((hint?: string) => {
    setTab("leads");
    setFilters(
      hint === "status:new"
        ? { ...EMPTY_FILTERS, statuses: ["new"] }
        : hint?.startsWith("kind:")
          ? { ...EMPTY_FILTERS, kinds: [normalizeKind(hint.slice(5))] }
          : EMPTY_FILTERS,
    );
  }, []);

  const loadSample = useCallback(() => {
    const existing = new Set(leads.map((l) => l.id));
    const fresh = buildSampleLeads().filter((l) => !existing.has(l.id));
    addMany(fresh);
    toast(`Added ${fresh.length} sample leads`);
  }, [leads, toast]);

  const removeSample = useCallback(() => {
    const ids = leads.filter((l) => l.id.startsWith("sample-")).map((l) => l.id);
    removeMany(ids);
    toast(`Removed ${ids.length} sample leads`, "warn");
  }, [leads, toast]);

  const exportCsv = useCallback(() => {
    downloadFile(exportFileName("csv"), leadsToCsv(leads), "text/csv;charset=utf-8");
    toast(`Exported ${leads.length} leads as CSV`);
  }, [leads, toast]);

  const openLead = useCallback(
    (id: string) => {
      setTab("leads");
      setActiveId(id);
    },
    [],
  );

  return (
    <div className="min-h-[70vh] bg-cloud pb-20">
      {/* header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 md:px-8 md:pt-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Internal</p>
                <h1 className="mt-2 font-display text-3xl font-bold text-navy md:text-5xl">
                  Admin dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate md:text-base">
                  Everything visitors type into the public site — test rides, quotes, financing
                  applications, fleet requests and call-backs — lands here as it is submitted.
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-brand-dark">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand" />
                  </span>
                  Live · this browser
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/"
                    className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-navy active:scale-95"
                  >
                    View public site
                  </Link>
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-navy-soft active:scale-95"
                  >
                    <Download className="size-3.5" /> Export CSV
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* tabs */}
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Dashboard sections">
            {TABS.map((t, i) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-bold transition-colors ${
                    active ? "text-navy" : "text-slate hover:text-navy"
                  }`}
                >
                  <Icon className="size-4" />
                  {t.label}
                  {t.id === "leads" && leads.length > 0 && (
                    <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] tabular-nums text-white">
                      {leads.length}
                    </span>
                  )}
                  {t.id === "overview" && newCount > 0 && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] tabular-nums text-white">
                      {newCount} new
                    </span>
                  )}
                  {active && (
                    <motion.span
                      layoutId="admin-tab-underline"
                      className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-brand"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* content */}
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "overview" && (
              <Overview
                leads={leads}
                onOpenLead={openLead}
                onGoToLeads={goToLeads}
                onLoadSample={loadSample}
              />
            )}
            {tab === "leads" && (
              <LeadsTable
                leads={leads}
                filters={filters}
                onFilters={setFilters}
                onOpen={setActiveId}
                onExportCsv={exportCsv}
              />
            )}
            {tab === "sources" && (
              <Sources
                leads={leads}
                onViewLeads={(route) => {
                  setFilters({ ...EMPTY_FILTERS, source: route });
                  setTab("leads");
                }}
              />
            )}
            {tab === "settings" && (
              <SettingsPanel
                leads={leads}
                onToast={toast}
                onLoadSample={loadSample}
                onRemoveSample={removeSample}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <LeadDrawer
        lead={activeLead}
        onClose={() => setActiveId(null)}
        onStatus={(id, status: LeadStatus) => {
          updateLead(id, { status });
          toast(`Marked as ${status}`);
        }}
        onDelete={(id) => {
          deleteLead(id);
          setActiveId(null);
          toast("Lead deleted", "warn");
        }}
      />

      <Toasts toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      <p className="mx-auto mt-10 flex max-w-7xl items-center gap-2 px-4 text-[11px] text-slate md:px-8">
        <SlidersHorizontal className="size-3.5" />
        Storage key <code className="rounded bg-white px-1.5 py-0.5 font-mono">ridecamp_leads</code> ·
        {leads.length} records on this device.
      </p>
    </div>
  );
}
