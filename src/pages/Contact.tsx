import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { BUSINESS, dispatchLead, SOCIAL, WA_DEFAULT } from "../lib/leads";
import { FacebookMark, InstagramMark, TikTokMark } from "../components/SocialIcons";
import { RULES } from "../lib/validate";
import { formatGhanaPhone, type LeadKind } from "../lib/leadKinds";

const CITIES = ["Accra", "Tema", "Kumasi", "Takoradi", "Cape Coast", "Tamale", "Other"];
const RIDER_TYPES = ["Commercial rider", "Delivery rider", "Private commuter", "Fleet / business"];
const INTENTS = ["Book a test ride", "Get a quote", "Apply for financing"] as const;
/** The intent label maps onto the canonical lead type the admin dashboard files it under. */
const KIND_BY_INTENT: Record<(typeof INTENTS)[number], LeadKind> = {
  "Book a test ride": "test-ride",
  "Get a quote": "quote",
  "Apply for financing": "financing",
};

/** One social chip. Reads the real handles from `SOCIAL`, never hard coded. */
function SocialLink({
  href,
  label,
  icon: Icon,
  tint,
  children,
}: {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-bold text-navy transition hover:border-brand hover:text-brand-dark"
    >
      <Icon className="size-4 shrink-0 transition-colors" style={{ color: tint }} />
      {children}
    </a>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const intent = params.get("intent") === "quote" ? "Get a quote" : "Book a test ride";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Accra",
    date: "",
    riderType: RIDER_TYPES[0],
    interest: intent,
    notes: "",
    website: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const mountedAt = useRef(Date.now());


  useEffect(() => {
    setForm((f) => ({ ...f, interest: intent }));
  }, [intent]);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <PageHero
        kicker="Contact / book a test ride"
        title="Try it. Then decide."
        sub="Book a test ride, request a quote or ask anything. A real person in Accra answers — usually the same day."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_380px]">
          <Reveal>
            {sent ? (
              <div className="rounded-3xl border border-brand/40 bg-mint p-10 text-center">
                <CalendarCheck className="mx-auto size-10 text-brand" />
                <h2 className="mt-4 font-display text-2xl font-bold text-navy">You're in the book.</h2>
                <p className="mt-3 text-sm text-slate">
                  Medaase, {form.name.split(" ")[0] || "rider"}! Your request ({form.interest.toLowerCase()}) has been
                  sent. An advisor will call you on {formatGhanaPhone(form.phone)} to confirm.
                </p>
              </div>
            ) : (
              <form
                className="relative rounded-3xl border border-line bg-cloud p-8 md:p-10"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSending(true);
                  setError("");
                  try {
                    await dispatchLead(
                      KIND_BY_INTENT[form.interest as (typeof INTENTS)[number]] ?? "quote",
                      {
                        Name: form.name,
                        Phone: formatGhanaPhone(form.phone),
                        Email: form.email,
                        City: form.city,
                        "Preferred date": form.date || "Flexible",
                        "Rider type": form.riderType,
                        Interest: form.interest,
                        Notes: form.notes,
                      },
                      undefined,
                      {
                        honeypot: form.website,
                        elapsedMs: Date.now() - mountedAt.current,
                        rules: {
                          Name: { ...RULES.name, required: true },
                          Phone: { ...RULES.phone, label: "Phone number" },
                          Email: { ...RULES.email, required: true },
                          City: RULES.city,
                          Notes: RULES.notes,
                          "Preferred date": { label: "Preferred date", max: 40 },
                        },
                      },
                    );
                    setSent(true);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Could not send that. Please try again.");
                  } finally {
                    setSending(false);
                  }
                }}
              >
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />
                <div className="flex flex-wrap gap-2">
                  {INTENTS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setForm({ ...form, interest: o })}
                      className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                        form.interest.toLowerCase() === o.toLowerCase()
                          ? "bg-navy text-white"
                          : "bg-white text-navy ring-1 ring-line hover:ring-navy"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input required value={form.name} onChange={set("name")} placeholder="Name" aria-label="Name" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand" />
                  <div className="flex overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand">
                    <span className="grid place-items-center border-r border-line bg-cloud px-3 text-sm font-semibold text-slate">+233</span>
                    <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="055 894 1297" aria-label="Phone number" className="w-full px-4 py-3 text-sm outline-none" />
                  </div>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="Email (optional)" aria-label="Email (optional)" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand" />
                  <select value={form.city} onChange={set("city")} aria-label="City" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand">
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input type="date" value={form.date} onChange={set("date")} aria-label="Preferred date" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand" />
                  <select value={form.riderType} onChange={set("riderType")} aria-label="Rider type" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand sm:col-span-2">
                    {RIDER_TYPES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <textarea
                    value={form.notes}
                    onChange={set("notes")}
                    rows={3}
                    placeholder="Anything we should know? (optional)"
                    aria-label="Anything we should know? (optional)"
                    className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand sm:col-span-2"
                  />
                </div>
                <button
                  disabled={sending}
                  className="mt-6 w-full rounded-full bg-brand py-4 text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending
                    ? "Sending…"
                    : form.interest === "Get a quote"
                      ? "Request Quote"
                      : "Confirm Booking"}
                </button>
                {error && (
                  <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200">
                    {error}
                  </p>
                )}
                <p className="mt-3 text-[11px] text-slate">
                  Your details go straight to our sales team by email and WhatsApp.
                </p>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              <a href={`tel:${BUSINESS.phoneTel}`} className="flex items-center gap-4 rounded-3xl border border-line bg-cloud p-6 transition hover:border-brand">
                <span className="grid size-11 place-items-center rounded-full bg-navy text-white"><Phone className="size-5" /></span>
                <span>
                  <span className="block text-sm font-bold text-navy">{BUSINESS.phoneDisplay}</span>
                  <span className="text-xs text-slate">Call us</span>
                </span>
              </a>
              <a href={WA_DEFAULT} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl border border-line bg-cloud p-6 transition hover:border-brand">
                <span className="grid size-11 place-items-center rounded-full bg-[#25D366] text-white"><MessageCircle className="size-5" /></span>
                <span>
                  <span className="block text-sm font-bold text-navy">WhatsApp</span>
                  <span className="text-xs text-slate">Fastest reply</span>
                </span>
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-4 rounded-3xl border border-line bg-cloud p-6 transition hover:border-brand">
                <span className="grid size-11 place-items-center rounded-full bg-navy text-white"><Mail className="size-5" /></span>
                <span>
                  <span className="block text-sm font-bold text-navy">{BUSINESS.email}</span>
                  <span className="text-xs text-slate">Email</span>
                </span>
              </a>
              <div className="rounded-3xl border border-line bg-cloud p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate">Follow us</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SocialLink
                    href={SOCIAL.instagram}
                    label={`Instagram, ${SOCIAL.instagramHandle}`}
                    icon={InstagramMark}
                    tint="#E1306C"
                  >
                    {SOCIAL.instagramHandle}
                  </SocialLink>
                  <SocialLink
                    href={SOCIAL.facebook}
                    label={`Facebook, ${SOCIAL.facebookHandle}`}
                    icon={FacebookMark}
                    tint="#1877F2"
                  >
                    {SOCIAL.facebookHandle}
                  </SocialLink>
                  <SocialLink
                    href={SOCIAL.tiktok}
                    label={`TikTok, @${SOCIAL.tiktokHandle}`}
                    icon={TikTokMark}
                    tint="#000000"
                  >
                    @{SOCIAL.tiktokHandle}
                  </SocialLink>
                </div>
              </div>
              <div className="rounded-3xl bg-navy p-6 text-white">
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-sm font-semibold transition-colors hover:text-brand-bright"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                  <span>{BUSINESS.addressLine}</span>
                </a>
                <p className="mt-3 flex items-center gap-3 text-sm text-white/70">
                  <Clock className="size-4 text-brand-bright" /> Open {BUSINESS.hours}
                </p>
                <p className="mt-3 text-xs text-white/50">
                  Tap the address for directions in Google Maps.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
