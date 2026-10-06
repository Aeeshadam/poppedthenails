"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Field, TextArea, TextInput } from "@/components/Field";
import { Heart } from "@/components/Heart";
import { TextLink } from "@/components/TextLink";
import { formatPounds } from "@/lib/money";

type DetailsFormProps = {
  serviceId: string;
  slotId: string;
  pricePounds: number;
  depositPounds: number;
};

/**
 * UI only: the browser checks the required fields, then opens the demo deposit
 * page. Step 5 adds the server action with Zod, the honeypot and createBooking.
 */
export function DetailsForm({ serviceId, slotId, pricePounds, depositPounds }: DetailsFormProps) {
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Only the service and slot go in the URL; never the client's details.
    const params = new URLSearchParams({ service: serviceId, slot: slotId });
    router.push(`/booking/demo-pending?${params}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-5">
      <Field label="Full name" htmlFor="name">
        <TextInput id="name" name="name" autoComplete="name" placeholder="Your name" required />
      </Field>
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </Field>
      <Field label="Mobile" htmlFor="phone">
        <TextInput id="phone" name="phone" type="tel" autoComplete="tel" placeholder="07…" required />
      </Field>
      <Field
        label={
          <>
            Notes <span className="font-normal text-muted">(optional)</span>
          </>
        }
        htmlFor="notes"
      >
        <TextArea id="notes" name="notes" placeholder="Inspo, allergies, removal needed…" rows={3} />
      </Field>

      <div className="flex items-start gap-3">
        <input
          id="policy"
          name="policy"
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
        <Button type="submit" className="w-full">
          Book my slot <Heart />
        </Button>
        <p className="mt-3 text-center text-[13px] text-muted">
          Next: bank details for your {formatPounds(depositPounds)} deposit. No card needed.
        </p>
      </div>
    </form>
  );
}
