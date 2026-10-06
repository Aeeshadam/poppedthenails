import { TextLink } from "@/components/TextLink";
import type { Service } from "@/lib/types";
import { formatPounds } from "@/lib/money";

export function Services({ services }: { services: Service[] }) {
  return (
    <section aria-labelledby="services-heading">
      <h2 id="services-heading" className="font-serif text-section">
        Services
      </h2>
      <ul className="mt-4">
        {services.map((service) => (
          <li
            key={service.id}
            className="flex items-center justify-between gap-4 border-b border-line py-4"
          >
            <div>
              <p className="font-semibold">{service.name}</p>
              <p className="mt-0.5 text-sm text-muted">{service.duration_min} min</p>
            </div>
            <p className="text-[17px]">{formatPounds(service.price_pounds)}</p>
          </li>
        ))}
      </ul>
      <TextLink href="/book" className="mt-4">
        See all services &amp; book →
      </TextLink>
    </section>
  );
}
