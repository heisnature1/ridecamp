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
  { to: "/gallery", label: "Gallery" },
  { to: "/fleet", label: "Fleet & Business" },
  { to: "/service", label: "Service" },
  { to: "/about", label: "About" },
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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "border-b border-line/50 bg-white/90 shadow-xl backdrop-blur-lg glass" 
          : "border-b border-transparent bg-white/70 backdrop-blur-xl"
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
                className={`relative px-4 py-2 whitespace-nowrap text-[13px] font-semibold transition-all duration-300 z-10 nav-link-3d ${
                  isActive ? "text-brand" : "text-navy/70 hover:text-navy"
                }`}
                data-text={l.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand/20 to-brand-bright/10 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                {hoveredPath === l.to && !isActive && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand/10 to-cyan-500/10 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden relative overflow-hidden rounded-full bg-gradient-to-r from-brand via-brand-bright to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand/40 hover:scale-[1.02] active:scale-[0.98] sm:inline-flex group btn-3d"
          >
            <span className="relative z-10">Book Test Ride</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-brand-bright to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <button
            className="rounded-xl border border-line p-2.5 text-navy xl:hidden transition-all duration-300 hover:bg-cloud hover:scale-105 active:scale-95"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.div initial={false} animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0, transform: "translateY(-10px) rotateX(-10deg)" }}
            animate={{ height: "auto", opacity: 1, transform: "translateY(0) rotateX(0)" }}
            exit={{ height: 0, opacity: 0, transform: "translateY(-10px) rotateX(-10deg)" }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-line bg-white/95 backdrop-blur-xl xl:hidden glass"
            aria-label="Mobile"
            style={{ transformOrigin: "top center" }}
          >
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-1 px-4 py-4"
            >
              {LINKS.map((l) => (
                <motion.div
                  key={l.to}
                  variants={{
                    open: { opacity: 1, x: 0, rotateY: 0 },
                    closed: { opacity: 0, x: -20, rotateY: 15 }
                  }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive 
                          ? "bg-gradient-to-r from-brand/10 to-brand-bright/10 text-brand" 
                          : "text-navy hover:bg-cloud hover:text-brand hover:translate-x-1"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0, rotateX: 0 },
                  closed: { opacity: 0, y: 15, rotateX: -10 }
                }}
              >
                <Link
                  to="/contact"
                  className="mt-2 block w-full rounded-full bg-gradient-to-r from-brand via-brand-bright to-cyan-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand/40 hover:scale-[1.02] active:scale-[0.98] btn-3d"
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
