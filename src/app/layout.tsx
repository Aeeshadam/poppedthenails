import type { Metadata } from "next";
import { dmSans, fraunces, sacramento } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "poppedthenail",
  description: "Gel, BIAB and acrylic nails by appointment.",
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
