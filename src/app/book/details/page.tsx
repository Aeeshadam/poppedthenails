import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { DetailsForm } from "@/components/booking/DetailsForm";
import { Card } from "@/components/Card";
import { TextLink } from "@/components/TextLink";
import { formatDayLong, formatTime } from "@/lib/dates";
import { findActiveService } from "@/lib/dummy";
import { buildDummyData, openSlots } from "@/lib/dummy-bookings";
import { firstParam } from "@/lib/params";
import { requestTime } from "@/lib/request-time";

export const metadata: Metadata = { title: "Your details · poppedthenail" };

export default async function DetailsPage({ searchParams }: PageProps<"/book/details">) {
  const params = await searchParams;
  const service = findActiveService(firstParam(params.service));
  if (!service) redirect("/book");

  const now = await requestTime();
  const slotId = firstParam(params.slot);
  const slot = openSlots(buildDummyData(now), now).find((s) => s.id === slotId);
  const timeHref = `/book/time?service=${service.id}`;
  if (!slot) redirect(timeHref);
  const editHref = `${timeHref}&slot=${encodeURIComponent(slot.id)}`;

  return (
    <>
      <BookingSteps step={3} backHref={editHref} />
      <h1 className="mt-8 font-serif text-title">Your details</h1>

      <Card className="mt-5 flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[17px] font-semibold">{service.name}</p>
          <p className="mt-1 text-muted">
            {formatDayLong(slot.starts_at)} · {formatTime(slot.starts_at)}
          </p>
          <p className="mt-1 text-muted">{service.duration_min} min</p>
        </div>
        <TextLink href={editHref} aria-label="Edit date and time" className="-mt-2.5">
          Edit
        </TextLink>
      </Card>

      <DetailsForm
        serviceId={service.id}
        slotId={slot.id}
        pricePounds={service.price_pounds}
        depositPounds={service.deposit_pounds}
      />
    </>
  );
}
