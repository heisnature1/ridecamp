import PageHero from "../components/PageHero";
import Calculator from "../components/Calculator";

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        kicker="Savings calculator"
        title="See how much you could save."
        sub="Petrol is a daily cost you cannot control. Your Ekon running cost is low and predictable. Put in your own numbers and see the difference in cedis."
      />
      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Calculator />
        </div>
      </section>
    </>
  );
}
