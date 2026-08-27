/**
 * The dataset, shaped for machines.
 *
 * Every view in this app reads the same modules these builders read, so the
 * published JSON is not an export of the site — it is the site, minus the
 * layout. When a review lands in `lib/repos.ts`, the board, the curriculum and
 * `/api/v1/repos.json` all move together.
 *
 * Nothing here touches React, the DOM or `process` beyond `NEXT_PUBLIC_*`, so
 * the build-time generator can import it under plain Node.
 */

import {
  AUDIO,
  DOCS,
  INVENTORY,
  NICHES,
  PILLARS,
  SLIDES,
  SOURCE_FEEDS,
  SOURCE_NOTE,
  type InventoryItem,
} from "./data"
import {
  EPISODES,
  PILLAR_LABEL,
  REVIEW_LOG,
  WEEK_SLOTS,
  buildWindow,
  providerChannelUrl,
  providerDisplayName,
  repoUrl,
  slotOf,
  type DedupedRepo,
  type RepoReview,
  type RollingWindow,
} from "./repos"
import { SKILLS, TIER_LABEL, buildCurriculum, type DatedLesson } from "./skills"
import {
  EXIT_MULTIPLE,
  FUNNEL_DEFAULTS,
  FUNNEL_FIELDS,
  FUNNEL_FORMULAS,
  MRR_TARGET,
  roundOutputs,
  simulateFunnel,
} from "./funnel"
import { API_VERSION, ENDPOINTS, LICENSE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "./site"

/** Envelope every collection endpoint shares, so one reader handles them all. */
export type Envelope<T> = {
  resource: string
  version: string
  updated: string
  count: number
  items: T[]
}

function envelope<T>(resource: string, items: T[], updated: string): Envelope<T> {
  return { resource, version: API_VERSION, updated, count: items.length, items }
}

/** Newest air date in the log — the dataset's own notion of "now". */
export function dataUpdated() {
  return REVIEW_LOG.reduce((max, r) => (r.date > max ? r.date : max), REVIEW_LOG[0].date)
}

/* ── repos ──────────────────────────────────────────────────────────────── */

export type RepoAiring = RepoReview & {
  /** Canonical GitHub URL. */
  url: string
  hostName: string
  hostChannel: string
  pillarLabel: string
  /** 1-4 while the airing is inside the live window, 0 once it has rolled out. */
  slot: number
  /** False once a later airing of the same repo superseded this row. */
  live: boolean
}

function airing(r: RepoReview, win: RollingWindow, liveKeys: Set<string>): RepoAiring {
  return {
    ...r,
    url: repoUrl(r),
    hostName: providerDisplayName(r.host),
    hostChannel: providerChannelUrl(r.host),
    pillarLabel: PILLAR_LABEL[r.pillar],
    slot: slotOf(win, r.date),
    live: liveKeys.has(`${r.repo}@${r.ep}`),
  }
}

export function reposPayload(win = buildWindow(REVIEW_LOG)) {
  const liveKeys = new Set(win.active.map((r) => `${r.repo}@${r.ep}`))
  const items = [...REVIEW_LOG]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.ep - a.ep))
    .map((r) => airing(r, win, liveKeys))
  return {
    ...envelope("repos", items, dataUpdated()),
    note: "One row per airing. `live` marks the row the crossover rule kept; see /api/v1/window.json for the deduped board.",
  }
}

/* ── rolling window ─────────────────────────────────────────────────────── */

export function windowPayload(win = buildWindow(REVIEW_LOG)) {
  const liveKeys = new Set(win.active.map((r) => `${r.repo}@${r.ep}`))
  const shrink = (r: RepoReview) => airing(r, win, liveKeys)

  return {
    resource: "window",
    version: API_VERSION,
    updated: dataUpdated(),
    /** Monday the window was last rebuilt on. */
    anchor: win.anchor,
    nextRoll: win.nextRoll,
    slots: WEEK_SLOTS,
    start: win.weeks[win.weeks.length - 1].start,
    end: win.weeks[0].end,
    crossoversCut: win.crossoversCut,
    weeks: win.weeks.map((w) => ({
      slot: w.slot,
      start: w.start,
      end: w.end,
      kept: w.kept,
      providers: w.providers,
      airings: w.airings.map(shrink),
    })),
    active: win.active.map((r: DedupedRepo) => ({
      ...shrink(r),
      supersedes: r.removed.map((x) => ({ ep: x.ep, host: x.host, date: x.date })),
    })),
    staging: win.staging.map(shrink),
    vaulted: win.vaulted.map((w) => ({
      start: w.start,
      end: w.end,
      rolledOut: w.rolledOut,
      providers: w.providers,
      airings: w.airings.map(shrink),
    })),
    episodes: Object.values(EPISODES).sort((a, b) => b.ep - a.ep),
  }
}

/* ── skills ─────────────────────────────────────────────────────────────── */

export function skillsPayload() {
  const c = buildCurriculum()
  const lesson = (l: DatedLesson) => ({
    ...l,
    hostName: providerDisplayName(l.host),
    episodeTitle: EPISODES[l.ep]?.epTitle ?? null,
  })
  const items = c.covered.map((s) => ({
    id: s.id,
    name: s.name,
    pillar: s.pillar,
    pillarLabel: PILLAR_LABEL[s.pillar],
    tier: s.tier,
    tierLabel: TIER_LABEL[s.tier],
    outcome: s.outcome,
    pitfall: s.pitfall,
    hosts: s.hosts,
    demos: s.demos,
    lastTaught: s.lastTaught,
    slot: s.slot,
    taught: s.taught.map(lesson),
    archived: s.archived.map(lesson),
  }))
  return {
    ...envelope("skills", items, dataUpdated()),
    window: { anchor: c.anchor, start: c.windowStart, end: c.windowEnd },
    lessonCount: c.lessonCount,
    hostTally: c.hostTally,
    catalogSize: SKILLS.length,
    dormant: c.dormant.map((s) => ({ id: s.id, name: s.name, pillar: s.pillar, tier: s.tier, outcome: s.outcome })),
  }
}

/* ── technical core ─────────────────────────────────────────────────────── */

export function inventoryPayload() {
  const items: InventoryItem[] = INVENTORY
  return {
    ...envelope("inventory", items, dataUpdated()),
    pillars: PILLARS,
    byKind: {
      agent: items.filter((i) => i.kind === "agent").length,
      skill: items.filter((i) => i.kind === "skill").length,
      protocol: items.filter((i) => i.kind === "protocol").length,
    },
  }
}

/* ── the rest ───────────────────────────────────────────────────────────── */

export function nichesPayload() {
  return envelope("niches", NICHES, dataUpdated())
}

export function vaultPayload() {
  return {
    resource: "vault",
    version: API_VERSION,
    updated: dataUpdated(),
    audio: { count: AUDIO.length, items: AUDIO },
    documents: { count: DOCS.length, items: DOCS },
  }
}

export function deckPayload() {
  return {
    ...envelope("deck", SLIDES, dataUpdated()),
    note: "The .pptx export is generated in the browser from these slides; the content here is the source.",
  }
}

export function funnelPayload() {
  const example = simulateFunnel(FUNNEL_DEFAULTS)
  return {
    resource: "funnel",
    version: API_VERSION,
    updated: dataUpdated(),
    model: "ACP — Audience → Community → Product",
    currency: "USD",
    target: { grossMRR: MRR_TARGET, exitMultiple: EXIT_MULTIPLE },
    inputs: FUNNEL_FIELDS,
    defaults: FUNNEL_DEFAULTS,
    formulas: FUNNEL_FORMULAS,
    example: { inputs: example.inputs, outputs: roundOutputs(example.outputs) },
    note: "Inputs outside the published bounds are clamped, not rejected. The figures are a model, not a forecast.",
  }
}

/* ── sources, index, everything ─────────────────────────────────────────── */

export function sourcesPayload() {
  return { note: SOURCE_NOTE, feeds: SOURCE_FEEDS }
}

export function indexPayload(generatedAt: string) {
  const win = buildWindow(REVIEW_LOG)
  const skills = skillsPayload()
  return {
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    version: API_VERSION,
    generatedAt,
    updated: dataUpdated(),
    license: LICENSE,
    window: { anchor: win.anchor, nextRoll: win.nextRoll, slots: WEEK_SLOTS },
    counts: {
      airings: REVIEW_LOG.length,
      liveRepos: win.active.length,
      crossoversCut: win.crossoversCut,
      skillsCovered: skills.count,
      lessons: skills.lessonCount,
      inventory: INVENTORY.length,
      niches: NICHES.length,
      audio: AUDIO.length,
      documents: DOCS.length,
      slides: SLIDES.length,
    },
    endpoints: ENDPOINTS.map((e) => ({ id: e.id, path: e.path, title: e.title, summary: e.summary, returns: e.returns })),
    sources: sourcesPayload(),
  }
}

export function datasetPayload(generatedAt: string) {
  const win = buildWindow(REVIEW_LOG)
  return {
    index: indexPayload(generatedAt),
    window: windowPayload(win),
    repos: reposPayload(win),
    skills: skillsPayload(),
    inventory: inventoryPayload(),
    niches: nichesPayload(),
    vault: vaultPayload(),
    deck: deckPayload(),
    funnel: funnelPayload(),
  }
}
