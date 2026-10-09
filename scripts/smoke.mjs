/**
 * Smoke check for the admin dashboard + the public→admin lead pipeline.
 *
 * Loads the real source modules through Vite (no re-implementations) and:
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
  const { addLead, readLeads, updateLead, deleteLead, leadsToCsv, leadName } =
    await vite.ssrLoadModule("/src/lib/leadsStore.ts");
  const { computeStats, filterLeads, EMPTY_FILTERS } = await vite.ssrLoadModule("/src/lib/leadStats.ts");
  const { normalizePath, sourceLabel } = await vite.ssrLoadModule("/src/lib/format.ts");
  const { buildSampleLeads } = await vite.ssrLoadModule("/src/data/sampleLeads.ts");

  addLead("test-ride", { Name: "Smoke Test Rider", Phone: "+233 24 111 2222", City: "Accra" });
  let leads = readLeads();
  check("addLead persists a submission", leads.length === 1, `got ${leads.length}`);
  check("source page is captured", leads[0].source === "/contact?intent=quote", leads[0].source);
  check("status starts as new", leads[0].status === "new", leads[0].status);

  addLead("fleet-quote", { Company: "Legacy Kind Ltd", "Number of bikes": "4" });
  leads = readLeads();
  check("legacy kind 'fleet-quote' normalises to fleet", leads[1].kind === "fleet", leads[1].kind);

  updateLead(leads[0].id, { status: "won" });
  check("status update persists", readLeads()[0].status === "won");
  deleteLead(leads[0].id);
  check("delete removes the record", readLeads().length === 1);

  const samples = buildSampleLeads();
  const stats = computeStats(samples);
  check("sample set has 15 leads", samples.length === 15, `got ${samples.length}`);
  check("stats total matches", stats.total === 15, `got ${stats.total}`);
  check("fleet bikes are summed", stats.fleetBikes === 45, `got ${stats.fleetBikes}`);
  check("kinds are bucketed", stats.byKind.length === 5, `got ${stats.byKind.length}`);
  check("home-page source keeps its path", normalizePath("/?intent=quote") === "/", normalizePath("/?intent=quote"));
  check("source filter isolates the fleet form", filterLeads(samples, { ...EMPTY_FILTERS, source: "/fleet" }).length === 3);
  check("source filter isolates the contact form", filterLeads(samples, { ...EMPTY_FILTERS, source: "/contact" }).length === 6);
  check("home page gets a readable label", sourceLabel("/") === "Home page", sourceLabel("/"));
  check("7-day series is produced", stats.last7.length === 7, `got ${stats.last7.length}`);
  check(
    "filterLeads narrows to one kind",
    filterLeads(samples, { ...EMPTY_FILTERS, kinds: ["fleet"] }).length === 3,
    `got ${filterLeads(samples, { ...EMPTY_FILTERS, kinds: ["fleet"] }).length}`,
  );
  check(
    "filterLeads free-text search finds a company",
    filterLeads(samples, { ...EMPTY_FILTERS, query: "harmattan" }).length === 1,
  );
  const csv = leadsToCsv(samples);
  check("csv has a header + one row per lead", csv.split("\r\n").length === 16, `got ${csv.split("\r\n").length}`);
  check("csv quotes values containing commas", csv.includes('"GH\u20b5 2,000 \u2013 5,000"'), "income band not quoted");

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
  check("sources tab lists all four public forms", /Fleet quote/.test(sources) && /Call-back request/.test(sources));
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

  console.log("\n3. Public forms dispatch through the same store");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { PUBLIC_FORMS } = await vite.ssrLoadModule("/src/data/forms.ts");
  const PAGE_BY_ROUTE = {
    "/": "src/pages/Home.tsx",
    "/contact": "src/pages/Contact.tsx",
    "/ownership": "src/pages/Ownership.tsx",
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
