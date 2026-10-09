import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Database,
  Download,
  FileSpreadsheet,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import {
  clearLeads,
  downloadFile,
  exportFileName,
  importLeadsJson,
  leadsToCsv,
  readLeads,
  type LeadRecord,
} from "../../lib/leadsStore";
import { EASE, Panel, PanelTitle } from "./ui";

function ActionButton({
  onClick,
  icon,
  title,
  body,
  tone = "default",
}: {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  body: string;
  tone?: "default" | "danger";
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
        tone === "danger"
          ? "border-red-200 bg-red-50/50 hover:border-red-300"
          : "border-line bg-white hover:border-brand/50"
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${tone === "danger" ? "text-red-600" : "text-brand"}`}>{icon}</span>
      <span>
        <span className="block text-sm font-bold text-navy">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate">{body}</span>
      </span>
    </motion.button>
  );
}

export default function Settings({
  leads,
  onToast,
  onLoadSample,
  onRemoveSample,
}: {
  leads: LeadRecord[];
  onToast: (text: string, tone?: "ok" | "warn") => void;
  onLoadSample: () => void;
  onRemoveSample: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const hasSamples = leads.some((l) => l.id.startsWith("sample-"));

  const exportCsv = () => {
    downloadFile(exportFileName("csv"), leadsToCsv(leads), "text/csv;charset=utf-8");
    onToast(`Exported ${leads.length} leads as CSV`);
  };

  const exportJson = () => {
    downloadFile(
      exportFileName("json"),
      JSON.stringify(leads, null, 2),
      "application/json;charset=utf-8",
    );
    onToast(`Exported ${leads.length} leads as JSON`);
  };

  const onPickFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = importLeadsJson(String(reader.result));
        onToast(`Imported ${result.added} leads${result.skipped ? ` · ${result.skipped} duplicates skipped` : ""}`);
      } catch (err) {
        onToast(err instanceof Error ? err.message : "Could not read that file", "warn");
      }
    };
    reader.readAsText(file);
  };

  const doClear = () => {
    const count = readLeads().length;
    clearLeads();
    setConfirmClear(false);
    onToast(`Deleted ${count} leads`, "warn");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel>
        <PanelTitle title="Export" hint="Take the leads with you" />
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionButton
            onClick={exportCsv}
            icon={<FileSpreadsheet className="size-5" />}
            title="Download CSV"
            body="Opens in Excel, Sheets or any CRM import."
          />
          <ActionButton
            onClick={exportJson}
            icon={<Download className="size-5" />}
            title="Download JSON"
            body="Full backup, re-importable on another device."
          />
        </div>
      </Panel>

      <Panel delay={0.06}>
        <PanelTitle title="Import & demo data" hint="Move leads between devices" />
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionButton
            onClick={() => fileRef.current?.click()}
            icon={<Upload className="size-5" />}
            title="Import JSON"
            body="Merges a previous export; duplicates are skipped."
          />
          <ActionButton
            onClick={hasSamples ? onRemoveSample : onLoadSample}
            icon={<Sparkles className="size-5" />}
            title={hasSamples ? "Remove sample leads" : "Load sample leads"}
            body={
              hasSamples
                ? "Delete the demo rows and keep only real submissions."
                : "Add 15 realistic leads so you can explore the dashboard."
            }
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPickFile(file);
            e.target.value = "";
          }}
        />
      </Panel>

      <Panel delay={0.12}>
        <PanelTitle title="Where the data lives" hint="Important before launch" />
        <div className="flex items-start gap-3 rounded-2xl bg-cloud p-4 text-sm leading-relaxed text-slate">
          <Database className="mt-0.5 size-5 shrink-0 text-brand" />
          <p>
            Leads are stored in this browser's local storage, so the dashboard reflects everything
            submitted <span className="font-semibold text-navy">on this device and browser</span> —
            including submissions made in another tab, which appear live. To collect leads from every
            visitor on every device, point{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-navy">
              dispatchLead
            </code>{" "}
            in <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-navy">src/lib/leads.ts</code>{" "}
            at a backend or CRM webhook. Until then, use the export above as the hand-over format.
          </p>
        </div>
      </Panel>

      <Panel delay={0.18}>
        <PanelTitle title="Danger zone" hint="This cannot be undone" />
        {confirmClear ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-red-700">
              <AlertTriangle className="size-4" /> Delete all {leads.length} leads?
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={doClear}
                className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 active:scale-95"
              >
                Yes, delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-navy"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <ActionButton
            onClick={() => setConfirmClear(true)}
            icon={<Trash2 className="size-5" />}
            title="Clear all leads"
            body={`Permanently remove all ${leads.length} stored leads from this browser.`}
            tone="danger"
          />
        )}
      </Panel>
    </div>
  );
}

