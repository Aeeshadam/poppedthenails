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
import { business, galleryPhotos, heroPhoto } from "@/lib/content";

export default async function Home() {
  await connection();
  const [services, settings] = await Promise.all([getActiveServices(), getPublicSettings()]);
  const deposit = quotedDeposit(services);

  return (
    <>
      <Hero depositPounds={deposit} photo={heroPhoto} />
      <PhotoCarousel photos={galleryPhotos} />

      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-10 pt-12 md:grid-cols-2 md:gap-12">
          <Services services={services.slice(0, 4)} />
          <div className="grid content-start gap-5">
            <About name={business.name} aboutText={settings.about_text} />
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
