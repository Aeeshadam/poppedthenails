// Hard-coded dummy content for building the screens. Step 5 replaces this with
// the services and settings tables in Supabase.

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

export const activeServices = services.filter((s) => s.is_active);

export function findActiveService(id: string | undefined): Service | undefined {
  return activeServices.find((s) => s.id === id);
}

/**
 * The deposit to quote on the home, /book and terms pages. Deposits are set
 * per service (default £5), so quote the lowest one in use.
 */
export const depositPounds = Math.min(...activeServices.map((s) => s.deposit_pounds));

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
  instagram_handle: "poppedthenail",
  about_text:
    "[A couple of lines about her — training, style, what clients love about coming in.]",
};

/** Fixed details that aren't in the settings table. */
export const business = {
  name: "Popped the Nail",
  ownerName: "[Name]",
  area: "Manchester",
};

/** Photos in public/gallery/. The hero photo also ends the carousel, so all ten appear there. */
export const heroPhoto = {
  src: "/gallery/hero-pink-red-almond.jpg",
  alt: "Long almond nails in pink with red heart art",
};

export const galleryPhotos = [
  { src: "/gallery/blush-marble-almond.jpg", alt: "Almond nails in blush pink with white marble art" },
  { src: "/gallery/french-blue-flowers.jpg", alt: "French tips with hand-painted blue flowers" },
  { src: "/gallery/lilac-french-square.jpg", alt: "Square nails with lilac French tips and a gem accent" },
  { src: "/gallery/short-mixed-art.jpg", alt: "Short nails with mixed hand-painted art and a star charm" },
  { src: "/gallery/classic-french-almond.jpg", alt: "Almond nails with classic white French tips" },
  { src: "/gallery/french-black-stars.jpg", alt: "Pink French tips with black star accents" },
  { src: "/gallery/milky-pink-short.jpg", alt: "Short square nails in milky pink" },
  { src: "/gallery/white-french-square.jpg", alt: "Square nails with crisp white French tips" },
  { src: "/gallery/sheer-nude-almond.jpg", alt: "Short almond nails in sheer nude pink" },
  heroPhoto,
];
