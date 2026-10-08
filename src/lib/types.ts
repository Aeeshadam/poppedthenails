// App row types, taken from the generated database types (npm run db:types).
// Times are ISO strings in UTC.

import type { Tables } from "./supabase/database.types";

export type BookingStatus =
  | "pending_deposit"
  | "confirmed"
  | "expired"
  | "cancelled"
  | "completed"
  | "no_show";

export type Service = Omit<Tables<"services">, "created_at">;

export type Slot = Pick<Tables<"slots">, "id" | "starts_at">;

/** status is a text column with a check, so narrow it to the six allowed values. */
export type Booking = Omit<Tables<"bookings">, "status"> & {
  status: BookingStatus;
};

export type Settings = Omit<Tables<"settings">, "id">;
