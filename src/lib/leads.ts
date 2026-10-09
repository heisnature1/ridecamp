/**
 * Business contact + lead-capture configuration.
 * PLACEHOLDERS — replace with confirmed details before launch (see brief §8).
 */
export const BUSINESS = {
  phoneDisplay: "+233 24 000 0000",
  phoneTel: "+233240000000",
  /** WhatsApp number in international format without "+" */
  whatsapp: "233240000000",
  email: "hello@futureride.gh",
  address: "Spintex Road, Accra, Ghana",
  hours: "Mon–Sat, 8:00–18:00",
};

export function waLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const WA_DEFAULT = waLink(
  "Hello Future Ride! I'd like to know more about the Spiro Ekon 450 M1.",
);

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type Lead = Record<string, string>;

import { kindMeta, type LeadKind } from "./leadKinds";
import { addLead, type LeadRecord } from "./leadsStore";

/** Drop empty inputs so the admin never sees a row of blank fields. */
function prune(lead: Lead): Lead {
  const out: Lead = {};
  for (const [key, value] of Object.entries(lead)) {
    const v = String(value ?? "").trim();
    if (v) out[key] = v;
  }
  return out;
}

/**
 * Front-end lead dispatch.
 *
 * 1. Saves the submission to the local lead store — this is exactly what the
 *    admin dashboard at `/admin` reads, and it happens *before* anything can
 *    navigate the browser away.
 * 2. Opens WhatsApp with the lead pre-filled and an email draft.
 *
 * A backend/CRM webhook can replace step 2 later without touching the forms.
 */
export function dispatchLead(kind: LeadKind, lead: Lead, source?: string): LeadRecord {
  const record = addLead(kind, prune(lead), source);

  const label = kindMeta(record.kind).label;
  const lines = Object.entries(record.data)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const wa = waLink(`New ${label} lead — Future Ride website\nSource: ${record.source}\n${lines}`);
  window.open(wa, "_blank", "noopener");
  // Use a small delay before redirect to ensure open succeeds
  setTimeout(() => {
    window.location.href = mailtoLink(
      `[${label}] New lead from futureride.gh`,
      `Source: ${record.source}\n\n${lines}`,
    );
  }, 100);

  return record;
}
