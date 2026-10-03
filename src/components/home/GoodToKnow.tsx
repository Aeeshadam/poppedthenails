import { Card } from "@/components/Card";
import { formatPounds } from "@/lib/money";

export function GoodToKnow({ depositPounds }: { depositPounds: number }) {
  return (
    <Card variant="outline" className="p-7">
      <h2 className="font-serif text-[22px]">Good to know</h2>
      <ul className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted">
        <li>
          A {formatPounds(depositPounds)} deposit by bank transfer secures your slot and comes
          off your total on the day.
        </li>
        <li>Your deposit is non-refundable if you cancel.</li>
        <li>Please arrive with bare nails unless you&rsquo;ve booked a removal.</li>
      </ul>
    </Card>
  );
}
