import type { Metadata } from "next";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { EmptyState } from "@/components/EmptyState";
import { ServicePicker } from "@/components/booking/ServicePicker";
import { activeServices, depositPounds, findActiveService } from "@/lib/dummy";
import { formatPounds } from "@/lib/money";
import { firstParam } from "@/lib/params";

export const metadata: Metadata = { title: "Choose a service · poppedthenail" };

export default async function ChooseServicePage({ searchParams }: PageProps<"/book">) {
  const { service } = await searchParams;
  const initial = findActiveService(firstParam(service));

  return (
    <>
      <BookingSteps step={1} backHref="/" />
      <h1 className="mt-8 font-serif text-title">Choose a service</h1>
      <p className="mt-2 leading-relaxed text-muted">
        {formatPounds(depositPounds)} deposit by bank transfer · the rest is paid in the
        studio.
      </p>

      {activeServices.length === 0 ? (
        <EmptyState className="mt-8">
          No services are open for booking right now. Please check back soon.
        </EmptyState>
      ) : (
        <ServicePicker services={activeServices} initialServiceId={initial?.id} />
      )}
    </>
  );
}
