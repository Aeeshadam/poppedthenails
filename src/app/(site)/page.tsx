import { connection } from "next/server";
import { About } from "@/components/home/About";
import { FindUs } from "@/components/home/FindUs";
import { GoodToKnow } from "@/components/home/GoodToKnow";
import { Hero } from "@/components/home/Hero";
import { PhotoCarousel } from "@/components/home/PhotoCarousel";
import { Services } from "@/components/home/Services";
import { quotedDeposit } from "@/lib/booking-rules";
import { getActiveServices } from "@/lib/data/services";
import { getPublicSettings } from "@/lib/data/settings";
import { business, heroPhoto } from "@/lib/content";
import { getGalleryPhotos } from "@/lib/data/gallery";
import { HOME_PHOTO_COUNT } from "@/lib/gallery";

export default async function Home() {
  await connection();
  const [services, settings, photos] = await Promise.all([
    getActiveServices(),
    getPublicSettings(),
    getGalleryPhotos(HOME_PHOTO_COUNT),
  ]);
  const deposit = quotedDeposit(services);

  return (
    <>
      <Hero depositPounds={deposit} photo={heroPhoto} />
      {photos.length > 0 && <PhotoCarousel photos={photos} />}

      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-10 pt-12 md:grid-cols-2 md:gap-12">
          <Services services={services.slice(0, 4)} />
          <div className="grid content-start gap-5">
            <About name={business.ownerName} aboutText={settings.about_text} />
            <GoodToKnow depositPounds={deposit} />
          </div>
        </div>

        <div className="pt-14">
          <FindUs address={settings.address} hoursNote={settings.hours_note} />
        </div>
      </div>
    </>
  );
}
