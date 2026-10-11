// Dummy services and settings for the admin screens, until steps 6 and 7 read
// them from Supabase.

import type { Service, Settings } from "./types";

function service(
  id: string,
  name: string,
  duration_min: number,
  price_pounds: number,
  description: string | null = null,
  is_active = true,
): Service {
  return { id, name, description, duration_min, price_pounds, deposit_pounds: 5, photo_path: null, is_active };
}

/** Listed in the order they were added. Chrome powder is switched off. */
export const services: Service[] = [
  service("gel", "Gel manicure", 45, 25, "Gel colour on your natural nails."),
  service("biab", "BIAB overlay", 60, 35, "Builder gel to strengthen your natural nails."),
  service("biab-infill", "BIAB infill", 60, 30, "Infill for an existing BIAB set."),
  service("acrylic", "Acrylic full set", 90, 45, "A new set of acrylic extensions."),
  service("removal", "Gel removal", 20, 10, "Gentle removal of gel or BIAB."),
  service("art", "Nail art", 15, 10, "Hand-painted designs on top of any set."),
  service("chrome", "Chrome powder", 15, 8, "Mirror chrome finish.", false),
];

export const settings: Settings = {
  bank_account_name: "[Account name]",
  bank_sort_code: "[00-00-00]",
  bank_account_number: "[00000000]",
  hold_hours: 2,
  min_notice_hours: 24,
  deposit_policy:
    "Your £5 deposit secures your slot and comes off your total on the day. It is non-refundable if you cancel.",
  address: "[Address line]\n[Town, Postcode]",
  hours_note: "Weekday evenings from 5pm and weekends. Times vary, so check the booking calendar.",
  about_text:
    "[A couple of lines about her — training, style, what clients love about coming in.]",
};
