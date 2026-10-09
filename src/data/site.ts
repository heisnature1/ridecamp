/* Content model — copy supplied in the Future Ride content brief. */

export const TRUST_STRIP = [
  "Built for African roads",
  "100 km range per battery swap",
  "Up to 2 years warranty on key components*",
  "GPS tracking built in",
];

export const WHY_GHANA = [
  {
    title: "Stop paying for petrol",
    text: "Every kilometre on an electric motorcycle costs far less than on a petrol bike. Fuel prices go up and down; your running cost stays low and predictable.",
  },
  {
    title: "Spend less on repairs",
    text: "No engine oil, no spark plugs, no clutch, no gearbox. Fewer moving parts means fewer breakdowns and less time in the workshop.",
  },
  {
    title: "Earn more every day",
    text: "A bike that costs less to run and spends less time off the road means more trips and more income.",
  },
  {
    title: "Smooth, quiet, comfortable",
    text: "No engine vibration and no noise. Long hours in the saddle are easier on the body.",
  },
  {
    title: "Power when you need it",
    text: "Instant acceleration in traffic, on hills and with a passenger. No gear shifting.",
  },
  {
    title: "Built for heavy use",
    text: "Reinforced frame, tuned suspension and a load capacity of up to 300 kg.",
  },
  {
    title: "Safe and secure",
    text: "GPS tracking helps prevent loss and theft. Bright LED lighting keeps you visible on the road.",
  },
  {
    title: "Good for Ghana",
    text: "Zero tailpipe emissions mean cleaner air in Accra, Kumasi, Takoradi, Tamale and every city we serve.",
  },
];

export const GLANCE = [
  { value: 100, unit: "km", label: "Range per battery swap" },
  { value: 90, unit: "km/h", label: "Top speed" },
  { value: 12, unit: "kW", label: "Peak power" },
  { value: 300, unit: "kg", label: "Load capacity" },
];

export const HOW_IT_WORKS = [
  { title: "Choose your bike", text: "Pick your colour and ownership option." },
  { title: "Ride", text: "Use the app to track your battery, bike and nearby swap points." },
  { title: "Swap and go", text: "When the battery runs low, swap it for a fully charged one in minutes instead of waiting hours to charge." },
];

export const WAYS_TO_OWN = [
  { title: "Lease to own", text: "Start riding without a large upfront payment. Small, manageable instalments, subject to approval by our financing partners." },
  { title: "Pay upfront", text: "Own it outright from day one. Price on request — talk to an advisor for today's figure." },
  { title: "Fleet purchase", text: "Special terms, volume pricing and dedicated support for businesses." },
];

/* Placeholder rider stories — replace with real Ghanaian testimonials once first customers have ridden (brief §8). */
export const TESTIMONIALS = [
  {
    name: "Kofi A.",
    role: "Delivery rider, Accra",
    quote: "I used to spend a big part of the morning on petrol before I earned anything. Now that money stays in my pocket.",
  },
  {
    name: "Ama S.",
    role: "Courier business owner, Kumasi",
    quote: "Quiet, smooth and cheap to run. My riders are on the road more hours and the workshop sees them less.",
  },
  {
    name: "Yaw M.",
    role: "Owner-operator, Tema",
    quote: "With 100 km on one battery I do more trips a day. The hills and traffic are no problem at all.",
  },
];

export const EKON_SPECS: [string, string][] = [
  ["Range", "Up to 100 km per battery swap"],
  ["Top speed", "90 km/h"],
  ["Peak power", "12 kW"],
  ["Load capacity", "300 kg"],
  ["Ride modes", "Eco (maximum range), Normal (everyday), Sport (more power)"],
  ["Charging", "Battery-swap system; charging slot in front storage"],
  ["Lighting and display", "High-visibility LED lighting; modern LED display"],
  ["Tracking", "GPS and companion app"],
  ["Warranty", "Up to 2 years or 30,000 km depending on the component*"],
  ["Colours", "Green, Black, Yellow, Red, Blue"],
];

export const EKON_FEATURES = [
  { title: "Built for rough roads and heavy loads", text: "Handles bad roads, heavy loads and long hours. Designed and tested on real routes." },
  { title: "Lower daily running cost", text: "No fuel. No oil changes. Fewer parts to replace." },
  { title: "Instant power when needed", text: "Quick pickup in traffic, on hills and with a passenger." },
  { title: "Strong electric performance", text: "Confident acceleration in traffic and smooth control at low speeds." },
  { title: "Reinforced frame", text: "Balanced geometry for stability at speed." },
  { title: "Tuned suspension", text: "Better control on uneven roads and potholes." },
  { title: "Three ride modes", text: "Eco for the longest range, Normal for daily riding, Sport when you need more power." },
  { title: "High-visibility LED lighting", text: "A strong road presence, day and night." },
  { title: "Balanced riding posture", text: "Comfortable seat height and ergonomic positioning for long hours." },
  { title: "Large front storage with charging slot", text: "Carry essentials securely and charge your phone on the go." },
  { title: "Rear and side mounting options", text: "Flexible mounting for delivery boxes and bags." },
  { title: "Companion app", text: "Track your bike, check battery level, find swap stations and get support alerts." },
];

export const WHY_ELECTRIC = [
  { title: "The money argument", text: "Petrol is a daily expense you cannot avoid and cannot control. Electricity from a swap is cheaper per kilometre and more stable. Use the calculator to see your own numbers." },
  { title: "The maintenance argument", text: "A petrol motorcycle has an engine with hundreds of moving parts. An electric motor has very few. That means fewer repairs, fewer surprises and more days working." },
  { title: "The income argument", text: "A rider who spends less on running costs and loses less time to breakdowns keeps more of every cedi earned. One Spiro rider put it simply: with 100 km on a single battery, he can do more trips and earn more." },
  { title: "The comfort argument", text: "No vibration and no engine roar. Riders report that long days feel easier, and that it is a better experience for passengers and women riders." },
  { title: "The reliability argument", text: "A reinforced frame and tuned suspension, designed and tested for African conditions." },
  { title: "The security argument", text: "GPS tracking and in-app monitoring help protect your bike and your livelihood." },
  { title: "The planet and health argument", text: "No exhaust fumes in crowded streets. Cleaner air for riders, passengers and neighbourhoods." },
  { title: "The future-proof argument", text: "Fuel prices and regulation are moving in one direction. Owning an electric bike now puts you ahead of the change." },
];

/* Spiro company figures — subject to written confirmation from Spiro before launch (brief §8). */
export const SPIRO_SCALE = [
  { value: "80,000+", label: "bikes running daily across cities*" },
  { value: "9", label: "countries of operation*" },
  { value: "TIME100", label: "Most Influential Companies, 2024*" },
];

export const SWAP_STEPS = [
  { title: "Swap", text: "Pull into a swap point and exchange your battery." },
  { title: "Pay", text: "Pay for the energy you use." },
  { title: "Ride", text: "Back on the road with a full battery." },
];

export const SWAP_WHY = [
  "No downtime waiting for a battery to charge.",
  "No need for home charging infrastructure.",
  "Battery health is managed professionally.",
  "Locate the nearest swap point in the app.",
];

export const OWNERSHIP_DOCS = [
  "Ghana Card",
  "Driver's licence",
  "Proof of address",
  "Guarantor (for lease-to-own)",
];

export const FLEET_BENEFITS = [
  "Lower and predictable cost per kilometre.",
  "GPS tracking and app visibility for every bike.",
  "Less downtime and lower maintenance bills.",
  "Cargo-ready mounting for delivery boxes and bags.",
  "Cleaner brand image and a clear ESG story.",
  "Volume pricing, financing and dedicated account support.",
];

export const FLEET_AUDIENCE = [
  "Food and parcel delivery",
  "Courier and logistics firms",
  "Banks and microfinance field officers",
  "Utilities",
  "NGOs",
  "Schools and campuses",
  "Estates and security companies",
  "Government agencies",
];

export const SERVICE_ITEMS = [
  { title: "Authorised service", text: "Ghana service centre locations will be listed here at launch. Accra first, then Kumasi and Takoradi." },
  { title: "Genuine spare parts", text: "Authorised components available at our service centres." },
  { title: "In-app support", text: "Report an issue and follow its resolution from the app." },
  { title: "Warranty", text: "Up to 2 years on key components (motor, controller, frame and other key parts) depending on part and mileage, up to 30,000 km. Terms, mileage limits and exclusions apply." },
  { title: "Insurance support", text: "We are confirming Ghanaian insurance partners for riders and fleets." },
  { title: "Theft protection", text: "GPS tracking via the app helps protect your bike and your livelihood." },
];

export const ABOUT_PROMISE = [
  "Genuine Spiro motorcycles with full manufacturer backing.",
  "Honest advice and transparent pricing.",
  "Fast after-sales service and genuine parts.",
  "A partner who stays with you after the sale.",
];

export const FAQS: [string, string][] = [
  ["What is the Ekon 450 M1?", "It is Spiro's electric motorcycle designed for African roads and commercial use, with up to 100 km range per swap, 90 km/h top speed and 300 kg load capacity."],
  ["How far can it go on one battery?", "Up to 100 km per swap under standard test conditions. Real range depends on load, speed, terrain and ride mode. Eco mode gives the longest range."],
  ["How do I charge it?", "You do not wait for charging. You swap your battery for a charged one at a swap point in minutes."],
  ["Is it cheaper than a petrol motorcycle?", "For riders who ride every day, running costs are much lower because you do not buy petrol or engine oil and have fewer parts to repair. Use our calculator to estimate your own savings. Actual savings vary by route, usage and financing path."],
  ["Can it carry passengers and cargo?", "Yes. It is designed for passenger and delivery use, with a load capacity of up to 300 kg and rear and side mounting options."],
  ["Can it handle bad roads and rain?", "It is built with a reinforced frame and tuned suspension and tested on real African routes."],
  ["What does the warranty cover?", "Up to 2 years or 30,000 km, depending on the component, covering key parts such as the motor, controller and frame. Terms and exclusions apply."],
  ["Can I buy on instalments?", "Yes. Lease-to-own options are available, subject to approval by our financing partners. No large upfront payment is required."],
  ["Where do I service the bike?", "At Future Ride authorised service centres in Ghana. You can also report issues and track them in the Spiro app."],
  ["Are spare parts available?", "Yes, genuine spare parts are stocked at authorised service centres."],
  ["What if the bike is stolen?", "The bike has GPS tracking through the app. Insurance support is available."],
  ["Do I need a special licence?", "Electric motorcycles are registered and ridden like other motorcycles in Ghana. Our advisors will walk you through licence and registration requirements."],
  ["Is it good for the environment?", "Yes. Electric motorcycles produce zero tailpipe emissions and are quiet, which means cleaner air and less noise."],
  ["Can my company buy a fleet?", "Yes. We offer fleet pricing, financing and dedicated support. See the Fleet & Business page."],
  ["Can I try before I buy?", "Yes. Book a test ride and see for yourself."],
];

/** Savings-calculator defaults (GH₵). Confirm constants with Spiro before launch (brief §5). */
export const CALC = {
  petrolPriceDefault: 12.0, // GH₵ per litre — update regularly
  kmPerLitreDefault: 35,
  daysPerMonthDefault: 26,
  maintenanceDefault: 100, // current monthly maintenance spend, GH₵
  evCostPerKm: 0.45, // PLACEHOLDER swap energy cost per km, GH₵
  evMaintenancePerMonth: 40, // PLACEHOLDER, GH₵
};
