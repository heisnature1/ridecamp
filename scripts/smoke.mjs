/**
 * Smoke check for the admin dashboard + the public→admin lead pipeline.
 *
 * Loads the real source modules through Vite (no re implementations) and:
 *  1. exercises the browser lead store with a minimal window/localStorage shim,
 *  2. renders the dashboard components to markup and asserts what a user sees.
 *
 * Run with: npm run smoke
 */
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

let failures = 0;
function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ---- minimal browser shim, installed BEFORE the store module is loaded ---- */
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
  location: { pathname: "/contact", search: "?intent=quote" },
  // pretend to be a desktop with a real pointer, unless a test says otherwise
  matchMedia: (query) => ({
    matches: query.includes("prefers-reduced-motion")
      ? Boolean(globalThis.__reducedMotion)
      : true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
  setTimeout: () => 0,
};
globalThis.localStorage = globalThis.window.localStorage;
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
};

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  console.log("\n1. Lead store — what the public forms write, the dashboard reads");
  const {
    readLeads,
    leadsToCsv,
    leadName,
    leadSummary,
    normalizeRecord,
    leadWhatsAppLink,
  } = await vite.ssrLoadModule("/src/lib/leadsStore.ts");
  const { computeStats, filterLeads, EMPTY_FILTERS } = await vite.ssrLoadModule("/src/lib/leadStats.ts");
  const { normalizePath, sourceLabel } = await vite.ssrLoadModule("/src/lib/format.ts");
  const { buildSampleLeads } = await vite.ssrLoadModule("/src/data/sampleLeads.ts");

  // records are normalised the same way whether they come from Postgres or the cache
  const ride = normalizeRecord({
    id: "00000000-0000-0000-0000-000000000001",
    kind: "test-ride",
    status: "new",
    createdAt: "2026-11-09T10:00:00.000Z",
    source: "/contact?intent=quote",
    data: { Name: "Smoke Test Rider", Phone: "+233 24 111 2222", City: "Accra" },
  });
  check("a lead keeps its name", leadName(ride) === "Smoke Test Rider", leadName(ride));
  check("summary joins the contact fields", leadSummary(ride).includes("Accra"), leadSummary(ride));
  check(
    "WhatsApp follow up link targets the rider",
    (leadWhatsAppLink(ride) ?? "").startsWith("https://wa.me/233241112222"),
    leadWhatsAppLink(ride) ?? "none",
  );
  const legacy = normalizeRecord({ kind: "fleet-quote", timestamp: "2026-10-01T09:00:00.000Z", data: {} });
  check("legacy kind 'fleet quote' normalises to fleet", legacy.kind === "fleet", legacy.kind);
  check("legacy timestamp is read", legacy.createdAt.startsWith("2026-10-01"), legacy.createdAt);
  check("readLeads() never throws without a cache", Array.isArray(readLeads()));

  const samples = buildSampleLeads();
  const stats = computeStats(samples);
  check("sample set has 15 leads", samples.length === 15, `got ${samples.length}`);
  check("stats total matches", stats.total === 15, `got ${stats.total}`);
  check("fleet bikes are summed", stats.fleetBikes === 45, `got ${stats.fleetBikes}`);
  check("kinds are bucketed", stats.byKind.length === 5, `got ${stats.byKind.length}`);
  check("home page source keeps its path", normalizePath("/?intent=quote") === "/", normalizePath("/?intent=quote"));
  check(
    "source filter picks up every lead from the fleet page (fleet quote + financing)",
    filterLeads(samples, { ...EMPTY_FILTERS, source: "/fleet" }).length === 6,
  );
  check("source filter isolates the contact form", filterLeads(samples, { ...EMPTY_FILTERS, source: "/contact" }).length === 6);
  check("home page gets a readable label", sourceLabel("/") === "Home page", sourceLabel("/"));
  check("7 day series is produced", stats.last7.length === 7, `got ${stats.last7.length}`);
  check(
    "filterLeads narrows to one kind",
    filterLeads(samples, { ...EMPTY_FILTERS, kinds: ["fleet"] }).length === 3,
    `got ${filterLeads(samples, { ...EMPTY_FILTERS, kinds: ["fleet"] }).length}`,
  );
  check(
    "filterLeads free text search finds a company",
    filterLeads(samples, { ...EMPTY_FILTERS, query: "harmattan" }).length === 1,
  );
  const csv = leadsToCsv(samples);
  check("csv has a header + one row per lead", csv.split("\r\n").length === 16, `got ${csv.split("\r\n").length}`);
  check("csv quotes values containing commas", csv.includes('"GH\u20b5 2,000 to 5,000"'), "income band not quoted");

  console.log("\n1b. Input hardening — validation, escaping and bot guards");
  const { sanitize, sanitizeRecord, validate, validateLead, RULES, normalizePhone, safeUrl } =
    await vite.ssrLoadModule("/src/lib/validate.ts");
  const { botCheck, submitBudget } = await vite.ssrLoadModule("/src/lib/botGuard.ts");

  check("markup is stripped from stored text", sanitize("<script>alert(1)</script>Kofi") === "scriptalert(1)/scriptKofi", sanitize("<script>alert(1)</script>Kofi"));
  check("control characters are removed", !/[\u0000-\u001f]/.test(sanitize("A\u0000B\u0007C")));
  check("length is capped", sanitize("x".repeat(900), 40).length === 40);
  check("backticks cannot start a template", !sanitize("a`b").includes("`"));
  const nested = sanitizeRecord({ Name: "Kofi", Evil: { $ne: 1 }, Note: "<b>hi</b>" });
  check("nested objects are dropped", !("Evil" in nested));
  check("nested markup is stripped", nested.Note === "bhi/b", nested.Note);

  check("a valid Ghanaian number passes", validate("055 894 1297", RULES.phone).ok);
  check("a short phone number fails", !validate("12345", RULES.phone).ok);
  check("a bad email fails", !validate("not-an-email", { ...RULES.email, required: true }).ok);
  check("a good email passes", validate("a@b.co", { ...RULES.email, required: true }).ok);
  check("markup in a name is refused", !validate("<script>alert(1)</script>", RULES.name).ok);
  check("phone is normalised to local format", normalizePhone("+233558941297") === "0558941297", normalizePhone("+233558941297"));
  check("javascript: urls are rejected", safeUrl("javascript:alert(1)") === null);
  check("https urls are allowed", safeUrl("https://example.com/a.jpg")?.startsWith("https://") === true);
  check("numeric bikes only", validate("3; drop table", { ...RULES.bikes, required: true }).ok === false);

  const leadCheck = validateLead({ Name: "Kofi Mensah", Phone: "055 894 1297", Notes: "Please call after 3pm" }, { Name: RULES.name, Phone: RULES.phone, Notes: RULES.notes });
  check("a whole lead is validated", leadCheck.ok === true, leadCheck.ok ? "" : leadCheck.error);
  check("lead values come back clean", leadCheck.ok && !leadCheck.data.Name.includes("<"));
  const filthy = validateLead({ Name: "<img src=x onerror=alert(1)>", Phone: "0558941297" }, { Name: RULES.name, Phone: RULES.phone });
  check("a lead with markup is refused", filthy.ok === false);

  check("honeypot filled in is blocked", botCheck({ honeypot: "http://spam.example", elapsedMs: 9000, source: "/contact" }).ok === false);
  check("instant submission is blocked", botCheck({ elapsedMs: 10, source: "/contact" }).ok === false);
  check("a normal submission is allowed", botCheck({ elapsedMs: 9000, source: "/contact" }).ok === true);
  check("the rate window reports a budget", typeof submitBudget().left === "number");

  console.log("\n1c. A visitor can submit without ever signing in");
  // The public forms must reach the server through the guarded RPC, never a
  // plain insert: the leads table has no anonymous read policy, so an insert
  // that asks for the row back (`.select().single()`) is refused and the
  // submission is silently rolled back. This guards that regression.
  const leadsSrc = await (await import("node:fs")).promises.readFile(
    new URL("../src/lib/leadsStore.ts", import.meta.url),
    "utf8",
  );
  check(
    "public submissions go through the submit function",
    /rpc\(\s*["']ridecamp_submit_lead["']/.test(leadsSrc),
  );
  check(
    "offline replay also goes through the submit function",
    (leadsSrc.match(/ridecamp_submit_lead/g) ?? []).length >= 2,
    `found ${(leadsSrc.match(/ridecamp_submit_lead/g) ?? []).length}`,
  );
  const addLeadBody = leadsSrc.slice(
    leadsSrc.indexOf("export async function addLead("),
    leadsSrc.indexOf("/** Retry anything queued while offline."),
  );
  check(
    "addLead never asks PostgREST to return the inserted row",
    !addLeadBody.includes('.single()') && !/\.from\(TABLE\)\s*\.insert/.test(addLeadBody),
  );

  const leadsLib = await (await import("node:fs")).promises.readFile(
    new URL("../src/lib/leads.ts", import.meta.url),
    "utf8",
  );
  const dispatchBody = leadsLib.slice(leadsLib.indexOf("export async function dispatchLead"));
  check(
    "submitting does not hijack the browser into a mail draft",
    !dispatchBody.includes("window.location.href") && !dispatchBody.includes("mailtoLink("),
  );
  check(
    "submitting does not force a WhatsApp tab open",
    !dispatchBody.includes("window.open("),
  );

  console.log("\n1d. Motion layer behaves honestly");
  const { default: TiltCard } = await vite.ssrLoadModule("/src/components/motion/TiltCard.tsx");
  const { default: Marquee } = await vite.ssrLoadModule("/src/components/motion/Marquee.tsx");
  const { clamp, pointerPosition } = await vite.ssrLoadModule("/src/lib/motion.ts");

  const tiltMarkup = renderToStaticMarkup(
    React.createElement(TiltCard, null, React.createElement("p", null, "Depth card")),
  );
  check("the tilt card renders its content", tiltMarkup.includes("Depth card"));
  check("the tilt card mounts the 3D surface", tiltMarkup.includes("tilt-surface"));
  check("the tilt card ships a moving highlight", tiltMarkup.includes("tilt-glare"));

  // a visitor who asks for less motion gets a plain, static card
  globalThis.__reducedMotion = true;
  const calmMarkup = renderToStaticMarkup(
    React.createElement(TiltCard, null, React.createElement("p", null, "Depth card")),
  );
  globalThis.__reducedMotion = false;
  check("reduced motion removes the 3D surface entirely", !calmMarkup.includes("tilt-surface"));
  check("reduced motion still shows the content", calmMarkup.includes("Depth card"));

  const marqueeMarkup = renderToStaticMarkup(
    React.createElement(Marquee, null, React.createElement("span", null, "No petrol, ever")),
  );
  check("the ribbon renders its text", marqueeMarkup.includes("No petrol, ever"));
  check(
    "the ribbon copies itself once for a seamless loop",
    (marqueeMarkup.match(/No petrol, ever/g) ?? []).length === 2,
    `found ${(marqueeMarkup.match(/No petrol, ever/g) ?? []).length}`,
  );
  check("the duplicate copy is hidden from screen readers", marqueeMarkup.includes('aria-hidden="true"'));

  check("pointer maths clamps to the element edge", clamp(9, -1, 1) === 1 && clamp(-9, -1, 1) === -1);
  const centre = pointerPosition(
    { clientX: 50, clientY: 50 },
    { getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }) },
  );
  check("the pointer is centred at the middle of a card", centre.x === 0 && centre.y === 0);

  // the animation engines must not be required to paint the first screen
  const appSrc = await (await import("node:fs")).promises.readFile(
    new URL("../src/App.tsx", import.meta.url),
    "utf8",
  );
  check("routes are code split", appSrc.includes("lazy(() => import("));
  check("a slow chunk shows a real loading state", appSrc.includes("RouteFallback"));

  console.log("\n1g. Following a link shows the branded wait, not a colour wipe");
  const fsx = await import("node:fs");
  const read = (rel) => fsx.promises.readFile(new URL(rel, import.meta.url), "utf8");
  const shellSrc = await read("../src/App.tsx");
  const transSrc = await read("../src/components/motion/PageTransition.tsx");
  const cssSrc = await read("../src/index.css");

  check("the shell mounts the page transition", shellSrc.includes("<PageTransition />"));
  check("the old colour wipe is gone from the shell", !shellSrc.includes("<RouteVeil"));
  check("the old colour wipe is gone from the styles", !cssSrc.includes(".route-veil"));
  check("the cover shows the logo loader", transSrc.includes("<LogoLoader"));
  check("the cover is full screen", transSrc.includes("fixed inset-0"));
  check("a link click is what raises it", transSrc.includes('document.addEventListener("click"'));
  check("modified clicks are left alone", /metaKey|ctrlKey/.test(transSrc));
  check("external and mail links are left alone", /https\?:\|tel:\|mailto:/.test(transSrc) || transSrc.includes("tel:") && transSrc.includes("mailto:"));
  check("same page anchors show nothing", transSrc.includes("url.hash"));
  check("it can never swallow a click", /pointer-events:\s*none|\.page-transition/.test(transSrc + cssSrc));
  check("reduced motion skips it", transSrc.includes("if (calm) return null"));
  check("a click that changes nothing still lifts it", transSrc.includes("SAFETY_MS"));

  // nothing over the page until a link is actually followed
  const { default: PageTransition } = await vite.ssrLoadModule("/src/components/motion/PageTransition.tsx");
  const initial = renderToStaticMarkup(
    React.createElement(MemoryRouter, { initialEntries: ["/"] }, React.createElement(PageTransition)),
  );
  check("it is invisible before any navigation", initial === "", initial.slice(0, 60));

  console.log("\n1f. The waiting state is the brand, and it always goes away");
  const { LogoLoader } = await vite.ssrLoadModule("/src/components/motion/LogoLoader.tsx");
  const loaderMarkup = renderToStaticMarkup(React.createElement(LogoLoader));
  check("the loader shows the Future Ride mark", loaderMarkup.includes("/brand/mark-512.png"));
  check("the loader spins more than one line", (loaderMarkup.match(/class="orbit orbit-/g) ?? []).length === 3,
    `found ${(loaderMarkup.match(/class="orbit orbit-/g) ?? []).length}`);
  check("each line has its own tempo", /orbit-a/.test(loaderMarkup) && /orbit-b/.test(loaderMarkup) && /orbit-c/.test(loaderMarkup));
  check("the loader announces itself to screen readers", loaderMarkup.includes('role="status"') && loaderMarkup.includes("sr-only"));
  check("the decorative rings are hidden from screen readers", loaderMarkup.includes('aria-hidden="true"'));

  globalThis.__reducedMotion = true;
  const calmLoader = renderToStaticMarkup(React.createElement(LogoLoader));
  globalThis.__reducedMotion = false;
  check("reduced motion freezes the rings", !calmLoader.includes("orbit orbit-"));
  check("reduced motion still shows the mark", calmLoader.includes("/brand/mark-512.png"));

  const html = await (await import("node:fs")).promises.readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  check("a first paint cover exists before any script runs", html.includes('id="boot-splash"'));
  check("the first paint cover uses the mark", html.includes("/brand/mark-512.png"));
  check("the first paint cover spins its own lines", (html.match(/boot-spin boot-spin-/g) ?? []).length === 3);
  check(
    "the first paint cover cannot outlive a broken bundle",
    html.includes("@keyframes boot-lift") && /animation:\s*boot-lift[^;]*6s/.test(html),
  );
  check("no inline script that a strict CSP would block", !/<script>(?![\s\S]*?application\/ld\+json)/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")));

  console.log("\n1e. The home page actually renders the scene");
  const { default: Home } = await vite.ssrLoadModule("/src/pages/Home.tsx");
  const homeHtml = renderToStaticMarkup(
    React.createElement(MemoryRouter, null, React.createElement(Home)),
  );
  const has = (re) => re.test(homeHtml);
  const countOf = (re) => (homeHtml.match(re) ?? []).length;
  check("the hero renders its headline", has(/smarter way to ride/));
  check("depth cards mount their 3D surfaces", countOf(/tilt-surface/g) >= 6, `found ${countOf(/tilt-surface/g)}`);
  check("each surface carries a moving highlight", countOf(/tilt-glare/g) === countOf(/tilt-surface/g));
  check("the hero reads pointer depth variables", countOf(/var\(--px\)/g) >= 3, `found ${countOf(/var\(--px\)/g)}`);
  check("sections register for scroll parallax", countOf(/data-parallax/g) >= 4, `found ${countOf(/data-parallax/g)}`);
  check("the proof ribbon renders", has(/Battery swap in under a minute/));
  check("the ribbon loops seamlessly", countOf(/marquee-track/g) === 1 && countOf(/Battery swap in under a minute/g) === 2);
  check("the bike photo renders in the glance section", countOf(/images\/motor\.jpg/g) >= 2);
  check("no stray debug text leaks into the page", !has(/undefined|NaN/));

  console.log("\n2. Dashboard components render the captured data");
  const { default: LeadsTable } = await vite.ssrLoadModule("/src/components/admin/LeadsTable.tsx");
  const { default: Overview } = await vite.ssrLoadModule("/src/components/admin/Overview.tsx");
  const { default: Sources } = await vite.ssrLoadModule("/src/components/admin/Sources.tsx");
  const { default: LeadDrawer } = await vite.ssrLoadModule("/src/components/admin/LeadDrawer.tsx");
  const { default: SettingsPanel } = await vite.ssrLoadModule("/src/components/admin/Settings.tsx");
  const noop = () => {};

  const table = renderToStaticMarkup(
    React.createElement(LeadsTable, {
      leads: samples,
      filters: EMPTY_FILTERS,
      onFilters: noop,
      onOpen: noop,
      onExportCsv: noop,
    }),
  );
  check("merged table lists every lead type", /Test rides/.test(table) && /Fleet quotes/.test(table));
  check("a fleet lead appears in the merged table", /Adjoa Boakye/.test(table) && /Harmattan Eats/.test(table));
  check("a financing lead appears in the merged table", /Yaw Owusu/.test(table));
  check("table shows the row count", /Showing/.test(table) && /of 15 leads/.test(table));

  const overview = renderToStaticMarkup(
    React.createElement(Overview, {
      leads: samples,
      onOpenLead: noop,
      onGoToLeads: noop,
      onLoadSample: noop,
    }),
  );
  check("overview renders the KPI cards", /Total leads/.test(overview) && /Fleet bikes/.test(overview));
  check("overview renders the breakdowns", /By lead type/.test(overview) && /Top cities/.test(overview));

  const sources = renderToStaticMarkup(
    React.createElement(MemoryRouter, null, React.createElement(Sources, { leads: samples, onViewLeads: noop })),
  );
  check("sources tab lists all four public forms", /Fleet quote/.test(sources) && /Call back request/.test(sources));
  check("sources tab lists captured fields", /Rider type/.test(sources) && /Number of bikes/.test(sources));
  const threeLeads = (sources.match(/3 leads/g) ?? []).length;
  const sixLeads = (sources.match(/6 leads/g) ?? []).length;
  check(
    "sources tab counts leads per form (badge + view button each)",
    threeLeads === 6 && sixLeads === 2,
    `'3 leads' x${threeLeads}, '6 leads' x${sixLeads}`,
  );

  const drawer = renderToStaticMarkup(
    React.createElement(LeadDrawer, {
      lead: samples[0],
      onClose: noop,
      onStatus: noop,
      onDelete: noop,
    }),
  );
  check("drawer shows what the visitor entered", /What they entered/.test(drawer));
  check("drawer shows the lead's own words", /Okada from Madina/.test(drawer));
  check("drawer shows the lead name", /Kwame Mensah/.test(drawer));

  const settings = renderToStaticMarkup(
    React.createElement(SettingsPanel, {
      leads: samples,
      onToast: noop,
      onLoadSample: noop,
      onRemoveSample: noop,
    }),
  );
  check("settings offers csv export", /Download CSV/.test(settings));
  check("settings offers import", /Import JSON/.test(settings));

  console.log("\n2b. Brand line reads as official");
  const { default: BrandLogo } = await vite.ssrLoadModule("/src/components/Logo.tsx");
  const logoHtml = renderToStaticMarkup(
    React.createElement(MemoryRouter, null, React.createElement(BrandLogo)),
  );
  check("the logo line says Official", logoHtml.includes("Official Spiro distributor"));
  check("the logo line keeps Ghana", logoHtml.includes("Ghana"));
  check("the trading name is untouched", logoHtml.includes("Future Ride Ltd"));

  console.log("\n3. Public forms dispatch through the same store");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { PUBLIC_FORMS } = await vite.ssrLoadModule("/src/data/forms.ts");
  const PAGE_BY_ROUTE = {
    "/": "src/pages/Home.tsx",
    "/contact": "src/pages/Contact.tsx",
    // Ownership & financing moved onto the Fleet & Business page, so both the
    // fleet quote form and the financing form live in Fleet.tsx.
    "/fleet": "src/pages/Fleet.tsx",
  };
  check("every public form is registered", PUBLIC_FORMS.length === 4, `got ${PUBLIC_FORMS.length}`);
  for (const form of PUBLIC_FORMS) {
    const file = PAGE_BY_ROUTE[form.route];
    const src = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
    const missing = form.fields.filter((f) => !src.includes(f.label)).map((f) => f.label);
    check(
      `${form.route} form captures its ${form.fields.length} registered fields (${file})`,
      missing.length === 0,
      missing.length ? `missing: ${missing.join(", ")}` : "",
    );
  }
  const dispatchKinds = ["test-ride", "quote", "financing", "fleet", "callback"];
  const allPages = fs
    .readdirSync(path.resolve(process.cwd(), "src/pages"))
    .filter((f) => f !== "Admin.tsx")
    .map((f) => fs.readFileSync(path.resolve(process.cwd(), "src/pages", f), "utf8"))
    .join("\n");
  const stray = allPages.match(/dispatchLead\(\s*"([^"]+)"/g) ?? [];
  check(
    "every dispatchLead call uses a canonical kind",
    stray.every((call) => dispatchKinds.some((k) => call.includes(`"${k}"`))),
    stray.join(" | "),
  );

} finally {
  await vite.close();
}

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
