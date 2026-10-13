"use client";

import { useActionState, useState } from "react";
import { saveSettingsForm } from "@/app/admin/actions";
import { Button } from "@/components/Button";
import { controlProps, Field, TextArea, TextInput } from "@/components/Field";
import { Check } from "@/components/icons";
import type { Settings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(saveSettingsForm, {});
  // "Saved" hides again as soon as she edits anything.
  const [edited, setEdited] = useState(false);
  const errors = state.errors ?? {};
  const value = (name: keyof Settings) => state.values?.[name] ?? String(settings[name]);
  const field = (name: keyof Settings) => ({ ...controlProps(name, errors[name]), defaultValue: value(name) });

  return (
    <form
      action={(formData) => {
        setEdited(false);
        formAction(formData);
      }}
      onChange={() => setEdited(true)}
      key={JSON.stringify(state.values ?? {})}
      noValidate
    >
      <h1 className="mt-8 font-serif text-title">Settings</h1>
      <p className="mt-2 leading-relaxed text-muted">The details clients see when they book.</p>

      <section className="mt-6 grid gap-5 rounded-card bg-surface p-6">
        <h2 className="font-serif text-card-title">Bank details</h2>
        <p className="-mt-3 text-[15px] text-muted">Shown only on the deposit page and in the deposit email.</p>
        <Field label="Account name" htmlFor="bank_account_name" error={errors.bank_account_name}>
          <TextInput {...field("bank_account_name")} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sort code" htmlFor="bank_sort_code" error={errors.bank_sort_code}>
            <TextInput {...field("bank_sort_code")} inputMode="numeric" placeholder="00-00-00" required />
          </Field>
          <Field label="Account number" htmlFor="bank_account_number" error={errors.bank_account_number}>
            <TextInput {...field("bank_account_number")} inputMode="numeric" placeholder="00000000" required />
          </Field>
        </div>
      </section>

      <section className="mt-5 grid gap-5 rounded-card bg-surface p-6">
        <h2 className="font-serif text-card-title">Studio</h2>
        <Field
          label="Address"
          htmlFor="address"
          hint="Street on the first line, town and postcode on the second."
          error={errors.address}
        >
          <TextArea {...field("address")} autoComplete="street-address" rows={2} required />
        </Field>
        <Field label="Usual hours" htmlFor="hours_note" hint="Shown under “Find us” on the home page." error={errors.hours_note}>
          <TextInput {...field("hours_note")} />
        </Field>
        <Field label="About you" htmlFor="about_text" hint="Shown on the home page." error={errors.about_text}>
          <TextArea {...field("about_text")} rows={4} />
        </Field>
      </section>

      <section className="mt-5 grid gap-5 rounded-card bg-surface p-6">
        <h2 className="font-serif text-card-title">Booking rules</h2>
        <Field
          label="Deposit policy"
          htmlFor="deposit_policy"
          hint="Shown before booking and in emails."
          error={errors.deposit_policy}
        >
          <TextArea {...field("deposit_policy")} rows={4} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hold unpaid (hours)" htmlFor="hold_hours" error={errors.hold_hours}>
            <TextInput {...field("hold_hours")} type="number" min={1} max={48} required />
          </Field>
          <Field label="Minimum notice (hours)" htmlFor="min_notice_hours" error={errors.min_notice_hours}>
            <TextInput {...field("min_notice_hours")} type="number" min={0} max={168} required />
          </Field>
        </div>
      </section>

      <Button type="submit" className="mt-6 w-full" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
      <p role="status" className="mt-3 flex items-center justify-center gap-1.5 text-[15px] empty:hidden">
        {state.saved && !edited && (
          <span className="flex items-center gap-1.5 text-success">
            <Check className="size-4" /> Saved
          </span>
        )}
        {state.errors && <span className="text-warning">Please fix the highlighted fields.</span>}
      </p>
    </form>
  );
}
