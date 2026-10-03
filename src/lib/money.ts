/** Formats an amount in pence as pounds, e.g. 2500 → "£25", 2550 → "£25.50". */
export function formatPence(pence: number): string {
  const pounds = pence / 100;
  return Number.isInteger(pounds) ? `£${pounds}` : `£${pounds.toFixed(2)}`;
}
