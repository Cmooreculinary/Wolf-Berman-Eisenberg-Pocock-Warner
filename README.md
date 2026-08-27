# Eisenberg, Pocock, Warner, Wolfe & Berman

A rolling four-week intelligence workspace over five public founder feeds.
Repos reviewed with crossovers cut, the skills each review taught, an ACP
funnel simulator, a technical-core inventory, a founder toolbox, and a
13-slide deck that exports to `.pptx` in the browser.

**[Live site →](https://eisenberg-pocock-warner-wolfe-berman.onrender.com)**

> An independent, unaffiliated index of publicly available videos. Not endorsed
> by, sponsored by, or affiliated with any of the creators listed.

## What it does

Every Monday the window rolls: the week that just closed is filed as Week 1,
each surviving week shifts down a slot, and whatever falls out of Week 4 is
vaulted. The board is always exactly four weeks wide.

A repo reviewed on more than one feed appears once — the newest airing wins,
and the superseded airings stay attached to the row so the cut is auditable
rather than invisible.

| View | What it holds |
| --- | --- |
| Convergence | The five feeds, the three pillars, and how they overlap |
| Repos | The rolling board — every repo reviewed in the live window |
| Skills | What each airing actually taught, tiered foundational → advanced |
| Toolbox | Value-prop builder, unbundling playbook, ACP funnel simulator |
| Inventory | The technical core — agents, methods, protocols |
| Vault | Weeks that have rolled out of the live window |
| Deck | A 13-slide summary, exportable to `.pptx` |

## Data model

`lib/repos.ts` holds `REVIEW_LOG` — one row per airing — and is the single
source of truth for episode numbers, hosts, titles, and air dates. Everything
else derives from it:

- `EPISODES` folds the log into one row per episode.
- `lib/skills.ts` resolves each lesson's air date and host *through* that fold
  rather than writing them down a second time, so the repo board and the
  curriculum cannot disagree about when an episode aired.
- `HOSTS`, `PROVIDER_CHANNEL` and `PROVIDER_NAME` are the only place a feed's
  identity lives; `SOURCE_FEEDS` in `lib/data.ts` reads through them, so a feed
  can never be linked one way on one screen and another way on the next.

Both windows anchor on the newest row in the log rather than the wall clock, so
the server and the client always compute the same four weeks.

`pnpm check:data` enforces the parts of that the type system cannot: that an
episode number means the same thing everywhere it appears, that no lesson cites
an episode missing from the log, and that no lesson demos a repo the log never
reviewed. It runs in CI ahead of the build.

### On coverage

Five feeds are tracked. Not all five have reviews in every window — a tracked
feed can have a quiet four weeks. The board counts which feeds actually aired
and says so, rather than implying full coverage. Airings are only ever added
from real episodes.

## Local development

Requires Node.js 22 and pnpm 10.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:3000>.

## Checks

```bash
pnpm check        # typecheck + data integrity — what CI runs
pnpm typecheck    # tsc --noEmit
pnpm check:data   # review log / curriculum consistency
pnpm build        # production build
```

## Deploying

Every route is prerendered, so this deploys as a **static site** — no server,
no database, no API route. `STATIC_EXPORT=true pnpm build` writes ~1.7 MB to
`out/`.

- **Render** — `render.yaml` is a Blueprint; Render Dashboard → New → Blueprint
  → pick this repo. Full detail, including the manual path, in [RENDER.md](RENDER.md).
- **Hugging Face Spaces** — as a Static Space. See [PUBLISHING.md](PUBLISHING.md).
- **Vercel / v0** — works unchanged. `STATIC_EXPORT` is opt-in: unset, Next
  serves the app and applies the security headers itself.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Corrections to the review log are the
most useful contribution — if an air date, attribution, or episode number is
wrong, say which row.

## License

[MIT](LICENSE) © Blue Collar Appz Co.
