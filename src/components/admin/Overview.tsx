import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Bike,
  CalendarClock,
  Inbox,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import CountUp from "../CountUp";
import { computeStats } from "../../lib/leadStats";
import { kindMeta, statusMeta, type LeadKind, type LeadStatus } from "../../lib/leadKinds";
import { leadName, leadSummary, type LeadRecord } from "../../lib/leadsStore";
import { timeAgo } from "../../lib/format";
import { BreakdownRow, EASE, KindChip, Panel, PanelTitle } from "./ui";

function Kpi({
  label,
  value,
  hint,
  icon,
  accent,
  delay,
  onClick,
}: {
  label: string;
  value: number;
  hint: string;
  icon: ReactNode;
  accent: string;
  delay: number;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-3xl border border-line bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <span className={`absolute -right-6 -top-8 size-24 rounded-full ${accent} transition-transform duration-500 group-hover:scale-125`} />
      <span className="relative flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">{label}</span>
        <span className="text-navy/60 transition-colors group-hover:text-brand">{icon}</span>
      </span>
      <span className="relative mt-4 block font-display text-4xl font-bold tabular-nums text-navy">
        <CountUp value={value} duration={1100} />
      </span>
      <span className="relative mt-1 block text-xs text-slate">{hint}</span>
    </motion.button>
  );
}

export default function Overview({
  leads,
  onOpenLead,
  onGoToLeads,
  onLoadSample,
}: {
  leads: LeadRecord[];
  onOpenLead: (id: string) => void;
  onGoToLeads: (kind?: string) => void;
  onLoadSample: () => void;
}) {
  const stats = computeStats(leads);
  const maxDay = Math.max(1, ...stats.last7.map((d) => d.count));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Total leads"
          value={stats.total}
          hint="Every public form submission"
          icon={<Inbox className="size-4" />}
          accent="bg-brand/10"
          delay={0}
          onClick={() => onGoToLeads()}
        />
        <Kpi
          label="Needs action"
          value={stats.unworked}
          hint="Still marked “new”"
          icon={<CalendarClock className="size-4" />}
          accent="bg-amber-500/10"
          delay={0.06}
          onClick={() => onGoToLeads("status:new")}
        />
        <Kpi
          label="This week"
          value={stats.thisWeek}
          hint="Last 7 days"
          icon={<TrendingUp className="size-4" />}
          accent="bg-sky-500/10"
          delay={0.12}
          onClick={() => onGoToLeads()}
        />
        <Kpi
          label="Fleet bikes"
          value={stats.fleetBikes}
          hint="Requested across fleet quotes"
          icon={<Bike className="size-4" />}
          accent="bg-violet-500/10"
          delay={0.18}
          onClick={() => onGoToLeads("kind:fleet")}
        />
      </div>

      {stats.latest && (
        <motion.button
          type="button"
          onClick={() => onOpenLead(stats.latest!.id)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          whileHover={{ y: -2 }}
          className="flex w-full items-center gap-4 rounded-3xl border border-line bg-navy p-5 text-left text-white shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-bright/60" />
            <Sparkles className="relative size-4 text-brand-bright" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
              Latest submission · {timeAgo(stats.latest.createdAt)}
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold">
              {leadName(stats.latest)} — {leadSummary(stats.latest)}
            </span>
          </span>
          <span className="hidden shrink-0 items-center gap-2 sm:flex">
            <KindChip chipClass={kindMeta(stats.latest.kind).chip}>{kindMeta(stats.latest.kind).label}</KindChip>
            <ArrowUpRight className="size-4 text-white/50" />
          </span>
        </motion.button>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Panel delay={0.26}>
          <PanelTitle
            title="Submissions, last 7 days"
            hint={`${stats.today} today · ${stats.thisWeek} this week`}
          />
          <div className="flex h-44 items-end gap-2 sm:gap-3">
            {stats.last7.map((day, i) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-bold tabular-nums text-navy">{day.count}</span>
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand/70 to-brand-bright"
                  initial={{ height: 4 }}
                  animate={{ height: `${Math.max(6, (day.count / maxDay) * 100)}%` }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.05, ease: EASE }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate">{day.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-line pt-4 text-xs text-slate">
            Pipeline: <span className="font-bold text-navy">{stats.wonRate}%</span> of all leads are marked won.
          </p>
        </Panel>

        <Panel delay={0.3}>
          <PanelTitle title="Pipeline" hint="Where each lead stands" />
          <div className="flex h-3 overflow-hidden rounded-full bg-cloud">
            {stats.byStatus
              .filter((s) => s.count > 0)
              .map((s, i) => (
                <motion.span
                  key={s.key}
                  className={statusMeta(s.key as LeadStatus).bar}
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.count / Math.max(1, stats.total)) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.35 + i * 0.06, ease: EASE }}
                />
              ))}
          </div>
          <ul className="mt-5 space-y-3">
            {stats.byStatus.map((s, i) => (
              <motion.li
                key={s.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className={`size-2.5 rounded-full ${statusMeta(s.key as LeadStatus).dot}`} />
                <span className="flex-1 font-semibold text-navy">{s.label}</span>
                <span className="tabular-nums text-slate">{s.count}</span>
              </motion.li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel delay={0.34}>
          <PanelTitle title="By lead type" hint="Merged from all four public forms" />
          {stats.byKind.length === 0 ? (
            <p className="text-sm text-slate">Nothing captured yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.byKind.map((b, i) => (
                <BreakdownRow
                  key={b.key}
                  label={b.label}
                  count={b.count}
                  total={stats.total}
                  barClass={kindMeta(b.key as LeadKind).bar}
                  delay={0.4 + i * 0.06}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel delay={0.38}>
          <PanelTitle title="Where they came from" hint="Page the visitor was on" />
          {stats.bySource.length === 0 ? (
            <p className="text-sm text-slate">Nothing captured yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.bySource.slice(0, 5).map((b, i) => (
                <BreakdownRow
                  key={b.key}
                  label={b.label}
                  count={b.count}
                  total={stats.total}
                  barClass="bg-navy-soft"
                  delay={0.44 + i * 0.06}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel delay={0.42}>
          <PanelTitle title="Top cities" hint="Riders are concentrated" />
          {stats.byCity.length === 0 ? (
            <p className="text-sm text-slate">Nothing captured yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.byCity.slice(0, 5).map((b, i) => (
                <BreakdownRow
                  key={b.key}
                  label={b.label}
                  count={b.count}
                  total={stats.total}
                  barClass="bg-brand"
                  delay={0.48 + i * 0.06}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>

      {leads.length === 0 && (
        <Panel delay={0.46} className="flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 text-sm text-slate">
            <Users className="size-5 shrink-0 text-brand" />
            The dashboard is empty. Submit any public form and it appears here instantly — or load
            sample leads to explore the layout.
          </p>
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-navy-soft active:scale-95"
          >
            Load sample leads
          </button>
        </Panel>
      )}
    </div>
  );
}
