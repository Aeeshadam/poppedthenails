import { addressLines, directionsUrl } from "@/lib/address";
import { buttonClasses } from "@/components/Button";

type FindUsProps = {
  address: string;
  hoursNote: string;
};

export function FindUs({ address, hoursNote }: FindUsProps) {
  const [firstLine, ...rest] = addressLines(address);

  return (
    <section aria-labelledby="find-us-heading" className="md:grid md:grid-cols-2 md:items-center md:gap-10">
      <h2 id="find-us-heading" className="font-serif text-section md:col-span-2">
        Find us
      </h2>
      <MapPreview />
      <div>
        <address className="mt-5 not-italic md:mt-0">
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
      </div>
    </section>
  );
}

/**
 * A drawn map, not a live one: it loads nothing from Google and sets no
 * cookies. "Get directions" opens the real map.
 */
function MapPreview() {
  return (
    <div className="relative mt-4 aspect-[342/260] overflow-hidden rounded-card-lg bg-soft md:mt-0">
      <svg viewBox="0 0 342 260" aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
        <rect width="342" height="260" fill="#f0e8fb" />
        <rect x="18" y="22" width="70" height="52" rx="10" fill="#e3f1e6" />
        <rect x="250" y="28" width="70" height="52" rx="10" fill="#e3f1e6" />
        <rect x="104" y="20" width="58" height="44" rx="10" fill="#faf7ff" />
        <rect x="180" y="20" width="56" height="30" rx="10" fill="#faf7ff" />
        <rect x="20" y="96" width="56" height="58" rx="10" fill="#faf7ff" />
        <rect x="104" y="96" width="50" height="40" rx="10" fill="#faf7ff" />
        <rect x="252" y="96" width="68" height="50" rx="10" fill="#faf7ff" />
        <path d="M0 200 C 90 180, 200 214, 342 188 V 260 H 0 Z" fill="#dcc6f5" opacity="0.7" />
        <g fill="#ffffff">
          <rect x="90" y="0" width="9" height="260" />
          <rect x="170" y="0" width="7" height="260" />
          <rect x="240" y="0" width="9" height="260" />
          <rect x="0" y="80" width="342" height="9" />
          <path d="M0 162 L342 150 L342 159 L0 172 Z" />
        </g>
      </svg>
      <svg viewBox="0 0 24 32" aria-hidden="true" className="absolute top-[34%] left-1/2 h-14 w-11 -translate-x-1/2 -translate-y-1/2 drop-shadow">
        <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0Z" fill="#7c4dcc" />
        <circle cx="12" cy="11.5" r="4.5" fill="#ffffff" />
      </svg>
      <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-2.5 py-1 text-[12px] text-muted">
        Map preview
      </span>
    </div>
  );
}
