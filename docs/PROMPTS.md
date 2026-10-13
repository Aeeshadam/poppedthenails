# Build prompts

Nine steps. Steps 1 to 3 build every screen with hard-coded dummy data. Steps 4 to 9 add the database, the real booking logic, admin actions, emails and deployment behind those screens.

Start a fresh Claude Code session for each step, paste the prompt, approve the plan, then review and commit before moving on. Each step has a "done when" check for you to try by hand.

## Before step 1 (you do this)

1. Create an empty private GitHub repo and clone it.
2. Copy in `CLAUDE.md`, `docs/SPEC.md` and `docs/PROMPTS.md`.
3. Save a screenshot of each purple design screen into `docs/designs/`: `Home.png`, `1 · Choose service.png`, `2 · Date & time.png`, `3 · Your details.png`, `4 · Send deposit (bank transfer).png`, `Confirmed (after she marks it paid).png`, `Admin · Log in.png`, `Admin · Bookings.png`, `Admin · Services.png`, `Admin · Availability.png`.
4. Put the logo at `public/logo.png` and the gallery photos in `public/gallery/`.
5. Create a Supabase project (London or EU region) and a Resend account. Keep the keys handy for step 4 and step 8.

## Step 1 — Project setup and home page

```
Read CLAUDE.md and docs/SPEC.md.

Set up the project: Next.js (App Router) with TypeScript in strict mode, Tailwind CSS,
ESLint, Vitest, and npm scripts for dev, typecheck, lint and test. Put the design tokens
from the spec into the Tailwind theme and load Fraunces, DM Sans and Sacramento with
next/font.

Then build only the home page at / to match docs/designs/Home.png, using hard-coded
dummy services and the photos in public/gallery/. Use public/logo.png in the header
and footer. Build a shared layout, button and card component as you go.

Create .env.example with the variable names from the spec, and make sure .env.local
is git-ignored. Update the Commands section of CLAUDE.md with the real commands.

Show me your plan first. Do not set up Supabase or any other page yet.
```

Done when: `npm run dev` shows the home page looking like the design on a phone-width window.

## Step 2 — Booking pages (UI only)

```
Read CLAUDE.md and docs/SPEC.md.

Build the public booking screens with hard-coded dummy data. No database, server
actions or emails yet. Extend the dummy data in src/lib/dummy.ts with open slots,
settings (bank details, deposit policy) and a few bookings.

1. /book to match "docs/designs/1 · Choose service.png": list the dummy services, let
   the client select one, and continue to /book/time?service=<id>.
2. /book/time to match "docs/designs/2 · Date & time.png": a month calendar where only
   days with dummy open slots can be picked, then that day's times. Times display in
   Europe/London.
3. /book/details to match "docs/designs/3 · Your details.png": name, email, mobile,
   notes and the policy checkbox, with proper labels. "Book my slot" goes to a dummy
   booking page; no saving yet.
4. /booking/[token] to match "docs/designs/4 · Send deposit (bank transfer).png" while
   pending_deposit and "docs/designs/Confirmed (after she marks it paid).png" once
   confirmed, plus clear messages for expired and cancelled. Use dummy tokens so each
   state can be opened. Copy buttons work; "I've sent it" only changes the screen.
5. /terms with the deposit and booking terms, and /gallery with every gallery photo,
   both linked in the footer, and a 404 page.
6. The desktop layout: booking pages centred in a column about 480px wide.

Add small helpers for displaying dates and times in Europe/London, with tests that
include the March and October clock changes.

Show me your plan first.
```

Done when: you can click through every booking screen on your phone and each one looks like its design.

## Step 3 — Admin pages (UI only)

```
Read CLAUDE.md and docs/SPEC.md.

Build the admin screens with hard-coded dummy data. No sign-in, database or emails
yet; buttons may change what is on screen but nothing is saved.

1. /admin/login to match "docs/designs/Admin · Log in.png".
2. A shared admin layout with the logo, Admin badge, sign out, and the three tabs
   (Bookings, Availability, Services).
3. /admin to match "docs/designs/Admin · Bookings.png": "Waiting for deposit" (showing
   whether the client says they've paid and the time left), "Today" and "Upcoming",
   with Mark as paid, Cancel, Completed and No-show buttons.
4. /admin/services to match "docs/designs/Admin · Services.png": list, add and edit
   forms, and show/hide toggle.
5. /admin/availability to match "docs/designs/Admin · Availability.png": a week strip,
   a grid of half-hour times from 08:00 to 21:00 plus a custom time field, booked slots
   locked and labelled, and a summary of the week's slots.
6. /admin/settings (no design; follow the other admin pages): bank details, address,
   about text, usual hours, deposit policy wording, hold hours,
   minimum notice.
7. The desktop layout: admin pages centred in a column about 480px wide.

Show me your plan first.
```

Done when: you can click through every admin screen on your phone and each one looks like its design.

## Step 4 — Database

```
Read CLAUDE.md and the "Data model" and "Security and access" sections of docs/SPEC.md.

Write Supabase SQL migrations in supabase/migrations/ for the four tables (services,
slots, bookings, settings), the one_live_booking_per_slot unique index, and Row Level
Security: the anon key can read only active services; nothing else is readable or
writable without the service role key.

Add a seed file with six dummy services, a single settings row with dummy bank details
and address, and about twenty slots spread over the next three weeks (evenings from
17:00 on weekdays, daytime at weekends).

Add two Supabase client helpers: one for the browser using the anon key, one
server-only helper using the service role key that cannot be imported into client
components. Generate TypeScript types for the tables.

Tell me exactly which commands or SQL I need to run in Supabase, and which values go
in .env.local. Show me your plan first.
```

Done when: the tables and seed data are visible in the Supabase dashboard.

## Step 5 — Booking on real data

```
Read CLAUDE.md and the "Booking flow and slot rules" section of docs/SPEC.md.

Replace the dummy data on the public pages with Supabase:
1. The home page and /book read active services and the settings row. Handle the case
   of no active services with a friendly message.
2. getOpenSlots(): slots with no pending_deposit or confirmed booking that start more
   than min_notice_hours from now. /book/time uses it.
3. /book/details: server-side Zod validation, a honeypot field, and a limit of 3
   bookings per email per day.
4. createBooking(): copies the service snapshot, sets status pending_deposit, a random
   token, a unique reference like POP-4827, and expires_at two hours ahead. If the
   unique index rejects it, return the client to step 2 with "Sorry, that time has
   just gone".
5. /booking/[token] reads the real booking, and "I've sent it" calls clientSaysPaid.

Do not send emails yet; leave clearly marked TODO hooks where emails 1, 2 and 3 go.

Write Vitest tests for: open-slot filtering, the 24-hour cut-off, two bookings for the
same slot (second must fail), and reference generation.

Show me your plan first.
```

Done when: hiding a service in the Supabase dashboard removes it from the site, and you can book a slot on your phone, land on the deposit page, and the slot disappears for a second visitor.

## Step 6 — Admin sign-in and bookings

```
Read CLAUDE.md and docs/SPEC.md.

Wire the admin screens from step 3 to Supabase:
1. /admin/login uses Supabase Auth email and password, with "Forgot password?". Only ADMIN_EMAIL may sign in; anyone
   else sees a polite refusal.
2. Every admin route and action checks the signed-in email equals ADMIN_EMAIL on the
   server. Sign out works.
3. /admin reads real bookings.
4. markPaid(id) and cancelBooking(id) server actions, plus marking a past booking
   completed or no-show.

Leave TODO hooks for emails 4 and 6. Tell me what to set in Supabase Auth (site URL,
redirect URLs, sign-ups off) and how to create the admin user.

Show me your plan first.
```

Done when: you sign in with your email and password, mark your test booking as paid, and its booking page switches to "You're booked".

## Step 7 — Admin services, availability and settings

```
Read CLAUDE.md and docs/SPEC.md.

Wire the remaining admin screens from step 3 to Supabase:
1. /admin/services: add, edit and show/hide.
2. /admin/availability: addSlots and removeSlot. Booked slots cannot be removed.
3. /admin/settings saves the settings row.

All times are entered and shown in Europe/London and stored in UTC. Add tests for
slot creation across the March and October clock changes.

Show me your plan first.
```

Done when: a slot you add in admin appears on the public booking page, and a booked slot cannot be removed.

## Step 8 — Emails

```
Read CLAUDE.md and the "Emails" section of docs/SPEC.md.

Build the seven emails as React Email templates in the purple design with the logo,
and a single sendEmail helper using Resend. Wire them into the TODO hooks from steps
5 and 6: emails 1 and 2 on booking, 3 on "I've sent it", 4 on mark as paid (with an
.ics calendar attachment), 6 on cancel. Emails 5 and 7 are wired in step 9, but build
their templates now.

An email failure must never fail the booking: catch, log, and carry on.

Resend is in test mode with no verified domain, so emails only reach the account
owner's address. Add a preview route or script so I can view every template in the
browser without sending.

Show me your plan first.
```

Done when: a test booking sends you the deposit email, and marking it paid sends the confirmation with a calendar file.

## Step 9 — Sweep, polish and deploy

```
Read CLAUDE.md and docs/SPEC.md.

Build:
1. /api/cron/sweep, protected by CRON_SECRET, as a Netlify scheduled function every
   15 minutes. It expires pending_deposit bookings past expires_at unless
   client_says_paid_at is set (send email 5), and sends email 7 once for confirmed
   bookings starting tomorrow.
2. Page titles, meta description, favicon from the logo, and a social share image.
3. Loading, empty and error states on every page.
4. A netlify.toml and anything else needed to deploy on Netlify.

Write tests for the sweep: expiry after two hours, no expiry when the client says
they paid, and the reminder sent only once.

Then give me a launch checklist: Netlify environment variables, Supabase redirect
URLs, and what to change when the domain poppedthenail.co.uk is bought later.

Show me your plan first.
```

Done when: the site runs on its Netlify address, and a full test booking works there from start to finish, including the emails.

## After each step

- Read the diff before committing.
- Try the "done when" check on your phone.
- If you changed your mind about anything, update `docs/SPEC.md` first so later sessions follow it.
- Merge to `main` only when the step is finished, to save Netlify credits.
