"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdminEmail } from "@/lib/admin-email";
import { firstErrors, serviceFormSchema, settingsFormSchema, type FieldErrors } from "@/lib/admin-forms";
import type { AdminAction } from "@/lib/admin-board";
import { requireAdmin } from "@/lib/auth";
import { changeBookingStatus } from "@/lib/data/admin-bookings";
import { createService, setServiceActive, updateService } from "@/lib/data/admin-services";
import { saveSettings } from "@/lib/data/admin-settings";
import { addSlots, removeOpenSlot } from "@/lib/data/admin-slots";
import { createAuthClient } from "@/lib/supabase/auth";

export type FormState = { message?: string; email?: string; done?: boolean };

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export async function signIn(_previous: FormState, formData: FormData): Promise<FormState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  if (!email.success || !password) return { email: String(formData.get("email") ?? ""), message: "Enter your email and password." };

  if (!isAdminEmail(email.data, process.env.ADMIN_EMAIL)) {
    return { email: email.data, message: "Sorry, only the studio's email can sign in here." };
  }

  const { error } = await (await createAuthClient()).auth.signInWithPassword({ email: email.data, password });
  if (error) return { email: email.data, message: "That email and password don't match. Please try again." };
  redirect("/admin");
}

/** Emails a reset link, but only to the admin. The reply is the same either way. */
export async function requestPasswordReset(_previous: FormState, formData: FormData): Promise<FormState> {
  const email = emailSchema.safeParse(formData.get("email"));
  if (email.success && isAdminEmail(email.data, process.env.ADMIN_EMAIL)) {
    await (await createAuthClient()).auth.resetPasswordForEmail(email.data, {
      redirectTo: `${process.env.SITE_URL}/auth/callback?next=/admin/reset-password`,
    });
  }
  return { done: true };
}

const passwordSchema = z
  .object({
    password: z.string().min(12, "Use at least 12 characters."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "The two passwords don't match.", path: ["confirm"] });

export async function updatePassword(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = passwordSchema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message };

  const { error } = await (await createAuthClient()).auth.updateUser({ password: parsed.data.password });
  if (error) return { message: error.message };
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await (await createAuthClient()).auth.signOut();
  redirect("/admin/login");
}

async function changeBooking(id: string, action: AdminAction): Promise<boolean> {
  await requireAdmin();
  const changed = await changeBookingStatus(id, action, new Date());
  refresh();
  return changed;
}

export async function markPaid(id: string): Promise<boolean> {
  const changed = await changeBooking(id, "mark-paid");
  // TODO(step 8): if changed, send email 4 (you're booked, with the calendar file) to the client.
  return changed;
}

export async function cancelBooking(id: string): Promise<boolean> {
  const changed = await changeBooking(id, "cancel");
  // TODO(step 8): if changed, send email 6 (booking cancelled) to the client.
  return changed;
}

export async function markCompleted(id: string): Promise<boolean> {
  return changeBooking(id, "completed");
}

export async function markNoShow(id: string): Promise<boolean> {
  return changeBooking(id, "no-show");
}

export type SaveState = {
  errors?: FieldErrors;
  values?: Record<string, string>;
  /** What was saved, e.g. the service name, once it succeeds. */
  saved?: string;
};

function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) if (typeof value === "string") values[key] = value;
  return values;
}

/** Adds a service, or edits one when the form has an id. */
export async function saveService(_previous: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const values = formValues(formData);
  const parsed = serviceFormSchema.safeParse(values);
  if (!parsed.success) return { values, errors: firstErrors(parsed.error) };

  if (values.id) await updateService(values.id, parsed.data);
  else await createService(parsed.data);
  refresh();
  return { saved: parsed.data.name };
}

export async function showService(id: string, show: boolean): Promise<void> {
  await requireAdmin();
  await setServiceActive(id, show);
  refresh();
}

export async function saveSettingsForm(_previous: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const values = formValues(formData);
  const parsed = settingsFormSchema.safeParse(values);
  if (!parsed.success) return { values, errors: firstErrors(parsed.error) };

  await saveSettings(parsed.data);
  refresh();
  return { saved: "Settings" };
}

/** Adds slots at these UTC start times; ones that already exist are skipped. */
export async function addAvailability(startsAt: string[]): Promise<void> {
  await requireAdmin();
  await addSlots(startsAt.filter((s) => !Number.isNaN(Date.parse(s))));
  refresh();
}

/** Removes an open slot. A slot a live booking holds is never removed. */
export async function removeAvailability(startsAt: string): Promise<boolean> {
  await requireAdmin();
  const removed = await removeOpenSlot(startsAt);
  refresh();
  return removed;
}
