export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtMoney(n: number): string {
  return fmtInt(n);
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** 9 Oct 2026, 14:05 */
export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit" },
  )}`;
}

/** 9 Oct, 14:05 */
export function fmtShortDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · ${d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} mo ago`;
}

/** Local-day key, e.g. `2026-10-09`, used to bucket leads by day. */
export function dayKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Strips query/hash and a trailing slash, but keeps "/" as "/". */
export function normalizePath(source: string): string {
  const path = String(source ?? "").split("?")[0].split("#")[0];
  if (path.length > 1) return path.replace(/\/+$/, "");
  return path || "/";
}

/** Human label for the public page a lead came from. */
export function sourceLabel(source: string): string {
  const path = source.split("?")[0].replace(/\/+$/, "") || "/";
  const MAP: Record<string, string> = {
    "/": "Home page",
    "/contact": "Contact / book a test ride",
    "/ownership": "Ownership & financing",
    "/fleet": "Fleet & business",
    "/calculator": "Savings calculator",
    "/ekon": "Ekon 450 M1",
    "/battery-swap": "Battery swap",
    "/why-electric": "Why electric",
    "/service": "Service & warranty",
    "/about": "About",
    "/faqs": "FAQs",
  };
  const label = MAP[path];
  const intent = new URLSearchParams(source.split("?")[1] ?? "").get("intent");
  if (label && intent) return `${label} (${intent.replace(/-/g, " ")})`;
  return label ?? path;
}
