import type { Metadata } from "next";
import { connection } from "next/server";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { ServicePicker } from "@/components/booking/ServicePicker";
import { EmptyState } from "@/components/EmptyState";
import { quotedDeposit } from "@/lib/booking-rules";
import { getActiveServices } from "@/lib/data/services";
import { formatPounds } from "@/lib/money";
import { firstParam } from "@/lib/params";

export const metadata: Metadata = { title: "Choose a service · poppedthenail" };

export default async function ChooseServicePage({ searchParams }: PageProps<"/book">) {
  await connection();
  const { service } = await searchParams;
  const services = await getActiveServices();
  const initial = services.find((s) => s.id === firstParam(service));

  return (
    <>
      <BookingSteps step={1} backHref="/" />
      <h1 className="mt-8 font-serif text-title">Choose a service</h1>
      <p className="mt-2 leading-relaxed text-muted">
        {formatPounds(quotedDeposit(services))} deposit by bank transfer · the rest is paid in the studio.
      </p>

      {services.length === 0 ? (
        <EmptyState className="mt-8">No services are open for booking right now. Please check back soon.</EmptyState>
      ) : (
        <ServicePicker services={services} initialServiceId={initial?.id} />
      )}
    </>
  );
}
