import type { LeadKind, LeadStatus } from "../lib/leadKinds";
import type { LeadData, LeadRecord } from "../lib/leadsStore";

/**
 * Optional demo data for the admin dashboard. Loaded on demand from the
 * dashboard itself (never automatically) so real leads are never mixed with
 * fiction by accident — and it can be removed with one click.
 */
type Seed = {
  daysAgo: number;
  hour: number;
  kind: LeadKind;
  status: LeadStatus;
  source: string;
  data: LeadData;
  adminNotes?: string;
};

const SEEDS: Seed[] = [
  {
    daysAgo: 0,
    hour: 9,
    kind: "test-ride",
    status: "new",
    source: "/contact?intent=test-ride",
    data: {
      Name: "Kwame Mensah",
      Phone: "+233 24 411 8890",
      Email: "kwame.mensah@gmail.com",
      City: "Accra",
      "Preferred date": "Flexible",
      "Rider type": "Commercial rider",
      Interest: "Book a test ride",
      Notes: "I ride Okada from Madina to Circle. Want to feel the bike before I commit.",
    },
    adminNotes: "Called twice, no answer. Left a WhatsApp message — follow up Friday morning.",
  },
  {
    daysAgo: 0,
    hour: 12,
    kind: "fleet",
    status: "contacted",
    source: "/fleet",
    data: {
      Company: "Harmattan Eats",
      "Contact person": "Adjoa Boakye",
      Phone: "+233 20 771 4432",
      Email: "adjoa@harmattaneats.com",
      "Number of bikes": "25",
      City: "Accra",
      "Use case": "Food / parcel delivery",
      Notes: "Replacing 25 petrol bikes in January. Need swap coverage in East Legon.",
    },
    adminNotes: "Sent fleet brochure + swap-network map. Customer wants a quote with 3 battery-subscription tiers. Follow up next week.",
  },
  {
    daysAgo: 1,
    hour: 16,
    kind: "financing",
    status: "qualified",
    source: "/fleet#apply-financing",
    data: {
      Name: "Yaw Owusu",
      Phone: "+233 55 208 1176",
      Email: "yaw.owusu@outlook.com",
      City: "Kumasi",
      Occupation: "Dispatch rider",
      "Income range": "GH₵ 2,000 – 5,000",
      "Preferred option": "Lease to own",
    },
  },
  {
    daysAgo: 1,
    hour: 8,
    kind: "callback",
    status: "contacted",
    source: "/",
    data: { Name: "Efua Ansah", Phone: "+233 27 903 5521", City: "Tema" },
  },
  {
    daysAgo: 2,
    hour: 14,
    kind: "quote",
    status: "new",
    source: "/contact?intent=quote",
    data: {
      Name: "Nana Kofi Adjei",
      Phone: "+233 24 660 0192",
      Email: "nk.adjei@yahoo.com",
      City: "Takoradi",
      "Preferred date": "2026-11-04",
      "Rider type": "Private commuter",
      Interest: "Get a quote",
      Notes: "Please send the price with and without the battery subscription.",
    },
  },
  {
    daysAgo: 2,
    hour: 19,
    kind: "test-ride",
    status: "won",
    source: "/contact",
    data: {
      Name: "Selorm Agbeko",
      Phone: "+233 50 330 7781",
      City: "Tema",
      "Preferred date": "2026-10-11",
      "Rider type": "Delivery rider",
      Interest: "Book a test ride",
    },
  },
  {
    daysAgo: 3,
    hour: 11,
    kind: "fleet",
    status: "qualified",
    source: "/fleet",
    data: {
      Company: "Kotoka Campus Shuttle",
      "Contact person": "Michael Tetteh",
      Phone: "+233 26 442 9908",
      Email: "ops@kotokashuttle.gh",
      "Number of bikes": "8",
      City: "Accra",
      "Use case": "Campus / estate service",
    },
  },
  {
    daysAgo: 4,
    hour: 17,
    kind: "financing",
    status: "lost",
    source: "/fleet#apply-financing",
    data: {
      Name: "Abena Sarpong",
      Phone: "+233 24 118 3345",
      City: "Cape Coast",
      Occupation: "Nurse",
      "Income range": "GH₵ 2,000 – 5,000",
      "Preferred option": "Pay upfront",
    },
  },
  {
    daysAgo: 5,
    hour: 10,
    kind: "callback",
    status: "contacted",
    source: "/",
    data: { Name: "Kofi Asare", Phone: "+233 59 774 2210", City: "Kumasi" },
  },
  {
    daysAgo: 5,
    hour: 15,
    kind: "quote",
    status: "qualified",
    source: "/contact?intent=quote",
    data: {
      Name: "Linda Quartey",
      Phone: "+233 20 556 8874",
      Email: "linda.quartey@gmail.com",
      City: "Accra",
      "Rider type": "Fleet / business",
      Interest: "Get a quote",
    },
  },
  {
    daysAgo: 6,
    hour: 13,
    kind: "test-ride",
    status: "contacted",
    source: "/contact",
    data: {
      Name: "Ibrahim Fuseini",
      Phone: "+233 24 990 1123",
      City: "Tamale",
      "Preferred date": "2026-10-18",
      "Rider type": "Commercial rider",
      Interest: "Book a test ride",
    },
  },
  {
    daysAgo: 7,
    hour: 9,
    kind: "fleet",
    status: "won",
    source: "/fleet",
    data: {
      Company: "Sika Courier Ltd",
      "Contact person": "Gifty Amoah",
      Phone: "+233 27 331 6654",
      Email: "gifty@sikacourier.gh",
      "Number of bikes": "12",
      City: "Tema",
      "Use case": "Courier & logistics",
    },
  },
  {
    daysAgo: 8,
    hour: 18,
    kind: "financing",
    status: "new",
    source: "/fleet#apply-financing",
    data: {
      Name: "Emmanuel Darko",
      Phone: "+233 55 002 7781",
      Email: "e.darko@proton.me",
      City: "Accra",
      Occupation: "Sales agent",
      "Income range": "Under GH₵ 2,000 / month",
      "Preferred option": "Lease to own",
    },
  },
  {
    daysAgo: 9,
    hour: 12,
    kind: "callback",
    status: "lost",
    source: "/",
    data: { Name: "Rita Ntim", Phone: "+233 24 664 9932", City: "Takoradi" },
  },
  {
    daysAgo: 10,
    hour: 16,
    kind: "test-ride",
    status: "contacted",
    source: "/contact?intent=test-ride",
    data: {
      Name: "Bright Addo",
      Phone: "+233 20 118 4409",
      City: "Accra",
      "Preferred date": "2026-10-20",
      "Rider type": "Private commuter",
      Interest: "Book a test ride",
    },
  },
];

export function buildSampleLeads(): LeadRecord[] {
  const now = new Date();
  return SEEDS.map((seed, i) => {
    const at = new Date(now);
    at.setDate(at.getDate() - seed.daysAgo);
    at.setHours(seed.hour, (i * 7) % 60, 0, 0);
    return {
      id: `sample-${i + 1}`,
      kind: seed.kind,
      status: seed.status,
      createdAt: at.toISOString(),
      source: seed.source,
      data: seed.data,
      adminNotes: seed.adminNotes ?? "",
    };
  });
}

export const SAMPLE_LEAD_IDS_PREFIX = "sample-";
