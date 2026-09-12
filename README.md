# BetterUptime

This is my take on a Better Uptime / UptimeRobot style monitoring tool — you give it a list of URLs, and it pings them on a schedule, tracks response times, and shows you a dashboard of what's up and what's down. I built it mostly to get hands-on with a real distributed system (queue, workers, multiple regions) instead of another CRUD app.

It's a Turborepo monorepo: a Next.js dashboard, an Express API, and a small pipeline of two background services (a "pusher" and a "worker") that talk to each other over Redis Streams.

## How it actually works

Every few minutes, the **pusher** reads every monitored website out of Postgres and drops each one onto a Redis stream. A **worker** — one per region — is sitting on a consumer group for that stream, picks messages up, pings the URL with axios, and writes the result (up/down, response time) back to Postgres as a `WebsiteTick`. The Express **backend** just serves that data to the frontend and handles auth. I went with Redis Streams instead of a simpler setup mainly so I could have multiple regional workers pulling from the same queue without stepping on each other, and so a crashed worker doesn't just lose whatever it was checking — it can reclaim its own stuck messages when it comes back up.

The frontend is a pretty standard Next.js app — email/password auth (JWT, bcrypt), a dashboard with uptime stats, and a monitors page to add/remove sites you're watching.

## Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind v4
- **Backend**: Express 5, JWT auth, Zod for validation
- **Database**: Postgres via Prisma 7 (using the new driver-adapter setup, `@prisma/adapter-pg`)
- **Queue**: Redis Streams, via the `redis` v5 client
- **Monorepo**: Turborepo + npm workspaces

## Project layout

```
apps/
  web/       Next.js dashboard
  backend/   Express API (auth + website CRUD)
  pusher/    loop that enqueues websites to check
  worker/    consumer that actually pings sites and writes results
packages/
  db/        Prisma schema, migrations, seed script
  redis/     thin wrapper around the Redis Streams client
  common/    shared Zod schemas used by both frontend and backend
```

## Running it locally

You'll need Node 18+, a Postgres database, and a Redis instance. There's a `docker-compose.yml` at the root for both:

```bash
npm run docker:up      # postgres on 5432, redis on 6379
```

> If you already have a Postgres running natively on 5432 (a system service, another docker-compose project, whatever), the container here won't be able to bind that port (ports are restricted to `127.0.0.1` on purpose, so this fails loudly instead of silently routing to the wrong database like it did the first time I hit this). Either stop the other one, or remap the `postgres` service's port in `docker-compose.yml` and adjust `DATABASE_URL` to match.

Install everything from the repo root:

```bash
npm install
```

Each app reads its own `.env` file rather than one shared root `.env` — there's an `.env.example` at the root and in each app/package that needs one (`packages/db`, `apps/backend`, `apps/worker`, `apps/pusher`). Copy each to `.env` in the same folder; the defaults already match `docker-compose.yml`.

`apps/web` doesn't need a `.env` for local dev — it defaults to hitting the backend at `http://localhost:5000`. Set `NEXT_PUBLIC_API_URL` if you're running the backend somewhere else.

Once the env files are in place:

```bash
cd packages/db
npx prisma migrate deploy   # apply the schema
npm run db:seed             # optional: adds a test user + a few sample sites
```

Then from the repo root:

```bash
npm run dev
```

This runs `turbo run dev`, which starts all four apps together — frontend, backend, pusher, and worker. I was wrong in an earlier version of this README claiming the pusher/worker weren't wired in; I hadn't actually checked. They are, and `npm run dev` alone is enough to get the whole pipeline running end to end.

## Testing

```bash
npm run test          # everything (turbo run test)
```

- `packages/common` and `apps/worker` have plain unit tests (schema validation, the up/down check logic with axios mocked out).
- `apps/backend` has both unit tests (auth middleware, error handler) and integration tests that run real HTTP requests against the Express app via supertest, hitting a real Postgres.
- `packages/redis` has an integration test against a real Redis instance — it pushes a message through the actual stream, reads it via a consumer group, and verifies a message left pending by a "dead" consumer gets reclaimed. This one exists specifically because that reclaim path is what silently broke early on (see the commit history if you're curious).

The integration tests need Postgres/Redis running and migrations applied — `npm run docker:up` plus `npx prisma migrate deploy` (from `packages/db`) covers both.

CI (`.github/workflows/ci.yml`) runs build + type-check on every push/PR, plus the full test suite against real Postgres/Redis service containers.

## Where it stands

This is a personal project I'm actively poking at, not something running in production anywhere. Some things worth knowing if you're digging through the code:

- Checks run on a fixed 3-minute cycle for every site — there's no per-monitor interval or pause/disable yet, though the schema has room for it.
- Multi-region support exists in the worker (it's keyed off `REGION_ID`), but I've only ever actually run the `asia` region.
- "Up" currently just means the server responded before a 500 — a site returning a 404 still counts as up. That's intentional (I care more about "is the host reachable" than "is this specific page healthy"), but it's worth knowing if the status doesn't match what you'd expect.

If you want a quick way to see whether the pipeline is actually working: seed the DB, start `worker` and `pusher`, and watch `WebsiteTick` rows show up in Postgres within a few minutes.
