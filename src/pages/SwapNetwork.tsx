import { BatteryCharging, QrCode, Timer } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import NetworkMap from "../components/NetworkMap";
import CallbackForm from "../components/CallbackForm";

const STEPS = [
  { icon: QrCode, title: "Scan", text: "Tap your rider app at the cabinet. The network recognises you and your plan." },
  { icon: BatteryCharging, title: "Swap", text: "Slide in your depleted packs, take two fresh ones. Balanced and ready to go." },
  { icon: Timer, title: "Ride", text: "Back on the road in under a minute — billed per swap, batteries always included." },
];

export default function SwapNetwork() {
  return (
    <>
      <PageHero
        kicker="Swap network"
        title="Energy, everywhere you earn."
        sub="A growing grid of battery-swap stations and service centres keeps riders rolling across seven markets."
      />

      <section className="bg-ink pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative h-full rounded-3xl border border-white/10 bg-coal p-8">
                  <span className="absolute right-6 top-6 font-display text-5xl font-bold text-moss">0{i + 1}</span>
                  <s.icon className="size-7 text-volt" />
                  <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-ash">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
              <img src="/images/swap-station.jpg" alt="Future Ride battery swap station at night" className="h-[420px] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <NetworkMap />
      <CallbackForm />
    </>
  );
}
