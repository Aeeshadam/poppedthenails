import { Action, Details, Layout, Paragraph, Title } from "./Layout";

export type ClientPaidEmailProps = {
  siteUrl: string;
  clientName: string;
  reference: string;
};

/** Email 3, to her. */
export function ClientPaidEmail(p: ClientPaidEmailProps) {
  return (
    <Layout preview={`${p.clientName} says they've paid`} siteUrl={p.siteUrl}>
      <Title>Deposit sent</Title>
      <Paragraph>{p.clientName} says they&rsquo;ve sent the deposit. Check your bank, then mark it as paid.</Paragraph>
      <Details
        rows={[
          ["Client", p.clientName],
          ["Reference", p.reference],
        ]}
      />
      <Action href={`${p.siteUrl}/admin`}>Open bookings</Action>
    </Layout>
  );
}
