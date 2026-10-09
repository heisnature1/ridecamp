import { useEffect, useState } from "react";
import { readLeads, subscribe, type LeadRecord } from "./leadsStore";

/**
 * Live list of every lead captured on the public site. Re-renders when a form
 * is submitted in this tab *or* in another tab of the same site.
 */
export default function useLeads(): LeadRecord[] {
  const [leads, setLeads] = useState<LeadRecord[]>(() => readLeads());
  useEffect(() => subscribe(setLeads), []);
  return leads;
}
