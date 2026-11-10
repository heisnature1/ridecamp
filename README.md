# Future Ride Ltd — Spiro Electric Motorcycles in Ghana

Marketing + sales site for **Future Ride Ltd**, sole distributor of Spiro electric motorcycles in
Ghana, built from the company's content brief. Every page drives toward four actions:
**Book a test ride · Request a quote · Apply for financing · Chat on WhatsApp.**

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (brand: deep navy `#0a1f44` + fresh green `#16a34a`)
- [Framer Motion](https://www.framer.com/motion/) for reveals and micro interactions
- [React Router v7](https://reactrouter.com)

## Getting started

```bash
npm install
npm run dev        # dev server on :5173
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run smoke      # lead pipeline + dashboard smoke check (no browser needed)
```

## Sitemap

| Route            | Page                          |
| ---------------- | ----------------------------- |
| `/`              | Home (hero, trust strip, sales case, glance, how it works, calculator, ways to own, testimonials, callback CTA) |
| `/ekon`          | The Ekon 450 M1 (specs, 12 feature blocks, colours, spec sheet download) |
| `/battery swap`  | Battery Swap (swap pay ride, Ghana network map) |
| `/calculator`    | Savings Calculator (GH₵, per brief §5 formulas) |
| `/fleet`         | Fleet & Business (benefits, audience, fleet quote form) **+ Ownership & Financing** (ways to own, documents, financing form — see `#financing`) |
| `/service`       | Service & Warranty **+ Why Go Electric** (8-argument sales case + Spiro scale — see `#why electric`) |
| `/about`         | About Future Ride Ltd (name meaning, promise, founder note placeholder) |
| `/faqs`          | FAQs (15 questions) |
| `/contact`       | Contact / Book a Test Ride (short lead form, +233 default) |
| `/spec sheet`    | Print friendly spec sheet ("Download Spec Sheet") |
| `/admin`         | Admin dashboard (internal — every public form submission, see below) |
| `/privacy`, `/terms` | Legal pages |
| `/ownership` → `/fleet#financing`, `/why electric` → `/service#why electric` | Legacy URLs, kept as redirects |

## Lead capture & admin dashboard

Every public form writes to a single lead store (`src/lib/leadsStore.ts`) that is
backed by Supabase, so nothing a visitor types is lost:

| Form | Page | Lead types | Fields captured |
| ---- | ---- | ---------- | --------------- |
| Call back | `/` | Call back | name, phone, city |
| Main lead form | `/contact` | Test ride · Quote · Financing | name, phone, email, city, preferred date, rider type, interest, notes |
| Financing application | `/fleet` (`#apply financing`) | Financing | name, phone, email, city, occupation, income range, preferred option |
| Fleet quote | `/fleet` | Fleet | company, contact person, phone, email, bikes, city, use case, notes |

`src/data/forms.ts` is the registry behind the dashboard's **Public forms** tab —
it is checked against the form components by `npm run smoke`, so the two cannot
silently drift apart. Phone numbers are normalised to `+233 …` on the way in
(`formatGhanaPhone`), and lead types are canonicalised, so old records saved
under labels such as `fleet quote` still file correctly.

`/admin` then shows that data:

- **Overview** — KPIs, 7-day submission chart, pipeline, and breakdowns by lead
  type, source page and city.
- **All leads** — one merged table for all five lead types (filtered by type,
  status, free text — not five separate tables). Clicking a row opens a drawer
  with every field the visitor entered plus WhatsApp/call/email follow up.
- **Public forms** — which forms feed the dashboard and exactly what each captures.
- **Data & export** — CSV/JSON export, JSON import, sample data, clear.

### Where the data lives

Leads and gallery posts live in **Supabase** (project `qtoeqbmlcanczlybimoj`), not in the
visitor's browser, so a booking survives a closed tab, a different device, or cleared site
data. Rows are only removed when an admin deletes them.

| Thing | Where |
| ----- | ----- |
| Leads / bookings | `public.leads` (one row per submission, `data` holds the form fields as JSON) |
| Gallery posts | `public.gallery_posts` + images in the public `gallery` storage bucket |
| Admin accounts | Supabase Auth users **and** an allowlisted row in `public.ridecamp_admins` |

Row level security does the real enforcing:

- a visitor may **insert** a lead and **read** the gallery, nothing else;
- only an authenticated user whose email is in `ridecamp_admins` (checked by
  `public.is_ridecamp_admin()`) may read, update or delete leads, or write gallery posts,
  or upload images. Every other account in the shared project sees nothing.

A small localStorage cache mirrors the last fetch so the dashboard paints instantly and a
submission made while offline is queued and retried on the next load rather than lost.

### Admin login

`/login` signs in with Supabase Auth (email + password); the default account is
`admin@futureride.gh` / `future-ride`. **Change that password** from the Supabase dashboard
(Authentication → Users) before going live, and add each colleague as a user *and* a row in
`ridecamp_admins`. Config lives in `src/lib/supabase.ts`; override it with
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` if the project ever moves.

## Brand & photography

The Future Ride Ltd logo lives in `src/components/Logo.tsx` (navigation, footer, spec sheet) and as
raster artwork in `public/brand/`. Every photo in `public/images/` carries the logo lockup, which
is stamped on by `scripts/brand/logo_watermark.py` — see `scripts/brand/README.md` to re run it
after swapping in new photography.

## Before launch (brief §8)

`src/data/site.ts` and `src/lib/leads.ts` hold the values that still need confirming:
Ghana pricing, swap locations/hours/cost, financing partners, service centres, confirmed
warranty terms, licensing wording, real testimonials, and written permission from Spiro
for brand figures (80,000+ bikes, 9 countries, TIME100 2024). These are marked with
`PLACEHOLDER`/asterisk notes in the UI.

Confirmed business details live in `src/lib/leads.ts` (`BUSINESS`): phone `055 894 1297`,
WhatsApp link `wa.me/message/P3GMWJXUIXIEC1`, address `Adjetey, Kwabla Ave, East Legon,
Accra` (with a Google Maps link) and hours `8:00am to 5:00pm`. The email address is still a
placeholder.
