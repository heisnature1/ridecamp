import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Staggered entrance used by every panel so the dashboard assembles itself. */
export const panelMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function Panel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={panelMotion.initial}
      animate={panelMotion.animate}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={`rounded-3xl border border-line bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function PanelTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-base font-bold text-navy">{title}</h2>
        {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  count,
  dotClass,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
  dotClass?: string;
  icon?: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
        active ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line hover:ring-navy/40"
      }`}
    >
      {dotClass && <span className={`size-1.5 rounded-full ${dotClass}`} />}
      {icon}
      {children}
      {typeof count === "number" && (
        <span className={`tabular-nums ${active ? "text-white/70" : "text-slate"}`}>{count}</span>
      )}
    </motion.button>
  );
}

/** Horizontal animated bar used for every breakdown in the dashboard. */
export function BreakdownRow({
  label,
  count,
  total,
  barClass,
  delay = 0,
  suffix,
}: {
  label: string;
  count: number;
  total: number;
  barClass: string;
  delay?: number;
  suffix?: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="truncate font-semibold text-navy">{label}</span>
        <span className="shrink-0 tabular-nums text-slate">
          {count}
          {suffix}
          <span className="text-slate/60"> · {Math.round(pct)}%</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cloud">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
          transition={{ duration: 0.8, delay, ease: EASE }}
        />
      </div>
    </div>
  );
}

export function KindChip({ chipClass, children }: { chipClass: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${chipClass}`}>
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-3xl border border-dashed border-line bg-cloud/60 p-10 text-center md:p-14"
    >
      <motion.div
        className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-brand shadow-sm"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {icon}
      </motion.div>
      <h3 className="mt-5 font-display text-lg font-bold text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">{body}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </motion.div>
  );
}

export type ToastMessage = { id: number; text: string; tone?: "ok" | "warn" };

export function Toasts({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-[min(92vw,22rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
              t.tone === "warn" ? "bg-navy-soft" : "bg-navy"
            }`}
          >
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-bright" />
            <span className="flex-1">{t.text}</span>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-white/60 transition hover:text-white"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
