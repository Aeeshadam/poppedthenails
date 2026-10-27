-- Gallery photos she uploads from admin (decided 24 October 2026).
-- Each photo has two files in the "gallery" bucket: {id}/thumb.jpg and {id}/full.jpg.
-- Newest first everywhere; the home page shows the first 10.
create table gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  alt        text check (length(alt) <= 200),
  created_at timestamptz not null default now()
);

-- No policies: only the server (service role) reads and writes the table.
alter table gallery_photos enable row level security;

-- Public bucket: anyone can view the files by URL. Writes need the service role.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 3145728, array['image/jpeg']);
