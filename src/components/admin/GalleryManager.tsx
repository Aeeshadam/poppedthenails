"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { addPhoto, removePhoto, savePhotoAlt } from "@/app/admin/actions";
import { Button, buttonClasses } from "@/components/Button";
import { TextInput } from "@/components/Field";
import { Upload } from "@/components/icons";
import { DEFAULT_ALT, HOME_PHOTO_COUNT, type GalleryPhoto } from "@/lib/gallery";
import { resizePhoto } from "@/lib/resize-image";

const asJpeg = (blob: Blob, name: string) => new File([blob], name, { type: "image/jpeg" });

export function GalleryManager({ photos }: { photos: GalleryPhoto[] }) {
  const [status, setStatus] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, startTransition] = useTransition();

  function upload(files: File[]) {
    setErrors([]);
    startTransition(async () => {
      const failed: string[] = [];
      for (const [i, file] of files.entries()) {
        setStatus(`Adding photo ${i + 1} of ${files.length}…`);
        try {
          const { thumb, full } = await resizePhoto(file);
          const form = new FormData();
          form.set("thumb", asJpeg(thumb, "thumb.jpg"));
          form.set("full", asJpeg(full, "full.jpg"));
          const error = await addPhoto(form);
          if (error) failed.push(`${file.name}: ${error}`);
        } catch {
          failed.push(`${file.name}: couldn't add this photo. Please try again.`);
        }
      }
      setStatus(failed.length ? undefined : files.length === 1 ? "Photo added." : `${files.length} photos added.`);
      setErrors(failed);
    });
  }

  return (
    <>
      <h1 className="mt-8 font-serif text-title">Gallery</h1>
      <p className="mt-2 leading-relaxed text-muted">
        Newest first. The first {HOME_PHOTO_COUNT} show on the home page; all of them show on the gallery page.
      </p>

      <label className={buttonClasses({}, `mt-6 w-full cursor-pointer ${busy ? "pointer-events-none opacity-60" : ""}`)}>
        <Upload /> {busy ? "Adding…" : "Add photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          className="sr-only"
          onChange={(e) => {
            const files = [...(e.target.files ?? [])];
            e.target.value = "";
            if (files.length) upload(files);
          }}
        />
      </label>
      <div role="status" className="mt-3 text-center text-[15px] empty:hidden">
        {status && <p className="text-muted">{status}</p>}
        {errors.map((error) => (
          <p key={error} className="text-warning">
            {error}
          </p>
        ))}
      </div>

      {photos.length === 0 ? (
        <p className="mt-6 rounded-card bg-surface p-6 text-center text-muted">No photos yet. Add your first above.</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {photos.map((photo, i) => (
            <PhotoCard key={photo.id} photo={photo} onHome={i < HOME_PHOTO_COUNT} />
          ))}
        </ul>
      )}
    </>
  );
}

function PhotoCard({ photo, onHome }: { photo: GalleryPhoto; onHome: boolean }) {
  const [busy, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const descriptionId = `alt-${photo.id}`;

  return (
    <li className="flex gap-4 rounded-card bg-surface p-4">
      <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-photo bg-lilac">
        <Image src={photo.thumbUrl} alt={photo.alt} fill unoptimized className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        {onHome && <p className="text-[13px] font-semibold text-accent">On the home page</p>}
        <form
          action={(form) =>
            startTransition(async () => {
              const error = await savePhotoAlt(photo.id, String(form.get("alt") ?? ""));
              setMessage(error ?? "Saved");
            })
          }
          onChange={() => setMessage(undefined)}
        >
          <label htmlFor={descriptionId} className="mt-1 block text-[14px] text-muted">
            Description (optional)
          </label>
          <TextInput
            id={descriptionId}
            name="alt"
            maxLength={200}
            defaultValue={photo.alt === DEFAULT_ALT ? "" : photo.alt}
            placeholder="e.g. Pink almond nails with hearts"
            className="mt-1"
          />
          <div className="mt-2 flex gap-2">
            <Button type="submit" size="md" variant="secondary" className="flex-1" disabled={busy}>
              Save
            </Button>
            <Button
              size="md"
              variant="secondary"
              className="flex-1"
              disabled={busy}
              onClick={() => {
                if (confirm("Delete this photo from the site?")) startTransition(() => removePhoto(photo.id));
              }}
            >
              Delete
            </Button>
          </div>
        </form>
        {message && (
          <p role="status" className="mt-2 text-[14px] text-muted">
            {message}
          </p>
        )}
      </div>
    </li>
  );
}
