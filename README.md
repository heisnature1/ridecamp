# Future Ride Ltd — Spiro Electric Motorcycles in Ghana

Marketing + sales site for **Future Ride Ltd**, sole distributor of Spiro electric motorcycles in
Ghana, built from the company's content brief. Every page drives toward four actions:
**Book a test ride · Request a quote · Apply for financing · Chat on WhatsApp.**

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (brand: deep navy `#0a1f44` + fresh green `#16a34a`)
- [Framer Motion](https://www.framer.com/motion/) for reveals and micro interactions
- [GSAP](https://gsap.com) + ScrollTrigger for scrubbed scroll effects (see [Motion & 3D](#motion--3d))
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

- a visitor submits through `public.ridecamp_submit_lead(kind, source, payload)`, a
  `security definer` function that writes the row, forces `status = 'new'`, strips
  reserved keys (`status`, `admin_notes`, `id`, `created_at`, `kind`) and hands back only
  that new row. It cannot read the table, so a visitor never gains access to anyone
  else's lead — a plain insert could not return its own row, which is why public
  submissions go through the function;
- a visitor may **read** the gallery, nothing else;
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

## Security

The site holds personal data (names, phone numbers, emails, income bands), so the checks are
layered — the database is the last word, not the UI.

| Area | What is in place | Where |
| ---- | ---------------- | ----- |
| Transport | HSTS with `includeSubDomains` + preload, HTTP to HTTPS redirect, `upgrade-insecure-requests` | `vercel.json` |
| Headers | CSP (no inline scripts, `frame-ancestors 'none'`), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP | `vercel.json` |
| Auth | Supabase Auth email + password; session restored from a rotating refresh token; the old trust-a-localStorage-flag login is deleted on boot | `src/lib/auth.ts`, `src/lib/supabase.ts` |
| Passwords | Never stored by this app — hashed with bcrypt by Supabase Auth (`auth.users.encrypted_password`) | Supabase |
| Login throttling | 5 attempts per 10 minutes per address, counted in Postgres | `public.ridecamp_login_guard()` |
| Session storage | Access token (1 h) + rotating refresh token in `localStorage` under `fr_admin_auth`; no cookies are set, so there is no CSRF surface. Signing out also clears the cached records | `src/lib/auth.ts` |
| Record access | RLS on `leads` and `gallery_posts`; only an email on the `ridecamp_admins` allowlist can read or delete | Supabase |
| Field tampering | A public insert can never choose `status`, `admin_notes` or `created_at`, only known `kind` values survive, payloads are capped at 8 kB and only flat strings are accepted | `ridecamp_guard_lead_insert()` |
| Rate limiting | Server side: max 3 submissions per phone number per 10 minutes. Browser side: 3 per 10 minutes per device | trigger + `src/lib/botGuard.ts` |
| Bot protection | Hidden honeypot field, minimum time on form, same-origin check | `src/lib/botGuard.ts` |
| Input validation | Every form validates against a shared rule set (phone, email, name, length) and refuses markup instead of storing it | `src/lib/validate.ts` |
| Escaping | React escapes all rendered values; the app never uses `dangerouslySetInnerHTML` or `innerHTML`, and stored text is scrubbed of `<>`, backticks and control characters | `src/lib/validate.ts` |
| Public submit | Visitors write leads only through `ridecamp_submit_lead()`, which returns their own row id and no table access | Supabase RPC |
| Uploads | `gallery` bucket limited to JPEG/PNG/WebP and 5 MB, write access restricted to allowlisted admins, and post rows only accept our own bucket or bundled `/images/` paths | Supabase + `ridecamp_guard_gallery_insert()` |
| Query safety | All database access goes through the Supabase client (parameterised PostgREST / RPC). There is no string-concatenated SQL anywhere | `src/lib/*Store.ts` |
| Data minimisation | API reads name their columns instead of `select *` | `src/lib/leadsStore.ts`, `src/lib/galleryStore.ts` |
| Dependencies | `npm run audit` (0 known vulnerabilities) wired into `npm run verify` | `package.json` |

Run everything before shipping:

```bash
npm run verify   # typecheck + dependency audit + build + smoke/security tests
```

Notes worth acting on before launch: change the seeded admin password, add each real admin to
both Supabase Auth **and** `ridecamp_admins`, and keep the published key limited to the
`anon`/publishable role (never ship the service role key).

## Motion & 3D

Two engines, split by what each is actually good at, with one shared vocabulary in
`src/lib/motion.ts` (easings, durations, variants, and the accessibility guards):

| Job | Tool | Where |
| --- | --- | --- |
| Entrances, hovers, press states, list staggers | Framer Motion | `Reveal.tsx`, `SplitHeading.tsx`, page components |
| Pointer driven 3D tilt + travelling glare | CSS custom properties written once per frame | `components/motion/TiltCard.tsx` |
| Scrubbed parallax and the scroll progress bar | GSAP `ScrollTrigger` | `lib/scrollFx.ts` |
| Infinite proof ribbon | CSS animation on a duplicated track | `components/motion/Marquee.tsx` |
| Link click cover: logo + orbiting lines on every page change | Framer Motion overlay | `components/motion/PageTransition.tsx` |

The tilt is real 3D, not a scale: `TiltCard` writes `--tilt-x`, `--tilt-y`, `--tilt-z` and the
glare position to the host element on `pointermove` (coalesced with `requestAnimationFrame`), and
the surface transforms with `rotateX/rotateY/translateZ`. Children opt into depth with
`.depth-1/2/3`. The hero scene works the same way: one listener writes `--px`/`--py` and every
layer reads them at its own strength, so the photograph, the light blooms and the grid floor move
past each other.

Accessibility is not an afterthought:

- `prefers-reduced-motion` disables every decorative effect. `useCalmMotion()` short circuits the
  hooks, `TiltCard` renders a plain static card with no listeners attached, and the CSS blanket
  rule in `index.css` is the backstop.
- Tilt and pointer parallax require `(hover: hover) and (pointer: fine)`; touch devices never
  attach the listeners.
- The ribbon pauses on hover so it can be read, and its duplicate copy is `aria-hidden`.
- Nothing below the fold starts invisible without a guaranteed reveal, and the route veil never
  blocks pointer events.

Performance: routes and third party code are split in `vite.config.ts` (`vendor`, `motion`,
`icons`, `data` chunks), so a first visit to `/` does not download the admin dashboard, and the
dashboard does not download GSAP. GSAP is loaded dynamically by `lib/scrollRefresh.ts`.

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
