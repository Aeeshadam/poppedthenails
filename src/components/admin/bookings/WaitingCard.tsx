import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Check } from "@/components/icons";
import type { BoardBooking } from "@/lib/admin-board";
import { formatDayShort, formatTime, formatTimeLeft, msUntil } from "@/lib/dates";
import { formatPounds } from "@/lib/money";

type WaitingCardProps = {
  booking: BoardBooking;
  now: Date;
  onMarkPaid: () => void;
  onCancel: () => void;
};

export function WaitingCard({ booking: b, now, onMarkPaid, onCancel }: WaitingCardProps) {
  // A client who says they've paid is held until she checks (spec), so no countdown.
  const holdNote = b.client_says_paid_at
    ? "held until you check"
    : formatTimeLeft(msUntil(b.expires_at, now));

  return (
    <li className="rounded-card border-[1.5px] border-lilac bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[17px] font-semibold">{b.client_name}</p>
        <Badge tone="warning">Awaiting {formatPounds(b.deposit_pounds)}</Badge>
      </div>
      <p className="mt-1 text-[15px] text-muted">
        {b.service_name} · {formatDayShort(b.starts_at)}, {formatTime(b.starts_at)}
      </p>
      <p className="text-[15px] text-muted">
        Ref {b.reference} · {holdNote}
      </p>
      {b.client_says_paid_at && (
        <p className="mt-2 flex items-center gap-1.5 text-[15px] font-semibold text-success">
          <Check className="size-4" /> Client says they&rsquo;ve paid
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button size="md" className="flex-1" onClick={onMarkPaid}>
          Mark as paid
        </Button>
        <Button size="md" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </li>
  );
}
