"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Check } from "@/components/icons";
import { formatPounds } from "@/lib/money";
import type { Service } from "@/lib/types";
import { BottomBar } from "./BottomBar";

type ServicePickerProps = {
  services: Service[];
  initialServiceId?: string;
};

export function ServicePicker({ services, initialServiceId }: ServicePickerProps) {
  const [selectedId, setSelectedId] = useState(initialServiceId);
  const selected = services.find((s) => s.id === selectedId);

  return (
    <form action="/book/time" method="get">
      <fieldset>
        <legend className="sr-only">Service</legend>
        <div className="mt-6 grid gap-3">
          {services.map((service) => {
            const checked = service.id === selectedId;
            return (
              <label
                key={service.id}
                className={`flex cursor-pointer items-center gap-4 rounded-card border px-5 py-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                  checked ? "border-[1.5px] border-accent bg-soft" : "border-line bg-surface hover:border-lilac"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={service.id}
                  checked={checked}
                  onChange={() => setSelectedId(service.id)}
                  className="sr-only"
                  required
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold">{service.name}</span>
                  <span className="mt-1 block text-[15px] text-muted">
                    {service.duration_min} min · {formatPounds(service.deposit_pounds)} deposit
                  </span>
                </span>
                <span className="text-[17px]">{formatPounds(service.price_pounds)}</span>
                <span
                  aria-hidden="true"
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    checked ? "border-accent bg-accent text-white" : "border-lilac"
                  }`}
                >
                  {checked && <Check className="size-4" />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <BottomBar>
        <div className="min-w-0" aria-live="polite">
          {selected ? (
            <>
              <p className="truncate font-semibold">{selected.name}</p>
              <p className="text-sm text-muted">
                {selected.duration_min} min · {formatPounds(selected.deposit_pounds)} deposit today
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Pick a service to continue</p>
          )}
        </div>
        <Button type="submit" disabled={!selected} className="shrink-0">
          Continue
        </Button>
      </BottomBar>
    </form>
  );
}
