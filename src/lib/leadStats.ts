import { dayKey, startOfDay } from "./format";
import { LEAD_KINDS, LEAD_STATUSES, type LeadKind, type LeadStatus } from "./leadKinds";
import { leadCity, type LeadRecord } from "./leadsStore";
import { normalizePath, sourceLabel } from "./format";

/** Pure aggregation helpers — the dashboard renders these numbers, nothing else. */

export type CountBucket = { key: string; label: string; count: number };

export type LeadStats = {
  total: number;
  today: number;
  thisWeek: number;
  unworked: number;
  fleetBikes: number;
  wonRate: number;
  byKind: CountBucket[];
  byStatus: CountBucket[];
  byCity: CountBucket[];
  bySource: CountBucket[];
  last7: CountBucket[];
  latest: LeadRecord | null;
};

function emptyCounts<T extends string>(list: { id: T; label: string }[]): Record<T, number> {
  return list.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {} as Record<T, number>);
}

export function computeStats(leads: LeadRecord[], now = new Date()): LeadStats {
  const byKind = emptyCounts(LEAD_KINDS);
  const byStatus = emptyCounts(LEAD_STATUSES);
  const cityTally = new Map<string, number>();
  const sourceTally = new Map<string, number>();
  const dayTally = new Map<string, number>();

  let today = 0;
  let thisWeek = 0;
  let unworked = 0;
  let fleetBikes = 0;
  let won = 0;
  let latest: LeadRecord | null = null;

  const todayKey = dayKey(now);
  const weekAgo = startOfDay(new Date(now.getTime() - 6 * 86400000));

  for (const lead of leads) {
    byKind[lead.kind] += 1;
    byStatus[lead.status] += 1;
    if (lead.status === "new") unworked += 1;
    if (lead.status === "won") won += 1;

    const city = leadCity(lead);
    if (city && city !== "—") cityTally.set(city, (cityTally.get(city) ?? 0) + 1);

    const src = sourceLabel(lead.source);
    sourceTally.set(src, (sourceTally.get(src) ?? 0) + 1);

    const key = dayKey(lead.createdAt);
    dayTally.set(key, (dayTally.get(key) ?? 0) + 1);

    if (key === todayKey) today += 1;
    if (new Date(lead.createdAt) >= weekAgo) thisWeek += 1;

    if (lead.kind === "fleet") {
      const bikes = Number.parseInt(lead.data["Number of bikes"] ?? "", 10);
      if (Number.isFinite(bikes)) fleetBikes += bikes;
    }
    if (!latest || new Date(lead.createdAt) > new Date(latest.createdAt)) latest = lead;
  }

  const last7: CountBucket[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = dayKey(d);
    last7.push({
      key,
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      count: dayTally.get(key) ?? 0,
    });
  }

  const toBuckets = <T extends string>(
    tally: Record<T, number>,
    meta: { id: T; label: string }[],
  ): CountBucket[] => meta.map((m) => ({ key: m.id, label: m.label, count: tally[m.id] }));

  const sorted = (tally: Map<string, number>): CountBucket[] =>
    [...tally.entries()]
      .map(([key, count]) => ({ key, label: key, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return {
    total: leads.length,
    today,
    thisWeek,
    unworked,
    fleetBikes,
    wonRate: leads.length ? Math.round((won / leads.length) * 100) : 0,
    byKind: toBuckets(byKind, LEAD_KINDS).filter((b) => b.count > 0),
    byStatus: toBuckets(byStatus, LEAD_STATUSES),
    byCity: sorted(cityTally),
    bySource: sorted(sourceTally),
    last7,
    latest,
  };
}

export type LeadFilters = {
  kinds: LeadKind[];
  statuses: LeadStatus[];
  query: string;
  source: string;
};

export const EMPTY_FILTERS: LeadFilters = { kinds: [], statuses: [], query: "", source: "" };

/** One merged query across every lead type — the dashboard has a single table. */
export function filterLeads(leads: LeadRecord[], filters: LeadFilters): LeadRecord[] {
  const raw = filters.query.trim();
  const q = raw.toLowerCase();
  const notesOnly = q === "has:notes";
  return leads
    .filter((lead) => (filters.kinds.length ? filters.kinds.includes(lead.kind) : true))
    .filter((lead) => (filters.statuses.length ? filters.statuses.includes(lead.status) : true))
    .filter((lead) => (filters.source ? normalizePath(lead.source) === normalizePath(filters.source) : true))
    .filter((lead) => {
      if (notesOnly) return lead.adminNotes.trim().length > 0;
      if (!q) return true;
      const haystack = [lead.kind, lead.status, lead.source, ...Object.values(lead.data), lead.adminNotes]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
