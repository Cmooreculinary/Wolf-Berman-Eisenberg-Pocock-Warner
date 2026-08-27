# Eisenberg, Pocock, Warner, Wolfe & Berman

A Next.js application providing a rolling four-week intelligence workspace.

## Local development

Requirements:

- Node.js 22
- pnpm 10

[Continue working on v0 →](https://v0.app/chat/projects/prj_C2Y2oJJjpfucsWZ20ZN8eVoeUWDF)

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

## Production build

```bash
pnpm build
pnpm start
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
