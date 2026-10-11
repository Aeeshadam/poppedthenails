# poppedthenail

A booking website for a one-person nail business. Clients pick a service and one of her open slots, pay a £5 deposit by bank transfer, and she confirms it in an admin page.

## Read these first

- `docs/SPEC.md` is the source of truth for behaviour, data model, routes and emails. Follow it. If a request conflicts with it, say so and ask before changing course.
- `docs/designs/` holds a screenshot of every screen. Match them closely: colours, fonts, spacing, wording.
- `docs/PROMPTS.md` lists the nine build steps. Work on one step at a time and stop when it is done.

## Stack

- Next.js (App Router) with TypeScript, strict mode
- Tailwind CSS, using the design tokens in the spec
- Supabase: Postgres, Auth (email and password, admin only), Storage
- Resend with React Email
- Hosted on Netlify; a scheduled function runs the sweep
- Vitest for unit tests

## Commands

Node 22 or later.

- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Type check: `npm run typecheck` (runs `next typegen` first, so route types like `LayoutProps` exist)
- Lint: `npm run lint` (ESLint CLI; `next lint` no longer exists in Next 16)
- Tests: `npm test` (Vitest, single run); `npm run test:watch` while working
- Tests against the real Supabase database (uses `.env.local`, cleans up after itself): `npm run test:db`
- Production build: `npm run build`
- Apply migrations and seed to the linked Supabase project: `npm run db:push`
- Regenerate database types after a migration: `npm run db:types`

Run type check, lint and tests before saying a step is finished.

## Rules

- Money is stored in whole pounds as integers (`price_pounds`, `deposit_pounds`). Add the £ sign only when displaying.
- Times are stored in UTC as `timestamptz` and always displayed in `Europe/London`.
- All writes, and all reads of `slots`, `bookings` and `settings`, happen in server code using the service role key. Never import that key into a client component.
- The public (anon) key may only read active services.
- Every admin page and server action checks the signed-in user's email equals `ADMIN_EMAIL`.
- Validate every form on the server with Zod.
- Bank details appear only on `/booking/[token]` and in email 1.
- Never commit secrets. Keys live in `.env.local`, which is git-ignored. Keep `.env.example` up to date with names only.
- Database changes go in new SQL files under `supabase/migrations/`. Never edit an old migration.
- Ask before adding a dependency that the spec does not name.
- Mobile first. Build at 390px wide, then add the desktop layout described in the spec.
- Use real buttons, links, labels and inputs. Keep touch targets at least 44px.

## Current constraints

- There is no domain yet. Use `http://localhost:3000` and the Netlify address for `SITE_URL`.
- Resend is in test mode, so emails only reach the account owner's address. Do not treat that as a bug.
- Services, bank details, address and about text are dummy seed data.
- The ten photos in `public/gallery/` are listed in `src/lib/dummy.ts`; `hero-pink-red-almond.jpg` is the home hero. Whether they are her work is still to be confirmed.

## Working style

- Show a short plan before writing code for a step, and wait for approval.
- Keep changes small and focused on the current step. Do not build ahead.
- Write tests for booking logic: taking a slot, the double-booking rule, the 2-hour expiry, the 24-hour cut-off.
- When finished, list what was built, what was tested, and anything left open.
