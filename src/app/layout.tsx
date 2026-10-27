import type { Metadata } from "next";
import { business } from "@/lib/content";
import { dmSans, fraunces, sacramento } from "./fonts";
import "./globals.css";

const description = `Gel, BIAB and acrylic nails by appointment in ${business.area}. Pick a time and book online.`;

export const metadata: Metadata = {
  // Makes the share image a full address, as social apps need.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "poppedthenail",
  description,
  openGraph: { siteName: "poppedthenail", locale: "en_GB", type: "website", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${dmSans.variable} ${sacramento.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-ink">{children}</body>
    </html>
  );
}
