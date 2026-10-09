import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import PageHero from "../components/PageHero";
import { COUNTRIES } from "../data/site";
import { useCountry } from "../components/CountryGate";

export default function BookTestRide() {
  const { code } = useCountry();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: code,
    city: "",
    use: "Delivery / courier",
  });

  const country = COUNTRIES.find((c) => c.code === form.country) ?? COUNTRIES[0];

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <PageHero
        kicker="Book test ride"
        title="Feel the difference yourself."
        sub="30 minutes on the FR Volt 450, on a real route, with a charged bike waiting for you."
      />

      <section className="bg-ink pb-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-volt/40 bg-volt/10 p-10 text-center"
            >
              <CheckCircle2 className="mx-auto size-10 text-volt" />
              <h2 className="mt-4 font-display text-2xl font-bold">You’re booked in.</h2>
              <p className="mt-3 text-sm text-cream/80">
                Thanks {form.name.split(" ")[0] || "rider"} — our {country.name} team will call you
                within one business day to confirm your slot.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5 rounded-3xl border border-white/10 bg-coal p-8 md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-cream/80">Full name</span>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none focus:border-volt"
                    placeholder="Achieng Odhiambo"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-cream/80">Phone</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none focus:border-volt"
                    placeholder="7XX XXX XXX"
                  />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-cream/80">Country</span>
                  <select value={form.country} onChange={set("country")} className="mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none focus:border-volt">
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-cream/80">City</span>
                  <select value={form.city} onChange={set("city")} required className="mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none focus:border-volt">
                    <option value="">Select city…</option>
                    {country.cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-medium text-cream/80">I ride for…</span>
                <select value={form.use} onChange={set("use")} className="mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 outline-none focus:border-volt">
                  {["Delivery / courier", "Passenger transport", "Personal use", "Fleet / business"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </label>
              <button className="w-full rounded-full bg-volt py-4 text-sm font-semibold text-ink hover:brightness-110">
                Confirm booking
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
