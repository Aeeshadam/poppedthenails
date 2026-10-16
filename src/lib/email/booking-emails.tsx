import "server-only";
import { addressOneLine } from "@/lib/address";
import { buildIcs } from "@/lib/calendar";
import { getBookingById, getBookingByToken } from "@/lib/data/bookings";
import { getBankDetails, getPublicSettings } from "@/lib/data/settings";
import type { Booking } from "@/lib/types";
import { BookedEmail } from "@/emails/BookedEmail";
import { CancelledEmail } from "@/emails/CancelledEmail";
import { ClientPaidEmail } from "@/emails/ClientPaidEmail";
import { DepositEmail } from "@/emails/DepositEmail";
import { NewBookingEmail } from "@/emails/NewBookingEmail";
import { ReleasedEmail } from "@/emails/ReleasedEmail";
import { sendEmail } from "./send";

const siteUrl = () => process.env.SITE_URL ?? "http://localhost:3000";
const adminEmail = () => process.env.ADMIN_EMAIL ?? "";
const bookingUrl = (b: Booking) => `${siteUrl()}/booking/${b.token}`;

/** Runs an email job, logging instead of throwing, so the caller's action always succeeds. */
async function quietly(job: () => Promise<unknown>): Promise<void> {
  try {
    await job();
  } catch (error) {
    console.error("Email job failed:", error);
  }
}

/** Emails 1 and 2, after a booking is made. */
export function sendBookingCreatedEmails(token: string) {
  return quietly(async () => {
    const [b, bank] = await Promise.all([getBookingByToken(token), getBankDetails()]);
    if (!b) return;
    await Promise.all([
      sendEmail({
        to: b.client_email,
        subject: `Send your deposit · ${b.reference}`,
        react: (
          <DepositEmail
            siteUrl={siteUrl()}
            name={b.client_name}
            reference={b.reference}
            serviceName={b.service_name}
            startsAt={b.starts_at}
            depositPounds={b.deposit_pounds}
            holdHours={bank.hold_hours}
            bank={{
              accountName: bank.bank_account_name,
              sortCode: bank.bank_sort_code,
              accountNumber: bank.bank_account_number,
            }}
            bookingUrl={bookingUrl(b)}
          />
        ),
      }),
      sendEmail({
        to: adminEmail(),
        subject: `New booking: ${b.client_name} · ${b.reference}`,
        react: (
          <NewBookingEmail
            siteUrl={siteUrl()}
            clientName={b.client_name}
            reference={b.reference}
            serviceName={b.service_name}
            startsAt={b.starts_at}
          />
        ),
      }),
    ]);
  });
}

/** Email 3, when the client presses "I've sent it". */
export function sendClientPaidEmail(token: string) {
  return quietly(async () => {
    const b = await getBookingByToken(token);
    if (!b) return;
    await sendEmail({
      to: adminEmail(),
      subject: `${b.client_name} says they've paid · ${b.reference}`,
      react: <ClientPaidEmail siteUrl={siteUrl()} clientName={b.client_name} reference={b.reference} />,
    });
  });
}

/** Email 4, when she marks the deposit paid, with the calendar file. */
export function sendBookedEmail(id: string) {
  return quietly(async () => {
    const [b, settings] = await Promise.all([getBookingById(id), getPublicSettings()]);
    if (!b) return;
    const ics = buildIcs({
      uid: b.id,
      start: new Date(b.starts_at),
      durationMin: b.duration_min,
      title: `${b.service_name} at poppedthenail`,
      location: addressOneLine(settings.address),
      description: `Booking ${b.reference}. ${bookingUrl(b)}`,
    });
    await sendEmail({
      to: b.client_email,
      subject: `You're booked · ${b.reference}`,
      react: (
        <BookedEmail
          siteUrl={siteUrl()}
          name={b.client_name}
          serviceName={b.service_name}
          startsAt={b.starts_at}
          durationMin={b.duration_min}
          address={settings.address}
          leftToPayPounds={b.price_pounds - b.deposit_pounds}
          depositPolicy={settings.deposit_policy}
          bookingUrl={bookingUrl(b)}
        />
      ),
      attachments: [{ filename: "poppedthenail.ics", content: ics }],
    });
  });
}

/** Email 5, when an unpaid hold runs out. Called by the sweep (step 9). */
export function sendReleasedEmail(b: Pick<Booking, "client_email" | "client_name" | "service_name" | "starts_at" | "reference">) {
  return quietly(() =>
    sendEmail({
      to: b.client_email,
      subject: `Your slot was released · ${b.reference}`,
      react: <ReleasedEmail siteUrl={siteUrl()} name={b.client_name} serviceName={b.service_name} startsAt={b.starts_at} />,
    }),
  );
}

/** Email 6, when she cancels. */
export function sendCancelledEmail(id: string) {
  return quietly(async () => {
    const b = await getBookingById(id);
    if (!b) return;
    await sendEmail({
      to: b.client_email,
      subject: `Booking cancelled · ${b.reference}`,
      react: <CancelledEmail siteUrl={siteUrl()} name={b.client_name} serviceName={b.service_name} startsAt={b.starts_at} />,
    });
  });
}
