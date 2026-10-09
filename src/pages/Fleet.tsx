import { useState } from "react";
import { Building2, CheckCircle2, FileCheck2, Handshake, MessageCircle } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SplitHeading from "../components/SplitHeading";
import { FLEET_AUDIENCE, FLEET_BENEFITS, OWNERSHIP_DOCS, WAYS_TO_OWN } from "../data/site";
import { dispatchLead, WA_DEFAULT } from "../lib/leads";
import { formatGhanaPhone } from "../lib/leadKinds";

/** Where the financing application lives now that /ownership has folded into /fleet. */
const FINANCING_SOURCE = "/fleet#apply-financing";

function FleetForm() {
  const [form, setForm] = useState({
    company: "",
    person: "",
    phone: "",
    email: "",
    bikes: "5",
    city: "",
    useCase: "Food / parcel delivery",
    notes: "",
  });
  const [sent, setSent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  if (sent) {
    return (
      <div className="rounded-3xl border border-brand/40 bg-mint p-10 text-center">
        <Building2 className="mx-auto size-10 text-brand" />
        <h3 className="mt-4 font-display text-2xl font-bold text-navy">Quote request received.</h3>
        <p className="mt-2 text-sm text-slate">
          Thanks {form.person.split(" ")[0] || ""} — our fleet team will send a tailored proposal for{" "}
          {form.company || "your fleet"} within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      id="fleet-quote"
      className="rounded-3xl border border-line bg-white p-8 md:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        dispatchLead(
          "fleet",
          {
            Company: form.company,
            "Contact person": form.person,
            Phone: formatGhanaPhone(form.phone),
            Email: form.email,
            "Number of bikes": form.bikes,
            City: form.city,
            "Use case": form.useCase,
            Notes: form.notes,
          },
          "/fleet#fleet-quote",
        );
      }}
    >
      <h3 className="font-display text-2xl font-bold text-navy">Request a fleet quote</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input required value={form.company} onChange={set("company")} placeholder="Company" aria-label="Company" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required value={form.person} onChange={set("person")} placeholder="Contact person" aria-label="Contact person" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone (+233)" aria-label="Phone" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required type="email" value={form.email} onChange={set("email")} placeholder="Email" aria-label="Email" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required type="number" min={1} value={form.bikes} onChange={set("bikes")} aria-label="Number of bikes" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required value={form.city} onChange={set("city")} placeholder="City" aria-label="City" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
      </div>
      <select value={form.useCase} onChange={set("useCase")} aria-label="Use case" className="mt-4 w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand">
        {["Food / parcel delivery", "Courier & logistics", "Field sales / microfinance", "Campus / estate service", "Government / NGO", "Other"].map((u) => (
          <option key={u}>{u}</option>
        ))}
      </select>
      <textarea
        value={form.notes}
        onChange={set("notes")}
        rows={3}
        placeholder="Tell us about your operation — routes, riders, current fuel spend (optional)"
        aria-label="Tell us about your operation (optional)"
        className="mt-4 w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand"
      />
      <button className="mt-6 w-full rounded-full bg-brand py-4 text-sm font-bold text-white hover:bg-brand-dark sm:w-auto sm:px-10">
        Request a Fleet Quote
      </button>
    </form>
  );
}

function FinancingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    occupation: "",
    income: "",
    option: "Lease to own",
  });
  const [sent, setSent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  if (sent) {
    return (
      <div className="rounded-3xl border border-brand/40 bg-mint p-10 text-center">
        <Handshake className="mx-auto size-10 text-brand" />
        <h3 className="mt-4 font-display text-2xl font-bold text-navy">Application received.</h3>
        <p className="mt-2 text-sm text-slate">
          Thank you, {form.name.split(" ")[0] || "rider"}. Our financing team will call you to walk
          through the next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      id="apply-financing"
      className="rounded-3xl border border-line bg-white p-8 md:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        dispatchLead(
          "financing",
          {
            Name: form.name,
            Phone: formatGhanaPhone(form.phone),
            Email: form.email,
            City: form.city,
            Occupation: form.occupation,
            "Income range": form.income || "Not provided",
            "Preferred option": form.option,
          },
          FINANCING_SOURCE,
        );
      }}
    >
      <h3 className="font-display text-2xl font-bold text-navy">Apply for financing</h3>
      <p className="mt-2 text-sm text-slate">Two minutes now saves you a week of wondering.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input required value={form.name} onChange={set("name")} placeholder="Name" aria-label="Name" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone (+233)" aria-label="Phone" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input type="email" value={form.email} onChange={set("email")} placeholder="Email (optional)" aria-label="Email (optional)" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required value={form.city} onChange={set("city")} placeholder="City" aria-label="City" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <input required value={form.occupation} onChange={set("occupation")} placeholder="Occupation" aria-label="Occupation" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand" />
        <select value={form.income} onChange={set("income")} aria-label="Income range (optional)" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand">
          <option value="">Income range (optional)</option>
          {["Under GH₵ 2,000 / month", "GH₵ 2,000 – 5,000", "GH₵ 5,000 – 10,000", "Above GH₵ 10,000"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <select value={form.option} onChange={set("option")} aria-label="Preferred option" className="rounded-xl border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-brand">
          {["Lease to own", "Pay upfront", "Fleet purchase"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <button className="mt-6 w-full rounded-full bg-brand py-4 text-sm font-bold text-white hover:bg-brand-dark sm:w-auto sm:px-10">
        Apply for Financing
      </button>
    </form>
  );
}

export default function Fleet() {
  return (
    <>
      <PageHero
        kicker="Fleet & business"
        title="Cut your delivery costs. Grow your fleet."
        sub="Whether you run food delivery, couriers, e-commerce logistics, field sales or a campus or estate service, electric motorcycles lower your cost per delivery and give you better control of your fleet."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-3xl">
                <img src="/images/fleet-delivery.jpg" alt="Delivery fleet of electric motorcycles" className="h-[320px] w-full object-cover" />
              </div>
              <h2 className="mt-8 font-display text-xl font-bold text-navy">Benefits for fleets</h2>
              <ul className="mt-4 space-y-3">
                {FLEET_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm font-medium text-ink">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" /> {b}
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 font-display text-xl font-bold text-navy">Who it is for</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {FLEET_AUDIENCE.map((a) => (
                  <span key={a} className="rounded-full bg-mint px-4 py-2 text-xs font-semibold text-brand-dark">
                    {a}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <FleetForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ownership & financing — the old /ownership page, now part of Fleet & Business */}
      <section id="financing" className="scroll-mt-24 bg-cloud py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Ownership & financing
            </p>
          </Reveal>
          <SplitHeading
            as="h2"
            text="Ways to pay, for one bike or fifty."
            className="mt-3 max-w-3xl font-display text-3xl font-bold leading-[1.1] text-navy md:text-5xl"
          />
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate">
              Flexible ownership paths designed around how riders and businesses actually earn — from
              a single bike on lease-to-own to a whole fleet on volume terms.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {WAYS_TO_OWN.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-8">
                  <h3 className="font-display text-xl font-bold text-navy">{w.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[380px_1fr]">
            <Reveal>
              <div className="rounded-3xl bg-navy p-8 text-white">
                <FileCheck2 className="size-7 text-brand-bright" />
                <h3 className="mt-4 font-display text-xl font-bold">Documents you will need</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-white/85">
                  {OWNERSHIP_DOCS.map((d) => (
                    <li key={d} className="flex items-center gap-2.5">
                      <span className="size-1.5 rounded-full bg-brand-bright" /> {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] text-white/50">
                  Final list subject to confirmation with our financing partners.
                </p>
                <p className="mt-6 text-sm font-semibold text-white/85">Financing partners</p>
                <p className="mt-2 text-sm text-white/60">
                  We are finalising partnerships with leading Ghanaian financing institutions. Ask
                  an advisor about current options.
                </p>
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-105"
                >
                  <MessageCircle className="size-4" /> Talk to an Advisor
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <FinancingForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
