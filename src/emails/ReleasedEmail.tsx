import { formatDayLong, formatTime } from "@/lib/dates";
import { Action, Layout, Paragraph, Title } from "./Layout";

export type ReleasedEmailProps = {
  siteUrl: string;
  name: string;
  serviceName: string;
  startsAt: string;
};

/** Email 5, to the client, when an unpaid hold runs out. Sent by the sweep. */
export function ReleasedEmail(p: ReleasedEmailProps) {
  return (
    <Layout preview="Your slot was released" siteUrl={p.siteUrl}>
      <Title>Your slot was released</Title>
      <Paragraph>
        Hi {p.name}, we didn&rsquo;t receive the deposit in time, so your {p.serviceName} on{" "}
        {formatDayLong(p.startsAt)} at {formatTime(p.startsAt)} has been released. You&rsquo;re welcome to book again.
      </Paragraph>
      <Action href={`${p.siteUrl}/book`}>Book again</Action>
    </Layout>
  );
}
