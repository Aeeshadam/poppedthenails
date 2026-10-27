import { addressLines, directionsUrl } from "@/lib/address";
import { buttonClasses } from "@/components/Button";

type FindUsProps = {
  address: string;
  hoursNote: string;
};

export function FindUs({ address, hoursNote }: FindUsProps) {
  const [firstLine, ...rest] = addressLines(address);

  return (
    <section aria-labelledby="find-us-heading" className="md:max-w-md">
      <h2 id="find-us-heading" className="font-serif text-section">
        Find us
      </h2>
      <address className="mt-4 not-italic">
        <p className="text-[17px] font-semibold">{firstLine}</p>
        {rest.map((line) => (
          <p key={line} className="text-muted">
            {line}
          </p>
        ))}
      </address>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{hoursNote}</p>
      <a
        href={directionsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses({ variant: "soft" }, "mt-5 w-full")}
      >
        Get directions<span className="sr-only"> (opens Google Maps)</span>
      </a>
    </section>
  );
}
