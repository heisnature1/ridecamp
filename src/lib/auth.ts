import { useEffect, useState } from "react";
import { supabase, friendlyError } from "./supabase";

/**
 * Admin authentication — a real Supabase Auth email + password session.
 *
 * Only accounts listed in `ridecamp_admins` (and signed in) can read or delete
 * leads and gallery posts; row level security enforces that in the database,
 * not just in the UI.
 */

export type AdminUser = { id: string; email: string };

/** Seconds to wait before another attempt is allowed (server side counter). */
export async function loginThrottle(email: string): Promise<number> {
  const { data, error } = await supabase.rpc("ridecamp_login_guard", {
    p_email: email.trim().toLowerCase(),
  });
  if (error) return 0;
  const result = data as { allowed?: boolean; retry_after?: number } | null;
  if (result && result.allowed === false) return result.retry_after ?? 600;
  return 0;
}

async function clearLoginAttempts(email: string) {
  await supabase.rpc("ridecamp_login_clear", { p_email: email.trim().toLowerCase() });
}

export async function signIn(email: string, password: string): Promise<AdminUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    throw new Error(
      /invalid login credentials/i.test(error.message)
        ? "That email or password isn't recognised."
        : friendlyError(error, "Could not sign you in."),
    );
  }
  await clearLoginAttempts(email);
  const user = data.user;
  if (!user?.email) throw new Error("Could not sign you in.");
  return { id: user.id, email: user.email };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  try {
    // drop any cached records so the next person on this machine sees nothing
    window.localStorage.removeItem("ridecamp_leads_cache");
    window.localStorage.removeItem("ridecamp_leads_pending");
  } catch {
    /* ignore */
  }
}

export async function currentAdmin(): Promise<AdminUser | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user?.email) return null;
  return { id: user.id, email: user.email };
}

/** React hook: undefined while the session is being restored. */
export function useAdmin(): { admin: AdminUser | null | undefined } {
  const [admin, setAdmin] = useState<AdminUser | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    currentAdmin().then((user) => {
      if (active) setAdmin(user);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setAdmin(user?.email ? { id: user.id, email: user.email } : null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { admin };
}
