import { About } from "@/components/home/About";
import { FindUs } from "@/components/home/FindUs";
import { GoodToKnow } from "@/components/home/GoodToKnow";
import { Hero } from "@/components/home/Hero";
import { PhotoCarousel } from "@/components/home/PhotoCarousel";
import { Services } from "@/components/home/Services";
import { activeServices, business, depositPounds, galleryPhotos, heroPhoto, settings } from "@/lib/dummy";

export default function Home() {
  return (
    <>
      <Hero depositPounds={depositPounds} photo={heroPhoto} />
      <PhotoCarousel photos={galleryPhotos} />

      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-10 pt-12 md:grid-cols-2 md:gap-12">
          <Services services={activeServices.slice(0, 4)} />
          <div className="grid content-start gap-5">
            <About name={business.name} aboutText={settings.about_text} />
            <GoodToKnow depositPounds={depositPounds} />
          </div>
        </div>

        <div className="pt-14">
          <FindUs address={settings.address} hoursNote={settings.hours_note} />
        </div>
      </div>
    </>
  );
}
