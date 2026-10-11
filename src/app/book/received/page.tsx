import type { Metadata } from "next";
import { TextLink } from "@/components/TextLink";

export const metadata: Metadata = { title: "Thanks · poppedthenail", robots: { index: false } };

/** Where a filled-in honeypot lands. It looks like success, so bots learn nothing. */
export default function ReceivedPage() {
  return (
    <div className="pt-14 text-center">
      <h1 className="font-serif text-title">Thanks</h1>
      <p className="mt-3 leading-relaxed text-muted">We&rsquo;ve got your request.</p>
      <TextLink href="/" className="mt-6">
        Back to home
      </TextLink>
    </div>
  );
}
