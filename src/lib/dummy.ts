// Hard-coded dummy content for the home page. Step 3 replaces this with
// the services and settings tables in Supabase.

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

export const services: Service[] = [
  {
    id: "dummy-gel",
    name: "Gel manicure",
    description: null,
    duration_min: 45,
    price_pounds: 25,
    deposit_pounds: 5,
    photo_path: null,
    is_active: true,
  },
  {
    id: "dummy-biab",
    name: "BIAB overlay",
    description: null,
    duration_min: 60,
    price_pounds: 35,
    deposit_pounds: 5,
    photo_path: null,
    is_active: true,
  },
  {
    id: "dummy-acrylic",
    name: "Acrylic full set",
    description: null,
    duration_min: 90,
    price_pounds: 45,
    deposit_pounds: 5,
    photo_path: null,
    is_active: true,
  },
  {
    id: "dummy-art",
    name: "Nail art",
    description: null,
    duration_min: 30,
    price_pounds: 15,
    deposit_pounds: 5,
    photo_path: null,
    is_active: true,
  },
];

export const business = {
  name: "Popped the Nail",
  area: "Manchester",
  address: "[Studio address, Town, Postcode]",
  instagramHandle: "poppedthenail",
  instagramUrl: "https://www.instagram.com/poppedthenail",
  aboutText:
    "[A couple of lines about her — training, style, what clients love about coming in.]",
  depositPounds: 5,
};

/** Placeholder photos in public/sample/. Not her work. */
export const heroPhoto = {
  src: "/sample/photo-4.jpg",
  alt: "Almond nails in pink chrome",
};

export const galleryPhotos = [
  {
    src: "/sample/photo-3.jpg",
    alt: "Long almond nails with bright summer art",
  },
  {
    src: "/sample/photo-2.jpg",
    alt: "Deep red nails with cherry and tortoiseshell art",
  },
  {
    src: "/sample/photo-5.jpg",
    alt: "Pale pink nails with tiny burgundy hearts",
  },
  {
    src: "/sample/photo-6.jpg",
    alt: "Pink nails with flower details and ridged accents",
  },
];
