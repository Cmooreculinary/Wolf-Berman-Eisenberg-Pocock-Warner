/**
 * Everything a machine needs to find this app.
 *
 * The site is a static export, so there is no request-time server to answer an
 * agent's questions. Instead the whole dataset is written to plain JSON files
 * at build time (see `scripts/build-api.mjs`) and served from the CDN like any
 * other asset. This module is the single registry of what exists and where —
 * the generator, the OpenAPI document, the in-app Integrate view and the MCP
 * server all read it, so a path can never be right in one place and stale in
 * another.
 */

export const API_VERSION = "v1"
export const API_BASE = `/api/${API_VERSION}`

/** Where this build is deployed. Override per environment. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://eisenberg-pocock-warner-wolfe-berman.onrender.com"
).replace(/\/+$/, "")

export const SITE_NAME = "Eisenberg, Pocock, Warner, Wolfe & Berman"

export const SITE_TAGLINE = "Rolling four-week intelligence on agents, governance and distribution."

export const SITE_DESCRIPTION =
  "A rolling four-week window over five founder feeds: repositories reviewed on air with crossovers cut, " +
  "the skills each episode taught, a technical-core inventory of agents and protocols, an unbundling niche " +
  "board, a masterclass vault, and the ACP funnel model. Published as a browsable workspace and as a " +
  "machine-readable dataset."

export const PUBLISHER = { name: "Blue Collar Appz Co.", url: "https://bcappz.com" }

export const REPO_URL = "https://github.com/Cmooreculinary/wolf-berman-eisenberg-pocock-warner"

/** Absolute URL for a site-relative path. */
export function absolute(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export type EndpointId =
  | "index"
  | "dataset"
  | "window"
  | "repos"
  | "skills"
  | "inventory"
  | "niches"
  | "vault"
  | "deck"
  | "funnel"

export type Endpoint = {
  id: EndpointId
  path: string
  title: string
  /** One line, written for whoever (or whatever) is deciding whether to fetch it. */
  summary: string
  /** The shape of `items`, or `object` when the payload is not a collection. */
  returns: string
}

export const ENDPOINTS: Endpoint[] = [
  {
    id: "index",
    path: `${API_BASE}/index.json`,
    title: "Index",
    summary: "Discovery document: every endpoint, its shape, and how fresh the data is.",
    returns: "object",
  },
  {
    id: "dataset",
    path: `${API_BASE}/dataset.json`,
    title: "Full dataset",
    summary: "Every resource below in one response, for callers that would rather fetch once.",
    returns: "object",
  },
  {
    id: "window",
    path: `${API_BASE}/window.json`,
    title: "Rolling window",
    summary:
      "The live four-week window: week slots, the deduped repo list, what is staged for the next roll, and what has been vaulted.",
    returns: "object",
  },
  {
    id: "repos",
    path: `${API_BASE}/repos.json`,
    title: "Repos reviewed",
    summary: "One row per airing, newest first, with the episode, host, pillar and GitHub URL resolved.",
    returns: "RepoAiring[]",
  },
  {
    id: "skills",
    path: `${API_BASE}/skills.json`,
    title: "Skills curriculum",
    summary: "Skills taught inside the window, each with its lessons, hosts, demo repos and the trap it avoids.",
    returns: "CoveredSkill[]",
  },
  {
    id: "inventory",
    path: `${API_BASE}/inventory.json`,
    title: "Technical core",
    summary: "The agents, methods and protocols behind the thesis, grouped by pillar.",
    returns: "InventoryItem[]",
  },
  {
    id: "niches",
    path: `${API_BASE}/niches.json`,
    title: "Unbundling niches",
    summary: "Communities with a named pain, the SaaS slice that unbundles it, and a modelled MRR.",
    returns: "Niche[]",
  },
  {
    id: "vault",
    path: `${API_BASE}/vault.json`,
    title: "Masterclass vault",
    summary: "Audio sessions and reference documents with their takeaways and summaries.",
    returns: "object",
  },
  {
    id: "deck",
    path: `${API_BASE}/deck.json`,
    title: "Slide deck",
    summary: "The thirteen slides of the briefing deck as structured content.",
    returns: "Slide[]",
  },
  {
    id: "funnel",
    path: `${API_BASE}/funnel.json`,
    title: "ACP funnel model",
    summary:
      "Inputs, bounds, defaults and the exact formulas behind the funnel simulator, so a caller can reproduce it.",
    returns: "object",
  },
]

export const ENDPOINT_BY_ID = Object.fromEntries(ENDPOINTS.map((e) => [e.id, e])) as Record<EndpointId, Endpoint>

/** Non-API discovery files, all written by the same generator. */
export const DISCOVERY = {
  openapi: "/openapi.json",
  llms: "/llms.txt",
  agent: "/.well-known/agent.json",
} as const

export const LICENSE = {
  /** The dataset is editorial: facts about public episodes, compiled here. */
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/",
  attribution: `${SITE_NAME} — ${PUBLISHER.name}`,
} as const
