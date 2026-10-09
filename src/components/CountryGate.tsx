import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY } from "../data/site";

const KEY = "fr-country";

const EVENT = "fr-country";

export function useCountry() {
  const [code, setCode] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY) ?? DEFAULT_COUNTRY;
    } catch {
      return DEFAULT_COUNTRY;
    }
  });

  useEffect(() => {
    const on = (e: Event) => setCode((e as CustomEvent<string>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  const choose = (c: string) => {
    setCode(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* private mode */
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: c }));
  };
  return { code, choose };
}

export default function CountryGate() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const { choose } = useCountry();

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose your country"
        >
          <motion.div
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-coal p-6 shadow-2xl"
          >
            <h2 className="font-display text-xl font-bold">Choose your country</h2>
            <p className="mt-1 text-sm text-ash">
              We’ll show prices, range and service centres for your location.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSel(c.code)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                    sel === c.code
                      ? "border-volt bg-volt/10 text-volt"
                      : "border-white/10 bg-moss/40 text-cream/85 hover:border-white/25"
                  }`}
                >
                  <span>
                    {c.flag} {c.name}
                  </span>
                  {sel === c.code && <Check className="size-4" />}
                </button>
              ))}
            </div>
            <button
              disabled={!sel}
              onClick={() => {
                if (sel) choose(sel);
                setOpen(false);
              }}
              className="mt-5 w-full rounded-full bg-volt py-3 text-sm font-semibold text-ink transition enabled:hover:brightness-110 disabled:opacity-40"
            >
              Continue
            </button>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 w-full py-2 text-xs text-ash hover:text-cream"
            >
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
