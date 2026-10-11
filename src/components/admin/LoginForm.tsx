"use client";

import { useActionState, useState } from "react";
import { requestPasswordReset, signIn } from "@/app/admin/actions";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Field, TextInput } from "@/components/Field";
import { Mail } from "@/components/icons";
import { textLinkClasses } from "@/components/TextLink";

export function LoginForm({ notice }: { notice?: string }) {
  const [mode, setMode] = useState<"sign-in" | "forgot">("sign-in");
  return mode === "sign-in" ? (
    <SignInForm notice={notice} onForgot={() => setMode("forgot")} />
  ) : (
    <ForgotForm onBack={() => setMode("sign-in")} />
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-6 rounded-card bg-warning-bg p-4 text-warning">
      {children}
    </p>
  );
}

function SignInForm({ notice, onForgot }: { notice?: string; onForgot: () => void }) {
  const [state, formAction, pending] = useActionState(signIn, {});
  const message = state.message ?? notice;

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      {message && <Alert>{message}</Alert>}
      <Field label="Email" htmlFor="email">
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@example.com"
          defaultValue={state.email}
          required
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" variant="dark" className="mt-2 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <button type="button" onClick={onForgot} className={textLinkClasses({ quiet: true }, "mx-auto text-[15px]")}>
        Forgot password?
      </button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {});

  if (state.done) {
    return (
      <Card role="status" className="mt-8 flex gap-3 p-5">
        <Mail className="mt-0.5 size-5 shrink-0 text-accent" />
        <div>
          <p className="font-semibold">Check your email</p>
          <p className="mt-1 leading-relaxed text-muted">
            If that&rsquo;s the studio&rsquo;s email, a link to set a new password is on its way. Open it on this
            device.
          </p>
          <button type="button" onClick={onBack} className={textLinkClasses({}, "mt-2")}>
            Back to sign in
          </button>
        </div>
      </Card>
    );
  }

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <p className="leading-relaxed text-muted">Enter your email and we&rsquo;ll send you a link to set a new password.</p>
      <Field label="Email" htmlFor="reset-email">
        <TextInput id="reset-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </Field>
      <Button type="submit" variant="dark" className="mt-2 w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      <button type="button" onClick={onBack} className={textLinkClasses({ quiet: true }, "mx-auto text-[15px]")}>
        Back to sign in
      </button>
    </form>
  );
}
