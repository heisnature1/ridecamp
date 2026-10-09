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
npm run smoke      # lead-pipeline + dashboard smoke check (no browser needed)
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
| `/admin`         | Admin dashboard (internal — every public form submission, see below) |
| `/privacy`, `/terms` | Legal pages |

## Lead capture & admin dashboard

Every public form writes to a single lead store (`src/lib/leadsStore.ts`, key
`ridecamp_leads`) *before* it dispatches, so nothing a visitor types is lost:

| Form | Page | Lead types | Fields captured |
| ---- | ---- | ---------- | --------------- |
| Call-back | `/` | Call-back | name, phone, city |
| Main lead form | `/contact` | Test ride · Quote · Financing | name, phone, email, city, preferred date, rider type, interest, notes |
| Financing application | `/ownership` | Financing | name, phone, email, city, occupation, income range, preferred option |
| Fleet quote | `/fleet` | Fleet | company, contact person, phone, email, bikes, city, use case, notes |

`src/data/forms.ts` is the registry behind the dashboard's **Public forms** tab —
it is checked against the form components by `npm run smoke`, so the two cannot
silently drift apart. Phone numbers are normalised to `+233 …` on the way in
(`formatGhanaPhone`), and lead types are canonicalised, so old records saved
under labels such as `fleet-quote` still file correctly.

`/admin` then shows that data:

- **Overview** — KPIs, 7-day submission chart, pipeline, and breakdowns by lead
  type, source page and city.
- **All leads** — one merged table for all five lead types (filtered by type,
  status, free text — not five separate tables). Clicking a row opens a drawer
  with every field the visitor entered plus WhatsApp/call/email follow-up.
- **Public forms** — which forms feed the dashboard and exactly what each captures.
- **Data & export** — CSV/JSON export, JSON import, sample data, clear.

Leads are stored in the browser's local storage, so the dashboard reflects
submissions made on that device (including other tabs, which update live). Point
`dispatchLead` in `src/lib/leads.ts` at a backend/CRM webhook to collect leads
from every visitor; the dashboard needs no other change.

## Before launch (brief §8)

`src/data/site.ts` and `src/lib/leads.ts` hold the placeholders that need real values:
Ghana pricing, swap locations/hours/cost, financing partners, service centres, confirmed
warranty terms, licensing wording, real testimonials, contact details, and written
permission from Spiro for brand figures (80,000+ bikes, 9 countries, TIME100 2024).
These are marked with `PLACEHOLDER`/asterisk notes in the UI.
