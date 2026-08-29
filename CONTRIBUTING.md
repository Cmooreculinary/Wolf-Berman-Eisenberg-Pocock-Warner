# Contributing

## The one rule that matters

`REVIEW_LOG` in `lib/repos.ts` is the single source of truth. One row per
airing. Air dates, episode numbers, hosts and titles are written down there and
nowhere else — the skills curriculum, the rolling window, the vault and the
deck all resolve through it.

If you find yourself writing an air date in a second file, stop. That is two
chances to be wrong about the same fact, and `pnpm check:data` will fail.

## Setup

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Before you open a pull request

```bash
pnpm check   # typecheck + data integrity
pnpm build
```

CI runs the same two commands. `tsconfig.json` is strict and the build no
longer ignores type errors, so a type error is a failed build — please don't
re-add an escape hatch to get past one.

## Adding or correcting an airing

Add a row to `REVIEW_LOG`:

```ts
{
  repo: "owner/name",        // also the crossover dedupe key
  name: "Display Name",
  blurb: "One sentence on why it was reviewed.",
  pillar: "agents",          // agents | governance | media
  lang: "Python",
  license: "MIT",
  website: "https://…",
  ep: 214,
  host: "Warner",            // must be one of HOSTS
  epTitle: "Episode title",
  date: "2026-08-21",        // ISO, the day it aired
}
```

Then run `pnpm check:data`. It will tell you if the episode number contradicts
an existing row, if the host is not a tracked feed, or if a skill lesson now
disagrees with the log.

**Only add airings that actually happened.** This project indexes real videos by
real people. An invented episode number, title or date is not a placeholder — it
is a false statement about someone, and it will be reverted.

## Adding a feed

Add the name to `HOSTS` in `lib/repos.ts` and fill in its entry in
`PROVIDER_CHANNEL`, `PROVIDER_NAME`, `PROVIDER_SHORT` and `FEED_FOCUS`. The type
system will point at every map that still needs one; the views derive their host
lists from `HOSTS`, so there is nothing to update in the UI.

A tracked feed with no airings yet is fine — the board counts real coverage and
says how many feeds actually aired. Do not fabricate rows to fill it in.

## Adding a skill

Skills live in `lib/skills.ts`. A lesson cites an episode number; the air date
and canonical host come from the log. `demos` must name repos that exist in the
log — the data check enforces it.

## Style

Match the file you are editing. Comments explain *why* a thing is the way it is,
not what the line does.
