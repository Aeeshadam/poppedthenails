import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { TextLink } from "@/components/TextLink";
import { getActiveService } from "@/lib/data/services";
import { getPublicSettings } from "@/lib/data/settings";
import { getOpenSlots } from "@/lib/data/slots";
import { londonDateKey } from "@/lib/dates";
import { firstParam } from "@/lib/params";
import { requestTime } from "@/lib/request-time";

export const metadata: Metadata = { title: "Pick a date & time · poppedthenail" };

export default async function PickTimePage({ searchParams }: PageProps<"/book/time">) {
  const now = await requestTime();
  const { service: serviceId, slot, gone } = await searchParams;
  const service = await getActiveService(firstParam(serviceId));
  if (!service) redirect("/book");

  const { min_notice_hours } = await getPublicSettings();
  const slots = await getOpenSlots(now, min_notice_hours);
  const serviceLabel = `${service.name} · ${service.duration_min} min`;

  return (
    <>
      <BookingSteps step={2} backHref={`/book?service=${service.id}`} />
      <h1 className="mt-8 font-serif text-title">Pick a date &amp; time</h1>

      {gone && (
        <p role="alert" className="mt-5 rounded-card bg-warning-bg p-4 text-warning">
          Sorry, that time has just gone. Please pick another.
        </p>
      )}

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
