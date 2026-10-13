"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { saveService, showService } from "@/app/admin/actions";
import { Button } from "@/components/Button";
import { controlProps, Field, Select, TextArea, TextInput } from "@/components/Field";
import { IconButton } from "@/components/IconButton";
import { Pencil } from "@/components/icons";
import { Switch } from "@/components/Switch";
import { formatPounds } from "@/lib/money";
import type { Service } from "@/lib/types";

/** Lengths offered in the form: 15 to 240 minutes in 15-minute steps (spec limits). */
const LENGTHS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

type Editing = { mode: "new" } | { mode: "edit"; service: Service } | null;

export function ServicesManager({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Editing>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function setShown(service: Service, show: boolean) {
    startTransition(async () => {
      await showService(service.id, show);
      setNotice(`${service.name} is now ${show ? "shown on" : "hidden from"} the website.`);
    });
  }

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <h1 className="font-serif text-title">Services</h1>
        <Button size="md" onClick={() => setEditing({ mode: "new" })}>
          + Add
        </Button>
      </div>

      <ul className="mt-5 grid gap-3">
        {services.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-card bg-surface py-3 pr-3 pl-5">
            <div className={`min-w-0 flex-1 ${s.is_active ? "" : "opacity-55"}`}>
              <p className="text-[17px] font-semibold">{s.name}</p>
              <p className="text-[15px] text-muted">
                {s.duration_min} min · {formatPounds(s.price_pounds)} · {formatPounds(s.deposit_pounds)} deposit
              </p>
            </div>
            <Switch checked={s.is_active} onChange={(on) => setShown(s, on)} label={`Show ${s.name} on the website`} />
            <IconButton variant="ghost" label={`Edit ${s.name}`} onClick={() => setEditing({ mode: "edit", service: s })}>
              <Pencil />
            </IconButton>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[15px] text-muted">Switched-off services are hidden from the website.</p>
      <p role="status" className="sr-only">
        {notice}
      </p>

      {editing && (
        <ServiceForm
          key={editing.mode === "edit" ? editing.service.id : "new"}
          service={editing.mode === "edit" ? editing.service : undefined}
          onDone={(name) => {
            setEditing(null);
            setNotice(`${name} saved.`);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
}

type ServiceFormProps = {
  service?: Service;
  onDone: (name: string) => void;
  onCancel: () => void;
};

function ServiceForm({ service, onDone, onCancel }: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(saveService, {});
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  const value = (name: keyof Service) => state.values?.[name] ?? String(service?.[name] ?? "");
  const lengths =
    service && !LENGTHS.includes(service.duration_min)
      ? [...LENGTHS, service.duration_min].sort((a, b) => a - b)
      : LENGTHS;

  // Braces matter: scrollIntoView can return a Promise, and an effect must return nothing or a clean-up function.
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (state.saved) onDone(state.saved);
  }, [state.saved, onDone]);

  return (
    <form
      ref={formRef}
      action={formAction}
      key={JSON.stringify(state.values ?? {})}
      aria-labelledby="service-form-title"
      className="mt-8 grid gap-5 rounded-card bg-surface p-6"
      noValidate
    >
      <h2 id="service-form-title" className="font-serif text-[26px]">
        {service ? "Edit service" : "New service"}
      </h2>
      {service && <input type="hidden" name="id" value={service.id} />}

      <Field label="Name" htmlFor="name" error={errors.name}>
        <TextInput {...controlProps("name", errors.name)} defaultValue={value("name")} placeholder="e.g. Chrome powder" maxLength={60} required />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Length" htmlFor="duration_min" error={errors.duration_min}>
          <Select {...controlProps("duration_min", errors.duration_min)} defaultValue={value("duration_min") || "60"}>
            {lengths.map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Price £" htmlFor="price_pounds" error={errors.price_pounds}>
          <TextInput {...controlProps("price_pounds", errors.price_pounds)} type="number" inputMode="numeric" min={0} step={1} defaultValue={value("price_pounds")} placeholder="0" required />
        </Field>
        <Field label="Deposit £" htmlFor="deposit_pounds" error={errors.deposit_pounds}>
          <TextInput {...controlProps("deposit_pounds", errors.deposit_pounds)} type="number" inputMode="numeric" min={0} step={1} defaultValue={value("deposit_pounds") || "5"} required />
        </Field>
      </div>
      <Field label="Description" htmlFor="description" error={errors.description}>
        <TextArea {...controlProps("description", errors.description)} defaultValue={value("description")} placeholder="What's included" rows={3} maxLength={300} />
      </Field>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={pending}>
          {pending ? "Saving…" : "Save service"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
