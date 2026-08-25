"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Archive, Code2, Globe, Inbox, Play, Search } from "lucide-react"
import {
  buildWindow,
  episodeUrl,
  formatDate,
  PILLAR_LABEL,
  PILLAR_SHORT,
  repoUrl,
  REVIEW_LOG,
  slotOf,
  weekRangeLabel,
  type DedupedRepo,
  type ProviderTally,
  type RepoPillar,
  type RepoReview,
  type VaultWeek,
  type WeekSlot,
} from "@/lib/repos"
import { Chip, CopyButton, Panel, PanelHeader, Segmented, Stat } from "@/components/kit"
import { cn } from "@/lib/utils"

type PillarFilter = "all" | RepoPillar
type WeekFilter = "all" | "1" | "2" | "3" | "4"

const PROVIDERS: Array<{ key: keyof ProviderTally; short: string }> = [
  { key: "Eisenberg", short: "Eis" },
  { key: "Pocock", short: "Pea" },
  { key: "Warner", short: "War" },
]

function LinkPill({
  href,
  icon: Icon,
  label,
  tone = "quiet",
}: {
  href: string
  icon: typeof Code2
  label: string
  tone?: "quiet" | "accent"
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
        tone === "accent"
          ? "border-accent/40 bg-accent/12 text-accent hover:bg-accent/20"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span>{label}</span>
      <ArrowUpRight className="size-3 opacity-60" aria-hidden />
    </a>
  )
}

function ProviderBars({ t, total }: { t: ProviderTally; total: number }) {
  return (
    <dl className="mt-3 flex flex-col gap-1">
      {PROVIDERS.map((p) => {
        const n = t[p.key]
        const pct = total > 0 ? Math.round((n / total) * 100) : 0
        return (
          <div key={p.key} className="flex items-center gap-2">
            <dt className="w-7 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{p.short}</dt>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-accent/70" style={{ width: `${pct}%` }} />
            </div>
            <dd className="w-4 text-right font-mono text-[10px] tabular-nums text-muted-foreground">{n}</dd>
          </div>
        )
      })}
    </dl>
  )
}

/** The conveyor: staging on the left, four live slots, the vault on the right. */
function RollRail({
  weeks,
  staging,
  vaultedCount,
  nextRoll,
  active,
  onPick,
}: {
  weeks: WeekSlot[]
  staging: RepoReview[]
  vaultedCount: number
  nextRoll: string
  active: WeekFilter
  onPick: (w: WeekFilter) => void
}) {
  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch">
      <div className="flex shrink-0 flex-col justify-between rounded-lg border border-dashed border-accent/50 bg-accent/8 p-3 lg:w-[132px]">
        <div>
          <div className="flex items-center gap-1.5">
            <Inbox className="size-3.5 text-accent" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              Incoming
            </span>
          </div>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums leading-none">{staging.length}</p>
        </div>
        <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
          Promotes to Week 1 on {formatDate(nextRoll)}
        </p>
      </div>

      <div className="grid flex-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {weeks.map((w) => {
          const id = String(w.slot) as WeekFilter
          const selected = active === id
          return (
            <button
              key={w.slot}
              onClick={() => onPick(selected ? "all" : id)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col rounded-lg border p-3 text-left transition-colors",
                selected
                  ? "border-accent bg-accent/12"
                  : w.slot === 1
                    ? "border-accent/40 bg-card hover:border-accent/70"
                    : "border-border bg-card/60 hover:border-muted-foreground/40",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-tight">Week {w.slot}</span>
                {w.slot === 1 ? (
                  <Chip tone="accent">fresh</Chip>
                ) : w.slot === 4 ? (
                  <Chip tone="outline">rolls out</Chip>
                ) : null}
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{weekRangeLabel(w)}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-semibold tabular-nums leading-none">{w.airings.length}</span>
                <span className="text-[10px] text-muted-foreground">airings</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                <span className="font-mono tabular-nums">{w.kept}</span> kept after dedupe
              </p>
              <ProviderBars t={w.providers} total={w.airings.length} />
            </button>
          )
        })}
      </div>

      <div className="flex shrink-0 flex-col justify-between rounded-lg border border-border bg-secondary/50 p-3 lg:w-[132px]">
        <div>
          <div className="flex items-center gap-1.5">
            <Archive className="size-3.5 text-muted-foreground" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Vault</span>
          </div>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums leading-none text-muted-foreground">
            {vaultedCount}
          </p>
        </div>
        <p className="mt-2 text-[10px] leading-snug text-muted-foreground">Airings pushed out of the window</p>
      </div>
    </div>
  )
}

function Row({ r, slot }: { r: DedupedRepo; slot: number }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="rounded-lg border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[14px] font-semibold tracking-tight">{r.name}</h4>
            <Chip tone={slot === 1 ? "accent" : "outline"}>W{slot}</Chip>
            <Chip tone="outline">{PILLAR_SHORT[r.pillar]}</Chip>
            {r.removed.length > 0 ? (
              <Chip tone="accent">crossover &times;{r.removed.length} removed</Chip>
            ) : null}
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{r.repo}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <LinkPill href={episodeUrl(r)} icon={Play} label={`Ep ${r.ep}`} tone="accent" />
          <LinkPill href={repoUrl(r)} icon={Code2} label="Repo" />
          <LinkPill href={r.website} icon={Globe} label="Site" />
        </div>
      </div>

      <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground text-pretty">{r.blurb}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
        <span className="font-mono tabular-nums">{formatDate(r.date)}</span>
        <span aria-hidden>&middot;</span>
        <span>{r.host}</span>
        <span aria-hidden>&middot;</span>
        <span className="truncate">&ldquo;{r.epTitle}&rdquo;</span>
        <span aria-hidden>&middot;</span>
        <span>{r.lang}</span>
        <span aria-hidden>&middot;</span>
        <span>{r.license}</span>
      </div>

      {r.removed.length > 0 ? (
        <div className="mt-3 border-t border-border pt-2.5">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {open ? "Hide" : "Show"} {r.removed.length} deleted duplicate
            {r.removed.length > 1 ? "s" : ""}
          </button>
          {open ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {r.removed.map((d) => (
                <li key={d.ep} className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="font-mono line-through">Ep {d.ep}</span>
                  <span className="line-through">{formatDate(d.date)}</span>
                  <span className="line-through">&ldquo;{d.epTitle}&rdquo;</span>
                  <a
                    href={episodeUrl(d)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2"
                  >
                    listen
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

function VaultBlock({ w }: { w: VaultWeek }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="rounded-lg border border-border bg-card/40 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold tracking-tight">{weekRangeLabel(w)}</span>
          <Chip tone="outline">
            {w.rolledOut} roll{w.rolledOut > 1 ? "s" : ""} ago
          </Chip>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {open ? "Hide" : "Show"} {w.airings.length} archived
        </button>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {PROVIDERS.map((p) => `${p.key} ${w.providers[p.key]}`).join(" · ")}
      </p>
      {open ? (
        <ul className="mt-2.5 flex flex-col gap-1.5 border-t border-border pt-2.5">
          {w.airings.map((r) => (
            <li key={`${r.repo}-${r.ep}`} className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-mono text-muted-foreground">{r.repo}</span>
              <a
                href={episodeUrl(r)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                Ep {r.ep}
              </a>
              <a
                href={repoUrl(r)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                repo
              </a>
              <a
                href={r.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                site
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function ReposView() {
  const [pillar, setPillar] = useState<PillarFilter>("all")
  const [week, setWeek] = useState<WeekFilter>("all")
  const [q, setQ] = useState("")

  const win = useMemo(() => buildWindow(REVIEW_LOG), [])
  const vaultedCount = win.vaulted.reduce((n, w) => n + w.airings.length, 0)
  const liveAirings = win.weeks.reduce((n, w) => n + w.airings.length, 0)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return win.active
      .map((r) => ({ r, slot: slotOf(win, r.date) }))
      .filter(({ r, slot }) => {
        if (pillar !== "all" && r.pillar !== pillar) return false
        if (week !== "all" && String(slot) !== week) return false
        if (!needle) return true
        return (
          r.name.toLowerCase().includes(needle) ||
          r.repo.toLowerCase().includes(needle) ||
          r.blurb.toLowerCase().includes(needle) ||
          r.epTitle.toLowerCase().includes(needle) ||
          r.host.toLowerCase().includes(needle) ||
          r.lang.toLowerCase().includes(needle)
        )
      })
  }, [win, pillar, week, q])

  const markdown = useMemo(() => {
    const head =
      "| Week | Repo | Pillar | Provider | Episode | Reviewed | Repo link | Website |\n| --- | --- | --- | --- | --- | --- | --- | --- |"
    const body = rows
      .map(
        ({ r, slot }) =>
          `| W${slot} | ${r.name} | ${PILLAR_SHORT[r.pillar]} | ${r.host} | [Ep ${r.ep} — ${r.epTitle}](${episodeUrl(
            r,
          )}) | ${formatDate(r.date)} | ${repoUrl(r)} | ${r.website} |`,
      )
      .join("\n")
    return `${head}\n${body}`
  }, [rows])

  const csv = useMemo(() => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
    const head = [
      "week_slot",
      "week_start",
      "repo",
      "name",
      "pillar",
      "provider",
      "episode",
      "episode_title",
      "date",
      "repo_url",
      "website",
      "episode_url",
      "duplicates_removed",
    ]
    const lines = rows.map(({ r, slot }) =>
      [
        `W${slot}`,
        win.weeks.find((w) => w.slot === slot)?.start ?? "",
        r.repo,
        r.name,
        PILLAR_LABEL[r.pillar],
        r.host,
        String(r.ep),
        r.epTitle,
        r.date,
        repoUrl(r),
        r.website,
        episodeUrl(r),
        String(r.removed.length),
      ]
        .map(esc)
        .join(","),
    )
    return [head.join(","), ...lines].join("\n")
  }, [rows, win])

  const byPillar = (p: RepoPillar) => win.active.filter((r) => r.pillar === p).length

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Rolling Window</Chip>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
          Four weeks wide, one Monday at a time
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
          Every Monday the agent ingests the week that just closed and files it as Week&nbsp;1. Each surviving
          week shifts down a slot and whatever falls out of Week&nbsp;4 is vaulted. The live board is always
          exactly four weeks of Eisenberg, Pocock and Warner coverage &mdash; never more, never less.
        </p>
      </header>

      <Panel>
        <PanelHeader
          title="The Monday roll"
          hint={`Window rebuilt ${formatDate(win.anchor)}, covering ${weekRangeLabel({
            start: win.weeks[3].start,
            end: win.weeks[0].end,
          })}. Next roll ${formatDate(win.nextRoll)}. Click a week to filter the table below.`}
        />
        <div className="mt-4">
          <RollRail
            weeks={win.weeks}
            staging={win.staging}
            vaultedCount={vaultedCount}
            nextRoll={win.nextRoll}
            active={week}
            onPick={setWeek}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Live repos"
            value={String(win.active.length)}
            sub={`${liveAirings} airings across 4 weeks`}
            emphasis
          />
          <Stat label="Crossovers deleted" value={String(win.crossoversCut)} sub="duplicate airings dropped" />
          <Stat
            label="Agents / Governance"
            value={`${byPillar("agents")} / ${byPillar("governance")}`}
            sub="pillar split"
          />
          <Stat label="Distribution" value={String(byPillar("media"))} sub="media & SaaS repos" />
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented<WeekFilter>
              value={week}
              onChange={setWeek}
              options={[
                { value: "all", label: "4wk" },
                { value: "1", label: "W1" },
                { value: "2", label: "W2" },
                { value: "3", label: "W3" },
                { value: "4", label: "W4" },
              ]}
            />
            <Segmented<PillarFilter>
              value={pillar}
              onChange={setPillar}
              options={[
                { value: "all", label: "All" },
                { value: "agents", label: PILLAR_SHORT.agents },
                { value: "governance", label: PILLAR_SHORT.governance },
                { value: "media", label: PILLAR_SHORT.media },
              ]}
            />
          </div>
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search repo, provider, episode…"
              aria-label="Search reviewed repos"
              className="w-full rounded-lg border border-input bg-card py-2 pl-8 pr-3 text-[13px] outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex shrink-0 gap-1.5">
            <CopyButton payload={markdown} label="Markdown" />
            <CopyButton payload={csv} label="CSV" />
          </div>
        </div>

        <p className="mt-3 text-[12px] text-muted-foreground">
          Showing <span className="font-mono font-semibold tabular-nums">{rows.length}</span> of{" "}
          <span className="font-mono tabular-nums">{win.active.length}</span> live repos
          {week === "all" ? " across all four weeks" : ` in Week ${week}`}.
        </p>

        {rows.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-8 text-center text-[13px] text-muted-foreground">
            No repo in the live window matches that filter.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            {rows.map(({ r, slot }) => (
              <Row key={r.repo} r={r} slot={slot} />
            ))}
          </ul>
        )}
      </Panel>

      {win.staging.length > 0 ? (
        <Panel className="border-accent/30 bg-accent/6">
          <PanelHeader
            title={`Staging — ${win.staging.length} airings waiting on the next roll`}
            hint={`Already collected but not yet part of the live window. These promote into Week 1 on ${formatDate(
              win.nextRoll,
            )}, which pushes the current Week 4 into the vault.`}
          />
          <ul className="mt-3 flex flex-col gap-1.5">
            {win.staging.map((r) => (
              <li key={`${r.repo}-${r.ep}`} className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-mono text-muted-foreground">{r.repo}</span>
                <Chip tone="outline">{r.host}</Chip>
                <a
                  href={episodeUrl(r)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2"
                >
                  Ep {r.ep}
                </a>
                <a
                  href={repoUrl(r)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  repo
                </a>
                <a
                  href={r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  site
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {win.vaulted.length > 0 ? (
        <Panel className="bg-secondary/40">
          <PanelHeader
            title={`Vault — ${vaultedCount} airings, ${win.vaulted.length} week${win.vaulted.length > 1 ? "s" : ""}`}
            hint="Weeks that have aged out of the four-week board. Nothing is destroyed on the roll: every link stays resolvable here, it just stops competing for attention on the live table."
          />
          <ul className="mt-3 flex flex-col gap-2">
            {win.vaulted.map((w) => (
              <VaultBlock key={w.start} w={w} />
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel className="bg-secondary/40">
        <PanelHeader
          title="Ingest contract"
          hint="The window anchors to the newest row in the log, so it advances the moment Monday's batch lands — server and client always compute the same four weeks. Repository and website links point at canonical upstream URLs; episode links resolve through the show's search rather than a hardcoded video id, so nothing here can rot into a dead link. Wiring the actual Monday cron needs a database and a scheduled route; say the word and I'll add it."
        />
      </Panel>
    </div>
  )
}
