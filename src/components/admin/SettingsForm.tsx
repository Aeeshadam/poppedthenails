"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Field, TextArea, TextInput } from "@/components/Field";
import { Check } from "@/components/icons";
import type { Settings } from "@/lib/types";

/** Admin settings. UI only: step 7 saves the settings row. */
export function SettingsForm({ settings }: { settings: Settings }) {
  const [saved, setSaved] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} onChange={() => setSaved(false)}>
      <h1 className="mt-8 font-serif text-title">Settings</h1>
      <p className="mt-2 leading-relaxed text-muted">The details clients see when they book.</p>

      <section className="mt-6 grid gap-5 rounded-card bg-surface p-6">
        <h2 className="font-serif text-card-title">Bank details</h2>
        <p className="-mt-3 text-[15px] text-muted">
          Shown only on the deposit page and in the deposit email.
        </p>
        <Field label="Account name" htmlFor="bank_account_name">
          <TextInput id="bank_account_name" name="bank_account_name" defaultValue={settings.bank_account_name} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sort code" htmlFor="bank_sort_code">
            <TextInput id="bank_sort_code" name="bank_sort_code" defaultValue={settings.bank_sort_code} inputMode="numeric" placeholder="00-00-00" required />
          </Field>
          <Field label="Account number" htmlFor="bank_account_number">
            <TextInput id="bank_account_number" name="bank_account_number" defaultValue={settings.bank_account_number} inputMode="numeric" placeholder="00000000" required />
          </Field>
        </div>
      </section>

      <section className="mt-5 grid gap-5 rounded-card bg-surface p-6">
        <h2 className="font-serif text-card-title">Studio</h2>
        <Field label="Address" htmlFor="address" hint="Street on the first line, town and postcode on the second.">
          <TextArea id="address" name="address" defaultValue={settings.address} autoComplete="street-address" rows={2} required />
        </Field>
        <Field label="Usual hours" htmlFor="hours_note" hint="Shown under “Find us” on the home page.">
          <TextInput id="hours_note" name="hours_note" defaultValue={settings.hours_note} />
        </Field>
        <Field label="Instagram handle" htmlFor="instagram_handle">
          <TextInput id="instagram_handle" name="instagram_handle" defaultValue={settings.instagram_handle} placeholder="poppedthenail" />
        </Field>
        <Field label="About you" htmlFor="about_text" hint="Shown on the home page.">
          <TextArea id="about_text" name="about_text" defaultValue={settings.about_text} rows={4} />
        </Field>
      </section>

      <section className="mt-5 grid gap-5 rounded-card bg-surface p-6">
        <h2 className="font-serif text-card-title">Booking rules</h2>
        <Field label="Deposit policy" htmlFor="deposit_policy" hint="Shown before booking and in emails.">
          <TextArea id="deposit_policy" name="deposit_policy" defaultValue={settings.deposit_policy} rows={4} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hold unpaid (hours)" htmlFor="hold_hours">
            <TextInput id="hold_hours" name="hold_hours" type="number" min={1} max={48} defaultValue={settings.hold_hours} required />
          </Field>
          <Field label="Minimum notice (hours)" htmlFor="min_notice_hours">
            <TextInput id="min_notice_hours" name="min_notice_hours" type="number" min={0} max={168} defaultValue={settings.min_notice_hours} required />
          </Field>
        </div>
      </section>

      <Button type="submit" className="mt-6 w-full">
        Save settings
      </Button>
      <p role="status" className="mt-3 flex items-center justify-center gap-1.5 text-[15px] text-success empty:hidden">
        {saved && (
          <>
            <Check className="size-4" /> Saved
          </>
        )}
      </p>
    </form>
  );
}
