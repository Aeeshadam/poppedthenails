"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Field, TextInput } from "@/components/Field";
import { Mail } from "@/components/icons";
import { textLinkClasses } from "@/components/TextLink";

/** UI only: step 6 sends the Supabase email link and refuses other addresses. */
export function LoginForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSentTo(String(new FormData(event.currentTarget).get("email") ?? ""));
  }

  if (sentTo) {
    return (
      <Card role="status" className="mt-8 flex gap-3 p-5">
        <Mail className="mt-0.5 size-5 shrink-0 text-accent" />
        <div>
          <p className="font-semibold">Check your email</p>
          <p className="mt-1 leading-relaxed text-muted">
            If {sentTo} is the studio&rsquo;s email, a sign-in link is on its way.
          </p>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className={textLinkClasses({}, "mt-2")}
          >
            Use a different email
          </button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </Field>
      <Button type="submit" variant="dark" className="mt-4 w-full">
        Send me a sign-in link
      </Button>
    </form>
  );
}
