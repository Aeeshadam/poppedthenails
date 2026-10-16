import { Heart } from "@/components/Heart";
import { TextLink } from "@/components/TextLink";
import { addressOneLine } from "@/lib/address";
import { formatDayShort, formatTime } from "@/lib/dates";
import { formatPounds } from "@/lib/money";
import type { Booking } from "@/lib/types";

type ConfirmedViewProps = {
  booking: Pick<Booking, "service_name" | "starts_at" | "duration_min" | "deposit_pounds">;
  address: string;
};

export function ConfirmedView({ booking, address }: ConfirmedViewProps) {
  const rows = [
    { label: "Service", value: booking.service_name, strong: true },
    { label: "When", value: `${formatDayShort(booking.starts_at)} · ${formatTime(booking.starts_at)}`, strong: true },
    { label: "Length", value: `${booking.duration_min} min` },
    { label: "Deposit received", value: formatPounds(booking.deposit_pounds, { pence: true }) },
  ];

  return (
    <>
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent text-white">
          <Heart className="size-9" />
        </div>
        <p className="mt-4 font-script text-[40px] leading-none text-accent">yay!</p>
        <h1 className="mt-2 font-serif text-title">You&rsquo;re booked!</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Your deposit has landed and your slot is confirmed. We&rsquo;ve emailed you the details.
        </p>
      </div>

      <dl className="mt-8 rounded-card bg-surface p-5">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-1.5">
            <dt className="text-muted">{row.label}</dt>
            <dd className={`text-right ${row.strong ? "font-semibold" : ""}`}>{row.value}</dd>
          </div>
        ))}
        <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3.5">
          <dt className="text-muted">Where</dt>
          <dd className="text-right">{addressOneLine(address)}</dd>
        </div>
      </dl>

      <div className="mt-10 text-center">
        <TextLink href="/">Back to home</TextLink>
      </div>
    </>
  );
}
