/**
 * Bot and abuse protection.
 *
 * 1. A honeypot field the visitor never sees — a real browser leaves it blank,
 *    naive bots fill it in.
 * 2. A minimum time-on-form check: humans take more than a moment.
 * 3. A per browser rate limit: the same visitor cannot hammer the forms.
 * 4. A same-origin check so a third party page cannot post on the visitor's
 *    behalf.
 *
 * None of this replaces the database side throttle (see `ridecamp_guard_lead_insert`),
 * which is what actually stops a scripted attacker who ignores the UI.
 */

const RATE_KEY = "ridecamp_form_rate";
const SUBMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMITS = 3;

type Stamp = { at: number };

function readStamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RATE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - SUBMIT_WINDOW_MS;
    return (parsed as Stamp[])
      .map((s) => Number(s?.at ?? 0))
      .filter((at) => at > cutoff);
  } catch {
    return [];
  }
}

function writeStamps(stamps: number[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      RATE_KEY,
      JSON.stringify(stamps.map((at) => ({ at }))),
    );
  } catch {
    /* ignore */
  }
}

export function recordSubmit() {
  writeStamps([...readStamps(), Date.now()]);
}

/** Remaining submissions in this window, and when the window frees up. */
export function submitBudget(): { left: number; retryInMinutes: number } {
  const stamps = readStamps();
  const left = Math.max(0, MAX_SUBMITS - stamps.length);
  const oldest = stamps[0];
  const retryInMinutes = oldest
    ? Math.max(1, Math.ceil((oldest + SUBMIT_WINDOW_MS - Date.now()) / 60000))
    : 0;
  return { left, retryInMinutes };
}

export type BotCheckInput = {
  /** value of the hidden honeypot field — must be empty */
  honeypot?: string;
  /** ms since the form was first rendered */
  elapsedMs: number;
  /** the page the form lives on */
  source: string;
};

export type BotCheckResult = { ok: true } | { ok: false; error: string };

/** Cheap pre-flight check run before a lead is saved. */
export function botCheck({ honeypot, elapsedMs, source }: BotCheckInput): BotCheckResult {
  if (honeypot && honeypot.trim()) {
    return { ok: false, error: "Your submission was blocked. Please reload and try again." };
  }
  if (elapsedMs < 1200) {
    return { ok: false, error: "That was too quick, please try again." };
  }
  if (typeof window !== "undefined") {
    try {
      const here = window.location.origin;
      const url = new URL(source, here);
      if (url.origin !== here) {
        return { ok: false, error: "Your submission was blocked. Please reload and try again." };
      }
    } catch {
      /* relative source — fine */
    }
  }
  const { left, retryInMinutes } = submitBudget();
  if (left <= 0) {
    return {
      ok: false,
      error: `You have made several requests already. Please try again in ${retryInMinutes} minute${
        retryInMinutes === 1 ? "" : "s"
      }, or call us on 055 894 1297.`,
    };
  }
  return { ok: true };
}
