/**
 * Canonical lead taxonomy.
 *
 * Shared by the public site (which writes leads) and the admin dashboard
 * (which reads them) so a submission always lands in the right bucket and is
 * always labelled the same way on both sides.
 *
 * NOTE: every Tailwind class below is written out in full — never interpolated —
 * so the Tailwind compiler can see and emit it.
 */

export type LeadKind = "test-ride" | "quote" | "financing" | "fleet" | "callback";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type KindMeta = {
  id: LeadKind;
  label: string;
  plural: string;
  /** pill styling */
  chip: string;
  /** small square/circle marker */
  dot: string;
  /** chart bar fill */
  bar: string;
  /** soft glow used behind KPI numbers */
  glow: string;
};

export const LEAD_KINDS: KindMeta[] = [
  {
    id: "test-ride",
    label: "Test ride",
    plural: "Test rides",
    chip: "bg-mint text-brand-dark ring-1 ring-brand/25",
    dot: "bg-brand",
    bar: "bg-brand",
    glow: "bg-brand/10",
  },
  {
    id: "quote",
    label: "Quote request",
    plural: "Quote requests",
    chip: "bg-navy/5 text-navy ring-1 ring-navy/15",
    dot: "bg-navy-soft",
    bar: "bg-navy-soft",
    glow: "bg-navy/10",
  },
  {
    id: "financing",
    label: "Financing",
    plural: "Financing applications",
    chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/25",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    glow: "bg-amber-500/10",
  },
  {
    id: "fleet",
    label: "Fleet",
    plural: "Fleet quotes",
    chip: "bg-violet-50 text-violet-700 ring-1 ring-violet-500/25",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
    glow: "bg-violet-500/10",
  },
  {
    id: "callback",
    label: "Call-back",
    plural: "Call-backs",
    chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-500/25",
    dot: "bg-sky-500",
    bar: "bg-sky-500",
    glow: "bg-sky-500/10",
  },
];

export type StatusMeta = {
  id: LeadStatus;
  label: string;
  chip: string;
  dot: string;
  bar: string;
};

export const LEAD_STATUSES: StatusMeta[] = [
  { id: "new", label: "New", chip: "bg-brand text-white", dot: "bg-brand", bar: "bg-brand" },
  { id: "contacted", label: "Contacted", chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-500/25", dot: "bg-sky-500", bar: "bg-sky-500" },
  { id: "qualified", label: "Qualified", chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/25", dot: "bg-amber-500", bar: "bg-amber-500" },
  { id: "won", label: "Won", chip: "bg-emerald-600 text-white", dot: "bg-emerald-600", bar: "bg-emerald-600" },
  { id: "lost", label: "Lost", chip: "bg-slate-100 text-slate ring-1 ring-line", dot: "bg-slate-400", bar: "bg-slate-400" },
];

const KIND_ALIASES: Record<string, LeadKind> = {
  "test-ride": "test-ride",
  "test ride": "test-ride",
  "book a test ride": "test-ride",
  "book-test-ride": "test-ride",
  "testride": "test-ride",
  quote: "quote",
  "get a quote": "quote",
  "quote request": "quote",
  "request a quote": "quote",
  financing: "financing",
  "apply for financing": "financing",
  "financing application": "financing",
  fleet: "fleet",
  "fleet-quote": "fleet",
  "fleet quote": "fleet",
  callback: "callback",
  "call me back": "callback",
  "call-back": "callback",
};

/** Maps any historical/free-text kind string onto the canonical set. */
export function normalizeKind(raw: unknown): LeadKind {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  return KIND_ALIASES[key] ?? "quote";
}

export function normalizeStatus(raw: unknown): LeadStatus {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();
  return LEAD_STATUSES.some((s) => s.id === key) ? (key as LeadStatus) : "new";
}

export function kindMeta(id: LeadKind): KindMeta {
  return LEAD_KINDS.find((k) => k.id === id) ?? LEAD_KINDS[1];
}

export function statusMeta(id: LeadStatus): StatusMeta {
  return LEAD_STATUSES.find((s) => s.id === id) ?? LEAD_STATUSES[0];
}

/**
 * Ghanaian numbers arrive in every shape (`024 000 0000`, `+233240000000`,
 * `233 24 000 0000`). Normalise before storing so the admin sees one format.
 */
export function formatGhanaPhone(raw: string): string {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("233")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  if (!d) return "";
  if (d.length === 9) return `+233 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `+233 ${d}`;
}

/** Digits only, country code included — what `wa.me` / `tel:` expect. */
export function phoneDigits(value: string): string {
  let d = String(value ?? "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("233")) return d;
  if (d.startsWith("0")) d = d.slice(1);
  return d ? `233${d}` : "";
}
