"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Code2, Globe, Play, Search } from "lucide-react"
import {
  dedupeReviews,
  episodeUrl,
  formatDate,
  PILLAR_LABEL,
  PILLAR_SHORT,
  repoUrl,
  REVIEW_LOG,
  windowLabel,
  type DedupedRepo,
  type RepoPillar,
} from "@/lib/repos"
import { Chip, CopyButton, Panel, PanelHeader, Segmented, Stat } from "@/components/kit"
import { cn } from "@/lib/utils"

type Filter = "all" | RepoPillar

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
          ? "border-accent/40 bg-accent/12 text-accent-foreground hover:bg-accent/20 dark:text-accent"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span>{label}</span>
      <ArrowUpRight className="size-3 opacity-60" aria-hidden />
    </a>
  )
}

function Row({ r }: { r: DedupedRepo }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[14px] font-semibold tracking-tight">{r.name}</h4>
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
                    className="text-accent-foreground underline underline-offset-2 dark:text-accent"
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

export function ReposView() {
  const [filter, setFilter] = useState<Filter>("all")
  const [q, setQ] = useState("")

  const deduped = useMemo(() => dedupeReviews(REVIEW_LOG), [])
  const span = useMemo(() => windowLabel(REVIEW_LOG), [])
  const removedCount = REVIEW_LOG.length - deduped.length

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return deduped.filter((r) => {
      if (filter !== "all" && r.pillar !== filter) return false
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
  }, [deduped, filter, q])

  const markdown = useMemo(() => {
    const head = "| Repo | Pillar | Episode | Reviewed | Repo link | Website |\n| --- | --- | --- | --- | --- | --- |"
    const body = rows
      .map(
        (r) =>
          `| ${r.name} | ${PILLAR_SHORT[r.pillar]} | [Ep ${r.ep} — ${r.epTitle}](${episodeUrl(r)}) | ${formatDate(
            r.date,
          )} | ${repoUrl(r)} | ${r.website} |`,
      )
      .join("\n")
    return `${head}\n${body}`
  }, [rows])

  const csv = useMemo(() => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
    const head = ["repo", "name", "pillar", "episode", "episode_title", "host", "date", "repo_url", "website", "episode_url", "duplicates_removed"]
    const lines = rows.map((r) =>
      [
        r.repo,
        r.name,
        PILLAR_LABEL[r.pillar],
        String(r.ep),
        r.epTitle,
        r.host,
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
  }, [rows])

  const byPillar = (p: RepoPillar) => deduped.filter((r) => r.pillar === p).length

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Review Log</Chip>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
          Repos reviewed, crossovers cut
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
          One row per repository. When a repo showed up in more than one episode inside the window, the older
          airings are deleted and only the newest review survives.
        </p>
      </header>

      <Panel>
        <PanelHeader
          title="Repos reviewed — trailing 30 days"
          hint={`Every repository put on the bench between ${formatDate(span.from)} and ${formatDate(
            span.to,
          )}. Crossovers are collapsed to a single row on the newest episode; the superseded airings are deleted but kept inspectable.`}
          right={
            <div className="flex shrink-0 gap-1.5">
              <CopyButton payload={markdown} label="Markdown" />
              <CopyButton payload={csv} label="CSV" />
            </div>
          }
        />
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Unique repos" value={String(deduped.length)} sub={`${REVIEW_LOG.length} raw airings`} emphasis />
          <Stat label="Crossovers deleted" value={String(removedCount)} sub="duplicate airings dropped" />
          <Stat label="Agents / Governance" value={`${byPillar("agents")} / ${byPillar("governance")}`} sub="pillar split" />
          <Stat label="Distribution" value={String(byPillar("media"))} sub="media & SaaS repos" />
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: `All ${deduped.length}` },
              { value: "agents", label: PILLAR_SHORT.agents },
              { value: "governance", label: PILLAR_SHORT.governance },
              { value: "media", label: PILLAR_SHORT.media },
            ]}
          />
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search repo, host, episode…"
              aria-label="Search reviewed repos"
              className="w-full rounded-lg border border-input bg-card py-2 pl-8 pr-3 text-[13px] outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        <p className="mt-3 text-[12px] text-muted-foreground">
          Showing <span className="font-mono font-semibold tabular-nums">{rows.length}</span> of{" "}
          <span className="font-mono tabular-nums">{deduped.length}</span> deduped repos.
        </p>

        {rows.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-[13px] text-muted-foreground">
            No repo in the 30-day window matches that filter.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            {rows.map((r) => (
              <Row key={r.repo} r={r} />
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="bg-secondary/40">
        <PanelHeader
          title="Link provenance"
          hint="Repository and website links point at canonical upstream URLs. Episode links resolve through the show's search rather than a hardcoded video id, so nothing in this table can rot into a dead link — swap them for permalinks once the Eisenberg / Peacock / Warner episode index is wired in. Language and license fields are best-effort; verify upstream before citing them in a filing."
        />
      </Panel>
    </div>
  )
}
