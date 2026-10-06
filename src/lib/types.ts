// Row shapes from the "Data model" in docs/SPEC.md. Step 4 replaces these with
// types generated from the database. Times are ISO strings in UTC.

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price_pounds: number;
  deposit_pounds: number;
  photo_path: string | null;
  is_active: boolean;
};

export type Slot = {
  id: string;
  starts_at: string;
};

export type BookingStatus =
  | "pending_deposit"
  | "confirmed"
  | "expired"
  | "cancelled"
  | "completed"
  | "no_show";

export type Booking = {
  id: string;
  token: string;
  reference: string;
  slot_id: string | null;
  service_id: string | null;
  service_name: string;
  price_pounds: number;
  deposit_pounds: number;
  duration_min: number;
  starts_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string | null;
  status: BookingStatus;
  expires_at: string;
  client_says_paid_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  reminder_sent_at: string | null;
  created_at: string;
};

export type Settings = {
  bank_account_name: string;
  bank_sort_code: string;
  bank_account_number: string;
  hold_hours: number;
  min_notice_hours: number;
  deposit_policy: string;
  /** Two lines: street, then town and postcode. */
  address: string;
  /** Short note on when she usually works, shown under "Find us". */
  hours_note: string;
  instagram_handle: string;
  about_text: string;
};
