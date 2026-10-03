/** Small filled heart used as a decorative accent. */
export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`inline-block size-[0.8em] fill-current ${className}`}>
      <path d="M12 21s-7.5-4.6-9.9-9.2C.4 8.4 2.3 4.5 6 4.5c2.2 0 3.5 1.2 4.4 2.5h3.2c.9-1.3 2.2-2.5 4.4-2.5 3.7 0 5.6 3.9 3.9 7.3C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}
