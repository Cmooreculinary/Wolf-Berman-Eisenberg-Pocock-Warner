# Eisenberg, Pocock, Warner, Wolfe & Berman

A Next.js application providing a rolling four-week intelligence workspace.

## Local development

Requirements:

- Node.js 22
- pnpm 10

[Continue working on v0 →](https://v0.app/chat/projects/prj_C2Y2oJJjpfucsWZ20ZN8eVoeUWDF)

## For agents and integrators

Every view is also a public JSON endpoint, generated at build time from the same
modules the pages import:

```bash
curl -s https://eisenberg-pocock-warner-wolfe-berman.onrender.com/api/v1/index.json
```

No key, no quota, CORS open to every origin. The repo also ships a
zero-dependency MCP server, so an agent can read the whole dataset as tools:

```bash
claude mcp add epwwb -- node /absolute/path/to/integrations/mcp/server.mjs
```

Discovery lives at [`/llms.txt`](https://eisenberg-pocock-warner-wolfe-berman.onrender.com/llms.txt),
[`/openapi.json`](https://eisenberg-pocock-warner-wolfe-berman.onrender.com/openapi.json)
and `/.well-known/agent.json`. Full guide: **[INTEGRATE.md](INTEGRATE.md)**.

## Deploying

This site is a static export and deploys free on Render — see [RENDER.md](RENDER.md).
The existing Vercel/v0 deploy keeps working unchanged.

## Getting Started

First, run the development server:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`pnpm dev` and `pnpm build` both run `pnpm api` first, which writes the
machine-readable half of the site — `public/api/v1/*.json`, `public/openapi.json`,
`public/llms.txt` and `public/.well-known/agent.json` — from `lib/`. Those files
are build output and are not committed.

## Production build

```bash
pnpm build
pnpm start
```

## Checks

```bash
pnpm exec tsc --noEmit   # types
pnpm check:export        # every JSON endpoint present and parseable in out/
```

## Render deployment

The repository includes a `render.yaml` Blueprint for a Render Node web service.

1. In Render, choose **New > Blueprint**.
2. Connect `Cmooreculinary/Eisenberg-Pocock-Warner` (or its renamed successor).
3. Render detects `render.yaml`; review the service and apply the Blueprint.
4. Confirm the first deployment passes its `/` health check.
5. Add any future secrets in the Render dashboard, never in this repository.

The service builds with the committed pnpm lockfile, binds to Render's `PORT` on `0.0.0.0`, and automatically deploys changes merged to `main`.

## Data model

`lib/repos.ts` holds `REVIEW_LOG`, one row per airing, and is the single source of
truth for episode numbers, hosts, titles, and air dates. `EPISODES` folds that log
into one row per episode; `lib/skills.ts` resolves each lesson's air date and host
through it rather than writing them down a second time, so the repo board and the
skills curriculum can never disagree about when an episode aired. Both views anchor
their four-week window on the newest row in the log rather than the wall clock, so
the server and the client always compute the same window.

`lib/api.ts` shapes that same data for publication, and `lib/site.ts` is the one
registry of what is published where — add an endpoint there and it appears in the
OpenAPI document, `llms.txt`, the agent manifest, the sitemap and the in-app
Integrate view at once. `lib/funnel.ts` holds the ACP funnel arithmetic, so the
simulator, `/api/v1/funnel.json` and the MCP tool cannot disagree about a number.
