#!/usr/bin/env node
/**
 * MCP server for the Eisenberg, Pocock, Warner, Wolfe & Berman dataset.
 *
 * It has no dependencies on purpose. The published data is a handful of static
 * JSON files, and the Model Context Protocol over stdio is newline-delimited
 * JSON-RPC 2.0 — neither needs a package to speak. So this file runs anywhere
 * Node 18+ runs, with nothing to install and nothing to keep up to date:
 *
 *   {
 *     "mcpServers": {
 *       "epwwb": { "command": "node", "args": ["/abs/path/integrations/mcp/server.mjs"] }
 *     }
 *   }
 *
 * Point it at another deployment (or at a local `out/` directory) with
 * EPWWB_BASE_URL. See integrations/mcp/README.md.
 */
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const NAME = "epwwb"
const VERSION = "1.0.0"
const DEFAULT_BASE = "https://eisenberg-pocock-warner-wolfe-berman.onrender.com"
const BASE = (process.env.EPWWB_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "")
const API = `${BASE}/api/v1`

/** Newest protocol revision this server was written against. */
const PROTOCOL_VERSION = "2025-06-18"

/* ── fetching ───────────────────────────────────────────────────────────── */

const CACHE_MS = 5 * 60_000
const cache = new Map()

/**
 * Read one endpoint. A `file:` base reads from disk instead, so the server can
 * be pointed at a local `out/` directory while developing.
 */
async function get(name) {
  const hit = cache.get(name)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value

  const url = `${API}/${name}.json`
  let value
  if (url.startsWith("file:")) {
    value = JSON.parse(await readFile(fileURLToPath(url), "utf8"))
  } else {
    const res = await fetch(url, { headers: { accept: "application/json" } })
    if (!res.ok) throw new Error(`${url} responded ${res.status} ${res.statusText}`)
    value = await res.json()
  }
  cache.set(name, { at: Date.now(), value })
  return value
}

/* ── helpers ────────────────────────────────────────────────────────────── */

const lower = (v) => String(v ?? "").toLowerCase()

function matches(row, query) {
  if (!query) return true
  return lower(JSON.stringify(row)).includes(lower(query))
}

function eq(a, b) {
  return b === undefined || b === null || b === "" || lower(a) === lower(b)
}

function take(rows, limit) {
  const n = Number(limit)
  return Number.isFinite(n) && n > 0 ? rows.slice(0, n) : rows
}

/* ── tools ──────────────────────────────────────────────────────────────── */

const str = (description, enumValues) => ({
  type: "string",
  description,
  ...(enumValues ? { enum: enumValues } : {}),
})
const num = (description) => ({ type: "number", description })

const HOSTS = ["Eisenberg", "Pocock", "Warner", "Wolfe", "Berman"]
const PILLARS = ["agents", "governance", "media"]

const TOOLS = [
  {
    name: "get_overview",
    description:
      "Start here. Returns what this dataset covers, how fresh it is, the current four-week window, and a count of every resource.",
    inputSchema: { type: "object", properties: {} },
    run: async () => {
      const i = await get("index")
      return {
        name: i.name,
        tagline: i.tagline,
        updated: i.updated,
        window: i.window,
        counts: i.counts,
        sources: i.sources.feeds,
        license: i.license,
      }
    },
  },
  {
    name: "list_repos",
    description:
      "Repositories reviewed on air. Defaults to the live board: one row per repo, newest airing kept, crossovers cut.",
    inputSchema: {
      type: "object",
      properties: {
        host: str("Filter by reviewing host.", HOSTS),
        pillar: str("Filter by thesis pillar.", PILLARS),
        week: num("Week slot 1-4, where 1 is the freshest ingest."),
        query: str("Free-text match against name, blurb, language or episode title."),
        includeArchived: {
          type: "boolean",
          description: "Include airings that have rolled out of the window or were superseded. Default false.",
        },
        limit: num("Maximum rows to return."),
      },
    },
    run: async (a = {}) => {
      const source = a.includeArchived ? (await get("repos")).items : (await get("window")).active
      const rows = source.filter(
        (r) =>
          eq(r.host, a.host) &&
          eq(r.pillar, a.pillar) &&
          (a.week === undefined || a.week === null || Number(a.week) === r.slot) &&
          matches(r, a.query),
      )
      return {
        count: rows.length,
        items: take(rows, a.limit).map((r) => ({
          repo: r.repo,
          name: r.name,
          blurb: r.blurb,
          pillar: r.pillar,
          lang: r.lang,
          license: r.license,
          url: r.url,
          week: r.slot,
          episode: { ep: r.ep, title: r.epTitle, date: r.date, host: r.hostName, channel: r.hostChannel },
        })),
      }
    },
  },
  {
    name: "get_window",
    description:
      "The rolling four-week window itself: each week slot with its date range and provider tally, what is staged for the next Monday roll, and what has been vaulted.",
    inputSchema: { type: "object", properties: {} },
    run: async () => {
      const w = await get("window")
      return {
        anchor: w.anchor,
        nextRoll: w.nextRoll,
        start: w.start,
        end: w.end,
        crossoversCut: w.crossoversCut,
        liveRepos: w.active.length,
        weeks: w.weeks.map((s) => ({
          slot: s.slot,
          start: s.start,
          end: s.end,
          airings: s.airings.length,
          kept: s.kept,
          providers: s.providers,
        })),
        staging: w.staging.map((r) => ({ repo: r.repo, date: r.date, host: r.host })),
        vaulted: w.vaulted.map((v) => ({ start: v.start, end: v.end, rolledOut: v.rolledOut, airings: v.airings.length })),
      }
    },
  },
  {
    name: "list_skills",
    description:
      "Skills taught inside the window, each with what it lets you do, the trap it avoids, the lessons that taught it and the repos demoed.",
    inputSchema: {
      type: "object",
      properties: {
        tier: str("Filter by tier.", ["foundational", "working", "advanced"]),
        pillar: str("Filter by thesis pillar.", PILLARS),
        host: str("Only skills this host taught inside the window.", HOSTS),
        query: str("Free-text match against name, outcome or pitfall."),
        includeDormant: {
          type: "boolean",
          description: "Also list catalog skills not taught inside the window. Default false.",
        },
        limit: num("Maximum rows to return."),
      },
    },
    run: async (a = {}) => {
      const s = await get("skills")
      const rows = s.items.filter(
        (k) =>
          eq(k.tier, a.tier) &&
          eq(k.pillar, a.pillar) &&
          (!a.host || k.hosts.some((h) => eq(h, a.host))) &&
          matches(k, a.query),
      )
      return {
        window: s.window,
        lessonCount: s.lessonCount,
        hostTally: s.hostTally,
        count: rows.length,
        items: take(rows, a.limit).map((k) => ({
          id: k.id,
          name: k.name,
          tier: k.tier,
          pillar: k.pillar,
          outcome: k.outcome,
          pitfall: k.pitfall,
          hosts: k.hosts,
          demos: k.demos,
          lastTaught: k.lastTaught,
          week: k.slot,
          lessons: k.taught.map((l) => ({ ep: l.ep, date: l.date, host: l.hostName, demos: l.demos })),
        })),
        ...(a.includeDormant ? { dormant: s.dormant } : {}),
      }
    },
  },
  {
    name: "get_inventory",
    description: "The technical core: agents, methods and protocols behind the thesis, with their roles and metrics.",
    inputSchema: {
      type: "object",
      properties: {
        kind: str("Filter by kind.", ["agent", "skill", "protocol"]),
        pillar: str("Filter by pillar.", ["autonomy", "governance", "distribution"]),
        query: str("Free-text match against name, role, detail or tags."),
      },
    },
    run: async (a = {}) => {
      const inv = await get("inventory")
      const rows = inv.items.filter((i) => eq(i.kind, a.kind) && eq(i.pillar, a.pillar) && matches(i, a.query))
      return { pillars: inv.pillars.map((p) => ({ id: p.id, title: p.title, line: p.line })), count: rows.length, items: rows }
    },
  },
  {
    name: "list_niches",
    description: "Unbundling candidates: a community, the pain it complains about, the SaaS slice that answers it, and a modelled MRR.",
    inputSchema: { type: "object", properties: { query: str("Free-text match."), limit: num("Maximum rows.") } },
    run: async (a = {}) => {
      const n = await get("niches")
      const rows = n.items.filter((r) => matches(r, a.query))
      return { count: rows.length, items: take(rows, a.limit) }
    },
  },
  {
    name: "get_vault",
    description: "Masterclass vault: audio sessions with their one-line takeaways, and reference documents with summaries.",
    inputSchema: {
      type: "object",
      properties: { type: str("Limit to one shelf.", ["audio", "documents"]), query: str("Free-text match.") },
    },
    run: async (a = {}) => {
      const v = await get("vault")
      const audio = v.audio.items.filter((r) => matches(r, a.query))
      const documents = v.documents.items.filter((r) => matches(r, a.query))
      if (a.type === "audio") return { audio }
      if (a.type === "documents") return { documents }
      return { audio, documents }
    },
  },
  {
    name: "get_deck",
    description: "The thirteen-slide briefing deck as structured content.",
    inputSchema: { type: "object", properties: { slide: num("Return a single slide by its number.") } },
    run: async (a = {}) => {
      const d = await get("deck")
      if (a.slide === undefined || a.slide === null) return { count: d.count, items: d.items }
      const one = d.items.find((s) => s.n === Number(a.slide))
      if (!one) throw new Error(`No slide ${a.slide}; the deck runs 1-${d.count}.`)
      return one
    },
  },
  {
    name: "simulate_funnel",
    description:
      "Run the ACP funnel model — Audience → Community → Product — and return the modelled monthly revenue, affiliate payout, ARR and 5x exit. Omitted inputs use the published defaults; out-of-range inputs are clamped, not rejected.",
    inputSchema: {
      type: "object",
      properties: {
        audience: num("Owned reach. 1,000-200,000."),
        communityConversionPct: num("Percent of audience joining the community. 1-25."),
        productConversionPct: num("Percent of community buying. 1-30."),
        pricePerMonth: num("Subscription price in dollars. 9-499."),
        affiliateSharePct: num("Percent of gross paid to affiliates. 0-60."),
      },
    },
    run: async (a = {}) => {
      // Bounds and defaults come from the published spec so this can never
      // drift from the simulator on the site; the arithmetic is repeated here
      // only because five multiplications are cheaper than a round trip.
      const spec = await get("funnel")
      const inputs = {}
      for (const f of spec.inputs) {
        const raw = Number(a[f.key])
        inputs[f.key] = Number.isFinite(raw) ? Math.min(f.max, Math.max(f.min, raw)) : f.default
      }
      const community = inputs.audience * (inputs.communityConversionPct / 100)
      const customers = community * (inputs.productConversionPct / 100)
      const grossMRR = customers * inputs.pricePerMonth
      const affiliatePayout = grossMRR * (inputs.affiliateSharePct / 100)
      const arr = grossMRR * 12
      const r = (n) => Math.round(n)
      return {
        inputs,
        outputs: {
          community: r(community),
          customers: r(customers),
          grossMRR: r(grossMRR),
          affiliatePayout: r(affiliatePayout),
          netMRR: r(grossMRR - affiliatePayout),
          arr: r(arr),
          exitAt5x: r(arr * spec.target.exitMultiple),
          pctOfTarget: Math.round(Math.min(100, (grossMRR / spec.target.grossMRR) * 100) * 10) / 10,
        },
        target: spec.target,
        note: spec.note,
      }
    },
  },
  {
    name: "search",
    description:
      "One free-text search across every resource: repos, skills, technical core, niches, vault and deck. Use it when you do not yet know which resource holds the answer.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: { query: str("What to look for."), limit: num("Maximum hits per resource. Default 5.") },
    },
    run: async (a = {}) => {
      if (!a.query) throw new Error("search needs a query.")
      const limit = Number(a.limit) > 0 ? Number(a.limit) : 5
      const [win, skills, inv, niches, vault, deck] = await Promise.all(
        ["window", "skills", "inventory", "niches", "vault", "deck"].map(get),
      )
      const hit = (rows, label) => take(rows.filter((r) => matches(r, a.query)), limit).map((r) => ({ resource: label, ...r }))
      return {
        query: a.query,
        repos: hit(win.active, "repos").map((r) => ({ resource: "repos", repo: r.repo, name: r.name, blurb: r.blurb, url: r.url, week: r.slot })),
        skills: hit(skills.items, "skills").map((s) => ({ resource: "skills", id: s.id, name: s.name, tier: s.tier, outcome: s.outcome })),
        inventory: hit(inv.items, "inventory").map((i) => ({ resource: "inventory", id: i.id, name: i.name, kind: i.kind, role: i.role })),
        niches: hit(niches.items, "niches"),
        audio: hit(vault.audio.items, "vault.audio"),
        documents: hit(vault.documents.items, "vault.documents"),
        slides: hit(deck.items, "deck").map((s) => ({ resource: "deck", n: s.n, title: s.title })),
      }
    },
  },
]

const TOOL_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]))

/* ── resources ──────────────────────────────────────────────────────────── */

const RESOURCES = [
  ["index", "Index", "Discovery document: endpoints, counts and freshness."],
  ["window", "Rolling window", "The live four-week window with weeks, staging and vault."],
  ["repos", "Repos reviewed", "Every airing, newest first."],
  ["skills", "Skills curriculum", "Skills taught inside the window."],
  ["inventory", "Technical core", "Agents, methods and protocols."],
  ["niches", "Unbundling niches", "Communities, pains and modelled MRR."],
  ["vault", "Masterclass vault", "Audio sessions and reference documents."],
  ["deck", "Slide deck", "The briefing deck as structured content."],
  ["funnel", "ACP funnel model", "Inputs, bounds and formulas behind the simulator."],
].map(([id, name, description]) => ({
  uri: `epwwb://v1/${id}`,
  name,
  description,
  mimeType: "application/json",
  _id: id,
}))

/* ── JSON-RPC plumbing ──────────────────────────────────────────────────── */

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`)
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id, result })
}

function fail(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } })
}

async function handle(msg) {
  const { id, method, params } = msg
  const isRequest = id !== undefined && id !== null

  switch (method) {
    case "initialize":
      return reply(id, {
        // Echo the client's revision when we know it; ours otherwise.
        protocolVersion: params?.protocolVersion ?? PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
        serverInfo: { name: NAME, version: VERSION },
        instructions:
          "Read-only access to the Eisenberg, Pocock, Warner, Wolfe & Berman dataset: repositories reviewed on air " +
          "in a rolling four-week window, the skills those episodes taught, the technical-core inventory, the " +
          "unbundling niche board, the masterclass vault and the ACP funnel model. Call get_overview first if you " +
          "are not sure what is in here. Figures in the funnel and niche data are models, not forecasts.",
      })

    case "notifications/initialized":
    case "notifications/cancelled":
      return // notifications take no response

    case "ping":
      return reply(id, {})

    case "tools/list":
      return reply(
        id,
        { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) },
      )

    case "tools/call": {
      const tool = TOOL_BY_NAME.get(params?.name)
      if (!tool) return fail(id, -32602, `Unknown tool "${params?.name}".`)
      try {
        const result = await tool.run(params?.arguments ?? {})
        return reply(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] })
      } catch (err) {
        // A tool failure is data for the model, not a protocol error.
        return reply(id, { content: [{ type: "text", text: `${tool.name} failed: ${err.message}` }], isError: true })
      }
    }

    case "resources/list":
      return reply(id, { resources: RESOURCES.map(({ _id, ...r }) => r) })

    case "resources/read": {
      const resource = RESOURCES.find((r) => r.uri === params?.uri)
      if (!resource) return fail(id, -32602, `Unknown resource "${params?.uri}".`)
      try {
        const value = await get(resource._id)
        return reply(id, {
          contents: [{ uri: resource.uri, mimeType: "application/json", text: JSON.stringify(value, null, 2) }],
        })
      } catch (err) {
        return fail(id, -32603, err.message)
      }
    }

    default:
      if (isRequest) return fail(id, -32601, `Method "${method}" is not supported.`)
  }
}

/**
 * A client that writes its requests and closes the pipe — a CI check, a script —
 * must still get its answers. Exit when the work drains, not when stdin ends.
 */
let pending = 0
let inputClosed = false

function settle() {
  if (inputClosed && pending === 0) process.exit(0)
}

let buffer = ""
process.stdin.setEncoding("utf8")
process.stdin.on("data", (chunk) => {
  buffer += chunk
  let cut
  while ((cut = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, cut).trim()
    buffer = buffer.slice(cut + 1)
    if (!line) continue
    let msg
    try {
      msg = JSON.parse(line)
    } catch {
      fail(null, -32700, "Parse error.")
      continue
    }
    // stdout is the protocol channel; anything we want to say goes to stderr.
    pending += 1
    handle(msg)
      .catch((err) => {
        if (msg.id !== undefined && msg.id !== null) fail(msg.id, -32603, err.message)
        else process.stderr.write(`${NAME}: ${err.stack}\n`)
      })
      .finally(() => {
        pending -= 1
        settle()
      })
  }
})
process.stdin.on("end", () => {
  inputClosed = true
  settle()
})

process.stderr.write(`${NAME} ${VERSION} → ${BASE}\n`)
