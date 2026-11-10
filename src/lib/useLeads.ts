import { useCallback, useEffect, useState } from "react";
import { fetchLeads, readLeads, subscribe, type LeadRecord } from "./leadsStore";

/**
 * Live list of every lead captured on the public site.
 *
 * Renders the cached snapshot immediately, then refreshes from Supabase so the
 * dashboard always reflects the database — including submissions from other
 * devices — and re renders whenever the cache changes in this tab or another.
 */
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
    return off;
  }, [refresh]);

  return Object.assign(leads, { refresh });
}
