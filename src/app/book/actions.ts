"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { parseBookingForm, type BookingFormErrors } from "@/lib/booking-form";
import { holdExpiresAt } from "@/lib/booking-rules";
import { countBookingsSince, insertBooking, markClientSaysPaid } from "@/lib/data/bookings";
import { getActiveService } from "@/lib/data/services";
import { getPublicSettings } from "@/lib/data/settings";
import { findBookableSlot } from "@/lib/data/slots";
import { addMinutes } from "@/lib/dates";
import { HONEYPOT } from "@/lib/honeypot";

const MAX_BOOKINGS_PER_EMAIL_PER_DAY = 3;

export type DetailsFormState = {
  errors?: BookingFormErrors;
  message?: string;
  values?: Record<string, string>;
};

export async function createBooking(_previous: DetailsFormState, formData: FormData): Promise<DetailsFormState> {
  const form: Record<string, string> = {};
  for (const [key, value] of formData) if (typeof value === "string") form[key] = value;

  // Bots fill in the hidden field. Show them a "thanks" page so they learn nothing.
  if (form[HONEYPOT]) redirect("/book/received");
  const values = { ...form };
  delete values[HONEYPOT];

  const parsed = parseBookingForm(form);
  if (!parsed.ok) {
    if (parsed.badIds) redirect("/book");
    return { values, errors: parsed.errors };
  }
  const input = parsed.data;

  const now = new Date();
  if ((await countBookingsSince(input.email, addMinutes(now, -24 * 60))) >= MAX_BOOKINGS_PER_EMAIL_PER_DAY) {
    return { values, message: "You've made several bookings today. Please message us on Instagram if you need another." };
  }

  const settings = await getPublicSettings();
  const [service, slot] = await Promise.all([
    getActiveService(input.service),
    findBookableSlot(input.slot, now, settings.min_notice_hours),
  ]);
  if (!service) redirect("/book");
  const timeGone = `/book/time?service=${service.id}&gone=1`;
  if (!slot) redirect(timeGone);

  const token = await insertBooking({
    slot_id: slot.id,
    service_id: service.id,
    // A copy of the service, so later price edits don't change this booking.
    service_name: service.name,
    price_pounds: service.price_pounds,
    deposit_pounds: service.deposit_pounds,
    duration_min: service.duration_min,
    starts_at: slot.starts_at,
    client_name: input.name,
    client_email: input.email,
    client_phone: input.phone,
    notes: input.notes,
    status: "pending_deposit",
    expires_at: holdExpiresAt(now, settings.hold_hours).toISOString(),
  });
  if (!token) redirect(timeGone);

  // TODO(step 8): send email 1 (send your deposit) to the client and email 2 (new booking) to her.
  redirect(`/booking/${token}`);
}

export async function clientSaysPaid(token: string): Promise<void> {
  await markClientSaysPaid(token, new Date());
  // TODO(step 8): send email 3 (client says they've paid) to her.
  refresh();
}
