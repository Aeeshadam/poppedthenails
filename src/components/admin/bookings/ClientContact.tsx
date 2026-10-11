/** The client's phone and email. One tap selects the whole value, ready to copy. */
export function ClientContact({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="mt-2 text-[14px] leading-snug text-muted">
      <p className="w-fit select-all">{phone}</p>
      <p className="w-fit break-all select-all">{email}</p>
    </div>
  );
}
