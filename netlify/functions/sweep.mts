// Netlify runs this every 15 minutes, on the live site only (not deploy previews).
export default async function sweep() {
  const response = await fetch(`${process.env.SITE_URL}/api/cron/sweep`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  console.log(`Sweep: ${response.status} ${await response.text()}`);
}

export const config = { schedule: "*/15 * * * *" };
