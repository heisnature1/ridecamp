import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

/*
 * Ownership & financing lives on the Fleet & Business page (/#financing) and
 * Why Go Electric lives on the Service page (/#why-electric), so the tab bar
 * stays short. The old /ownership and /why-electric URLs still redirect.
 */
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/ekon", label: "Ekon 450 M1" },
  { to: "/battery-swap", label: "Battery Swap" },
  { to: "/calculator", label: "Savings" },
  { to: "/fleet", label: "Fleet & Business" },
  { to: "/service", label: "Service" },
  { to: "/about", label: "About" },
  { to: "/faqs", label: "FAQs" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line bg-white/95 shadow-sm backdrop-blur" : "border-b border-transparent bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary" onMouseLeave={() => setHoveredPath(null)}>
          {LINKS.map((l) => {
            const isActive = pathname === l.to;
            return (
              <NavLink 
                key={l.to} 
                to={l.to}
                onMouseEnter={() => setHoveredPath(l.to)}
                className={`relative px-3 py-2 whitespace-nowrap text-[13px] font-semibold transition-colors z-10 ${
                  isActive ? "text-brand" : "text-navy/80 hover:text-navy"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full bg-brand/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {hoveredPath === l.to && !isActive && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 rounded-full bg-slate/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {l.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden relative overflow-hidden rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-dark hover:scale-105 active:scale-95 sm:inline-block group"
          >
            <span className="relative z-10">Book Test Ride</span>
            <motion.div
              className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            />
          </Link>
          <button
            className="rounded-lg border border-line p-2 text-navy xl:hidden transition-transform hover:scale-105 active:scale-95"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.div initial={false} animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line bg-white xl:hidden"
            aria-label="Mobile"
          >
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-1 px-4 py-4"
            >
              {LINKS.map((l) => (
                <motion.div
                  key={l.to}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 }
                  }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-mint text-brand" : "text-navy hover:bg-cloud"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 10 }
                }}
              >
                <Link
                  to="/contact"
                  className="mt-2 block w-full rounded-full bg-brand px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark active:scale-95"
                >
                  Book Test Ride
                </Link>
              </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
