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

/**
 * Front-end lead dispatch: opens WhatsApp with the lead pre-filled and an
 * email draft. A backend/CRM webhook can be added here later.
 */
export function dispatchLead(kind: string, lead: Lead) {
  const lines = Object.entries(lead)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const wa = waLink(`New ${kind} lead — Future Ride website\n${lines}`);
  window.open(wa, "_blank", "noopener");
  window.location.href = mailtoLink(`[${kind}] New lead from futureride.gh`, lines);
}
