import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { to: "/ekon", label: "Ekon 450 M1" },
  { to: "/why-electric", label: "Why Go Electric" },
  { to: "/battery-swap", label: "Battery Swap" },
  { to: "/calculator", label: "Savings Calculator" },
  { to: "/ownership", label: "Ownership & Financing" },
  { to: "/fleet", label: "Fleet & Business" },
  { to: "/service", label: "Service & Warranty" },
  { to: "/faqs", label: "FAQs" },
  { to: "/about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const cls = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-[13px] font-semibold transition-colors hover:text-brand ${
      isActive ? "text-brand" : "text-navy/80"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled ? "border-line bg-white/95 shadow-sm backdrop-blur" : "border-transparent bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/25 transition hover:bg-brand-dark sm:inline-block"
          >
            Book Test Ride
          </Link>
          <button
            className="rounded-lg border border-line p-2 text-navy xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-line bg-white xl:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-mint text-brand" : "text-navy hover:bg-cloud"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-sm font-bold text-white"
              >
                Book Test Ride
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
