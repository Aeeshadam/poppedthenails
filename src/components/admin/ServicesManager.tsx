"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Field, Select, TextArea, TextInput } from "@/components/Field";
import { IconButton } from "@/components/IconButton";
import { Pencil, Upload } from "@/components/icons";
import { Switch } from "@/components/Switch";
import { formatPounds } from "@/lib/money";
import type { Service } from "@/lib/types";

/** Lengths offered in the form: 15 to 240 minutes in 15-minute steps (spec limits). */
const LENGTHS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

type Editing = { mode: "new" } | { mode: "edit"; id: string } | null;

/** UI only: step 7 saves to Supabase and uploads photos to Storage. */
export function ServicesManager({ services: initial }: { services: Service[] }) {
  const [services, setServices] = useState(initial);
  const [editing, setEditing] = useState<Editing>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const current = editing?.mode === "edit" ? services.find((s) => s.id === editing.id) : undefined;

  function setActive(id: string, is_active: boolean) {
    setServices((all) => all.map((s) => (s.id === id ? { ...s, is_active } : s)));
    const name = services.find((s) => s.id === id)?.name;
    setNotice(`${name} is now ${is_active ? "shown on" : "hidden from"} the website.`);
  }

  function save(values: Omit<Service, "id" | "is_active" | "photo_path">) {
    if (editing?.mode === "edit") {
      setServices((all) => all.map((s) => (s.id === editing.id ? { ...s, ...values } : s)));
      setNotice(`${values.name} saved.`);
    } else {
      setServices((all) => [...all, { ...values, id: `new-${Date.now()}`, is_active: true, photo_path: null }]);
      setNotice(`${values.name} added.`);
    }
    setEditing(null);
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
            <Switch checked={s.is_active} onChange={(on) => setActive(s.id, on)} label={`Show ${s.name} on the website`} />
            <IconButton variant="ghost" label={`Edit ${s.name}`} onClick={() => setEditing({ mode: "edit", id: s.id })}>
              <Pencil />
            </IconButton>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[15px] text-muted">Switched-off services are hidden from the website.</p>
      <p role="status" className="sr-only">{notice}</p>

      {editing && (
        <ServiceForm
          key={editing.mode === "edit" ? editing.id : "new"}
          service={current}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
}

type ServiceFormProps = {
  service?: Service;
  onSave: (values: Omit<Service, "id" | "is_active" | "photo_path">) => void;
  onCancel: () => void;
};

function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lengths = service && !LENGTHS.includes(service.duration_min)
    ? [...LENGTHS, service.duration_min].sort((a, b) => a - b)
    : LENGTHS;

  // Braces matter: scrollIntoView can return a Promise, and an effect must return nothing or a clean-up function.
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Free the preview's object URL when it changes or the form closes.
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      name: String(data.get("name")).trim(),
      duration_min: Number(data.get("duration_min")),
      price_pounds: Number(data.get("price_pounds")),
      deposit_pounds: Number(data.get("deposit_pounds")),
      description: String(data.get("description")).trim() || null,
    });
  }

  function onPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoUrl(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-labelledby="service-form-title"
      className="mt-8 grid gap-5 rounded-card bg-surface p-6"
      ref={formRef}
    >
      <h2 id="service-form-title" className="font-serif text-[26px]">
        {service ? "Edit service" : "New service"}
      </h2>
      <Field label="Name" htmlFor="name">
        <TextInput id="name" name="name" defaultValue={service?.name} placeholder="e.g. Chrome powder" required maxLength={60} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Length" htmlFor="duration_min">
          <Select id="duration_min" name="duration_min" defaultValue={service?.duration_min ?? 60}>
            {lengths.map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Price £" htmlFor="price_pounds">
          <TextInput id="price_pounds" name="price_pounds" type="number" inputMode="numeric" min={0} step={1} defaultValue={service?.price_pounds} placeholder="0" required />
        </Field>
        <Field label="Deposit £" htmlFor="deposit_pounds">
          <TextInput id="deposit_pounds" name="deposit_pounds" type="number" inputMode="numeric" min={0} step={1} defaultValue={service?.deposit_pounds ?? 5} required />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={service?.description ?? ""} placeholder="What's included" rows={3} />
      </Field>

      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-card border-2 border-dashed border-lilac p-4 text-muted hover:border-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
        <input type="file" name="photo" accept="image/*" onChange={onPhoto} className="sr-only" />
        {photoUrl ? (
          <>
            <Image src={photoUrl} alt="Chosen photo" width={240} height={160} unoptimized className="h-32 w-auto rounded-xl object-cover" />
            <span className="text-[15px]">Change photo</span>
          </>
        ) : (
          <>
            <Upload />
            <span className="text-[15px]">Add a photo</span>
          </>
        )}
      </label>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          Save service
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
