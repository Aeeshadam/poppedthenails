import { ButtonLink } from "@/components/Button";
import { TextLink } from "@/components/TextLink";
import { INSTAGRAM_URL } from "@/lib/content";
import { formatDayShort, formatTime } from "@/lib/dates";
import type { BookingStatus } from "@/lib/types";

type ClosedStatus = Exclude<BookingStatus, "pending_deposit" | "confirmed">;

type BookingClosedViewProps = {
  status: ClosedStatus;
  serviceName: string;
  startsAt: string;
  holdHours: number;
};

function copyFor(status: ClosedStatus, holdHours: number) {
  switch (status) {
    case "expired":
      return {
        title: "Your slot was released",
        body: `The deposit didn't arrive within ${holdHours} hours, so the time went back on the calendar. You're welcome to book again.`,
      };
    case "cancelled":
      return { title: "This booking was cancelled", body: "If you weren't expecting this, please get in touch." };
    case "completed":
      return { title: "Thanks for coming in", body: "This appointment has been and gone. Hope you love your nails!" };
    case "no_show":
      return { title: "This appointment has passed", body: "If you'd like another slot, you're welcome to book again." };
  }
}

export function BookingClosedView({ status, serviceName, startsAt, holdHours }: BookingClosedViewProps) {
  const { title, body } = copyFor(status, holdHours);

  return (
    <div className="text-center">
      <h1 className="font-serif text-title">{title}</h1>
      <p className="mt-2 text-muted">
        {serviceName}, {formatDayShort(startsAt)} {formatTime(startsAt)}
      </p>
      <p className="mt-5 leading-relaxed text-muted">{body}</p>
      <ButtonLink href="/book" className="mt-8 w-full">
        Book again
      </ButtonLink>
      {status === "cancelled" && (
        <TextLink href={INSTAGRAM_URL} className="mt-3">
          Message us on Instagram
        </TextLink>
      )}
    </div>
  );
}
