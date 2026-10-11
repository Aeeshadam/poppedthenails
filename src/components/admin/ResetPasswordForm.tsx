"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/admin/actions";
import { Button } from "@/components/Button";
import { Field, TextInput } from "@/components/Field";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, {});

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      {state.message && (
        <p role="alert" className="rounded-card bg-warning-bg p-4 text-warning">
          {state.message}
        </p>
      )}
      <Field label="New password" htmlFor="password">
        <TextInput id="password" name="password" type="password" autoComplete="new-password" minLength={12} required />
      </Field>
      <Field label="Type it again" htmlFor="confirm">
        <TextInput id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={12} required />
      </Field>
      <Button type="submit" variant="dark" className="mt-2 w-full" disabled={pending}>
        {pending ? "Saving…" : "Save password"}
      </Button>
    </form>
  );
}
