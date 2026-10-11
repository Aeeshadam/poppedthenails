import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { hasFinished, type BoardBooking } from "@/lib/admin-board";
import { formatTime } from "@/lib/dates";
import { formatPounds } from "@/lib/money";
import { ClientContact } from "./ClientContact";

type TodayCardProps = {
  booking: BoardBooking;
  now: Date;
  /** True while a change is being saved. */
  busy?: boolean;
  onCompleted: () => void;
  onNoShow: () => void;
};

function StatusBadge({ booking: b }: { booking: BoardBooking }) {
  if (b.status === "completed") return <Badge tone="lilac">Done</Badge>;
  if (b.status === "no_show") return <Badge tone="warning">No-show</Badge>;
  return <Badge tone="success">Paid {formatPounds(b.deposit_pounds)}</Badge>;
}

export function TodayCard({ booking: b, now, busy, onCompleted, onNoShow }: TodayCardProps) {
  return (
    <li>
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 shrink-0">
            <p className="text-xl font-semibold">{formatTime(b.starts_at)}</p>
            <p className="text-sm text-muted">{b.duration_min}m</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold">{b.client_name}</p>
            <p className="text-[15px] text-muted">
              {b.service_name}
              {b.notes && <> · &ldquo;{b.notes}&rdquo;</>}
            </p>
            <ClientContact phone={b.client_phone} email={b.client_email} />
          </div>
          <StatusBadge booking={b} />
        </div>
        {b.status === "confirmed" && hasFinished(b, now) && (
          <div className="mt-4 flex gap-3">
            <Button size="md" variant="secondary" className="flex-1" onClick={onCompleted} disabled={busy}>
              Completed
            </Button>
            <Button size="md" variant="secondary" className="flex-1" onClick={onNoShow} disabled={busy}>
              No-show
            </Button>
          </div>
        )}
      </Card>
    </li>
  );
}
