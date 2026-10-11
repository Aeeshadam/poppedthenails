import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { clientSaysPaid } from "@/app/book/actions";
import { BookingClosedView } from "@/components/booking/BookingClosedView";
import { ConfirmedView } from "@/components/booking/ConfirmedView";
import { DepositView } from "@/components/booking/DepositView";
import { getBookingByToken } from "@/lib/data/bookings";
import { getBankDetails, getPublicSettings, type PublicSettings } from "@/lib/data/settings";
import type { Booking } from "@/lib/types";

export const metadata: Metadata = {
  title: "Your booking · poppedthenail",
  robots: { index: false },
};

export default async function BookingPage({ params }: PageProps<"/booking/[token]">) {
  await connection();
  const { token } = await params;
  const [booking, settings] = await Promise.all([getBookingByToken(token), getPublicSettings()]);
  if (!booking) notFound();

  return (
    <main className="mx-auto w-full max-w-column flex-1 px-6 pt-14 pb-10">
      {await bookingView(booking, settings, token)}
    </main>
  );
}

async function bookingView(booking: Booking, settings: PublicSettings, token: string) {
  if (booking.status === "pending_deposit") {
    // Only what the screen shows goes to the browser: no email or phone. Bank
    // details are only fetched while the deposit is due.
    return (
      <DepositView
        booking={{
          reference: booking.reference,
          service_name: booking.service_name,
          starts_at: booking.starts_at,
          deposit_pounds: booking.deposit_pounds,
          client_says_paid_at: booking.client_says_paid_at,
        }}
        bank={await getBankDetails()}
        onSentIt={clientSaysPaid.bind(null, token)}
      />
    );
  }

  if (booking.status === "confirmed") {
    return <ConfirmedView booking={booking} address={settings.address} />;
  }

  return (
    <BookingClosedView
      status={booking.status}
      serviceName={booking.service_name}
      startsAt={booking.starts_at}
      holdHours={settings.hold_hours}
    />
  );
}
