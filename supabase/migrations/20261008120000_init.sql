-- poppedthenail: tables, double-booking rule and Row Level Security.
-- See docs/SPEC.md "Data model" and "Security and access".
-- Money is whole pounds (int). Times are timestamptz, stored in UTC.

-- Services she offers. Listed on the site in the order they were added.
create table services (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (length(trim(name)) > 0),
  description    text,
  duration_min   int  not null check (duration_min between 15 and 240),
  price_pounds   int  not null check (price_pounds >= 0),
  deposit_pounds int  not null default 5 check (deposit_pounds >= 0),
  photo_path     text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Each date and time she is free, added by her.
create table slots (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null unique,
  created_at timestamptz not null default now()
);

create table bookings (
  id                  uuid primary key default gen_random_uuid(),
  token               uuid not null unique default gen_random_uuid(),
  reference           text not null unique,
  -- Set null if she later deletes the slot; starts_at below keeps the time.
  -- The app only lets her delete slots with no live booking.
  slot_id             uuid references slots (id) on delete set null,
  service_id          uuid references services (id) on delete set null,

  -- Snapshot of the service, so later edits don't change old bookings.
  service_name        text not null,
  price_pounds        int  not null check (price_pounds >= 0),
  deposit_pounds      int  not null check (deposit_pounds >= 0),
  duration_min        int  not null,
  starts_at           timestamptz not null,

  client_name         text not null,
  client_email        text not null,
  client_phone        text not null,
  notes               text,

  status              text not null default 'pending_deposit'
                      check (status in ('pending_deposit', 'confirmed', 'expired',
                                        'cancelled', 'completed', 'no_show')),
  expires_at          timestamptz not null,
  client_says_paid_at timestamptz,
  paid_at             timestamptz,
  cancelled_at        timestamptz,
  reminder_sent_at    timestamptz,
  created_at          timestamptz not null default now()
);

-- A slot can have only one live booking, even if two people submit at once.
create unique index one_live_booking_per_slot
  on bookings (slot_id)
  where status in ('pending_deposit', 'confirmed');

-- A single row of business settings. The boolean key allows only one row.
create table settings (
  id                  boolean primary key default true check (id),
  bank_account_name   text not null default '',
  bank_sort_code      text not null default '',
  bank_account_number text not null default '',
  hold_hours          int  not null default 2  check (hold_hours > 0),
  min_notice_hours    int  not null default 24 check (min_notice_hours >= 0),
  deposit_policy      text not null default '',
  -- Two lines: street, then town and postcode.
  address             text not null default '',
  -- Her usual hours in a sentence, shown under "Find us".
  hours_note          text not null default '',
  instagram_handle    text not null default '',
  about_text          text not null default ''
);

-- Row Level Security. The service role key bypasses RLS, so server code can
-- read and write everything. The public (anon) key can only read active services.
alter table services enable row level security;
alter table slots    enable row level security;
alter table bookings enable row level security;
alter table settings enable row level security;

create policy "Anyone can read active services"
  on services for select
  to anon, authenticated
  using (is_active);

-- Belt and braces: take away table privileges the public roles don't need,
-- so a missing or mistaken policy can't expose anything.
revoke insert, update, delete, truncate on services from anon, authenticated;
revoke all on slots, bookings, settings from anon, authenticated;
