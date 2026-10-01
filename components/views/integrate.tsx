"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, Plug, Puzzle, ScrollText, Terminal } from "lucide-react"
import { Chip, CopyButton, Panel, PanelHeader, Segmented, Stat } from "@/components/kit"
import { DISCOVERY, ENDPOINTS, LICENSE, PUBLISHER, REPO_URL, SITE_URL } from "@/lib/site"
import { AUDIO, DOCS, INVENTORY, NICHES, SLIDES } from "@/lib/data"
import { REVIEW_LOG, buildWindow } from "@/lib/repos"
import { buildCurriculum } from "@/lib/skills"
import { cn } from "@/lib/utils"

function Code({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <pre className="scroll-slim overflow-x-auto rounded-lg border border-border bg-secondary/50 p-4 pr-12 font-mono text-[12px] leading-relaxed">
        <code>{children}</code>
      </pre>
      <CopyButton payload={children} className="absolute right-2 top-2" label="" />
    </div>
  )
}

const LANGS = [
  { value: "shell" as const, label: "curl" },
  { value: "js" as const, label: "JavaScript" },
  { value: "python" as const, label: "Python" },
]

/** The hash each workspace view answers to — the app's deep-link surface. */
const DEEP_LINKS: { hash: string; what: string }[] = [
  { hash: "#repos", what: "The rolling repo board" },
  { hash: "#skills", what: "The curriculum for the live window" },
  { hash: "#blueprint", what: "The ACP funnel simulator" },
  { hash: "#inventory", what: "The technical core" },
  { hash: "#deck", what: "The slide deck" },
  { hash: "#integrate", what: "This page" },
]

export function IntegrateView() {
  const [lang, setLang] = useState<(typeof LANGS)[number]["value"]>("shell")

  // Show the host the reader is actually on, so a copied snippet runs as-is.
  const [origin, setOrigin] = useState(SITE_URL)
  useEffect(() => setOrigin(window.location.origin), [])

  const counts = useMemo(() => {
    const win = buildWindow(REVIEW_LOG)
    const cur = buildCurriculum()
    return {
      anchor: win.anchor,
      nextRoll: win.nextRoll,
      airings: REVIEW_LOG.length,
      live: win.active.length,
      skills: cur.covered.length,
      records: REVIEW_LOG.length + cur.covered.length + INVENTORY.length + NICHES.length + AUDIO.length + DOCS.length + SLIDES.length,
    }
  }, [])

  const snippets: Record<(typeof LANGS)[number]["value"], string> = {
    shell: `# every repo on the live board, newest first
curl -s ${origin}/api/v1/window.json \\
  | jq '.active[] | {repo, name, week: .slot, host: .hostName}'

# what the endpoints are, before you pick one
curl -s ${origin}/api/v1/index.json | jq '.endpoints'`,
    js: `const res = await fetch("${origin}/api/v1/window.json")
const win = await res.json()

console.log(\`\${win.active.length} repos, week of \${win.anchor}\`)
for (const r of win.active) {
  console.log(\`W\${r.slot}  \${r.name.padEnd(24)} \${r.url}\`)
}`,
    python: `import urllib.request, json

with urllib.request.urlopen("${origin}/api/v1/window.json") as r:
    win = json.load(r)

print(f"{len(win['active'])} repos, week of {win['anchor']}")
for repo in win["active"]:
    print(f"W{repo['slot']}  {repo['name']:<24} {repo['url']}")`,
  }

  const mcpConfig = `{
  "mcpServers": {
    "epwwb": {
      "command": "node",
      "args": ["/absolute/path/to/integrations/mcp/server.mjs"],
      "env": { "EPWWB_BASE_URL": "${origin}" }
    }
  }
}`

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Integrate</Chip>
        <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">
          Every page here is also a JSON file.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground text-pretty">
          The board, the curriculum and the funnel model are built from the same modules that render these views, then
          written out at build time. No key, no quota, no server to wake up — just files on a CDN, open to any origin.
        </p>
      </header>

      <div className="mt-7 grid gap-3 sm:grid-cols-4">
        <Stat label="Records published" value={counts.records.toLocaleString()} emphasis sub="across nine resources" />
        <Stat label="Airings logged" value={String(counts.airings)} sub={`${counts.live} live after dedupe`} />
        <Stat label="Skills in window" value={String(counts.skills)} sub="taught in the last four weeks" />
        <Stat label="Window anchor" value={counts.anchor} sub={`next roll ${counts.nextRoll}`} />
      </div>

      <Panel className="mt-5">
        <PanelHeader
          title="Endpoints"
          hint="Read-only GET, CORS open to every origin, cached five minutes. Fetching more than once a day buys nothing — the data moves when a build runs."
          right={<CopyButton payload={`${origin}/api/v1/index.json`} label="Index URL" />}
        />
        <div className="scroll-slim mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Path</th>
                <th className="py-2 pr-4 font-medium">Returns</th>
                <th className="py-2 pr-4 font-medium">What it holds</th>
                <th className="py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.id} className="border-b border-border/60 align-top">
                  <td className="py-2.5 pr-4">
                    <a
                      href={e.path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[12px] text-accent hover:underline"
                    >
                      {e.path}
                      <ArrowUpRight className="size-3" />
                    </a>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[11px] text-muted-foreground">{e.returns}</td>
                  <td className="py-2.5 pr-4 text-[12px] leading-relaxed text-muted-foreground text-pretty">{e.summary}</td>
                  <td className="py-2.5 text-right">
                    <CopyButton payload={`${origin}${e.path}`} label="URL" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <Panel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-accent" />
                <h3 className="text-[15px] font-semibold tracking-tight">Read it in thirty seconds</h3>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                Nothing to install. These run against this deployment as written.
              </p>
            </div>
            <Segmented value={lang} onChange={setLang} options={LANGS} />
          </div>
          <Code className="mt-4">{snippets[lang]}</Code>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2">
            <Plug className="size-4 text-accent" />
            <h3 className="text-[15px] font-semibold tracking-tight">Give an agent the whole dataset</h3>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground text-pretty">
            The repo ships a Model Context Protocol server: one file, no dependencies, ten tools — repos, skills,
            inventory, niches, vault, deck, search and the funnel simulator.
          </p>
          <Code className="mt-4">{mcpConfig}</Code>
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground text-pretty">
            Or, in Claude Code:{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">
              claude mcp add epwwb -- node …/integrations/mcp/server.mjs
            </code>
          </p>
        </Panel>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center gap-2">
            <ScrollText className="size-4 text-accent" />
            <h3 className="text-[15px] font-semibold tracking-tight">Discovery</h3>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground text-pretty">
            Published at the conventional paths, so a crawler or agent finds the data without being told about it.
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              [DISCOVERY.openapi, "OpenAPI 3.1", "Typed contract for every endpoint — generate a client from it."],
              [DISCOVERY.llms, "llms.txt", "A plain-text map of the site, written for a model that landed here."],
              [DISCOVERY.agent, "Agent manifest", "What this app is, how to access it, and the MCP server's location."],
              ["/sitemap.xml", "Sitemap", "The page and every JSON file, so the data is crawlable too."],
            ].map(([path, title, note]) => (
              <li key={path} className="flex items-start gap-3">
                <a
                  href={path}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 font-mono text-[12px] text-accent hover:underline"
                >
                  {path}
                </a>
                <span className="min-w-0 text-[12px] leading-relaxed text-muted-foreground text-pretty">
                  <span className="text-foreground">{title}</span> — {note}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2">
            <Puzzle className="size-4 text-accent" />
            <h3 className="text-[15px] font-semibold tracking-tight">Deep links & terms</h3>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground text-pretty">
            Every view answers to a hash, so you can link a colleague — or an agent's citation — to the exact panel.
          </p>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {DEEP_LINKS.map((l) => (
              <li key={l.hash} className="text-[12px] text-muted-foreground">
                <a href={l.hash} className="font-mono text-accent hover:underline">
                  {l.hash}
                </a>{" "}
                {l.what}
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-border pt-4 text-[12px] leading-relaxed text-muted-foreground text-pretty">
            <p>
              Licensed <a href={LICENSE.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{LICENSE.name}</a>
              {" — "}attribute as “{LICENSE.attribution}”. The dataset is editorial: it records what five public feeds
              covered. Figures in the funnel model and the niche board are models, not forecasts.
            </p>
            <p className="mt-2">
              Source:{" "}
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                the repository
              </a>
              , with the integration guide in{" "}
              <a href={`${REPO_URL}/blob/main/INTEGRATE.md`} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                INTEGRATE.md
              </a>
              . Published by{" "}
              <a href={PUBLISHER.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {PUBLISHER.name}
              </a>
              .
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}
