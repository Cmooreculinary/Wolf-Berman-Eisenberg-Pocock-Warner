# Deploying to Render

This app deploys to Render as a **static site**, which is Render's free tier
and — unlike a free *web service* — never spins down between visitors.

## Why static works here

Every route is prerendered at build time. There is no server rendering, no API
route, no database, and no server action; the interactive parts (view switching,
the ACP simulator, the .pptx export) all run in the visitor's browser. So there
is nothing for a server to do at request time, and the whole site is 1.7 MB of
files Render can serve from its CDN.

The machine-readable dataset is static too. `pnpm api` writes `/api/v1/*.json`,
`/openapi.json`, `/llms.txt` and `/.well-known/agent.json` into `public/` before
Next runs, so they are copied into the export like any other asset — the JSON
endpoints work on the free static plan exactly as they do on Vercel.

`STATIC_EXPORT=true pnpm build` writes those files to `out/`.

## Option A — Blueprint (recommended)

`render.yaml` in the repo root describes the whole site.

1. Render Dashboard → **New** → **Blueprint**
2. Connect this repo and pick the branch
3. Render reads `render.yaml` and creates the site — no fields to fill in

## Option B — Manual

Render Dashboard → **New** → **Static Site**, then:

| Field | Value |
| --- | --- |
| Build command | `corepack enable && pnpm install --frozen-lockfile && STATIC_EXPORT=true pnpm build` |
| Publish directory | `out` |

The security headers in `render.yaml` (`X-Content-Type-Options`,
`Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`) are not
applied in this path — add them under the site's **Headers** tab if you want
them, using path `/*`.

Add `Access-Control-Allow-Origin: *` on `/api/*`, `/.well-known/*`,
`/openapi.json` and `/llms.txt` in the same tab, or the JSON endpoints will be
readable by hand but not from another site's JavaScript. `render.yaml` sets
these for you on the Blueprint path.

## Cost

Render's static site tier is free and includes TLS, a custom domain, and a
monthly bandwidth allowance. At 1.7 MB per full page load, that allowance goes
a long way for a site like this one. Check Render's current pricing page for the
exact bandwidth and build-minute figures before you rely on them — those numbers
change.

If you ever outgrow the free bandwidth, the fix is a paid static plan, not a
server. Nothing about this app needs one.

## Keeping Vercel working too

The Render setup does not break the existing Vercel/v0 deploy. `STATIC_EXPORT`
is opt-in:

- **unset** (Vercel, v0, `pnpm dev`) — normal Next.js build, and `next.config.mjs`
  applies the security headers itself
- **`true`** (Render) — static export to `out/`, headers come from `render.yaml`

Vercel Analytics is likewise gated on `VERCEL=1`, so the Render build ships no
Vercel scripts.

## Local check

```bash
STATIC_EXPORT=true pnpm build
cd out && python3 -m http.server 4173
```

Then open <http://localhost:4173> — that is byte-for-byte what Render serves.

```bash
pnpm check:export
```

asserts the export actually carries every JSON endpoint. The failure it catches
is a quiet one: the site renders perfectly while every integration 404s.
