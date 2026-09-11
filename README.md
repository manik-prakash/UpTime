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

You'll need Node 18+, a Postgres database, and a Redis instance. I don't have a `docker-compose.yml` for these yet — I've just been pointing everything at a local Postgres and a Redis container. Something like:

```bash
docker run -d --name uptime-redis -p 6379:6379 redis:7-alpine
```

Install everything from the repo root:

```bash
npm install
```

Each app reads its own `.env` file rather than one shared root `.env`, so you'll need to add these:

```
# packages/db/.env, apps/pusher/.env, apps/worker/.env
DATABASE_URL="postgresql://user:password@localhost:5432/uptime?schema=public"

# apps/backend/.env (also needs DATABASE_URL)
JWT_SECRET_WORD="something long and random"

# apps/worker/.env (also needs DATABASE_URL)
REGION_ID="asia"
WORKER_ID="worker-1"
```

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

That starts the frontend and backend together (`turbo run dev`). The pusher and worker aren't wired into that yet, so I run those separately when I want the actual monitoring loop running:

```bash
cd apps/worker && npm run dev
cd apps/pusher && npm run dev
```

## Where it stands

This is a personal project I'm actively poking at, not something running in production anywhere. Some things worth knowing if you're digging through the code:

- Checks run on a fixed 3-minute cycle for every site — there's no per-monitor interval or pause/disable yet, though the schema has room for it.
- Multi-region support exists in the worker (it's keyed off `REGION_ID`), but I've only ever actually run the `asia` region.
- No test suite yet. I've been leaning on manually running the pipeline end-to-end when I change something in the worker/pusher path.
- "Up" currently just means the server responded before a 500 — a site returning a 404 still counts as up. That's intentional (I care more about "is the host reachable" than "is this specific page healthy"), but it's worth knowing if the status doesn't match what you'd expect.

If you want a quick way to see whether the pipeline is actually working: seed the DB, start `worker` and `pusher`, and watch `WebsiteTick` rows show up in Postgres within a few minutes.
