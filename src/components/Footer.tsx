import { Link } from "react-router-dom";
import { useCountry } from "./CountryGate";
import { getCountry } from "../data/site";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  );
}

const COLS = [
  {
    title: "Products",
    links: [{ to: "/bike", label: "FR Volt 450" }],
  },
  {
    title: "Ecosystem",
    links: [
      { to: "/energy", label: "Swap Network" },
      { to: "/technology", label: "Technology" },
    ],
  },
  {
    title: "About us",
    links: [
      { to: "/about", label: "Our Team" },
      { to: "/news", label: "News" },
      { to: "/support", label: "Support" },
      { to: "/sustainability", label: "Sustainability" },
    ],
  },
];

export default function Footer() {
  const { code } = useCountry();
  const country = getCountry(code);

  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 64 64" className="size-9" aria-hidden="true">
              <rect width="64" height="64" rx="14" className="fill-volt" />
              <path d="M36 8 18 36h12l-4 20 22-30H34l6-18z" className="fill-ink" />
            </svg>
            <span className="font-display text-lg font-bold tracking-tight">FUTURE RIDE</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-ash">
            Electric motorcycles and a battery-swap network built for the riders who keep cities moving.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="Future Ride on LinkedIn" className="rounded-full border border-white/10 p-2.5 text-cream/70 hover:border-volt hover:text-volt">
              <LinkedInIcon />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Future Ride on Facebook" className="rounded-full border border-white/10 p-2.5 text-cream/70 hover:border-volt hover:text-volt">
              <FacebookIcon />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Future Ride on X" className="rounded-full border border-white/10 p-2.5 text-cream/70 hover:border-volt hover:text-volt">
              <XIcon />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ash">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-cream/80 hover:text-volt">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <p className="text-xs text-ash">© 2026 Future Ride. All rights reserved.</p>
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-cream/80">
            {country.flag} {country.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
