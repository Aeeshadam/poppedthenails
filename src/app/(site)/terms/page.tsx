import type { Metadata } from "next";
import { depositPounds, settings } from "@/lib/dummy";
import { formatPounds } from "@/lib/money";

export const metadata: Metadata = { title: "Terms & conditions · poppedthenail" };

export default function TermsPage() {
  const deposit = formatPounds(depositPounds);

  return (
    <article className="mx-auto w-full max-w-reading px-6 pt-10">
      <h1 className="font-serif text-title">Terms &amp; conditions</h1>
      <p className="mt-3 leading-relaxed text-muted">
        The short version of how booking works. By booking, you agree to these terms.
      </p>

      <section id="deposit" className="mt-8 scroll-mt-6">
        <h2 className="font-serif text-card-title">Deposit and cancellations</h2>
        <p className="mt-2 leading-relaxed text-muted">{settings.deposit_policy}</p>
      </section>

      <section id="holding" className="mt-8">
        <h2 className="font-serif text-card-title">Holding your slot</h2>
        <p className="mt-2 leading-relaxed text-muted">
          When you book, your slot is held for {settings.hold_hours} hours while you send the{" "}
          {deposit} deposit by bank transfer. Please use your booking reference so the payment
          can be matched. If the deposit hasn&rsquo;t arrived in time, the slot is released and
          you&rsquo;re emailed. If you&rsquo;ve told us you&rsquo;ve sent it, your slot stays held
          while the payment is checked.
        </p>
      </section>

      <section id="booking" className="mt-8">
        <h2 className="font-serif text-card-title">Booking</h2>
        <p className="mt-2 leading-relaxed text-muted">
          Appointments can be booked up to {settings.min_notice_hours} hours before they start.
          Your booking is confirmed once the deposit has landed, and you&rsquo;ll get a
          confirmation email and a reminder the day before.
        </p>
      </section>

      <section id="on-the-day" className="mt-8">
        <h2 className="font-serif text-card-title">On the day</h2>
        <p className="mt-2 leading-relaxed text-muted">
          Please arrive with bare nails unless you&rsquo;ve booked a removal. The rest of the price
          is paid in the studio.
        </p>
      </section>
    </article>
  );
}
