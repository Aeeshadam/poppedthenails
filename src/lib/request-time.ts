import "server-only";
import { connection } from "next/server";

/**
 * The current time for a server page. Waits for a real request first, so a
 * page that depends on "now" is built per visit, never frozen at build time.
 */
export async function requestTime(): Promise<Date> {
  await connection();
  return new Date();
}
