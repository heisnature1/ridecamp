import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { DIAL_CODES, getCountry } from "../data/site";
import { useCountry } from "./CountryGate";

export default function CallbackForm() {
  const { code } = useCountry();
  const [dial, setDial] = useState(getCountry(code).dial);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden bg-volt py-24 text-ink">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-ink/5" />
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
          Ready to make the switch?
        </h2>
        <p className="mt-4 text-ink/70">Leave your number and we’ll get in touch.</p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-5 text-cream"
          >
            <CheckCircle2 className="size-6 text-volt" />
            <p className="text-sm font-medium">
              Thanks! A Future Ride advisor will call you within one business day.
            </p>
          </motion.div>
        ) : (
          <form
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.trim().length >= 6) setSent(true);
            }}
          >
            <select
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              className="rounded-full border-2 border-ink/20 bg-cream px-4 py-3.5 text-sm font-medium outline-none focus:border-ink"
              aria-label="Country dial code"
            >
              {DIAL_CODES.map((d) => (
                <option key={d.name} value={d.dial}>
                  {d.name} ({d.dial})
                </option>
              ))}
            </select>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="7XX XXX XXX"
              className="flex-1 rounded-full border-2 border-ink/20 bg-cream px-5 py-3.5 text-sm outline-none placeholder:text-ink/40 focus:border-ink"
              aria-label="Phone number"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-volt hover:brightness-125"
            >
              I’m interested <ArrowRight className="size-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
