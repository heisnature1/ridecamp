import type { LeadKind } from "../lib/leadKinds";

/**
 * Registry of every public form that feeds the admin dashboard.
 *
 * Keep this in step with the form components it describes — the admin
 * "Sources" tab renders it so the team can see exactly what a visitor types
 * and where it will show up. Fields listed here are the keys stored on the
 * lead record (i.e. the labels the forms pass to `dispatchLead`).
 */
export type PublicForm = {
  id: string;
  title: string;
  blurb: string;
  /** page the form lives on */
  route: string;
  pageLabel: string;
  /** optional element id / anchor on that page */
  anchor?: string;
  kinds: LeadKind[];
  fields: { label: string; required: boolean }[];
};

export const PUBLIC_FORMS: PublicForm[] = [
  {
    id: "home-callback",
    title: "Call-back request",
    blurb: "The “Ready to make the switch?” strip at the bottom of the home page.",
    route: "/",
    pageLabel: "Home",
    kinds: ["callback"],
    fields: [
      { label: "Name", required: true },
      { label: "Phone", required: true },
      { label: "City", required: true },
    ],
  },
  {
    id: "contact",
    title: "Test ride · quote · financing",
    blurb: "The main lead form. Visitors pick an intent, so one form produces three lead types.",
    route: "/contact",
    pageLabel: "Contact / book a test ride",
    kinds: ["test-ride", "quote", "financing"],
    fields: [
      { label: "Name", required: true },
      { label: "Phone", required: true },
      { label: "Email", required: false },
      { label: "City", required: true },
      { label: "Preferred date", required: false },
      { label: "Rider type", required: true },
      { label: "Interest", required: true },
      { label: "Notes", required: false },
    ],
  },
  {
    id: "ownership",
    title: "Financing application",
    blurb: "Lease-to-own applications from the Ownership & Financing page.",
    route: "/ownership",
    pageLabel: "Ownership & financing",
    anchor: "#apply-financing",
    kinds: ["financing"],
    fields: [
      { label: "Name", required: true },
      { label: "Phone", required: true },
      { label: "Email", required: false },
      { label: "City", required: true },
      { label: "Occupation", required: true },
      { label: "Income range", required: false },
      { label: "Preferred option", required: true },
    ],
  },
  {
    id: "fleet",
    title: "Fleet quote",
    blurb: "Business and fleet enquiries — the only form that captures company size.",
    route: "/fleet",
    pageLabel: "Fleet & business",
    kinds: ["fleet"],
    fields: [
      { label: "Company", required: true },
      { label: "Contact person", required: true },
      { label: "Phone", required: true },
      { label: "Email", required: true },
      { label: "Number of bikes", required: true },
      { label: "City", required: true },
      { label: "Use case", required: true },
      { label: "Notes", required: false },
    ],
  },
];
