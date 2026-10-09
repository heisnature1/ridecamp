import { Printer } from "lucide-react";
import { EKON_SPECS } from "../data/site";
import Logo from "../components/Logo";

/** Print-friendly spec sheet — "Download Spec Sheet" lands here; print = save as PDF. */
export default function SpecSheet() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 print:p-0">
      <div className="flex items-end justify-between border-b-2 border-navy pb-4">
        <Logo />
        <p className="text-xs text-slate">Spiro Ekon 450 M1 — Specification Sheet (Ghana)</p>
      </div>

      <h1 className="mt-6 font-display text-3xl font-bold text-navy">Ekon 450 M1</h1>
      <p className="mt-2 text-sm text-slate">
        The electric motorcycle designed for African roads and commercial use. Distributed in
        Ghana by Future Ride.
      </p>

      <table className="mt-6 w-full border-collapse text-sm">
        <tbody>
          {EKON_SPECS.map(([k, v]) => (
            <tr key={k} className="border-b border-line">
              <th className="w-1/3 py-2.5 pr-4 text-left font-semibold text-slate">{k}</th>
              <td className="py-2.5 font-medium text-ink">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-[11px] text-slate">
        Specifications are indicative and tested under standard test conditions. Warranty coverage
        varies by component; terms, mileage limits and exclusions apply.
      </p>

      <div className="mt-8 flex items-center justify-between print:hidden">
        <p className="text-xs text-slate">Use your browser's print dialog to save this page as a PDF.</p>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Printer className="size-4" /> Print / Save PDF
        </button>
      </div>
    </div>
  );
}
