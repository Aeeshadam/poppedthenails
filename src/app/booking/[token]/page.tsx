import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingClosedView } from "@/components/booking/BookingClosedView";
import { ConfirmedView } from "@/components/booking/ConfirmedView";
import { DepositView } from "@/components/booking/DepositView";
import { settings } from "@/lib/dummy";
import { buildDummyData, findBookingByToken } from "@/lib/dummy-bookings";
import { firstParam } from "@/lib/params";
import { requestTime } from "@/lib/request-time";

export const metadata: Metadata = {
  title: "Your booking · poppedthenail",
  robots: { index: false },
};

/**
 * One page that changes with the booking status. Dummy tokens for now:
 * demo-pending, demo-says-paid, demo-confirmed, demo-expired, demo-cancelled.
 */
export default async function BookingPage({ params, searchParams }: PageProps<"/booking/[token]">) {
  const { token } = await params;
  const query = await searchParams;

  const now = await requestTime();
  const booking = findBookingByToken(buildDummyData(now), token, {
    serviceId: firstParam(query.service),
    slotId: firstParam(query.slot),
  });
  if (!booking) notFound();

  return (
    <main className="mx-auto w-full max-w-column flex-1 px-6 pt-14 pb-10">
      {booking.status === "pending_deposit" ? (
        // Only what the screen shows goes to the browser: no token, email or phone.
        <DepositView
          booking={{
            reference: booking.reference,
            service_name: booking.service_name,
            starts_at: booking.starts_at,
            deposit_pounds: booking.deposit_pounds,
            client_says_paid_at: booking.client_says_paid_at,
          }}
          bank={{
            bank_account_name: settings.bank_account_name,
            bank_sort_code: settings.bank_sort_code,
            bank_account_number: settings.bank_account_number,
            hold_hours: settings.hold_hours,
          }}
        />
      ) : booking.status === "confirmed" ? (
        <ConfirmedView booking={booking} address={settings.address} />
      ) : (
        <BookingClosedView
          status={booking.status}
          serviceName={booking.service_name}
          startsAt={booking.starts_at}
          holdHours={settings.hold_hours}
          instagramUrl={`https://www.instagram.com/${settings.instagram_handle}`}
        />
      )}
    </main>
  );
}
