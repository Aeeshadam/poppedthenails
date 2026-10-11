"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { Heart } from "@/components/Heart";
import { Check, Clock, Mail } from "@/components/icons";
import { TextLink } from "@/components/TextLink";
import { formatDayShort, formatTime } from "@/lib/dates";
import { formatPounds } from "@/lib/money";
import type { Booking, Settings } from "@/lib/types";

type DepositViewProps = {
  booking: Pick<Booking, "reference" | "service_name" | "starts_at" | "deposit_pounds" | "client_says_paid_at">;
  bank: Pick<Settings, "bank_account_name" | "bank_sort_code" | "bank_account_number" | "hold_hours">;
  /** The clientSaysPaid server action, already tied to this booking. */
  onSentIt: () => Promise<void>;
};

/** The only page, with email 1, that shows bank details. */
export function DepositView({ booking, bank, onSentIt }: DepositViewProps) {
  const [saidPaid, setSaidPaid] = useState(booking.client_says_paid_at !== null);
  const amount = formatPounds(booking.deposit_pounds, { pence: true });
  const rows = [
    { label: "Amount", value: amount },
    { label: "Account name", value: bank.bank_account_name },
    { label: "Sort code", value: bank.bank_sort_code },
    { label: "Account number", value: bank.bank_account_number },
    { label: "Reference", value: booking.reference },
  ];

  return (
    <>
      <div className="text-center">
        <p className="font-script text-[40px] leading-none text-accent">almost there</p>
        <h1 className="mt-4 font-serif text-title">
          Send your {formatPounds(booking.deposit_pounds)} deposit
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          Your slot is saved for you. Pop the deposit over by bank transfer to confirm it.
        </p>
        <p className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-lilac px-3.5 text-left text-[13px] font-semibold">
          <Clock className="size-[18px] shrink-0" />
          Held for {bank.hold_hours} hours · {booking.service_name}, {formatDayShort(booking.starts_at)}{" "}
          {formatTime(booking.starts_at)}
        </p>
      </div>

      <div className="mt-6 rounded-card-lg bg-surface px-5 pt-2 pb-5">
        <dl>
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 border-b border-line py-3.5">
              <div className="min-w-0">
                <dt className="text-[13px] text-muted">{row.label}</dt>
                <dd className="mt-0.5 break-all text-lg font-semibold">{row.value}</dd>
              </div>
              <CopyButton value={row.value} label={row.label.toLowerCase()} />
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Please use the reference so we can match your payment.
        </p>
      </div>

      <div className="mt-5 flex gap-3 rounded-card border-2 border-dashed border-lilac p-5">
        <Mail className="mt-0.5 size-5 shrink-0 text-accent" />
        <p className="text-[15px] leading-relaxed">
          We&rsquo;ve emailed these details to you too. You&rsquo;ll get a confirmation email as soon
          as your deposit lands.
        </p>
      </div>

      <div className="mt-10" aria-live="polite">
        {saidPaid ? (
          <div className="flex gap-3 rounded-card bg-success-bg p-5 text-success">
            <Check className="mt-0.5 size-5 shrink-0" />
            <p className="leading-relaxed">
              Thanks! We&rsquo;ll check for your deposit and confirm your slot as soon as it lands.
            </p>
          </div>
        ) : (
          <form action={onSentIt} onSubmit={() => setSaidPaid(true)}>
            <Button type="submit" className="w-full">
              I&rsquo;ve sent it <Heart />
            </Button>
          </form>
        )}
      </div>
      <div className="mt-3 text-center">
        <TextLink href="/">I&rsquo;ll pay later</TextLink>
        <p className="mt-2 text-[15px] text-muted">
          Not paid within {bank.hold_hours} hours? The slot is released automatically.
        </p>
      </div>
    </>
  );
}
