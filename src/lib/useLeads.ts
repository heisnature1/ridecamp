import { useCallback, useEffect, useState } from "react";
import { fetchLeads, readLeads, subscribe, type LeadRecord } from "./leadsStore";

/**
 * Live list of every lead captured on the public site.
 *
 * Renders the cached snapshot immediately, then refreshes from Supabase so the
 * dashboard always reflects the database — including submissions from other
 * devices — and re renders whenever the cache changes in this tab or another.
 *
 * A quiet poll keeps an admin who is watching the dashboard from having to
 * reload it to see a form that was just submitted on a phone.
 */
const POLL_MS = 20_000;

export default function useLeads(): LeadRecord[] & { refresh: () => Promise<void> } {
  const [leads, setLeads] = useState<LeadRecord[]>(() => readLeads());

  const refresh = useCallback(async () => {
    try {
      setLeads(await fetchLeads());
    } catch {
      /* offline or signed out — keep the cached list */
    }
  }, []);

  useEffect(() => {
    const off = subscribe(setLeads);
    void refresh();
    const timer = window.setInterval(() => {
      // don't poll a tab nobody is looking at
      if (typeof document === "undefined" || document.visibilityState !== "hidden") {
        void refresh();
      }
    }, POLL_MS);
    return () => {
      off();
      window.clearInterval(timer);
    };
  }, [refresh]);

  return Object.assign(leads, { refresh });
}
