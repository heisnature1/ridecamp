export type City = {
  name: string;
  lat: number;
  lon: number;
  swapStations: number;
  serviceCentres: number;
};

export type Country = {
  code: string;
  name: string;
  flag: string;
  dial: string;
  currency: string;
  /** petrol price per litre, local currency */
  petrolPerLitre: number;
  /** EV energy cost per km, local currency */
  evPerKm: number;
  cities: City[];
};

export const COUNTRIES: Country[] = [
  {
    code: "KE", name: "Kenya", flag: "🇰🇪", dial: "+254", currency: "KES",
    petrolPerLitre: 178, evPerKm: 2.4,
    cities: [
      { name: "Nairobi", lat: -1.29, lon: 36.82, swapStations: 42, serviceCentres: 6 },
      { name: "Mombasa", lat: -4.05, lon: 39.67, swapStations: 14, serviceCentres: 2 },
      { name: "Kisumu", lat: -0.1, lon: 34.76, swapStations: 9, serviceCentres: 1 },
      { name: "Nakuru", lat: -0.3, lon: 36.07, swapStations: 8, serviceCentres: 1 },
      { name: "Thika", lat: -1.03, lon: 37.07, swapStations: 6, serviceCentres: 1 },
    ],
  },
  {
    code: "RW", name: "Rwanda", flag: "🇷🇼", dial: "+250", currency: "RWF",
    petrolPerLitre: 1520, evPerKm: 20,
    cities: [
      { name: "Kigali", lat: -1.94, lon: 30.06, swapStations: 24, serviceCentres: 3 },
    ],
  },
  {
    code: "UG", name: "Uganda", flag: "🇺🇬", dial: "+256", currency: "UGX",
    petrolPerLitre: 5350, evPerKm: 71,
    cities: [
      { name: "Kampala", lat: 0.31, lon: 32.58, swapStations: 18, serviceCentres: 2 },
    ],
  },
  {
    code: "CM", name: "Cameroon", flag: "🇨🇲", dial: "+237", currency: "XAF",
    petrolPerLitre: 670, evPerKm: 9,
    cities: [
      { name: "Douala", lat: 4.05, lon: 9.77, swapStations: 12, serviceCentres: 2 },
      { name: "Yaoundé", lat: 3.87, lon: 11.52, swapStations: 8, serviceCentres: 1 },
    ],
  },
  {
    code: "NG", name: "Nigeria", flag: "🇳🇬", dial: "+234", currency: "NGN",
    petrolPerLitre: 875, evPerKm: 12,
    cities: [
      { name: "Lagos", lat: 6.52, lon: 3.38, swapStations: 21, serviceCentres: 3 },
      { name: "Abuja", lat: 9.06, lon: 7.49, swapStations: 10, serviceCentres: 1 },
    ],
  },
  {
    code: "BJ", name: "Benin", flag: "🇧🇯", dial: "+229", currency: "XOF",
    petrolPerLitre: 615, evPerKm: 8,
    cities: [
      { name: "Cotonou", lat: 6.36, lon: 2.43, swapStations: 7, serviceCentres: 1 },
    ],
  },
  {
    code: "TG", name: "Togo", flag: "🇹🇬", dial: "+228", currency: "XOF",
    petrolPerLitre: 610, evPerKm: 8,
    cities: [
      { name: "Lomé", lat: 6.13, lon: 1.22, swapStations: 6, serviceCentres: 1 },
    ],
  },
];

export const DEFAULT_COUNTRY = "KE";

export function getCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export const HERO_STATS = [
  { label: "Kilometres Driven", value: 3_026_679_853, suffix: "", decimals: 0 },
  { label: "Tonnes of CO₂ Saved", value: 222.4, suffix: " K", decimals: 1 },
  { label: "Energy Distributed", value: 113.5, suffix: " GWh", decimals: 1 },
  { label: "Battery Swaps", value: 55_906_658, suffix: "", decimals: 0 },
] as const;

export const BIKE_SPECS = [
  { label: "Range per swap", value: 110, unit: "km" },
  { label: "Top Speed", value: 95, unit: "km/h" },
  { label: "Peak Power", value: 12, unit: "kW" },
  { label: "Load Capacity", value: 320, unit: "kg" },
] as const;

export type NewsItem = {
  source: string;
  date: string;
  title: string;
  image: string;
  excerpt: string;
  external?: boolean;
};

export const NEWS: NewsItem[] = [
  {
    source: "The Star",
    date: "Aug 7, 2026",
    title: "Future Ride expands electric mobility network with mega battery swap hub in Nairobi",
    image: "/images/swap-station.jpg",
    excerpt:
      "The new hub adds 480 battery slots and cuts average swap wait times to under a minute for riders in the capital.",
  },
  {
    source: "Future Ride",
    date: "Jul 21, 2026",
    title: "Future Ride publishes its first Sustainability Report, confirming strong climate impact",
    image: "/images/hero-rider.jpg",
    excerpt:
      "Our first ESG report details the economic, social and climate value created across seven markets.",
  },
  {
    source: "TechCable",
    date: "Jun 12, 2026",
    title: "Inside the FR-1: the battery platform engineered for 2,000 swap cycles",
    image: "/images/battery-tech.jpg",
    excerpt:
      "A look at the swappable pack, telemetry and thermal design behind the Future Ride energy network.",
  },
];

export const PRESS = ["The Star", "TechCable", "Mobility Weekly", "GreenGrid", "City Ledger", "EV Journal"];

export const NAV_LINKS = [
  { to: "/bike", label: "FR Volt 450" },
  { to: "/energy", label: "Swap Network" },
  { to: "/technology", label: "Technology" },
  { to: "/about", label: "About us" },
] as const;

export const DIAL_CODES: { name: string; dial: string }[] = [
  { name: "Kenya", dial: "+254" },
  { name: "Rwanda", dial: "+250" },
  { name: "Uganda", dial: "+256" },
  { name: "Cameroon", dial: "+237" },
  { name: "Nigeria", dial: "+234" },
  { name: "Benin", dial: "+229" },
  { name: "Togo", dial: "+228" },
  { name: "Tanzania", dial: "+255" },
  { name: "Ghana", dial: "+233" },
  { name: "Ethiopia", dial: "+251" },
  { name: "South Africa", dial: "+27" },
  { name: "United Kingdom", dial: "+44" },
  { name: "United States", dial: "+1" },
  { name: "France", dial: "+33" },
  { name: "Germany", dial: "+49" },
  { name: "India", dial: "+91" },
];

export const MODEL = {
  name: "FR Volt 450",
  tagline: "The bike that pays you back.",
  blurb: "Every kilometre costs less. Every day earns more.",
  priceNote: "Flexible financing and battery-subscription plans available in every market.",
};

export const ASSUMPTIONS = [
  "Petrol bike consumes 2.5 L per 100 km at local pump prices.",
  "Energy cost per km uses the standard battery-swap tariff, batteries included.",
  "Savings assume riding 330 days per year.",
  "Maintenance delta based on 40% fewer moving parts vs. an equivalent petrol bike.",
];
