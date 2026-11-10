import { supabase, friendlyError } from "./supabase";
import {
  kindMeta,
  normalizeKind,
  normalizeStatus,
  statusMeta,
  type LeadKind,
  type LeadStatus,
} from "./leadKinds";

/**
 * Lead store — backed by Supabase (Postgres).
 *
 * Every booking, quote, financing application, fleet enquiry and call back is
 * written to the `leads` table, so it survives the visitor closing the browser,
 * switching device, or clearing site data. Rows are only removed when an admin
 * deletes them (or clears everything from the dashboard).
 *
 * A read through cache is mirrored to localStorage: it keeps the dashboard
 * instant on reloads and means a submission is never lost if the network blips
 * — unsent leads are retried and removed from the cache only once they land.
 */

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

const TABLE = "leads";
const CACHE_KEY = "ridecamp_leads_cache";
const PENDING_KEY = "ridecamp_leads_pending";
const CHANGE_EVENT = "ridecamp:leads-change";

const canUseBrowser = typeof window !== "undefined";

/* ------------------------------------------------------------------ */
/* cache + pending queue (localStorage)                                */
/* ------------------------------------------------------------------ */

function readJson<T>(key: string, fallback: T): T {
  if (!canUseBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — the dashboard still works from memory */
  }
}

function emit(leads: LeadRecord[]) {
  if (!canUseBrowser) return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { leads } }));
}

/* ------------------------------------------------------------------ */
/* shape conversion                                                    */
/* ------------------------------------------------------------------ */

type Row = {
  id: string;
  kind: string;
  status: string;
  created_at: string;
  source: string;
  data: unknown;
  admin_notes: string;
};

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

function fromRow(row: Row): LeadRecord {
  return {
    id: row.id,
    kind: normalizeKind(row.kind),
    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    source: row.source || "unknown",
    data: cleanData(row.data),
    adminNotes: row.admin_notes ?? "",
  };
}

function toRow(lead: LeadRecord) {
  return {
    kind: lead.kind,
    status: lead.status,
    created_at: lead.createdAt,
    source: lead.source,
    data: lead.data,
    admin_notes: lead.adminNotes,
  };
}

/* ------------------------------------------------------------------ */
/* reads                                                               */
/* ------------------------------------------------------------------ */

/** Cached snapshot — used for the first paint and the smoke tests. */
export function readLeads(): LeadRecord[] {
  const cached = readJson<LeadRecord[]>(CACHE_KEY, []);
  if (!Array.isArray(cached)) return [];
  return cached.map((l) => ({
    id: String(l.id ?? ""),
    kind: normalizeKind(l.kind),
    status: normalizeStatus(l.status),
    createdAt: typeof l.createdAt === "string" ? l.createdAt : new Date(0).toISOString(),
    source: typeof l.source === "string" ? l.source : "unknown",
    data: cleanData(l.data),
    adminNotes: typeof l.adminNotes === "string" ? l.adminNotes : "",
  }));
}

function setCache(leads: LeadRecord[]) {
  writeJson(CACHE_KEY, leads);
  emit(leads);
}

/** Fresh list from the server. Requires an admin session. */
export async function fetchLeads(): Promise<LeadRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,kind,status,created_at,source,data,admin_notes")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error, "Could not load leads."));
  const leads = (data as Row[]).map(fromRow);
  setCache(leads);
  return leads;
}

/* ------------------------------------------------------------------ */
/* writes                                                              */
/* ------------------------------------------------------------------ */

type PendingLead = { kind: string; data: LeadData; source: string; createdAt: string };

function readPending(): PendingLead[] {
  const list = readJson<PendingLead[]>(PENDING_KEY, []);
  return Array.isArray(list) ? list : [];
}

function writePending(list: PendingLead[]) {
  writeJson(PENDING_KEY, list);
}

function makeRecord(kind: string, data: LeadData, source: string, createdAt: string): LeadRecord {
  return {
    id: `local-${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    kind: normalizeKind(kind),
    status: "new",
    createdAt,
    source,
    data: cleanData(data),
    adminNotes: "",
  };
}

/**
 * Save a public form submission.
 *
 * Resolves as soon as the row is in Postgres. If the network is down the lead
 * is queued locally (and shown in the dashboard from the cache) and retried on
 * the next page load — it is never silently dropped.
 */
export async function addLead(
  kind: string,
  data: LeadData,
  source?: string,
): Promise<LeadRecord> {
  const createdAt = new Date().toISOString();
  const resolvedSource = source ?? currentSource();
  const optimistic = makeRecord(kind, data, resolvedSource, createdAt);

  /**
   * Visitors submit through `ridecamp_submit_lead`, a guarded function that
   * writes the row and hands back its id. A plain insert cannot do this: the
   * table has no anonymous read policy (by design), so asking PostgREST to
   * return the new row would fail and roll the submission back.
   */
  const { data: saved, error } = await supabase.rpc("ridecamp_submit_lead", {
    p_kind: normalizeKind(kind),
    p_source: resolvedSource.slice(0, 500),
    p_data: cleanData(data),
  });

  if (error) {
    if (isNetworkError(error)) {
      // offline: keep it on the device and retry on the next load
      writePending([...readPending(), { kind, data, source: resolvedSource, createdAt }]);
      setCache([optimistic, ...readLeads()]);
      return optimistic;
    }
    throw new Error(friendlyError(error, "Could not save your details."));
  }

  const record = saved ? fromRow(saved as Row) : optimistic;
  setCache([record, ...readLeads().filter((l) => l.id !== record.id)]);
  return record;
}

/** Retry anything queued while offline. Safe to call on every dashboard load. */
export async function flushPendingLeads(): Promise<number> {
  const pending = readPending();
  if (!pending.length) return 0;
  let sent = 0;
  const keep: PendingLead[] = [];
  for (const item of pending) {
    const { error } = await supabase.rpc("ridecamp_submit_lead", {
      p_kind: normalizeKind(item.kind),
      p_source: String(item.source ?? "website").slice(0, 500),
      p_data: cleanData(item.data),
    });
    if (error && isNetworkError(error)) keep.push(item);
    else sent += 1;
  }
  writePending(keep);
  if (sent) emit(readLeads());
  return sent;
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<LeadRecord, "status" | "data" | "adminNotes">>,
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (patch.status !== undefined) payload.status = normalizeStatus(patch.status);
  if (patch.data !== undefined) payload.data = cleanData(patch.data);
  if (patch.adminNotes !== undefined) payload.admin_notes = patch.adminNotes;

  const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
  if (error) throw new Error(friendlyError(error, "Could not update that lead."));

  setCache(
    readLeads().map((l) =>
      l.id === id
        ? {
            ...l,
            status: payload.status ? (payload.status as LeadStatus) : l.status,
            data: patch.data !== undefined ? cleanData(patch.data) : l.data,
            adminNotes:
              patch.adminNotes !== undefined ? patch.adminNotes : l.adminNotes,
          }
        : l,
    ),
  );
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(friendlyError(error, "Could not delete that lead."));
  setCache(readLeads().filter((l) => l.id !== id));
}

/** Admin "delete everything" — the only other way rows disappear. */
export async function clearLeads(): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw new Error(friendlyError(error, "Could not clear the leads."));
  writePending([]);
  setCache([]);
}

/** Bulk insert — used by the dashboard's "load sample data" button. */
export async function addMany(records: LeadRecord[]): Promise<number> {
  if (!records.length) return 0;
  const { error } = await supabase
    .from(TABLE)
    .insert(records.map((r) => ({ ...toRow(r), id: isUuid(r.id) ? r.id : undefined })));
  if (error) throw new Error(friendlyError(error, "Could not load the sample data."));
  await fetchLeads();
  return records.length;
}

/** Bulk removal — used to strip the sample data set back out. */
export async function removeMany(ids: string[]): Promise<void> {
  const uuids = ids.filter(isUuid);
  if (!uuids.length) return;
  const { error } = await supabase.from(TABLE).delete().in("id", uuids);
  if (error) throw new Error(friendlyError(error, "Could not remove those leads."));
  setCache(readLeads().filter((l) => !uuids.includes(l.id)));
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isNetworkError(error: { message?: string } | null): boolean {
  return /failed to fetch|networkerror|load failed|timeout/i.test(error?.message ?? "");
}

export function currentSource(): string {
  if (!canUseBrowser) return "unknown";
  const { pathname, search } = window.location;
  return `${pathname}${search}`;
}

/**
 * Notifies on local cache changes (same tab) and on writes from other tabs.
 * The dashboard also re-fetches from Supabase on mount.
 */
export function subscribe(onChange: (leads: LeadRecord[]) => void): () => void {
  if (!canUseBrowser) return () => {};
  const handler = () => onChange(readLeads());
  const onStorage = (e: StorageEvent) => {
    if (e.key === CACHE_KEY || e.key === null) onChange(readLeads());
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
  return firstValue(lead.data, CITY_KEYS);
}

export function leadSummary(lead: LeadRecord): string {
  const parts = [leadPhone(lead), leadEmail(lead), leadCity(lead)].filter(Boolean);
  return parts.join(" · ") || "No contact details captured";
}

/** Whether an admin has attached an internal note to this lead. */
export function leadHasNotes(lead: LeadRecord): boolean {
  return lead.adminNotes.trim().length > 0;
}

/** WhatsApp deep link that messages the *customer*, pre filled with context. */
export function leadWhatsAppLink(lead: LeadRecord): string | null {
  const digits = leadPhone(lead).replace(/\D/g, "");
  if (!digits) return null;
  const name = leadName(lead).split(" ")[0];
  const text = `Hello ${name}, this is Future Ride Ltd (Spiro electric motorcycles, Ghana). We received your ${kindMeta(
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
    `Following up on your ${kindMeta(lead.kind).label.toLowerCase()} request, Future Ride Ltd`,
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

function isoStamp(raw: unknown): string {
  return typeof raw === "string" && !Number.isNaN(Date.parse(raw))
    ? raw
    : new Date().toISOString();
}

/** Accepts the current shape and the older `{ kind, timestamp, data }` shape. */
export function normalizeRecord(raw: unknown): LeadRecord {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === "string" && r.id ? r.id : `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: normalizeKind(r.kind),
    status: normalizeStatus(r.status),
    createdAt: isoStamp(r.createdAt ?? r.timestamp),
    source: typeof r.source === "string" && r.source ? r.source : "unknown",
    data: cleanData(r.data),
    adminNotes: typeof r.adminNotes === "string" ? r.adminNotes : "",
  };
}

/** Restore an exported JSON backup into the database. */
export async function importLeadsJson(json: string): Promise<{ added: number; skipped: number }> {
  const parsed: unknown = JSON.parse(json);
  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { leads?: unknown })?.leads)
      ? ((parsed as { leads: unknown[] }).leads)
      : null;
  if (!list) throw new Error("That file does not look like a Future Ride Ltd lead export.");

  const existing = await fetchLeads();
  const known = new Set(existing.map((l) => l.id));
  const incoming = list.map(normalizeRecord);
  const fresh = incoming.filter((l) => !known.has(l.id));
  if (!fresh.length) return { added: 0, skipped: incoming.length };

  const rows = fresh.map((l) => ({
    ...(isUuid(l.id) ? { id: l.id } : {}),
    ...toRow(l),
  }));
  const { error } = await supabase.from(TABLE).insert(rows);
  if (error) throw new Error(friendlyError(error, "Could not import that backup."));
  await fetchLeads();
  return { added: fresh.length, skipped: incoming.length - fresh.length };
}
