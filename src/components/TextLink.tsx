import Link from "next/link";
import type { ComponentProps } from "react";

/** Underlined accent link with a 44px touch target. */
export function TextLink({ className = "", ...rest }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={`inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-hover ${className}`}
    />
  );
}
