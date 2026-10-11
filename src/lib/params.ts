/** A search param's single value; repeated or missing params give undefined. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ids from the URL are checked first, so junk gives "not found" rather than a database error. */
export function isUuid(value: string | undefined): value is string {
  return value !== undefined && UUID.test(value);
}
