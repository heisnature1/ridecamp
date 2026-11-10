import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for Future Ride Ltd.
 *
 * Leads and gallery posts live in Postgres so a booking survives the visitor
 * closing their browser, switching device, or clearing site data — rows are
 * only ever removed when an admin deletes them from the dashboard.
 *
 * The URL and publishable key are safe to ship in the bundle; row level
 * security decides what each visitor is allowed to do.
 */
const DEFAULT_URL = "https://qtoeqbmlcanczlybimoj.supabase.co";
const DEFAULT_KEY = "sb_publishable_asX5kyceUUfV9ZD-sfLB-g_YEs5QO0G";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || DEFAULT_URL;
const key =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() || DEFAULT_KEY;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // The admin signs in with a password on our own /login screen, so there is
    // no auth redirect to parse.
    detectSessionInUrl: false,
    storageKey: "fr_admin_auth",
  },
});

/** The gallery images bucket (public read, admin only writes). */
export const GALLERY_BUCKET = "gallery";

/** Thrown when a write is refused because nobody is signed in as an admin. */
export class NotAdminError extends Error {
  constructor(message = "Sign in as an admin to do that.") {
    super(message);
    this.name = "NotAdminError";
  }
}

export function isNotAdmin(error: unknown): boolean {
  if (error instanceof NotAdminError) return true;
  const e = error as { code?: string; message?: string } | null;
  return (
    e?.code === "42501" ||
    /row level security|permission denied/i.test(e?.message ?? "")
  );
}

/** Human readable message for anything the stores or the dashboard surface. */
export function friendlyError(error: unknown, fallback = "Something went wrong."): string {
  const e = error as { message?: string; code?: string } | null;
  if (!e) return fallback;
  if (isNotAdmin(error)) return "Sign in as an admin to do that.";
  if (e.code === "23505") return "That record already exists.";
  if (/failed to fetch|networkerror|load failed/i.test(e.message ?? ""))
    return "Could not reach the server. Check your connection and try again.";
  return e.message || fallback;
}
