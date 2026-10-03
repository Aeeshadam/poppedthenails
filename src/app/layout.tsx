import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
      <body className="flex min-h-dvh flex-col bg-background font-sans text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
