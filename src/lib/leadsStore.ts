import {
  kindMeta,
  normalizeKind,
  normalizeStatus,
  statusMeta,
  type LeadKind,
  type LeadStatus,
} from "./leadKinds";

/**
 * Browser-side lead store.
 *
 * Everything a visitor types into a public form is written here, and the admin
 * dashboard reads from the same place, so the two can never drift apart.
 * Writes notify subscribers in the current tab (custom event) *and* in any
 * other open tab (`storage` event), which is how the dashboard updates live.
 */

export const STORAGE_KEY = "ridecamp_leads";
const CHANGE_EVENT = "ridecamp:leads-change";

export type LeadData = Record<string, string>;

export type LeadRecord = {
  id: string;
  kind: LeadKind;
  status: LeadStatus;
  /** ISO timestamp of the submission */
  createdAt: string;
  /** page the lead was submitted from, e.g. `/contact?intent=quote` */
  source: string;
  /** exactly what the visitor typed, keyed by the form's own field labels */
  data: LeadData;
  /** internal notes added by an admin on the dashboard — never mixed with visitor data */
  adminNotes: string;
};

const canUseBrowser = typeof window !== "undefined";

function newId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function cleanData(raw: unknown): LeadData {
  if (!raw || typeof raw !== "object") return {};
  const out: LeadData = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v === null || v === undefined) continue;
    const value = String(v).trim();
    if (value) out[k] = value;
  }
  return out;
}

function isoDate(raw: unknown): string {
  if (typeof raw === "string" && !Number.isNaN(Date.parse(raw))) return raw;
  return new Date(0).toISOString();
}

/** Accepts the current shape *and* the older `{ kind, timestamp, data }` shape. */
export function normalizeRecord(raw: unknown): LeadRecord {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === "string" && r.id ? r.id : newId(),
    kind: normalizeKind(r.kind),
    status: normalizeStatus(r.status),
    createdAt: isoDate(r.createdAt ?? r.timestamp),
    source: typeof r.source === "string" && r.source ? r.source : "unknown",
    data: cleanData(r.data),
    adminNotes: typeof r.adminNotes === "string" ? r.adminNotes : "",
  };
}

export function readLeads(): LeadRecord[] {
  if (!canUseBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeRecord);
  } catch {
    return [];
  }
}

function write(leads: LeadRecord[]) {
  if (!canUseBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    /* private mode / quota — the dashboard still shows in-memory data */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { leads } }));
}

export function currentSource(): string {
  if (!canUseBrowser) return "unknown";
  const { pathname, search } = window.location;
  return `${pathname}${search}`;
}

export function addLead(kind: string, data: LeadData, source?: string): LeadRecord {
  const record = normalizeRecord({
    id: newId(),
    kind: normalizeKind(kind),
    status: "new",
    createdAt: new Date().toISOString(),
    source: source ?? currentSource(),
    data,
  });
  write([...readLeads(), record]);
  return record;
}

export function updateLead(id: string, patch: Partial<Pick<LeadRecord, "status" | "data" | "adminNotes">>) {
  write(
    readLeads().map((l) =>
      l.id === id
        ? {
            ...l,
            status: patch.status ? normalizeStatus(patch.status) : l.status,
            data: patch.data ? cleanData(patch.data) : l.data,
            adminNotes: patch.adminNotes !== undefined ? patch.adminNotes : l.adminNotes,
          }
        : l,
    ),
  );
}

export function deleteLead(id: string) {
  write(readLeads().filter((l) => l.id !== id));
}

export function clearLeads() {
  if (!canUseBrowser) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { leads: [] } }));
}

export function addMany(records: LeadRecord[]) {
  write([...readLeads(), ...records.map(normalizeRecord)]);
}

/** Bulk removal — used to strip the sample data set back out. */
export function removeMany(ids: string[]) {
  const drop = new Set(ids);
  write(readLeads().filter((l) => !drop.has(l.id)));
}

/** Fires on same-tab writes and on writes from other tabs of the same site. */
export function subscribe(onChange: (leads: LeadRecord[]) => void): () => void {
  if (!canUseBrowser) return () => {};
  const handler = () => onChange(readLeads());
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onChange(readLeads());
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", onStorage);
  };
}

/* ------------------------------------------------------------------ */
/* Presentational helpers shared by the dashboard                      */
/* ------------------------------------------------------------------ */

const NAME_KEYS = ["Name", "Contact person", "Contact Person", "Company"];
const PHONE_KEYS = ["Phone", "Phone number", "Mobile"];
const EMAIL_KEYS = ["Email", "Email address"];
const CITY_KEYS = ["City", "Town"];

function firstValue(data: LeadData, keys: string[]): string {
  for (const k of keys) if (data[k]) return data[k];
  return "";
}

export function leadName(lead: LeadRecord): string {
  return firstValue(lead.data, NAME_KEYS) || "Unnamed lead";
}

export function leadPhone(lead: LeadRecord): string {
  return firstValue(lead.data, PHONE_KEYS);
}

export function leadEmail(lead: LeadRecord): string {
  return firstValue(lead.data, EMAIL_KEYS);
}

/** Company name, when the lead came from the fleet form. */
export function leadOrg(lead: LeadRecord): string {
  return lead.data.Company ?? "";
}

export function leadCity(lead: LeadRecord): string {
  return firstValue(lead.data, CITY_KEYS) || "—";
}

export function leadSummary(lead: LeadRecord): string {
  const parts = [leadPhone(lead), leadEmail(lead), leadCity(lead)].filter((p) => p && p !== "—");
  return parts.join(" · ") || "No contact details captured";
}

/** Whether an admin has attached an internal note to this lead. */
export function leadHasNotes(lead: LeadRecord): boolean {
  return lead.adminNotes.trim().length > 0;
}

/** WhatsApp deep-link that messages the *customer*, pre-filled with context. */
export function leadWhatsAppLink(lead: LeadRecord): string | null {
  const digits = leadPhone(lead).replace(/\D/g, "");
  if (!digits) return null;
  const name = leadName(lead).split(" ")[0];
  const text = `Hello ${name}, this is Future Ride (Spiro electric motorcycles, Ghana). We received your ${kindMeta(
    lead.kind,
  ).label.toLowerCase()} request on our website and would love to help. When is a good time to talk?`;
  return `https://wa.me/${digits.startsWith("233") ? digits : `233${digits}`}?text=${encodeURIComponent(text)}`;
}

export function leadEmailLink(lead: LeadRecord): string | null {
  const to = leadEmail(lead);
  if (!to) return null;
  const body = Object.entries(lead.data)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(
    `Following up on your ${kindMeta(lead.kind).label.toLowerCase()} request — Future Ride`,
  )}&body=${encodeURIComponent(`Hi ${leadName(lead).split(" ")[0]},\n\nThank you for your interest.\n\nYour details:\n${body}`)}`;
}

/* ------------------------------------------------------------------ */
/* Export / import                                                     */
/* ------------------------------------------------------------------ */

function csvCell(value: unknown): string {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function leadsToCsv(leads: LeadRecord[]): string {
  const dataKeys: string[] = [];
  for (const lead of leads) {
    for (const key of Object.keys(lead.data)) if (!dataKeys.includes(key)) dataKeys.push(key);
  }
  const header = ["Submitted", "Type", "Status", "Source", ...dataKeys, "Admin notes"];
  const rows = leads.map((lead) => [
    new Date(lead.createdAt).toLocaleString("en-GB"),
    kindMeta(lead.kind).label,
    statusMeta(lead.status).label,
    lead.source,
    ...dataKeys.map((key) => lead.data[key] ?? ""),
    lead.adminNotes,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function exportFileName(ext: "csv" | "json"): string {
  return `future-ride-leads-${new Date().toISOString().slice(0, 10)}.${ext}`;
}

export function downloadFile(fileName: string, content: string, mime: string) {
  if (!canUseBrowser) return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function importLeadsJson(json: string): { added: number; skipped: number } {
  const parsed: unknown = JSON.parse(json);
  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { leads?: unknown })?.leads)
      ? ((parsed as { leads: unknown[] }).leads)
      : null;
  if (!list) throw new Error("That file does not look like a Future Ride lead export.");
  const existing = readLeads();
  const known = new Set(existing.map((l) => l.id));
  const incoming = list.map(normalizeRecord);
  const fresh = incoming.filter((l) => !known.has(l.id));
  if (fresh.length) write([...existing, ...fresh]);
  return { added: fresh.length, skipped: incoming.length - fresh.length };
}
