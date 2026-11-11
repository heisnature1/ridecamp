/**
 * EkonStage — the key specifications, as something you operate rather than read.
 *
 * A studio shot of the Ekon 450 sits on a layered 3D plane. Move across it and
 * the scene turns: the floor grid, the motorcycle and the battery pack each sit
 * at a different depth, so one pointer moves them by different amounts and the
 * depth is real rather than a filter. The pack is a live object: the swap
 * control pulls it out of the bay, sends a charged one in and seats it, with the
 * range readout following the ride mode.
 *
 * Four rules this file is built around:
 *
 * 1. The figures stay readable. They are a real `<dl>` before any animation
 *    runs, and the stage never hides them behind motion.
 * 2. Animation never costs a React render. The swap loop writes transforms
 *    straight to the DOM nodes; React state only changes when the spoken status
 *    or the charge figure actually changes.
 * 3. `prefers-reduced-motion` or a coarse pointer removes the drag, the idle
 *    drift and the autoplay. The swap slider still works, so the interaction is
 *    available without anything moving on its own.
 * 4. Nothing is announced twice. The pins are buttons with labels; the scene and
 *    pack are `aria-hidden`, because the `<dl>` already says all of it.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  FileDown,
  Gauge,
  MessageCircle,
  Move3d,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCalmMotion, useFinePointer } from "../../lib/motion";
import { WA_DEFAULT } from "../../lib/leads";

/**
 * The figures from the manufacturer sheet, placed on the machine itself.
 * Coordinates are percentages of the photograph, measured against the original
 * 1408 × 768 frame, so they stay on the part they describe at every width.
 */
const HOTSPOTS = [
  {
    key: "speed",
    label: "Top speed",
    value: "90 km/h",
    note: "Normal mode, flat road, no headwind.",
    icon: Gauge,
    x: 27,
    y: 26,
  },
  {
    key: "torque",
    label: "Peak torque",
    value: "260+ Nm",
    note: "Pulls a 300 kg load away from a standstill without straining.",
    icon: Zap,
    x: 52,
    y: 46,
  },
  {
    key: "range",
    label: "Range per swap",
    value: "120 km",
    note: "Eco mode, ideal conditions. 80 to 100 km is a realistic working day.",
    icon: BatteryCharging,
    x: 36.5,
    y: 67,
  },
  {
    key: "warranty",
    label: "Warranty",
    value: "2 years",
    note: "Or 30,000 km, depending on the component.",
    icon: ShieldCheck,
    x: 65,
    y: 33,
  },
] as const;

/** The five colours the bike ships in. Picking one tints the whole stage. */
const COLOURS = [
  { name: "Green", hex: "#16a34a" },
  { name: "Black", hex: "#111111" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Red", hex: "#dc2626" },
  { name: "Blue", hex: "#2563eb" },
] as const;

const MODES = [
  { key: "eco", label: "Eco", range: 120 },
  { key: "normal", label: "Normal", range: 100 },
  { key: "sport", label: "Sport", range: 80 },
] as const;

/** The spoken phases of a swap. Index is derived from progress, not stored. */
const PHASES = [
  "Pack seated, fully charged.",
  "Releasing the latch, pack sliding out.",
  "Bay empty, a charged pack is on its way.",
  "Fresh pack sliding in.",
  "Locked in. Back on the road.",
];

/** Linear 0..1 ramp with a smoothstep, so the pack eases rather than jumps. */
function ramp(value: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

function phaseOf(v: number): number {
  if (v < 0.04) return 0;
  if (v < 0.4) return 1;
  if (v < 0.58) return 2;
  if (v < 0.94) return 3;
  return 4;
}

export default function EkonStage() {
  const calm = useCalmMotion();
  const fine = useFinePointer();
  /*
   * Drag needs a real pointer. On touch the stage must not swallow the swipe
   * that scrolls the page, so the pads, the slider and the autoplay carry the
   * interaction there instead.
   */
  const interactive = !calm && fine;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const outPackRef = useRef<HTMLDivElement | null>(null);
  const inPackRef = useRef<HTMLDivElement | null>(null);
  const bayRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLSpanElement | null>(null);
  const chargeBarRef = useRef<HTMLSpanElement | null>(null);
  const chargeNumRef = useRef<HTMLSpanElement | null>(null);
  const sliderRef = useRef<HTMLInputElement | null>(null);

  const pointerFrame = useRef(0);
  const playFrame = useRef(0);
  const phaseRef = useRef(0);

  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("eco");
  const [active, setActive] = useState<string>("range");
  const [colour, setColour] = useState<(typeof COLOURS)[number]>(COLOURS[0]);

  const rangeKm = MODES.find((m) => m.key === mode)?.range ?? 120;

  /* ------------------------------------------------------------------ */
  /* the swap, written straight to the DOM                              */
  /* ------------------------------------------------------------------ */

  const paintSwap = useCallback((v: number) => {
    const out = outPackRef.current;
    const incoming = inPackRef.current;
    if (!out || !incoming) return;

    const ejecting = ramp(v, 0.02, 0.4);
    const arriving = ramp(v, 0.58, 0.94);
    const empty = ramp(v, 0.36, 0.5) * (1 - ramp(v, 0.6, 0.72));
    const seated = v < 0.3 || v > 0.9;

    out.style.transform = `translate3d(${ejecting * 46}%, ${ejecting * 58}%, ${
      ejecting * 90
    }px) rotate(${ejecting * -16}deg) scale(${1 + ejecting * 0.22})`;
    out.style.opacity = String(1 - ramp(v, 0.34, 0.44));

    incoming.style.transform = `translate3d(${(1 - arriving) * 120}%, ${
      (1 - arriving) * 120
    }%, ${(1 - arriving) * 60}px) rotate(${(1 - arriving) * 20}deg) scale(${
      0.9 + arriving * 0.1
    })`;
    incoming.style.opacity = String(ramp(v, 0.56, 0.7));

    if (bayRef.current) bayRef.current.style.opacity = String(0.25 + empty * 0.75);
    if (ringRef.current) ringRef.current.style.opacity = String(empty);

    // the slider follows the animation without a React render per frame
    if (sliderRef.current) sliderRef.current.value = String(Math.round(v * 100));

    const charge = seated ? 100 : 0;
    if (chargeBarRef.current) chargeBarRef.current.style.width = `${charge}%`;
    if (chargeNumRef.current) chargeNumRef.current.textContent = `${charge}%`;

    const next = phaseOf(v);
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }
  }, []);

  const runSwap = useCallback(
    (duration = 4200) => {
      cancelAnimationFrame(playFrame.current);
      const start = performance.now();
      setPlaying(true);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        paintSwap(t);
        if (t < 1) {
          playFrame.current = requestAnimationFrame(tick);
        } else {
          setPlaying(false);
        }
      };
      playFrame.current = requestAnimationFrame(tick);
    },
    [paintSwap],
  );

  const stopSwap = useCallback(() => {
    cancelAnimationFrame(playFrame.current);
    setPlaying(false);
  }, []);

  const resetSwap = useCallback(() => {
    stopSwap();
    paintSwap(0);
  }, [paintSwap, stopSwap]);

  /* seat the pack on first paint, before any observer or pointer event */
  useEffect(() => {
    paintSwap(0);
  }, [paintSwap]);

  useEffect(() => () => cancelAnimationFrame(playFrame.current), []);

  /* play once, when the stage first comes into view */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || calm || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          runSwap();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [calm, runSwap]);

  /* ------------------------------------------------------------------ */
  /* pointer: depth drift on hover, a turn while pressed                */
  /* ------------------------------------------------------------------ */

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const stage = stageRef.current;
      if (!stage || !interactive) return;
      const rect = stage.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      const dragging = stage.dataset.dragging === "true";
      cancelAnimationFrame(pointerFrame.current);
      pointerFrame.current = requestAnimationFrame(() => {
        stage.style.setProperty("--px", (x * 2 - 1).toFixed(3));
        stage.style.setProperty("--py", (y * 2 - 1).toFixed(3));
        stage.style.setProperty("--shine", `${(x * 100).toFixed(2)}%`);
        if (dragging) {
          // a spec panel that turns further than this stops being readable
          stage.style.setProperty("--spin", `${((x * 2 - 1) * 9).toFixed(2)}deg`);
        }
      });
    },
    [interactive],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const stage = stageRef.current;
      if (!stage) return;
      stage.dataset.dragging = "true";
      stage.setPointerCapture?.(event.pointerId);
      stage.style.setProperty("--spin", "0deg");
    },
    [interactive],
  );

  const onPointerUp = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.dataset.dragging = "false";
    stage.style.setProperty("--spin", "0deg");
  }, []);

  const current = HOTSPOTS.find((h) => h.key === active) ?? HOTSPOTS[0];

  return (
    <div className="ekon-stage-panel">
      <div className="ekon-stage-head">
        <div>
          <p className="ekon-kicker">Key specifications</p>
          <h2 className="ekon-title">Look at it like it is already yours.</h2>
          <p className="ekon-lede">
            Move across the machine to turn it. Run the swap to watch a spent pack leave and a
            charged one go in.
          </p>
        </div>
        <div className="ekon-modes" role="group" aria-label="Ride mode">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`ekon-mode ${mode === m.key ? "is-on" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ekon-stage-grid">
        <div
          className="ekon-stage"
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          data-interactive={interactive ? "true" : "false"}
          data-dragging="false"
          style={{ "--ekon-glow": colour.hex } as React.CSSProperties}
        >
          <div className="ekon-plane ekon-grid-floor" aria-hidden="true" />
          <div className="ekon-plane ekon-halo" aria-hidden="true" />

          <div className="ekon-scene">
            <div className="ekon-bike-layer" aria-hidden="true">
              <img
                src="/images/bike-studio.jpg"
                alt=""
                className="ekon-bike"
                width={1408}
                height={768}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="ekon-bay" ref={bayRef} aria-hidden="true">
              <span className="ekon-bay-ring" ref={ringRef} />
            </div>

            {/* the pack on its way out, spent */}
            <div className="ekon-battery" ref={outPackRef} data-state="spent" aria-hidden="true">
              <span className="ekon-battery-cap" />
              <span className="ekon-battery-cell" />
              <span className="ekon-battery-cell" />
              <span className="ekon-battery-cell" />
              <span className="ekon-battery-bolt">⌁</span>
            </div>

            {/* the pack on its way in, charged */}
            <div className="ekon-battery" ref={inPackRef} data-state="charged" aria-hidden="true">
              <span className="ekon-battery-cap" />
              <span className="ekon-battery-cell is-full" />
              <span className="ekon-battery-cell is-full" />
              <span className="ekon-battery-cell is-full" />
              <span className="ekon-battery-bolt">⌁</span>
            </div>

            {HOTSPOTS.map((h) => (
              <button
                key={h.key}
                type="button"
                className={`ekon-pin ${active === h.key ? "is-on" : ""} ${h.x > 55 ? "is-flip" : ""}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onMouseEnter={() => setActive(h.key)}
                onFocus={() => setActive(h.key)}
                onClick={() => setActive(h.key)}
                aria-label={`${h.label}: ${h.value}. ${h.note}`}
              >
                <span className="ekon-pin-dot" />
                <span className="ekon-pin-text">
                  <strong>{h.value}</strong>
                  <em>{h.label}</em>
                </span>
              </button>
            ))}
          </div>

          <div className="ekon-shine" aria-hidden="true" />
          {interactive ? (
            <p className="ekon-hint" aria-hidden="true">
              <Move3d className="size-3.5" /> Move to turn, hold to hold it there
            </p>
          ) : null}
        </div>

        <aside className="ekon-console">
          <div className="ekon-readout">
            <p className="ekon-readout-label">{current.label}</p>
            <p className="ekon-readout-value">{current.value}</p>
            <p className="ekon-readout-note">{current.note}</p>
            <p className="ekon-readout-range">
              <span>{rangeKm} km</span> per swap in {mode} mode
            </p>
          </div>

          <div className="ekon-swap">
            <div className="ekon-swap-row">
              <label htmlFor="ekon-swap" className="ekon-swap-label">
                Battery swap
              </label>
              <div className="ekon-swap-actions">
                <button
                  type="button"
                  className="ekon-icon-btn"
                  onClick={() => (playing ? stopSwap() : runSwap())}
                  aria-label={playing ? "Pause the swap" : "Play the swap"}
                >
                  {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                </button>
                <button
                  type="button"
                  className="ekon-icon-btn"
                  onClick={resetSwap}
                  aria-label="Reset the swap"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>

            <input
              ref={sliderRef}
              id="ekon-swap"
              type="range"
              min={0}
              max={100}
              defaultValue={0}
              aria-label="Battery swap position"
              onChange={(event) => {
                stopSwap();
                paintSwap(Number(event.target.value) / 100);
              }}
              className="fr-range ekon-range"
            />

            <div className="ekon-charge">
              <span className="ekon-charge-bar">
                <span ref={chargeBarRef} style={{ width: "100%" }} />
              </span>
              <span className="ekon-charge-num" ref={chargeNumRef}>
                100%
              </span>
            </div>
            <p className="ekon-status" aria-live="polite">
              {PHASES[phase]}
            </p>
          </div>
        </aside>
      </div>

      <div className="ekon-actions">
        <div className="ekon-colours" role="group" aria-label="Available colours">
          <span className="ekon-colours-label">Colour</span>
          <div className="ekon-swatches">
            {COLOURS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColour(c)}
                aria-pressed={colour.name === c.name}
                aria-label={c.name}
                title={c.name}
                className={`ekon-swatch ${colour.name === c.name ? "is-on" : ""}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <span className="ekon-colour-name">{colour.name}</span>
        </div>

        <div className="ekon-ctas">
          <Link to="/contact" className="ekon-cta is-primary">
            Book a Test Ride <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noreferrer"
            className="ekon-cta is-whatsapp"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> Chat on WhatsApp
          </a>
          <Link to="/spec-sheet" className="ekon-cta is-quiet">
            <FileDown className="size-4" aria-hidden="true" /> Download Spec Sheet
          </Link>
        </div>
      </div>

      {/* The readable figures. Always present, never dependent on the animation. */}
      <dl className="ekon-facts">
        {HOTSPOTS.map((h) => (
          <div
            key={h.key}
            className={`ekon-fact ${active === h.key ? "is-on" : ""}`}
            onMouseEnter={() => setActive(h.key)}
          >
            <dt>
              <h.icon className="size-4" aria-hidden="true" />
              {h.label}
            </dt>
            <dd>{h.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
