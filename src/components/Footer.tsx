import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Globe, Camera, Music } from "lucide-react";
import Logo from "./Logo";
import { BUSINESS, WA_DEFAULT } from "../lib/leads";

const QUICK = [
  { to: "/", label: "Home" },
  { to: "/ekon", label: "Ekon 450 M1" },
  { to: "/battery-swap", label: "Battery Swap" },
  { to: "/gallery", label: "Gallery" },
  { to: "/fleet", label: "Fleet & Business" },
  { to: "/fleet#financing", label: "Ownership & Financing" },
  { to: "/service", label: "Service & Warranty" },
  { to: "/service#why-electric", label: "Why Go Electric" },
  { to: "/about", label: "About Future Ride" },
  { to: "/contact", label: "Contact / Book a Test Ride" },
];

const SOCIAL_LINKS = [
  { icon: Globe, href: "https://www.facebook.com", label: "Facebook", color: "#1877F2" },
  { icon: Camera, href: "https://www.instagram.com", label: "Instagram", color: "#E4405F" },
  { icon: Music, href: "https://www.tiktok.com", label: "TikTok", color: "#000000" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-deep text-white overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-brand/10 blur-3xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-1/4 right-1/4 size-72 rounded-full bg-cyan-500/10 blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 size-64 rounded-full bg-brand-bright/10 blur-3xl animate-float" style={{ animationDelay: "-4s" }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 lg:grid-cols-[1.3fr_1fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70 leading-relaxed">
            Future Ride is the sole distributor of Spiro electric motorcycles in Ghana. Ride the
            future. Keep your money.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110 hover:rotate-3"
                aria-label={s.label}
                whileTap={{ scale: 0.9 }}
              >
                <s.icon className="size-5 text-white/70 group-hover:text-white transition-colors" />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium text-white bg-navy-deep rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {s.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          aria-label="Footer"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Quick links</p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {QUICK.map((l, i) => (
              <motion.li
                key={l.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link
                  to={l.to}
                  className="relative inline-flex items-center gap-2 text-sm text-white/80 hover:text-brand-bright transition-all duration-300"
                >
                  <span className="relative z-10">{l.label}</span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand to-brand-bright scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -5 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Talk to us</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href={`tel:${BUSINESS.phoneTel}`} className="group flex items-center gap-3 hover:text-brand-bright transition-colors">
                <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/5 group-hover:bg-brand/20 transition-colors">
                  <Phone className="size-4 text-brand-bright" />
                </span>
                <span>{BUSINESS.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={WA_DEFAULT} target="_blank" rel="noreferrer" className="group flex items-center gap-3 hover:text-brand-bright transition-colors">
                <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/5 group-hover:bg-[#25D366]/20 transition-colors">
                  <span className="grid size-4 place-items-center rounded-full bg-[#25D366] text-[9px] font-black text-white">W</span>
                </span>
                <span>WhatsApp us</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="group flex items-center gap-3 hover:text-brand-bright transition-colors">
                <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/5 group-hover:bg-brand/20 transition-colors">
                  <Mail className="size-4 text-brand-bright" />
                </span>
                <span>{BUSINESS.email}</span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/5">
                <MapPin className="size-4 text-brand-bright" />
              </span>
              <span>{BUSINESS.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/5">
                <Clock className="size-4 text-brand-bright" />
              </span>
              <span>{BUSINESS.hours}</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-white/60 md:px-8">
          <p>© 2026 Future Ride. All rights reserved. Authorised Spiro distributor in Ghana.*</p>
          <p className="flex gap-4">
            <Link to="/privacy" className="hover:text-brand-bright transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-bright transition-colors">Terms</Link>
          </p>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-6 text-[11px] text-white/40 md:px-8">
          *Distributor wording, product figures and specifications subject to written confirmation
          from Spiro. Specifications are indicative and tested under standard test conditions.
        </p>
      </div>
    </footer>
  );
}
