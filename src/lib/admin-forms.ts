import { z } from "zod";

const pounds = (label: string) =>
  z.coerce
    .number({ error: `Enter the ${label} in whole pounds.` })
    .int(`Enter the ${label} in whole pounds.`)
    .min(0, `The ${label} can't be negative.`)
    .max(1000, `That ${label} looks too high.`);

export const serviceFormSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a name.").max(60, "Keep the name under 60 characters."),
    duration_min: z.coerce
      .number()
      .int()
      .min(15, "Length must be 15 to 240 minutes.")
      .max(240, "Length must be 15 to 240 minutes."),
    price_pounds: pounds("price"),
    deposit_pounds: pounds("deposit"),
    description: z
      .string()
      .trim()
      .max(300, "Keep the description under 300 characters.")
      .transform((v) => v || null),
  })
  .refine((s) => s.deposit_pounds <= s.price_pounds, {
    message: "The deposit can't be more than the price.",
    path: ["deposit_pounds"],
  });

export type ServiceForm = z.infer<typeof serviceFormSchema>;

export const settingsFormSchema = z.object({
  bank_account_name: z.string().trim().min(1, "Enter the account name.").max(60),
  bank_sort_code: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(6, "A sort code is 6 digits, like 12-34-56."))
    .transform((d) => `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`),
  bank_account_number: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(8, "An account number is 8 digits.")),
  address: z
    .string()
    .transform((v) => v.split("\n").map((line) => line.trim()).filter(Boolean).join("\n"))
    .pipe(z.string().min(1, "Enter the address.").max(200)),
  hours_note: z.string().trim().max(200, "Keep this under 200 characters."),
  about_text: z.string().trim().max(600, "Keep this under 600 characters."),
  deposit_policy: z.string().trim().min(1, "Enter the deposit policy.").max(600, "Keep this under 600 characters."),
  hold_hours: z.coerce.number().int().min(1, "Hold for 1 to 48 hours.").max(48, "Hold for 1 to 48 hours."),
  min_notice_hours: z.coerce
    .number()
    .int()
    .min(0, "Notice must be 0 to 168 hours.")
    .max(168, "Notice must be 0 to 168 hours."),
});

export type SettingsForm = z.infer<typeof settingsFormSchema>;

/** Field name → first error message, for showing under each field. */
export type FieldErrors = Record<string, string>;

export function firstErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const [field, messages] of Object.entries(z.flattenError(error).fieldErrors)) {
    const first = (messages as string[] | undefined)?.[0];
    if (first) errors[field] = first;
  }
  return errors;
}
