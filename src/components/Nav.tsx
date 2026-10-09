import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "../data/site";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="Future Ride home">
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
        <rect width="64" height="64" rx="14" className="fill-volt" />
        <path d="M36 8 18 36h12l-4 20 22-30H34l6-18z" className="fill-ink" />
      </svg>
      <span className="font-display text-lg font-700 tracking-tight leading-none">
        <span className="block font-bold">FUTURE RIDE</span>
        <span className="block text-[10px] font-medium tracking-[0.28em] text-ash group-hover:text-volt transition-colors">
          ENERGY ON THE MOVE
        </span>
      </span>
    </Link>
  );
}

const ABOUT_SUB = [
  { to: "/about", label: "Our Team" },
  { to: "/news", label: "News" },
  { to: "/support", label: "Support" },
  { to: "/sustainability", label: "Sustainability" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-volt ${isActive ? "text-volt" : "text-cream/80"}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.slice(0, 3).map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-cream/80 hover:text-volt transition-colors"
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
            >
              About us <ChevronDown className={`size-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {aboutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full -translate-x-1/2 w-44 rounded-xl border border-white/10 bg-coal/95 p-2 shadow-xl backdrop-blur"
                >
                  {ABOUT_SUB.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="block rounded-lg px-3 py-2 text-sm text-cream/80 hover:bg-moss hover:text-volt"
                    >
                      {s.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            to="/book-test-ride"
            className="rounded-full bg-volt px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Book test ride
          </Link>
        </nav>

        <button
          className="lg:hidden rounded-lg border border-white/10 p-2 text-cream"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-white/5 bg-ink/95 backdrop-blur"
          >
            <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile">
              {NAV_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className="rounded-lg px-3 py-2.5 text-base font-medium text-cream/85 hover:bg-moss">
                  {l.label}
                </NavLink>
              ))}
              {ABOUT_SUB.map((s) => (
                <NavLink key={s.to} to={s.to} className="rounded-lg px-3 py-2.5 text-base font-medium text-cream/85 hover:bg-moss">
                  {s.label}
                </NavLink>
              ))}
              <Link
                to="/book-test-ride"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-3 text-sm font-semibold text-ink"
              >
                Book test ride <ArrowUpRight className="size-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
