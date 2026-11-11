/**
 * Business contact + lead capture configuration.
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
   * number based link so visitors reach the business inbox directly.
   */
  whatsappLink: "https://wa.me/message/P3GMWJXUIXIEC1",
  email: "info@futurerideafrica.com",
  /** Street address, used where the location is shown in running copy. */
  address: "Adjetey, Kwabla Ave, East Legon, Accra, Ghana",
  /** Single line address for cards, the footer and schema.org. */
  addressLine: "Adjetey, Kwabla Ave, East Legon, Accra",
  /** Opens Google Maps on the office. */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kwabla+Ave%2C+East+Legon%2C+Accra%2C+Ghana",
  hours: "8:00am to 5:00pm",
};

/**
 * Build a WhatsApp deep link. A message can only be pre filled on a
 * number based link; `wa.me/message/…` short links cannot carry `?text=`, so
 * they open the chat directly with the business.
 */
export function waLink(message?: string): string {
  const text = message?.trim();
  if (!text) return BUSINESS.whatsappLink;
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const WA_DEFAULT = BUSINESS.whatsappLink;

/**
 * Social accounts.
 *
 * Instagram and TikTok handles given as `Futurerideghana_` and `Future.ride.ltd`.
 * A handle with no "official" style match is easy to typo, so both the display
 * handle and the URL are kept here in one place — the footer, the contact page
 * and the structured data all read from this object.
 */
export const SOCIAL = {
  instagramHandle: "Futurerideghana_",
  instagram: "https://www.instagram.com/futurerideghana_/",
  facebookHandle: "Future Ride Ltd",
  facebook: "https://www.facebook.com/search/top?q=Future%20Ride%20Ltd",
  tiktokHandle: "Future.ride.ltd",
  tiktok: "https://www.tiktok.com/@future.ride.ltd",
};


export function mailtoLink(subject: string, body: string): string {
  return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type Lead = Record<string, string>;

import { type LeadKind } from "./leadKinds";
import { addLead, type LeadRecord } from "./leadsStore";
import { botCheck, recordSubmit } from "./botGuard";
import { sanitizeRecord, validateLead, type FieldRule } from "./validate";

/** Drop empty inputs so the admin never sees a row of blank fields. */
function prune(lead: Lead): Lead {
  return sanitizeRecord(lead, 2000);
}

/**
 * Front end lead dispatch.
 *
 * 1. Saves the submission to the database (Supabase `leads` table) so it is
 *    kept until an admin deletes it — it survives a closed browser, another
 *    device, or cleared site data.
 * The form is done as soon as the lead is saved — the visitor stays put and
 * sees a confirmation. If the network is down the lead is queued locally and
 * retried, so a visitor never loses a booking to a dropped connection.
 */
export type DispatchOptions = {
  /** field rules to enforce before saving */
  rules?: Record<string, FieldRule>;
  /** value of the hidden honeypot input */
  honeypot?: string;
  /** ms since the form first rendered */
  elapsedMs?: number;
};

export async function dispatchLead(
  kind: LeadKind,
  lead: Lead,
  source?: string,
  options: DispatchOptions = {},
): Promise<LeadRecord> {
  // 1. bot / abuse checks
  const bot = botCheck({
    honeypot: options.honeypot,
    elapsedMs: options.elapsedMs ?? Number.POSITIVE_INFINITY,
    source: source ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
  });
  if (!bot.ok) throw new Error(bot.error);

  // 2. shape and content validation, then scrub every value
  const checked = validateLead(prune(lead), options.rules ?? {});
  if (!checked.ok) throw new Error(checked.error);

  const record = await addLead(kind, checked.data, source);
  recordSubmit();

  // Saving is the whole job. The visitor stays on the page and sees the
  // confirmation panel; the lead sits in the dashboard until an admin works it.
  // No mail client is opened and no tab is stolen.
  return record;
}
