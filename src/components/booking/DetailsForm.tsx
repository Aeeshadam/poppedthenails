"use client";

import { useActionState } from "react";
import { createBooking, type DetailsFormState } from "@/app/book/actions";
import { Button } from "@/components/Button";
import { errorId, Field, TextArea, TextInput } from "@/components/Field";
import { Heart } from "@/components/Heart";
import { TextLink } from "@/components/TextLink";
import { HONEYPOT } from "@/lib/honeypot";
import { formatPounds } from "@/lib/money";

type DetailsFormProps = {
  serviceId: string;
  slotId: string;
  pricePounds: number;
  depositPounds: number;
};

function fieldProps(name: keyof NonNullable<DetailsFormState["errors"]>, state: DetailsFormState) {
  const error = state.errors?.[name];
  return {
    id: name,
    name,
    defaultValue: state.values?.[name],
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId(name) : undefined,
  };
}

export function DetailsForm({ serviceId, slotId, pricePounds, depositPounds }: DetailsFormProps) {
  const [state, formAction, pending] = useActionState(createBooking, {});

  return (
    // key resets the inputs to the saved values after each failed submit.
    <form action={formAction} key={JSON.stringify(state.values ?? {})} className="mt-6 grid gap-5" noValidate>
      <input type="hidden" name="service" value={serviceId} />
      <input type="hidden" name="slot" value={slotId} />

      {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT}>Leave this empty</label>
        <input id={HONEYPOT} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" />
      </div>

      {state.message && (
        <p role="alert" className="rounded-card bg-warning-bg p-4 text-warning">
          {state.message}
        </p>
      )}

      <Field label="Full name" htmlFor="name" error={state.errors?.name}>
        <TextInput {...fieldProps("name", state)} autoComplete="name" placeholder="Your name" required />
      </Field>
      <Field label="Email" htmlFor="email" error={state.errors?.email}>
        <TextInput {...fieldProps("email", state)} type="email" autoComplete="email" placeholder="you@example.com" required />
      </Field>
      <Field label="Mobile" htmlFor="phone" error={state.errors?.phone}>
        <TextInput {...fieldProps("phone", state)} type="tel" autoComplete="tel" placeholder="07…" required />
      </Field>
      <Field
        label={
          <>
            Notes <span className="font-normal text-muted">(optional)</span>
          </>
        }
        htmlFor="notes"
        error={state.errors?.notes}
      >
        <TextArea {...fieldProps("notes", state)} placeholder="Inspo, allergies, removal needed…" rows={3} maxLength={500} />
      </Field>

      <div>
        <div className="flex items-start gap-3">
          <input
            {...fieldProps("policy", state)}
            defaultChecked={state.values?.policy === "on"}
            defaultValue={undefined}
            type="checkbox"
            required
            className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-md border-line accent-accent"
          />
          <label htmlFor="policy" className="cursor-pointer leading-relaxed">
            I agree to the{" "}
            <TextLink inline href="/terms#deposit" target="_blank">
              deposit &amp; cancellation policy
            </TextLink>
          </label>
        </div>
        {state.errors?.policy && (
          <p id={errorId("policy")} className="mt-2 text-[14px] font-medium text-warning">
            {state.errors.policy}
          </p>
        )}
      </div>

      <dl className="rounded-card border border-line p-5">
        <div className="flex justify-between text-muted">
          <dt>Service price</dt>
          <dd>{formatPounds(pricePounds)}</dd>
        </div>
        <div className="mt-2 flex justify-between text-muted">
          <dt>Pay in studio</dt>
          <dd>{formatPounds(pricePounds - depositPounds)}</dd>
        </div>
        <div className="mt-3 flex justify-between border-t border-line pt-3 text-[17px] font-semibold">
          <dt>Deposit by bank transfer</dt>
          <dd>{formatPounds(depositPounds, { pence: true })}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            "Booking…"
          ) : (
            <>
              Book my slot <Heart />
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-[13px] text-muted">
          Next: bank details for your {formatPounds(depositPounds)} deposit. No card needed.
        </p>
      </div>
    </form>
  );
}
