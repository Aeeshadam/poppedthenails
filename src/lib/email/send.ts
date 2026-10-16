import "server-only";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { Resend } from "resend";

type Email = {
  to: string;
  subject: string;
  react: ReactElement;
  attachments?: { filename: string; content: string }[];
};

/** Sends one email. Never throws: a failed email must not fail a booking. Returns whether it sent. */
export async function sendEmail({ react, ...email }: Email): Promise<boolean> {
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM ?? "",
      replyTo: process.env.ADMIN_EMAIL,
      ...email,
      html: await render(react),
      text: await render(react, { plainText: true }),
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Email "${email.subject}" to ${email.to} failed:`, error);
    return false;
  }
}
