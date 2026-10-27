// Fixed site content that lives in code rather than the database.

export const INSTAGRAM_HANDLE = "poppedthenail";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

export const business = {
  ownerName: "Manuela",
  area: "Manchester",
};

/** The home hero photo. Gallery photos are uploaded in admin and live in Supabase Storage. */
export const heroPhoto = {
  src: "/hero.jpg",
  alt: "Long almond nails in pink with red heart art",
};
