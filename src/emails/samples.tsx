import { BookedEmail } from "./BookedEmail";
import { CancelledEmail } from "./CancelledEmail";
import { ClientPaidEmail } from "./ClientPaidEmail";
import { DepositEmail } from "./DepositEmail";
import { NewBookingEmail } from "./NewBookingEmail";
import { ReleasedEmail } from "./ReleasedEmail";

/** Every email with made-up details, for the preview page and the tests. */
export function sampleEmails(siteUrl: string) {
  const client = { siteUrl, name: "Amara", serviceName: "BIAB overlay", startsAt: "2026-10-23T16:30:00Z" };
  const bookingUrl = `${siteUrl}/booking/sample`;
  return [
    {
      title: "1 · Send your deposit",
      email: (
        <DepositEmail
          {...client}
          reference="POP-1001"
          depositPounds={5}
          holdHours={2}
          bank={{ accountName: "M Example", sortCode: "00-00-00", accountNumber: "12345678" }}
          bookingUrl={bookingUrl}
        />
      ),
    },
    {
      title: "2 · New booking",
      email: <NewBookingEmail {...client} clientName="Amara" reference="POP-1001" />,
    },
    {
      title: "3 · Client says they've paid",
      email: <ClientPaidEmail siteUrl={siteUrl} clientName="Amara" reference="POP-1001" />,
    },
    {
      title: "4 · You're booked",
      email: (
        <BookedEmail
          {...client}
          durationMin={60}
          address={"12 Sample Street\nManchester M1 1AA"}
          leftToPayPounds={30}
          depositPolicy="Your £5 deposit is non-refundable if you cancel."
          bookingUrl={bookingUrl}
        />
      ),
    },
    { title: "5 · Your slot was released", email: <ReleasedEmail {...client} /> },
    { title: "6 · Booking cancelled", email: <CancelledEmail {...client} /> },
  ];
}
