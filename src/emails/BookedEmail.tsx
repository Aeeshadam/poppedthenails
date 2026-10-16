import { addressLines } from "@/lib/address";
import { formatDayLong, formatTime } from "@/lib/dates";
import { formatPounds } from "@/lib/money";
import { Action, Details, Divider, Layout, Paragraph, Title } from "./Layout";

export type BookedEmailProps = {
  siteUrl: string;
  name: string;
  serviceName: string;
  startsAt: string;
  durationMin: number;
  address: string;
  leftToPayPounds: number;
  depositPolicy: string;
  bookingUrl: string;
};

/** Email 4, to the client, with the calendar file attached. */
export function BookedEmail(p: BookedEmailProps) {
  return (
    <Layout preview={`You're booked for ${formatDayLong(p.startsAt)}`} siteUrl={p.siteUrl}>
      <Title>You&rsquo;re booked!</Title>
      <Paragraph>Hi {p.name}, your deposit has landed and your slot is confirmed. See you soon.</Paragraph>
      <Details
        rows={[
          ["Service", `${p.serviceName} (${p.durationMin} min)`],
          ["When", `${formatDayLong(p.startsAt)}, ${formatTime(p.startsAt)}`],
          ["Where", addressLines(p.address).join(", ")],
          ["Left to pay on the day", formatPounds(p.leftToPayPounds)],
        ]}
      />
      <Paragraph>The calendar file attached adds it to your calendar.</Paragraph>
      <Action href={p.bookingUrl}>View your booking</Action>
      <Divider />
      <Paragraph>{p.depositPolicy}</Paragraph>
    </Layout>
  );
}
