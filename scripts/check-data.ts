/**
 * Data integrity gate.
 *
 * The workspace makes one structural promise: the review log is the single
 * source of truth, and everything else — the curriculum, the window, the host
 * roster — derives from it. That promise is only worth something if a build
 * fails when it breaks, so this runs in CI ahead of the build.
 *
 * It checks facts the type system cannot: that an episode number means the same
 * thing everywhere it appears, that a lesson cites an episode that exists, and
 * that a demo names a repo the log actually reviewed.
 *
 *   pnpm check:data
 */
import {
  HOSTS,
  REVIEW_LOG,
  buildWindow,
  providerChannelUrl,
  providerDisplayName,
  type RepoReview,
} from "../lib/repos"
import { SKILLS, buildCurriculum } from "../lib/skills"

const problems: string[] = []
const notes: string[] = []

const fail = (msg: string) => problems.push(msg)
const note = (msg: string) => notes.push(msg)

/* ── 1. Every row is well formed ─────────────────────────────────────────── */

const ISO = /^\d{4}-\d{2}-\d{2}$/
const OWNER_NAME = /^[\w.-]+\/[\w.-]+$/

for (const r of REVIEW_LOG) {
  const at = `${r.repo} (ep ${r.ep})`
  if (!OWNER_NAME.test(r.repo)) fail(`${at}: repo is not in "owner/name" form`)
  if (!ISO.test(r.date)) fail(`${at}: date "${r.date}" is not ISO yyyy-mm-dd`)
  else if (Number.isNaN(Date.parse(r.date))) fail(`${at}: date "${r.date}" is not a real calendar date`)
  if (!Number.isInteger(r.ep) || r.ep <= 0) fail(`${at}: episode number must be a positive integer`)
  if (!HOSTS.includes(r.host)) fail(`${at}: host "${r.host}" is not one of the tracked feeds`)
  if (!r.website.startsWith("https://")) fail(`${at}: website is not an https URL`)
}

/* ── 2. An episode number means one thing ────────────────────────────────── */

const byEpisode = new Map<number, RepoReview[]>()
for (const r of REVIEW_LOG) {
  const list = byEpisode.get(r.ep)
  if (list) list.push(r)
  else byEpisode.set(r.ep, [r])
}

for (const [ep, rows] of byEpisode) {
  for (const field of ["host", "epTitle", "date"] as const) {
    const values = [...new Set(rows.map((r) => r[field]))]
    if (values.length > 1) {
      fail(`Episode ${ep} disagrees about ${field}: ${values.map((v) => JSON.stringify(v)).join(" vs ")}`)
    }
  }
}

/* ── 3. Every feed resolves to a real channel ────────────────────────────── */

for (const host of HOSTS) {
  const url = providerChannelUrl(host)
  const name = providerDisplayName(host)
  if (!url?.startsWith("https://www.youtube.com/@")) fail(`Host "${host}" has no usable channel URL (got ${url})`)
  if (!name) fail(`Host "${host}" has no display name`)
}

/* ── 4. The curriculum cites only episodes the log knows ─────────────────── */

const repoNames = new Set(REVIEW_LOG.map((r) => r.name))
const skillIds = new Set<string>()

for (const s of SKILLS) {
  if (skillIds.has(s.id)) fail(`Duplicate skill id "${s.id}"`)
  skillIds.add(s.id)
  if (s.lessons.length === 0) fail(`Skill "${s.id}" has no lessons`)

  for (const l of s.lessons) {
    const rows = byEpisode.get(l.ep)
    if (!rows) {
      fail(`Skill "${s.id}" cites episode ${l.ep}, which is not in the review log`)
      continue
    }
    if (rows[0].host !== l.host) {
      fail(`Skill "${s.id}" attributes episode ${l.ep} to ${l.host}, but the log says ${rows[0].host}`)
    }
    for (const demo of l.demos) {
      if (!repoNames.has(demo)) {
        fail(`Skill "${s.id}" (ep ${l.ep}) demos "${demo}", which no reviewed repo is named`)
      }
    }
  }
}

/* ── 5. The window is derivable and self-consistent ──────────────────────── */

const win = buildWindow(REVIEW_LOG)
const liveAirings = win.weeks.reduce((n, w) => n + w.airings.length, 0)

if (win.weeks.length !== 4) fail(`Window has ${win.weeks.length} week slots, expected 4`)
if (win.crossoversCut < 0) fail(`Negative crossover count (${win.crossoversCut})`)
if (win.active.length + win.crossoversCut !== liveAirings) {
  fail(
    `Window arithmetic is off: ${win.active.length} live + ${win.crossoversCut} cut != ${liveAirings} airings`,
  )
}

const cur = buildCurriculum()
if (cur.covered.length + cur.dormant.length !== SKILLS.length) {
  fail(`Curriculum drops skills: ${cur.covered.length} covered + ${cur.dormant.length} dormant != ${SKILLS.length}`)
}

/* ── 6. Roster claims match the data ─────────────────────────────────────── */

const airing = HOSTS.filter((h) => REVIEW_LOG.some((r) => r.host === h))
const quiet = HOSTS.filter((h) => !airing.includes(h))
if (quiet.length > 0) {
  note(
    `${quiet.length} tracked feed(s) have no reviews logged: ${quiet.join(", ")}. ` +
      `The UI states this rather than implying full coverage — keep it that way, or add real rows.`,
  )
}

/* ── Report ──────────────────────────────────────────────────────────────── */

console.log(
  `Checked ${REVIEW_LOG.length} airings · ${byEpisode.size} episodes · ${SKILLS.length} skills · ${HOSTS.length} feeds`,
)
for (const n of notes) console.log(`note: ${n}`)

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}

console.log("Data integrity: OK")
