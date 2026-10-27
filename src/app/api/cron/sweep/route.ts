import { hasCronSecret } from "@/lib/cron";
import { expireOverdueBookings } from "@/lib/data/admin-bookings";
import { sendReleasedEmail } from "@/lib/email/booking-emails";

/** Called every 15 minutes by netlify/functions/sweep.mts. */
export async function POST(request: Request) {
  if (!hasCronSecret(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const expired = await expireOverdueBookings(new Date());
  await Promise.all(expired.map(sendReleasedEmail));
  return Response.json({ expired: expired.length });
}
