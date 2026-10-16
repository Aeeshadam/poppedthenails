import { formatDayLong, formatTime } from "@/lib/dates";
import { Action, Details, Layout, Paragraph, Title } from "./Layout";

export type NewBookingEmailProps = {
  siteUrl: string;
  clientName: string;
  reference: string;
  serviceName: string;
  startsAt: string;
};

/** Email 2, to her. */
export function NewBookingEmail(p: NewBookingEmailProps) {
  return (
    <Layout preview={`New booking from ${p.clientName}`} siteUrl={p.siteUrl}>
      <Title>New booking</Title>
      <Paragraph>{p.clientName} has booked and been asked for the deposit.</Paragraph>
      <Details
        rows={[
          ["Client", p.clientName],
          ["Service", p.serviceName],
          ["When", `${formatDayLong(p.startsAt)}, ${formatTime(p.startsAt)}`],
          ["Reference", p.reference],
        ]}
      />
      <Action href={`${p.siteUrl}/admin`}>Open bookings</Action>
    </Layout>
  );
}
