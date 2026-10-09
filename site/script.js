/*
 * RideCamp homepage behaviour: vanilla JavaScript, no dependencies.
 * Edit the CONFIG block to replace the sample data.
 */
(() => {
  "use strict";

  /* ---------- CONFIG (sample data) ---------- */

  const COUNTRIES = [
    { code: "KE", name: "Kenya", flag: "🇰🇪", dial: "+254" },
    { code: "RW", name: "Rwanda", flag: "🇷🇼", dial: "+250" },
    { code: "UG", name: "Uganda", flag: "🇺🇬", dial: "+256" },
    { code: "CM", name: "Cameroon", flag: "🇨🇲", dial: "+237" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬", dial: "+234" },
    { code: "BJ", name: "Benin", flag: "🇧🇯", dial: "+229" },
    { code: "TG", name: "Togo", flag: "🇹🇬", dial: "+228" },
  ];

  const CURRENCIES = ["USD", "EUR", "GBP", "KES", "RWF", "UGX", "XAF", "NGN", "XOF"];

  // Listed for every country. Replace with real sites.
  const LOCATIONS = [
    { type: "station", title: "Swap station A" },
    { type: "station", title: "Swap station B" },
    { type: "service", title: "Service centre A" },
  ];

  const TYPE_LABELS = { station: "Swap station", service: "Service centre" };
  const MARKET_STORAGE_KEY = "ridecamp:market";
  const COUNTER_DURATION_MS = 1400;

  /* ---------- helpers ---------- */

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function countryByCode(code) {
    return COUNTRIES.find((country) => country.code === code) || COUNTRIES[0];
  }

  function numberFrom(input) {
    const value = parseFloat(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function formatMoney(amount, currency, maxDigits) {
    const value = Math.abs(amount) < 1e-9 ? 0 : amount; // avoids "-$0"
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDigits,
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(maxDigits)}`;
    }
  }

  /* ---------- running-cost estimate ---------- */

  function estimateSavings({ distanceKm, kmPerLitre, petrolPrice, electricPerKm, daysPerWeek }) {
    const distance = Math.max(distanceKm, 0);
    const efficiency = Math.max(kmPerLitre, 0.1);
    const days = Math.min(Math.max(Math.round(daysPerWeek), 0), 7);

    const dailyPetrol = (distance / efficiency) * Math.max(petrolPrice, 0);
    const dailyElectric = distance * Math.max(electricPerKm, 0);
    const daily = dailyPetrol - dailyElectric;

    return {
      daily,
      monthly: (daily * days * 52) / 12,
      yearly: daily * days * 52,
    };
  }

  /* ---------- market (country) ---------- */

  const state = { market: COUNTRIES[0].code, type: "all" };

  function readStoredMarket() {
    try {
      const stored = localStorage.getItem(MARKET_STORAGE_KEY);
      return COUNTRIES.some((country) => country.code === stored) ? stored : null;
    } catch {
      return null;
    }
  }

  function storeMarket(code) {
    try {
      localStorage.setItem(MARKET_STORAGE_KEY, code);
    } catch {
      // Storage can be blocked (for example in private mode). The choice still applies for this visit.
    }
  }

  function setMarket(code) {
    state.market = countryByCode(code).code;
    $("#network-country").value = state.market;
    $("#dial-code").value = state.market;
    renderLocations();
  }

  function setupMarketDialog() {
    const dialog = $("#market-dialog");
    const form = $("#market-form");
    const options = $("#market-options");
    const stored = readStoredMarket();
    if (stored) state.market = stored;

    COUNTRIES.forEach((country) => {
      const input = createElement("input");
      input.type = "radio";
      input.name = "market";
      input.value = country.code;
      input.checked = country.code === state.market;

      const label = createElement("label", "market-option");
      label.append(
        input,
        createElement("span", "market-flag", country.flag),
        createElement("span", "market-name", country.name)
      );
      options.append(label);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const picked = form.elements.market.value;
      if (picked) {
        setMarket(picked);
        storeMarket(picked);
      }
      dialog.close();
    });

    $("#market-skip").addEventListener("click", () => dialog.close());

    setMarket(state.market);

    if (!stored) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    }
  }

  /* ---------- network filter ---------- */

  function setupNetwork() {
    const select = $("#network-country");
    COUNTRIES.forEach((country) => {
      select.append(new Option(`${country.flag} ${country.name}`, country.code));
    });
    select.addEventListener("change", () => setMarket(select.value));

    const buttons = $$(".segmented button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        state.type = button.dataset.type;
        buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        renderLocations();
      });
    });
  }

  function renderLocations() {
    const country = countryByCode(state.market);
    const items = LOCATIONS.filter((location) => state.type === "all" || location.type === state.type);

    $("#location-list").replaceChildren(
      ...items.map((location) => {
        const item = createElement("li", "location");
        item.append(
          createElement("span", `badge badge-${location.type}`, TYPE_LABELS[location.type]),
          createElement("h3", "", location.title),
          createElement("p", "", `${country.flag} ${country.name} · Sample location`)
        );
        return item;
      })
    );
    $("#location-empty").hidden = items.length > 0;
  }

  /* ---------- running-cost calculator ---------- */

  function setupCalculator() {
    const inputs = {
      distance: $("#km"),
      kmPerLitre: $("#kpl"),
      petrolPrice: $("#petrol"),
      electricPerKm: $("#ekm"),
      daysPerWeek: $("#days"),
    };
    const currency = $("#currency");
    const card = $(".results");
    const note = $("#calc-note");
    const defaultNote = note.textContent;

    CURRENCIES.forEach((code) => currency.append(new Option(code, code)));
    currency.value = "USD";

    function update() {
      $("#km-out").textContent = inputs.distance.value;

      const result = estimateSavings({
        distanceKm: numberFrom(inputs.distance),
        kmPerLitre: numberFrom(inputs.kmPerLitre),
        petrolPrice: numberFrom(inputs.petrolPrice),
        electricPerKm: numberFrom(inputs.electricPerKm),
        daysPerWeek: numberFrom(inputs.daysPerWeek),
      });

      $("#daily").textContent = formatMoney(result.daily, currency.value, 2);
      $("#monthly").textContent = formatMoney(result.monthly, currency.value, 0);
      $("#yearly").textContent = formatMoney(result.yearly, currency.value, 0);

      const costsMore = result.yearly < 0;
      card.classList.toggle("is-negative", costsMore);
      note.textContent = costsMore
        ? "With these inputs the electric option costs more to run. Adjust the inputs to match your route."
        : defaultNote;
    }

    Object.values(inputs).forEach((input) => input.addEventListener("input", update));
    currency.addEventListener("change", update);
    update();
  }

  /* ---------- count-up figures ---------- */

  function setupCounters() {
    const counters = $$("[data-count]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    counters.forEach((node) => {
      node.textContent = "0";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animateCounter(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((node) => observer.observe(node));
  }

  function animateCounter(node) {
    const target = Number(node.dataset.count);
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / COUNTER_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  /* ---------- callback form (demo only) ---------- */

  function setupContactForm() {
    const form = $("#contact-form");
    const dial = $("#dial-code");
    const phone = $("#phone");
    const status = $("#form-status");

    COUNTRIES.forEach((country) => {
      dial.append(new Option(`${country.flag} ${country.dial}`, country.code));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const raw = phone.value.trim();
      const digitCount = raw.replace(/\D/g, "").length;
      const valid = /^[+\d\s()-]+$/.test(raw) && digitCount >= 6 && digitCount <= 15;

      phone.setAttribute("aria-invalid", String(!valid));
      status.dataset.kind = valid ? "ok" : "error";

      if (!valid) {
        status.textContent = "Enter a valid phone number, for example +254 700 123 456.";
        phone.focus();
        return;
      }

      // Demo only: nothing is sent. Connect this handler to your backend before going live.
      status.textContent = "Thanks! This demo form doesn't send anything yet.";
      form.reset();
      dial.value = state.market;
    });
  }

  /* ---------- mobile navigation ---------- */

  function setupNav() {
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });

    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  }

  /* ---------- init ---------- */

  function init() {
    setupNetwork();
    setupContactForm();
    setupMarketDialog();
    setupCalculator();
    setupCounters();
    setupNav();
  }

  init();
})();
