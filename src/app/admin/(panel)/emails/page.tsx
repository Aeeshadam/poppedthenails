import { render } from "@react-email/components";
import { sampleEmails } from "@/emails/samples";
import { requireAdmin } from "@/lib/auth";

/** Every email with sample details, to check how they look. Not linked from the tabs. */
export default async function AdminEmailsPage() {
  await requireAdmin();
  const emails = await Promise.all(
    sampleEmails(process.env.SITE_URL ?? "http://localhost:3000").map(async ({ title, email }) => ({
      title,
      html: await render(email),
    })),
  );
  return (
    <>
      <h1 className="mt-8 font-serif text-title">Emails</h1>
      <p className="mt-2 leading-relaxed text-muted">What clients and you receive, with sample details.</p>
      {emails.map(({ title, html }) => (
        <section key={title} className="mt-8">
          <h2 className="mb-3 font-semibold">{title}</h2>
          <iframe title={title} srcDoc={html} className="h-[640px] w-full rounded-card bg-surface" />
        </section>
      ))}
    </>
  );
}
