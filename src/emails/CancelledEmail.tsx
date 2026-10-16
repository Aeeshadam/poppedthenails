import { Link } from "@react-email/components";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";
import { formatDayLong, formatTime } from "@/lib/dates";
import { colors, Layout, Paragraph, Title } from "./Layout";

export type CancelledEmailProps = {
  siteUrl: string;
  name: string;
  serviceName: string;
  startsAt: string;
};

/** Email 6, to the client, when she cancels. */
export function CancelledEmail(p: CancelledEmailProps) {
  return (
    <Layout preview="Your booking was cancelled" siteUrl={p.siteUrl}>
      <Title>Booking cancelled</Title>
      <Paragraph>
        Hi {p.name}, your {p.serviceName} on {formatDayLong(p.startsAt)} at {formatTime(p.startsAt)} has been cancelled.
      </Paragraph>
      <Paragraph>
        Questions? Reply to this email or message{" "}
        <Link href={INSTAGRAM_URL} style={{ color: colors.accent }}>
          @{INSTAGRAM_HANDLE}
        </Link>{" "}
        on Instagram.
      </Paragraph>
    </Layout>
  );
}
