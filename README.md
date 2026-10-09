# Future Ride — Spiro Electric Motorcycles in Ghana

Marketing + sales site for **Future Ride**, sole distributor of Spiro electric motorcycles in
Ghana, built from the company's content brief. Every page drives toward four actions:
**Book a test ride · Request a quote · Apply for financing · Chat on WhatsApp.**

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (brand: deep navy `#0a1f44` + fresh green `#16a34a`)
- [Framer Motion](https://www.framer.com/motion/) for reveals and micro-interactions
- [React Router v7](https://reactrouter.com)

## Getting started

```bash
npm install
npm run dev        # dev server on :5173
npm run build      # typecheck + production build
npm run preview    # serve the production build
```

## Sitemap

| Route            | Page                          |
| ---------------- | ----------------------------- |
| `/`              | Home (hero, trust strip, sales case, glance, how-it-works, calculator, ways to own, testimonials, callback CTA) |
| `/ekon`          | The Ekon 450 M1 (specs, 12 feature blocks, colours, spec-sheet download) |
| `/why-electric`  | Why Go Electric (8-argument sales case + Spiro scale) |
| `/battery-swap`  | Battery Swap (swap-pay-ride, Ghana network map) |
| `/calculator`    | Savings Calculator (GH₵, per brief §5 formulas) |
| `/ownership`     | Ownership & Financing (lease-to-own, docs, financing form) |
| `/fleet`         | Fleet & Business (benefits, audience, fleet-quote form) |
| `/service`       | Service & Warranty |
| `/about`         | About Future Ride (name meaning, promise, founder-note placeholder) |
| `/faqs`          | FAQs (15 questions) |
| `/contact`       | Contact / Book a Test Ride (short lead form, +233 default) |
| `/spec-sheet`    | Print-friendly spec sheet ("Download Spec Sheet") |
| `/privacy`, `/terms` | Legal pages |

## Lead capture

Forms show an instant confirmation and dispatch the lead via WhatsApp deep-link
(`wa.me`) plus an email draft — see `src/lib/leads.ts`. Point `BUSINESS` at the
real number/email, or swap `dispatchLead` for a CRM webhook later.

## Before launch (brief §8)

`src/data/site.ts` and `src/lib/leads.ts` hold the placeholders that need real values:
Ghana pricing, swap locations/hours/cost, financing partners, service centres, confirmed
warranty terms, licensing wording, real testimonials, contact details, and written
permission from Spiro for brand figures (80,000+ bikes, 9 countries, TIME100 2024).
These are marked with `PLACEHOLDER`/asterisk notes in the UI.
