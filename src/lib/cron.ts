import { timingSafeEqual } from "node:crypto";

/** True if the Authorization header is "Bearer <CRON_SECRET>". Always false when no secret is set. */
export function hasCronSecret(header: string | null, secret: string | undefined): boolean {
  if (!secret || !header) return false;
  const given = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
