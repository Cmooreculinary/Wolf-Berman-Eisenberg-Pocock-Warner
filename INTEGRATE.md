# Integrating with this app

Everything the site shows is also published as plain JSON. There is no key, no
quota, no account and no server: the files are written at build time from the
same modules the pages import, and served from a CDN with CORS open to every
origin.

Base URL below is whatever host you are reading this on — the production deploy
is `https://eisenberg-pocock-warner-wolfe-berman.onrender.com`.

---

## 1. The fastest path

```bash
curl -s $BASE/api/v1/index.json | jq '.counts, .endpoints[].path'
```

`index.json` is the discovery document: what exists, how fresh it is, and where
everything else lives. Fetch it first and you never have to guess a path.

---

## 2. Endpoints

| Path | Returns | What it holds |
| --- | --- | --- |
| `/api/v1/index.json` | object | Discovery: endpoints, counts, freshness, sources. |
| `/api/v1/dataset.json` | object | Everything below in one response. |
| `/api/v1/window.json` | object | The live four-week window: week slots, the deduped board, staging, vault. |
| `/api/v1/repos.json` | `RepoAiring[]` | One row per airing, newest first, with episode, host, pillar and GitHub URL. |
| `/api/v1/skills.json` | `CoveredSkill[]` | Skills taught inside the window, with lessons, hosts and demo repos. |
| `/api/v1/inventory.json` | `InventoryItem[]` | Agents, methods and protocols, grouped by pillar. |
| `/api/v1/niches.json` | `Niche[]` | Communities, their pain, the slice that unbundles it, a modelled MRR. |
| `/api/v1/vault.json` | object | Audio sessions and reference documents. |
| `/api/v1/deck.json` | `Slide[]` | The thirteen-slide briefing deck. |
| `/api/v1/funnel.json` | object | Inputs, bounds and formulas behind the ACP funnel simulator. |

Collection endpoints share one envelope, so a single reader handles all of them:

```jsonc
{
  "resource": "repos",
  "version": "v1",
  "updated": "2026-08-24",   // newest air date in the log — the data's own "now"
  "count": 60,
  "items": [ /* … */ ]
}
```

Typed contract: [`/openapi.json`](/openapi.json) (OpenAPI 3.1 — feed it to any
client generator).

### Two views of the same repos

`repos.json` is the **log**: every airing, including the ones the crossover rule
superseded. `window.json.active` is the **board**: one row per repo, newest
airing kept. Most callers want the board.

```bash
# the live board, by week
curl -s $BASE/api/v1/window.json \
  | jq '.active[] | {week: .slot, name, repo, host: .hostName}'
```

---

## 3. Give an agent the whole thing

`integrations/mcp/server.mjs` is a Model Context Protocol server: one file, zero
dependencies, ten tools. Anything that speaks MCP over stdio can use it.

```jsonc
{
  "mcpServers": {
    "epwwb": {
      "command": "node",
      "args": ["/absolute/path/to/integrations/mcp/server.mjs"]
    }
  }
}
```

```bash
# Claude Code
claude mcp add epwwb -- node /absolute/path/to/integrations/mcp/server.mjs
```

Tools: `get_overview`, `list_repos`, `get_window`, `list_skills`,
`get_inventory`, `list_niches`, `get_vault`, `get_deck`, `simulate_funnel`,
`search`. Full detail in [`integrations/mcp/README.md`](integrations/mcp/README.md).

Point it at your own deployment — or at a local `out/` directory, with no
network at all — using `EPWWB_BASE_URL`.

---

## 4. Discovery

An agent that lands here without being told anything finds:

| Path | What it is |
| --- | --- |
| [`/llms.txt`](/llms.txt) | Plain-text map of the site, in the llms.txt convention. |
| [`/.well-known/agent.json`](/.well-known/agent.json) | What this app is, how to access it, where the MCP server lives. |
| [`/openapi.json`](/openapi.json) | Typed contract for every endpoint. |
| [`/sitemap.xml`](/sitemap.xml) | The page **and** every JSON file. |
| `<script type="application/ld+json">` | schema.org `Dataset` in the page head. |

`agent.json` is this project's own manifest shape, not a claim of conformance to
any agent-to-agent protocol. It says plainly what is true: `GET` only, no auth,
no writes, no rate limit, static transport.

---

## 5. Deep links

Every view answers to a hash, so a link — or an agent's citation — can point at
the exact panel: `#convergence`, `#blueprint`, `#inventory`, `#repos`,
`#skills`, `#toolbox`, `#vault`, `#deck`, `#founders`, `#integrate`.

---

## 6. Reproducing the funnel model

The simulator on the Blueprint view is a pure function, and its inputs, bounds
and formulas are published:

```bash
curl -s $BASE/api/v1/funnel.json | jq '{inputs: [.inputs[].key], formulas, target}'
```

Compute it yourself, or call the `simulate_funnel` MCP tool. Both agree with the
page because all three read `lib/funnel.ts`. Out-of-range inputs are clamped to
the published bounds rather than rejected.

---

## 7. Embedding

The site is a static export with no framing restrictions, so a view can be
embedded directly:

```html
<iframe
  src="https://eisenberg-pocock-warner-wolfe-berman.onrender.com/#repos"
  width="100%" height="720" style="border:0;border-radius:12px"
  title="Repos reviewed — rolling 4-week window"></iframe>
```

For anything more than a panel, render the JSON yourself — it is the same data
and it will fit your layout better than ours.

---

## 8. Caching and etiquette

`Cache-Control: public, max-age=300, stale-while-revalidate=86400`. The data
changes only when a build runs, which is weekly at most — polling faster than
daily buys you nothing. `updated` in every payload tells you whether anything
moved.

---

## 9. Terms

Licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute as
*"Eisenberg, Pocock, Warner, Wolfe & Berman — Blue Collar Appz Co."*

The dataset is editorial: it records what five public feeds covered, with air
dates resolved from a single review log. Figures in the funnel model and the
niche board are **models, not forecasts**, and should be labelled that way
wherever you republish them.

---

## 10. Working on it

```bash
pnpm install --frozen-lockfile
pnpm api          # regenerate the JSON, OpenAPI, llms.txt and manifest
pnpm dev          # runs pnpm api first, then next dev
pnpm check:export # assert a finished build published all of it
```

The generated files under `public/api/`, `public/.well-known/`,
`public/openapi.json` and `public/llms.txt` are build output and are not
committed — `pnpm api` rewrites them from `lib/`.

To add an endpoint: register it in `ENDPOINTS` (`lib/site.ts`), add a builder in
`lib/api.ts`, and map the two together in `scripts/build-api.mjs`. The generator
fails the build if a registered endpoint has no builder, or a builder has no
registered endpoint, so the OpenAPI document, `llms.txt`, the manifest, the
sitemap and the Integrate view cannot fall behind.
