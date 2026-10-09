import { useState } from "react";
import { FileCheck2, Handshake } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { OWNERSHIP_DOCS, WAYS_TO_OWN } from "../data/site";
import { dispatchLead, WA_DEFAULT } from "../lib/leads";
import { formatGhanaPhone } from "../lib/leadKinds";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

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
        dispatchLead("financing", {
          Name: form.name,
          Phone: formatGhanaPhone(form.phone),
          Email: form.email,
          City: form.city,
          Occupation: form.occupation,
          "Income range": form.income || "Not provided",
          "Preferred option": form.option,
        });
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

export default function Ownership() {
  return (
    <>
      <PageHero
        kicker="Ownership & financing"
        title="Start saving from day one."
        sub="Flexible ownership paths designed around how riders actually earn."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {WAYS_TO_OWN.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-line bg-cloud p-8">
                  <h2 className="font-display text-xl font-bold text-navy">{w.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[380px_1fr]">
            <Reveal>
              <div className="rounded-3xl bg-navy p-8 text-white">
                <FileCheck2 className="size-7 text-brand-bright" />
                <h2 className="mt-4 font-display text-xl font-bold">Documents you will need</h2>
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

          <Reveal delay={0.15}>
            <p className="mt-10 text-sm text-slate">
              Buying for a business?{" "}
              <Link to="/fleet" className="font-bold text-brand hover:underline">
                See Fleet & Business <ArrowRight className="inline size-4" />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
