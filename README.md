# Eisenberg, Peacock & Warner

A rolling four-week intelligence window on the three feeds worth a founder's whole week —
agents, governance, distribution. Built by Blue Collar Appz Co.

## What's in it

- **Convergence** — the three pillars and what sits under each.
- **Repos reviewed** — every repo the three covered, on a four-week board that rolls every Monday. Crossovers are deduped to one row per repo, and weeks that age out land in the vault instead of being deleted.
- **Skills covered** — the same window applied to the teaching curriculum: what was taught, by whom, and which repos were on screen.
- **Blueprint** — the ACP funnel simulator (audience → community → product, with affiliate rev-share).
- **Inventory / Toolbox / Vault** — the technical core, the founder instruments, and the source documents.
- **Deck** — a 13-slide summary, exportable to `.pptx`.

## Data model

`lib/repos.ts` holds `REVIEW_LOG`, one row per airing, and is the single source of truth for
episode numbers, hosts, titles, and air dates. `EPISODES` folds that log into one row per
episode; `lib/skills.ts` resolves its lesson dates through it rather than writing them down a
second time, so the repo board and the curriculum can never disagree about when an episode aired.
Both views anchor their four-week window on the newest row in the log rather than the wall clock,
so the server and the client always compute the same window.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Built with v0

This repository is linked to a [v0](https://v0.app) project — start new chats there and v0 pushes
commits directly to this repo. Every merge to `main` deploys.

[Continue working on v0 →](https://v0.app/chat/projects/prj_C2Y2oJJjpfucsWZ20ZN8eVoeUWDF)
