/** A search param's single value; repeated or missing params give undefined. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}
