/** Splits the stored address into display lines (street, then town and postcode). */
export function addressLines(address: string): string[] {
  return address
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function addressOneLine(address: string): string {
  return addressLines(address).join(", ");
}

export function directionsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOneLine(address))}`;
}
