/**
 * Formats a whole-pound amount for display: 25 → "£25".
 * With { pence: true } it always shows pence, as the deposit screens do: 5 → "£5.00".
 */
export function formatPounds(pounds: number, options: { pence?: boolean } = {}): string {
  return options.pence ? `£${pounds.toFixed(2)}` : `£${pounds}`;
}
