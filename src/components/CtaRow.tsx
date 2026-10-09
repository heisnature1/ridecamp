import { Link } from "react-router-dom";
import { ArrowRight, FileDown, MessageCircle } from "lucide-react";
import { WA_DEFAULT } from "../lib/leads";

/** The four site-wide conversion actions, as a reusable button row. */
export default function CtaRow({ specSheet = false }: { specSheet?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/25 transition hover:bg-brand-dark"
      >
        Book a Test Ride <ArrowRight className="size-4" />
      </Link>
      <Link
        to="/contact?intent=quote"
        className="inline-flex items-center gap-2 rounded-full border-2 border-navy px-6 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
      >
        Get a Quote
      </Link>
      <a
        href={WA_DEFAULT}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#25D366]/25 transition hover:brightness-105"
      >
        <MessageCircle className="size-4" /> Chat on WhatsApp
      </a>
      {specSheet && (
        <Link
          to="/spec-sheet"
          className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-white px-6 py-3 text-sm font-bold text-navy transition hover:border-navy"
        >
          <FileDown className="size-4" /> Download Spec Sheet
        </Link>
      )}
    </div>
  );
}
