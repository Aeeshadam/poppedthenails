import { Card } from "@/components/Card";
import { TextLink } from "@/components/TextLink";
import { formatPounds } from "@/lib/money";

export function GoodToKnow({ depositPounds }: { depositPounds: number }) {
  return (
    <Card variant="outline" className="p-7">
      <h2 className="font-serif text-card-title">Good to know</h2>
      <ul className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted">
        <li>
          A {formatPounds(depositPounds)} deposit by bank transfer secures your slot and comes
          off your total on the day.
        </li>
        <li>Please arrive with bare nails unless you&rsquo;ve booked a removal.</li>
      </ul>
      <TextLink href="/terms" className="mt-2 text-[15px]">
        Read the full terms →
      </TextLink>
    </Card>
  );
}
