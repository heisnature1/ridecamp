import PageHero from "../components/PageHero";

export function Privacy() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy Policy."
        sub="Short version: we collect only what we need to call you back, and we never sell your data."
      />
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-3xl space-y-5 px-4 text-sm leading-relaxed text-slate md:px-8">
          <p>
            Future Ride collects the details you enter in our forms — name, phone number, city and
            your interest in our products — solely to respond to your request and to arrange test
            rides, quotes, financing and fleet proposals.
          </p>
          <p>
            Form submissions are delivered to our sales team by email and WhatsApp. We do not sell,
            rent or share your personal information with third parties except where required to
            process a financing application you have requested.
          </p>
          <p>
            We use basic, privacy-respecting analytics to understand which pages help riders most.
            You may ask us at any time to correct or delete your details by emailing us or sending
            a WhatsApp message.
          </p>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Terms of Use."
        sub="The plain-English rules for using this website."
      />
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-3xl space-y-5 px-4 text-sm leading-relaxed text-slate md:px-8">
          <p>
            All specifications, prices and savings figures on this website are indicative and
            tested or estimated under standard conditions. Actual range, savings and performance
            vary with load, route, riding style, terrain and maintenance.
          </p>
          <p>
            Warranty terms, financing approval and insurance options are subject to the written
            terms of Future Ride, Spiro and our financing partners. Nothing on this website is an
            offer of credit; lease-to-own plans are subject to approval.
          </p>
          <p>
            Content and branding on this site belong to Future Ride. Spiro product names and marks
            are used under our distributor relationship and remain the property of their owner.
          </p>
        </div>
      </section>
    </>
  );
}
