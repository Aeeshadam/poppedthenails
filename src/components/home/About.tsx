import { Card } from "@/components/Card";
import { Heart } from "@/components/Heart";

export function About({ name, aboutText }: { name: string; aboutText: string }) {
  return (
    <Card className="p-7">
      <div aria-hidden="true" className="size-16 rounded-full bg-lilac" />
      <h2 className="mt-6 font-serif text-[26px]">
        Hi, I&rsquo;m {name} <Heart className="text-accent" />
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{aboutText}</p>
    </Card>
  );
}
