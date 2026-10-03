import { About } from "@/components/home/About";
import { Gallery } from "@/components/home/Gallery";
import { GoodToKnow } from "@/components/home/GoodToKnow";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { business, galleryPhotos, heroPhoto, services } from "@/lib/dummy";

export default function Home() {
  const activeServices = services.filter((s) => s.is_active);

  return (
    <div className="mx-auto w-full max-w-5xl px-6">
      <Hero area={business.area} depositPounds={business.depositPounds} photo={heroPhoto} />

      <div className="grid gap-12 pt-14 md:grid-cols-2">
        <Services services={activeServices} />
        <Gallery photos={galleryPhotos} instagramUrl={business.instagramUrl} />
      </div>

      <div className="grid gap-5 pt-14 md:grid-cols-2">
        <About name={business.name} aboutText={business.aboutText} />
        <GoodToKnow depositPounds={business.depositPounds} />
      </div>
    </div>
  );
}
