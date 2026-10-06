import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { TextLink } from "@/components/TextLink";
import { buildDummyData, openSlots } from "@/lib/dummy-bookings";
import { londonDateKey } from "@/lib/dates";
import { findActiveService } from "@/lib/dummy";
import { firstParam } from "@/lib/params";
import { requestTime } from "@/lib/request-time";

export const metadata: Metadata = { title: "Pick a date & time · poppedthenail" };

export default async function PickTimePage({ searchParams }: PageProps<"/book/time">) {
  const { service: serviceId, slot } = await searchParams;
  const service = findActiveService(firstParam(serviceId));
  if (!service) redirect("/book");

  const now = await requestTime();
  const slots = openSlots(buildDummyData(now), now);
  const serviceLabel = `${service.name} · ${service.duration_min} min`;

  return (
    <>
      <BookingSteps step={2} backHref={`/book?service=${service.id}`} />
      <h1 className="mt-8 font-serif text-title">Pick a date &amp; time</h1>

      <div className="mt-5 flex min-h-14 items-center justify-between gap-4 rounded-full border border-line bg-surface pl-6 pr-4">
        <p className="truncate">{serviceLabel}</p>
        <TextLink href={`/book?service=${service.id}`} aria-label={`Change service (${service.name})`}>
          Change
        </TextLink>
      </div>

      <DateTimePicker
        serviceId={service.id}
        serviceLabel={serviceLabel}
        slots={slots}
        initialSlotId={firstParam(slot)}
        today={londonDateKey(now)}
      />
    </>
  );
}
