import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { BUSINESS, WA_DEFAULT } from "../lib/leads";

const QUICK = [
  { to: "/ekon", label: "Ekon 450 M1" },
  { to: "/why-electric", label: "Why Go Electric" },
  { to: "/battery-swap", label: "Battery Swap" },
  { to: "/calculator", label: "Savings Calculator" },
  { to: "/ownership", label: "Ownership & Financing" },
  { to: "/fleet", label: "Fleet & Business" },
  { to: "/service", label: "Service & Warranty" },
  { to: "/faqs", label: "FAQs" },
  { to: "/about", label: "About Future Ride" },
  { to: "/contact", label: "Contact / Book a Test Ride" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-8 lg:grid-cols-[1.3fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Future Ride is the sole distributor of Spiro electric motorcycles in Ghana. Ride the
            future. Keep your money.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <a className="rounded-full border border-white/20 px-3 py-1.5 hover:border-brand-bright hover:text-brand-bright" href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a className="rounded-full border border-white/20 px-3 py-1.5 hover:border-brand-bright hover:text-brand-bright" href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="rounded-full border border-white/20 px-3 py-1.5 hover:border-brand-bright hover:text-brand-bright" href="https://www.tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Quick links</p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {QUICK.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/80 hover:text-brand-bright">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Talk to us</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href={`tel:${BUSINESS.phoneTel}`} className="flex items-center gap-3 hover:text-brand-bright">
                <Phone className="size-4 text-brand-bright" /> {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={WA_DEFAULT} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brand-bright">
                <span className="grid size-4 place-items-center rounded-full bg-[#25D366] text-[9px] font-black text-white">W</span>
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 hover:text-brand-bright">
                <Mail className="size-4 text-brand-bright" /> {BUSINESS.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-brand-bright" /> {BUSINESS.address}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-brand-bright" /> {BUSINESS.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 md:px-8">
          <p>© 2026 Future Ride. All rights reserved. Authorised Spiro distributor in Ghana.*</p>
          <p className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
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
