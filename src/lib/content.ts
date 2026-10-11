// Fixed site content that lives in code rather than the database (see the
// open questions in docs/SPEC.md about managing photos from admin).

export const INSTAGRAM_HANDLE = "poppedthenail";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

export const business = {
  ownerName: "Manuela",
  area: "Manchester",
};

/** Photos in public/gallery/. The hero photo also ends the carousel, so all ten appear there. */
export const heroPhoto = {
  src: "/gallery/hero-pink-red-almond.jpg",
  alt: "Long almond nails in pink with red heart art",
};

export const galleryPhotos = [
  {
    src: "/gallery/blush-marble-almond.jpg",
    alt: "Almond nails in blush pink with white marble art",
  },
  {
    src: "/gallery/french-blue-flowers.jpg",
    alt: "French tips with hand-painted blue flowers",
  },
  {
    src: "/gallery/lilac-french-square.jpg",
    alt: "Square nails with lilac French tips and a gem accent",
  },
  {
    src: "/gallery/short-mixed-art.jpg",
    alt: "Short nails with mixed hand-painted art and a star charm",
  },
  {
    src: "/gallery/classic-french-almond.jpg",
    alt: "Almond nails with classic white French tips",
  },
  {
    src: "/gallery/french-black-stars.jpg",
    alt: "Pink French tips with black star accents",
  },
  {
    src: "/gallery/milky-pink-short.jpg",
    alt: "Short square nails in milky pink",
  },
  {
    src: "/gallery/white-french-square.jpg",
    alt: "Square nails with crisp white French tips",
  },
  {
    src: "/gallery/sheer-nude-almond.jpg",
    alt: "Short almond nails in sheer nude pink",
  },
  heroPhoto,
];
