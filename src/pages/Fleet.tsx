import { useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { FLEET_AUDIENCE, FLEET_BENEFITS } from "../data/site";
import { dispatchLead } from "../lib/leads";

function FleetForm() {
  const [form, setForm] = useState({
    company: "",
    person: "",
    phone: "",
    email: "",
    bikes: "5",
    city: "",
    useCase: "Food / parcel delivery",
  });
  const [sent, setSent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
      className="rounded-3xl border border-line bg-white p-8 md:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        dispatchLead("fleet-quote", {
          Company: form.company,
          "Contact person": form.person,
          Phone: `+233 ${form.phone}`,
          Email: form.email,
          "Number of bikes": form.bikes,
          City: form.city,
          "Use case": form.useCase,
        });
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
      <button className="mt-6 w-full rounded-full bg-brand py-4 text-sm font-bold text-white hover:bg-brand-dark sm:w-auto sm:px-10">
        Request a Fleet Quote
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
    </>
  );
}
