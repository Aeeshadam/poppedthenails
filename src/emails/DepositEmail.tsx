import { formatDayLong, formatTime } from "@/lib/dates";
import { formatPounds } from "@/lib/money";
import { Action, Details, Divider, Layout, Paragraph, Title } from "./Layout";

export type DepositEmailProps = {
  siteUrl: string;
  name: string;
  reference: string;
  serviceName: string;
  startsAt: string;
  depositPounds: number;
  holdHours: number;
  bank: { accountName: string; sortCode: string; accountNumber: string };
  bookingUrl: string;
};

/** Email 1, to the client. The only email with bank details. */
export function DepositEmail(p: DepositEmailProps) {
  const amount = formatPounds(p.depositPounds, { pence: true });
  return (
    <Layout preview={`Send your ${amount} deposit to confirm your slot`} siteUrl={p.siteUrl}>
      <Title>Send your {formatPounds(p.depositPounds)} deposit</Title>
      <Paragraph>
        Hi {p.name}, your slot is saved for {p.holdHours} hours. Pop the deposit over by bank transfer to confirm it.
      </Paragraph>
      <Details
        rows={[
          ["Service", p.serviceName],
          ["When", `${formatDayLong(p.startsAt)}, ${formatTime(p.startsAt)}`],
        ]}
      />
      <Divider />
      <Details
        rows={[
          ["Amount", amount],
          ["Account name", p.bank.accountName],
          ["Sort code", p.bank.sortCode],
          ["Account number", p.bank.accountNumber],
          ["Reference", p.reference],
        ]}
      />
      <Paragraph>Please use the reference so we can match your payment. If it doesn&rsquo;t arrive in time, the slot is released.</Paragraph>
      <Action href={p.bookingUrl}>View your booking</Action>
    </Layout>
  );
}
