# poppedthenail — Technical Spec

As of 3 October 2026.

## Summary

poppedthenail is a mobile-first booking site for a one-person nail business, built to cost nothing to run except the domain. Clients pick a service and a time, then pay a £5 deposit by bank transfer. She confirms the payment with one tap in her admin page, and the site sends every email for her.

Decisions already made:

- **Name:** poppedthenail, lower case and one word. Domain: poppedthenail.co.uk (to be bought at launch, not before).
- **Design:** the clean purple design, with the Popped logo. Screenshots are in `docs/designs/`.
- **Payments:** bank transfer only. No Stripe or other card processor, so no fees.
- **Hosting:** Netlify free plan.
- **Deposit:** £5 by default, editable per service.
- **Hold time:** an unpaid booking holds its slot for 2 hours, then cancels itself.
- **Availability:** she adds each open date and time herself. There are no weekly opening hours to maintain.
- **Notice:** clients can book up to 24 hours before a slot, not later.
- **Services:** each is booked on its own. No add-ons and no clean-up gap.
- **Accounts:** clients never log in. Only she logs in, by email link.
- **Time zone:** everything is shown in UK time (Europe/London) and stored in UTC.

## Stack and accounts

One Next.js app holds the public site, the booking flow and the admin pages. Three free services sit behind it.

| Part | Choice | What it does | Cost |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Pages, server actions, API routes | Free |
| Styling | Tailwind CSS | The purple design as reusable tokens | Free |
| Calendar | DayPicker (`@daypicker/react`) | The month calendar on step 2. Days are matched to slots by UK date, not the visitor's time zone. | Free |
| Hosting | Netlify | Builds from GitHub, runs server code as functions, scheduled functions | Free plan: 300 credits a month, 15 per production deploy |
| Database | Supabase Postgres | Services, slots, bookings, settings | Free tier |
| Admin login | Supabase Auth, email link | Her sign-in, no password | Free tier |
| Photos | Supabase Storage, and `public/gallery/` for now | Service photos in Storage. Gallery photos are a fixed list in code for now (see open questions). | Free tier |
| Email | Resend + React Email | All client and admin emails | Free tier, check current limits |
| Domain | Any registrar | Site address and the email sending address | About £10 a year |
| Code | GitHub private repo | Source, deploy trigger | Free |

Three things to know before building:

- **Netlify credits:** deploy to production in batches. Her day-to-day changes live in the database and cost no deploys.
- **Supabase free tier:** free projects can be paused after a period with no activity. The scheduled sweep queries the database regularly, which keeps it active. Check the current rule at setup.
- **No domain during the build:** the site runs locally and on a free Netlify address. Resend can only send to the account owner's own email until a domain is verified, which is enough for testing all seven emails.

## Pages and routes

| Route | Page | Who | Notes |
| --- | --- | --- | --- |
| `/` | Home | Public | Hero, photo carousel, services, about, good to know, find us. Reads services and settings. |
| `/gallery` | Gallery | Public | All gallery photos in a grid, a link to Instagram and a book button. Linked from the carousel and the footer. |
| `/book` | Step 1, choose service | Public | Active services only |
| `/book/time?service=…` | Step 2, date and time | Public | Shows the days that have open slots, then the times on the chosen day |
| `/book/details?service=…&slot=…` | Step 3, your details | Public | Name, email, mobile, notes, policy checkbox |
| `/booking/[token]` | Send deposit, then Confirmed | Public, by secret link | One page that changes with the booking status. Shows bank details only here. |
| `/admin/login` | Admin log in | Her | Email link |
| `/admin` | Bookings | Her | Waiting for deposit, today, upcoming. Mark as paid, cancel. |
| `/admin/services` | Services | Her | Add, edit, show or hide |
| `/admin/availability` | Availability | Her | Add and remove the dates and times she is free |
| `/admin/settings` | Settings (no design yet; follow the other admin pages) | Her | Bank details, address, usual hours, about text, deposit wording, hold hours, minimum notice |
| `/terms` | Terms and conditions | Public | Deposit and cancellation policy, holding a slot, booking notice, on the day. Linked from "Good to know", the footer and the policy checkbox on step 3. |

Server endpoints:

| Endpoint | Type | Does |
| --- | --- | --- |
| `getOpenSlots()` | Server action | Returns every free slot more than 24 hours away |
| `createBooking(form)` | Server action | Validates, takes the slot, sends emails 1 and 2, redirects to `/booking/[token]` |
| `clientSaysPaid(token)` | Server action | Sets a flag and emails her |
| `markPaid(id)`, `cancelBooking(id)` | Server actions, admin only | Change status and email the client |
| `addSlots(date, times)`, `removeSlot(id)` | Server actions, admin only | Manage her open slots |
| `/api/cron/sweep` | Netlify scheduled function, every 15 minutes | Expires unpaid bookings and sends day-before reminders |

The designs are mobile only. On desktop, centre the same layout in a column about 480px wide for the booking and admin pages, and widen the home page to two columns.

Home page sections, top to bottom:

- **Header:** logo and a "Book now" button.
- **Hero:** the hero photo in an arched card, darkened towards the bottom, with "hey gorgeous", "Pretty nails, happy you." and a white "Book your slot" button on top. A one-line intro sits under the card.
- **Photo carousel:** arched slides of the gallery photos. It moves on by itself every 4 seconds, loops back to the start after the last photo, and can be swiped. Swiping (or tapping an arrow on desktop) pauses it, and a Pause/Play button stops and restarts it (WCAG 2.2.2). It never moves by itself when the device asks for reduced motion. "Gallery →" links to `/gallery`.
- **Services:** the first four active services, and "See all services & book".
- **About** and **Good to know** cards. Good to know links to `/terms`.
- **Find us:** a drawn map preview (not a live map, so nothing loads from Google), the address on two lines, her usual hours, and "Get directions", which opens Google Maps.
- **Footer:** logo; links to Gallery, Book now and Terms & conditions; Instagram; copyright.

On desktop (768px and wider) the home page sits in a 1024px column. The hero becomes two columns: the headline, intro and a purple "Book your slot" button on the left, and the arched photo on the right. The carousel shows four photos at a time and adds previous and next arrow buttons because there is no swipe.

## Data model

Four tables in Supabase Postgres. Money is stored in whole pounds as integers, and times as `timestamptz` in UTC.

**`services`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid, primary key | |
| `name` | text | "BIAB overlay" |
| `description` | text, nullable | |
| `duration_min` | int | 15 to 240. Shown to clients; not used to work out slots. |
| `price_pounds` | int | Whole pounds |
| `deposit_pounds` | int, default 5 | Whole pounds |
| `photo_path` | text, nullable | Path in Supabase Storage |
| `is_active` | boolean, default true | The show or hide switch |
| `created_at` | timestamptz, default now() | Services are listed in the order they were added |

**`slots`** (each date and time she is free, added by her)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid, primary key | |
| `starts_at` | timestamptz, unique | One row per appointment start, such as Sat 10 Oct 17:00 |
| `created_at` | timestamptz, default now() | |

**`bookings`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid, primary key | |
| `token` | uuid, unique | Secret link for the client's booking page |
| `reference` | text, unique | Short payment reference, "POP-4827" |
| `slot_id` | uuid, references slots | The slot this booking takes |
| `service_id` | uuid, references services | |
| `service_name`, `price_pounds`, `deposit_pounds`, `duration_min` | copied from the service | A snapshot, so later price edits don't change old bookings |
| `starts_at` | timestamptz | Copied from the slot |
| `client_name`, `client_email`, `client_phone` | text | |
| `notes` | text, nullable | |
| `status` | text | `pending_deposit`, `confirmed`, `expired`, `cancelled`, `completed`, `no_show` |
| `expires_at` | timestamptz | When an unpaid hold ends |
| `client_says_paid_at` | timestamptz, nullable | Set by the "I've sent it" button |
| `paid_at`, `cancelled_at`, `reminder_sent_at` | timestamptz, nullable | |
| `created_at` | timestamptz, default now() | |

**`settings`** (a single row)

| Column | Type | Notes |
| --- | --- | --- |
| `bank_account_name`, `bank_sort_code`, `bank_account_number` | text | Shown only on the deposit page and in email 1. Dummy values until launch. |
| `hold_hours` | int, default 2 | |
| `min_notice_hours` | int, default 24 | Latest a client can book before a slot |
| `deposit_policy` | text | The wording shown before booking and in emails |
| `address` | text | Two lines: street, then town and postcode. Home page, confirmed page and emails. Dummy value until launch. |
| `hours_note` | text | Her usual hours in a sentence, shown under "Find us". Dummy value until launch. |
| `about_text` | text | Home page. Dummy value until launch. |

The Instagram handle is fixed, so it is a constant in `src/lib/content.ts` rather than a setting.

One database rule prevents double-booking even if two people submit at the same second. A slot can have only one live booking:

```sql
create unique index one_live_booking_per_slot
  on bookings (slot_id)
  where status in ('pending_deposit', 'confirmed');
```

## Booking flow and slot rules

A booking is created unpaid, holds its slot for 2 hours, and becomes confirmed only when she marks the deposit as paid.

Booking statuses:

```
pending_deposit --(she marks paid)--------> confirmed --(done)--------------> completed
       |                                        |      \--(did not turn up)--> no_show
       |--(no deposit in 2 hours)--> expired    |--(she cancels)-------------> cancelled
       \--(she cancels)-----------> cancelled
```

Only `pending_deposit` and `confirmed` block a slot.

The client's steps:

1. Choose a service on `/book`.
2. Pick one of her open slots on `/book/time`.
3. Enter name, email and mobile, tick the policy box, and press "Book my slot".
4. The server checks the slot is still free and creates the booking as `pending_deposit`. Email 1 goes to the client and email 2 to her.
5. The client lands on `/booking/[token]`, which shows the bank details, the £5 amount and their reference.
6. The client pays in their banking app and can press "I've sent it", which emails her.
7. She checks her bank, opens `/admin` and presses "Mark as paid". The booking becomes `confirmed` and email 4 goes to the client.
8. The same `/booking/[token]` page now shows the confirmation.

How dates and times work. She adds each slot herself, and the site offers only those:

1. **She adds slots.** On `/admin/availability` she picks a date and taps the start times she is free, such as 17:00 and 18:30. A "copy this week to next week" button repeats a pattern.
2. **Clients see open slots.** A slot is open if it has no booking with status `pending_deposit` or `confirmed`, and it starts more than 24 hours from now.
3. **A booking takes one slot.** Any service can go in any slot. She spaces her slots to suit her longest service.
4. **To be unavailable, she does nothing.** A day with no slots is not offered. She can delete any slot that has no live booking.

Rules for holds and expiry:

- `expires_at` is 2 hours after the booking is made.
- The scheduled sweep runs every 15 minutes. It sets overdue `pending_deposit` bookings to `expired` and sends email 5.
- A booking where the client has pressed "I've sent it" does not expire by itself. It waits for her to mark it paid or cancel it, so a client who paid is never dropped because she was busy.
- If two clients submit the same slot together, the database index rejects the second. Show "Sorry, that time has just gone" and return them to step 2.
- She can cancel any booking from `/admin`. Whether the deposit is returned is her call, made outside the site.

## Emails

Seven emails, all sent by the server through Resend.

| # | Email | To | Sent when | Contains |
| --- | --- | --- | --- | --- |
| 1 | Send your deposit | Client | Booking created | Service, date and time, £5 amount, bank details, reference, 2-hour deadline, link to their booking page |
| 2 | New booking | Her | Booking created | Client name, service, time, reference, link to `/admin` |
| 3 | Client says they've paid | Her | Client presses "I've sent it" | Name, reference, link to `/admin` |
| 4 | You're booked | Client | She marks it paid | Service, date and time, address, amount left to pay, calendar file (.ics), deposit policy |
| 5 | Your slot was released | Client | Hold expires unpaid | Short note and a link to book again |
| 6 | Booking cancelled | Client | She cancels | Short note, her contact |
| 7 | See you tomorrow | Client | The day before, sent by the sweep | Time, address, "come with bare nails" |

Build details:

- Templates are React Email components in the purple design, with the logo at the top.
- The sender is `EMAIL_FROM` and replies go to `ADMIN_EMAIL`.
- The reminder is sent once per booking. `reminder_sent_at` stops duplicates.
- If an email fails to send, the booking still succeeds. Log the error and show the details on screen.

## Security and access

The browser can read only public content. Every write, and every read of client data, goes through server code.

- **Row Level Security on every table.** The public (anon) key can read `services` where `is_active` is true. It cannot read `slots`, `bookings` or `settings` at all.
- **Server-only key.** Server actions use the Supabase service role key, which never reaches the browser.
- **Admin check.** Every admin page and action checks for a signed-in Supabase user whose email equals `ADMIN_EMAIL`. Turn off public sign-ups in Supabase Auth.
- **Client booking page.** `/booking/[token]` uses a random UUID, not the short reference, so it can't be guessed.
- **Bank details.** Shown only on the deposit page and in email 1, never on a public page.
- **Slots endpoint.** Returns open start times only, never who booked.
- **Spam.** Validate the form on the server with Zod, add a hidden honeypot field, and limit bookings to 3 per email address per day.
- **Sweep endpoint.** Rejects calls without the `CRON_SECRET` header.
- **Personal data.** She holds names, emails and phone numbers, so UK GDPR applies. Delete client details from bookings older than 12 months. Check whether she needs to register with the ICO. There is no privacy page for now (decided 6 October 2026); see open questions.

## Environment and deployment

| Variable | Used for | Secret |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project address | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public read access | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes and booking reads | Yes |
| `RESEND_API_KEY` | Sending email | Yes |
| `EMAIL_FROM` | Sender address. Resend's test sender until the domain is bought, then `bookings@poppedthenail.co.uk` | No |
| `ADMIN_EMAIL` | The one email allowed into `/admin`, and where her notices go. aeeshaht@gmail.com for now. | No |
| `SITE_URL` | Links in emails and the sign-in redirect. `http://localhost:3000` locally, the Netlify address when deployed. | No |
| `CRON_SECRET` | Protects the sweep endpoint | Yes |

Setup steps, in order:

1. Create the Supabase project in a London or EU region. Run the SQL migrations for the tables, the one-booking-per-slot index and the security rules.
2. Create a public Storage bucket called `photos`.
3. In Supabase Auth, set the site URL and redirect URLs (localhost and the Netlify address) and turn off sign-ups. Create her user by hand.
4. Connect the GitHub repo to Netlify and add the environment variables.
5. Add the scheduled function for `/api/cron/sweep`, every 15 minutes.
6. Deploy, then run one test booking end to end on the Netlify address.
7. At launch: buy the domain, add it to Netlify, add Resend's DNS records, and update `SITE_URL`, `EMAIL_FROM` and the Supabase redirect URL.

Work on branches and use Netlify deploy previews. Merge to `main` only when a batch of changes is ready, because each production deploy costs 15 credits.

## Design tokens

| Token | Value | Used for |
| --- | --- | --- |
| `background` | `#FAF7FF` | Page background |
| `surface` | `#FFFFFF` | Cards, inputs |
| `ink` | `#2E1F47` | Text, dark buttons, footer |
| `muted` | `#6A5A85` | Secondary text |
| `accent` | `#7C4DCC` | Main buttons, links, selected states |
| `accent-hover` | `#5B34A3` | Hover and pressed |
| `lilac` | `#DCC6F5` | Badges, soft blocks (close to the logo colour) |
| `soft` | `#F3ECFD` | Selected card fill, available days |
| `line` | `#E6DAF5` | Borders and dividers |
| `success` | `#25613A` on `#E3F1E6` | "Paid" badge |
| `warning` | `#7A4A0B` on `#FBEBD3` | "Awaiting deposit" badge |

| Font | Role | Sizes |
| --- | --- | --- |
| Fraunces (400, 600) | Headings | 46 hero, 30 to 36 page titles, 22 card titles |
| DM Sans (400, 500, 600) | Body, buttons, forms | 16 body, 15 buttons, 13 to 14 small |
| Sacramento | Small script accents only | 34 to 40 |

Shape and spacing: buttons and chips are fully rounded pills, 54 to 56px tall. Cards use a 20 to 28px radius, inputs 14px and 52px tall. Page side padding is 24px. Load all three fonts with `next/font` so they are self-hosted.

## Build order

Every screen is built first with dummy data, then the database and logic go in behind it.

1. **Project setup.** Next.js, TypeScript, Tailwind with the tokens above, fonts, the logo, and the home page with dummy data.
2. **Booking pages (UI).** Choose service, date and time, your details, the deposit and confirmed page, the gallery and terms pages, and a 404, all on dummy data. Desktop column layout.
3. **Admin pages (UI).** Log in, bookings, services, availability and settings, all on dummy data. Desktop column layout.
4. **Database.** The four tables, the one-booking-per-slot index, security rules, and dummy services and slots.
5. **Booking on real data.** Home and step 1 read Supabase, open slots, `createBooking`, the real deposit and confirmed page.
6. **Admin sign-in and bookings.** Email-link sign-in, real bookings, mark as paid, cancel, completed and no-show.
7. **Admin services, availability and settings.** Saving services, photo upload, adding and removing slots, bank details.
8. **Emails.** The seven templates, Resend, and the calendar file.
9. **Sweep, polish and launch.** Expiry and reminders, titles and favicon, loading and error states, Netlify deploy, and a full test booking.

Test these hardest: two people booking the same slot at once, the 2-hour expiry, the 24-hour cut-off, and times shown correctly across the clock changes in March and October.

## Open questions for her

These can wait until just before launch, because the build uses dummy values.

- [ ] Privacy notice. The privacy page was removed on 6 October 2026. UK GDPR expects clients to be told what is kept about them, why and for how long, so confirm before launch whether a short notice is needed (it could be a section on the terms page).

- [ ] Her real list of services, with length and price for each.
- [ ] Her bank account name, sort code and account number.
- [ ] Studio address, Instagram handle (set in `src/lib/content.ts`) and a few lines about her.
- [ ] Photos. Ten photos are in `public/gallery/`; `hero-pink-red-almond.jpg` is the hero. Confirm they are her work and fine to publish.
- [ ] Should she manage gallery photos from admin (a `gallery_photos` table and upload page), or is a fixed list updated by a developer enough?
- [ ] Her usual hours for "Find us", and the rest of the terms (lateness, allergies, refunds if she cancels).
- [ ] Her own email address for sign-in and notices.
- [ ] Deposit rule: "no notice" is read here as the deposit being non-refundable whenever a client cancels. Confirm the wording.
- [ ] The logo's small text reads "The neils". Confirm the spelling and get a clean logo file.
