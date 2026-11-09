/**
 * Business contact + lead-capture configuration.
 * Phone, address and hours are confirmed. The email is still a PLACEHOLDER —
 * replace it with the confirmed inbox before launch (see brief §8).
 */
export const BUSINESS = {
  phoneDisplay: "055 894 1297",
  /** Same number in international format, for `tel:` links. */
  phoneTel: "+233558941297",
  /** WhatsApp number in international format without "+" — used for deep links. */
  whatsapp: "233558941297",
  /**
   * Live WhatsApp short link (wa.me/message/…). Always prefer this over a
   * number-based link so visitors reach the business inbox directly.
   */
  whatsappLink: "https://wa.me/message/P3GMWJXUIXIEC1",
  email: "hello@futureride.gh",
  /** Street address, used where the location is shown in running copy. */
  address: "Adjetey, Kwabla Ave, East Legon, Accra, Ghana",
  /** Single-line address for cards, the footer and schema.org. */
  addressLine: "Adjetey, Kwabla Ave, East Legon, Accra",
  /** Opens Google Maps on the office. */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kwabla+Ave%2C+East+Legon%2C+Accra%2C+Ghana",
  hours: "8:00am to 5:00pm",
};

/**
 * Build a WhatsApp deep link. A message can only be pre-filled on a
 * number-based link; `wa.me/message/…` short links cannot carry `?text=`, so
 * they open the chat directly with the business.
 */
export function waLink(message?: string): string {
  const text = message?.trim();
  if (!text) return BUSINESS.whatsappLink;
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const WA_DEFAULT = BUSINESS.whatsappLink;

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
  // The business WhatsApp is a `wa.me/message/…` short link, which cannot carry
  // a pre-filled message — it opens the real inbox directly. The lead detail is
  // still captured in the admin store and the email draft below.
  window.open(BUSINESS.whatsappLink, "_blank", "noopener");
  // Use a small delay before redirect to ensure open succeeds
  setTimeout(() => {
    window.location.href = mailtoLink(
      `[${label}] New lead from futureride.gh`,
      `Source: ${record.source}\n\n${lines}`,
    );
  }, 100);

  return record;
}
