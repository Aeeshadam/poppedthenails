import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

// The design tokens, written out because email apps ignore CSS variables.
export const colors = {
  background: "#faf7ff",
  surface: "#ffffff",
  ink: "#2e1f47",
  muted: "#6a5a85",
  accent: "#7c4dcc",
  lilac: "#dcc6f5",
  line: "#e6daf5",
};

const font = "'DM Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Logo and a white card. */
export function Layout({ preview, siteUrl, children }: { preview: string; siteUrl: string; children: ReactNode }) {
  return (
    <Html lang="en-GB">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.background, fontFamily: font, color: colors.ink, margin: 0, padding: "24px 0" }}>
        <Container style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
          <Img src={`${siteUrl}/logo.png`} alt="poppedthenail" width={96} style={{ margin: "8px 0 20px" }} />
          <Section style={{ backgroundColor: colors.surface, borderRadius: 24, padding: "28px 24px" }}>{children}</Section>
        </Container>
      </Body>
    </Html>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <Text style={{ fontFamily: "Georgia, serif", fontSize: 26, lineHeight: "32px", margin: "0 0 12px", color: colors.ink }}>
      {children}
    </Text>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 14px", color: colors.muted }}>{children}</Text>;
}

/** A label-and-value list, e.g. Service: Gel manicure. */
export function Details({ rows }: { rows: [label: string, value: string][] }) {
  return (
    <Section style={{ margin: "8px 0 16px" }}>
      {rows.map(([label, value]) => (
        <Text key={label} style={{ margin: "0 0 8px", fontSize: 15, lineHeight: "22px" }}>
          <span style={{ color: colors.muted }}>{label}</span>
          <br />
          <strong style={{ color: colors.ink, fontSize: 17 }}>{value}</strong>
        </Text>
      ))}
    </Section>
  );
}

export function Action({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: colors.accent,
        color: "#ffffff",
        borderRadius: 999,
        padding: "14px 28px",
        fontSize: 15,
        fontWeight: 600,
        display: "inline-block",
        margin: "8px 0 4px",
      }}
    >
      {children}
    </Button>
  );
}

export function Divider() {
  return <Hr style={{ borderColor: colors.line, margin: "16px 0" }} />;
}
