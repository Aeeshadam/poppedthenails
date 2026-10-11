import { z } from "zod";

export const bookingFormSchema = z.object({
  service: z.uuid(),
  slot: z.uuid(),
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Please shorten your name."),
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address.")),
  // Accepts spaces and brackets; stores the digits.
  phone: z
    .string()
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^(\+44|0)7\d{9}$/, "Please enter a UK mobile number, like 07700 900000.")),
  notes: z
    .string()
    .trim()
    .max(500, "Please keep notes under 500 characters.")
    .transform((value) => value || null),
  policy: z.literal("on", { error: "Please tick to agree to the deposit and cancellation policy." }),
});

export type BookingForm = z.infer<typeof bookingFormSchema>;

export type BookingFormErrors = Partial<Record<"name" | "email" | "phone" | "notes" | "policy", string>>;

export type ParsedBookingForm =
  | { ok: true; data: BookingForm }
  | { ok: false; errors: BookingFormErrors; badIds: boolean };

export function parseBookingForm(form: Record<string, string>): ParsedBookingForm {
  const result = bookingFormSchema.safeParse({ notes: "", ...form });
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors = z.flattenError(result.error).fieldErrors;
  const errors: BookingFormErrors = {};
  for (const key of ["name", "email", "phone", "notes", "policy"] as const) {
    const message = fieldErrors[key]?.[0];
    if (message) errors[key] = message;
  }
  return { ok: false, errors, badIds: Boolean(fieldErrors.service || fieldErrors.slot) };
}
