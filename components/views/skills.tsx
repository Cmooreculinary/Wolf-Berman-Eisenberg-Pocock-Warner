"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Search } from "lucide-react"
import { Chip, CopyButton, Panel, PanelHeader, Segmented, Stat } from "@/components/kit"
import { PILLAR_SHORT, formatDate, weekRangeLabel, type RepoPillar } from "@/lib/repos"
import {
  buildCurriculum,
  lessonUrl,
  TIER_LABEL,
  TIER_ORDER,
  type CoveredSkill,
  type SkillHost,
  type SkillTier,
} from "@/lib/skills"
import { cn } from "@/lib/utils"

type PillarFilter = RepoPillar | "all"
type TierFilter = SkillTier | "all"

const HOST_ABBR: Record<SkillHost, string> = {
  Eisenberg: "EIS",
  Pocock: "PEA",
  Warner: "WAR",
  Wolfe: "WOL",
  Berman: "BER",
}

function TierBar({ tier }: { tier: SkillTier }) {
  const filled = tier === "foundational" ? 1 : tier === "working" ? 2 : 3
  return (
    <span className="inline-flex items-center gap-1" title={TIER_LABEL[tier]}>
      {[0, 1, 2].map((i) => (
        <span key={i} aria-hidden className={cn("h-2.5 w-1", i < filled ? "bg-accent" : "bg-border-strong")} />
      ))}
      <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {TIER_LABEL[tier]}
      </span>
    </span>
  )
}

function SkillRow({ s }: { s: CoveredSkill }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="rounded-lg border border-border bg-secondary/40">
      <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-medium tracking-[-0.01em]">{s.name}</h3>
            <Chip tone="outline">{PILLAR_SHORT[s.pillar]}</Chip>
            {s.slot === 1 ? <Chip tone="accent">This week</Chip> : null}
          </div>

          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">{s.outcome}</p>

          <p className="mt-2.5 border-l-2 border-border-strong pl-3 text-[12px] leading-relaxed text-muted-foreground text-pretty">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Trap </span>
            {s.pitfall}
          </p>

          {s.demos.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Shown with
              </span>
              {s.demos.map((d) => (
                <span
                  key={d}
                  className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {d}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:w-40 sm:items-end">
          <TierBar tier={s.tier} />
          <div className="flex flex-wrap items-center gap-1 sm:justify-end">
            {s.hosts.map((h) => (
              <span
                key={h}
                title={h}
                className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-secondary-foreground"
              >
                {HOST_ABBR[h]}
              </span>
            ))}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-accent"
          >
            {s.taught.length} lesson{s.taught.length === 1 ? "" : "s"} {open ? "−" : "+"}
          </button>
        </div>
      </div>

      {open ? (
        <ul className="border-t border-border px-3.5 py-2.5">
          {s.taught.map((l) => (
            <li key={`${l.host}-${l.ep}-${l.date}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1">
              <a
                href={lessonUrl(s.name, l)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-accent underline underline-offset-2"
              >
                Ep {l.ep}
                <ArrowUpRight className="size-3" />
              </a>
              <span className="font-mono text-[11px] text-muted-foreground">{l.host}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{formatDate(l.date)}</span>
              <span className="text-[12px] text-muted-foreground">{l.demos.join(", ")}</span>
            </li>
          ))}
          {s.archived.length > 0 ? (
            <li className="mt-1 border-t border-border pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {s.archived.length} earlier airing{s.archived.length === 1 ? "" : "s"} outside the window
            </li>
          ) : null}
        </ul>
      ) : null}
    </li>
  )
}

export function SkillsView() {
  const cur = useMemo(() => buildCurriculum(), [])
  const [pillar, setPillar] = useState<PillarFilter>("all")
  const [tier, setTier] = useState<TierFilter>("all")
  const [q, setQ] = useState("")

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return cur.covered.filter((s) => {
      if (pillar !== "all" && s.pillar !== pillar) return false
      if (tier !== "all" && s.tier !== tier) return false
      if (!needle) return true
      return (
        s.name.toLowerCase().includes(needle) ||
        s.outcome.toLowerCase().includes(needle) ||
        s.pitfall.toLowerCase().includes(needle) ||
        s.demos.some((d) => d.toLowerCase().includes(needle)) ||
        s.hosts.some((h) => h.toLowerCase().includes(needle))
      )
    })
  }, [cur.covered, pillar, tier, q])

  const byTier = useMemo(
    () => TIER_ORDER.map((t) => ({ tier: t, n: cur.covered.filter((s) => s.tier === t).length })),
    [cur.covered],
  )

  const range = weekRangeLabel({ start: cur.windowStart, end: cur.windowEnd })

  const markdown = useMemo(
    () =>
      [
        `# Skills covered — ${range}`,
        "",
        `${rows.length} skills · ${cur.lessonCount} lessons · Eisenberg, Pocock, Warner, Wolfe & Berman`,
        "",
        "| Skill | Pillar | Tier | Hosts | Last taught | Shown with |",
        "| --- | --- | --- | --- | --- | --- |",
        ...rows.map(
          (s) =>
            `| ${s.name} | ${PILLAR_SHORT[s.pillar]} | ${TIER_LABEL[s.tier]} | ${s.hosts.join(
              ", ",
            )} | ${formatDate(s.lastTaught)} | ${s.demos.join(", ")} |`,
        ),
      ].join("\n"),
    [rows, cur.lessonCount, range],
  )

  const csv = useMemo(
    () =>
      [
        "skill,pillar,tier,hosts,lessons,last_taught,week_slot,shown_with",
        ...rows.map((s) =>
          [
            `"${s.name}"`,
            PILLAR_SHORT[s.pillar],
            s.tier,
            `"${s.hosts.join(" ")}"`,
            s.taught.length,
            s.lastTaught,
            s.slot,
            `"${s.demos.join(" ")}"`,
          ].join(","),
        ),
      ].join("\n"),
    [rows],
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Curriculum</Chip>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-balance">
          Everything the three taught this month
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
          Not a topic list — a skill list. Each row is something you can do afterwards, the trap that catches
          founders who skip it, and the episodes where it was actually taught. Same rolling four-week window as the
          repo log: {range}.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Skills covered" value={String(cur.covered.length)} sub="in the live window" emphasis />
        <Stat label="Lessons" value={String(cur.lessonCount)} sub="airings that taught one" />
        <Stat
          label="Taught by"
          value={`${cur.hostTally.Eisenberg}/${cur.hostTally.Pocock}/${cur.hostTally.Warner}/${cur.hostTally.Wolfe}/${cur.hostTally.Berman}`}
          sub="EIS / PEA / WAR"
        />
        <Stat
          label="This week"
          value={String(cur.covered.filter((s) => s.slot === 1).length)}
          sub="taught in W1"
        />
      </div>

      <Panel>
        <PanelHeader title="Depth ladder" hint="Where the month's teaching actually sits." />
        <div className="mt-4 flex flex-col gap-2">
          {byTier.map(({ tier: t, n }) => {
            const pct = cur.covered.length ? Math.round((n / cur.covered.length) * 100) : 0
            return (
              <div key={t} className="flex items-center gap-3">
                <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {TIER_LABEL[t]}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-sm bg-secondary">
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {n} · {pct}%
                </span>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
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
            <Segmented<TierFilter>
              value={tier}
              onChange={setTier}
              options={[
                { value: "all", label: "Any" },
                { value: "foundational", label: "Found." },
                { value: "working", label: "Working" },
                { value: "advanced", label: "Adv." },
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
              placeholder="Search skills, traps, tools…"
              aria-label="Search skills covered"
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
          <span className="font-mono tabular-nums">{cur.covered.length}</span> skills covered in the window.
        </p>

        {rows.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-8 text-center text-[13px] text-muted-foreground">
            No skill in the window matches that filter.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            {rows.map((s) => (
              <SkillRow key={s.id} s={s} />
            ))}
          </ul>
        )}
      </Panel>

      {cur.dormant.length > 0 ? (
        <Panel className="bg-secondary/40">
          <PanelHeader
            title="Dormant this month"
            hint="In the catalog, but no airing inside the live window taught them."
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {cur.dormant.map((s) => (
              <span
                key={s.id}
                className="rounded border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
              >
                {s.name}
              </span>
            ))}
          </div>
        </Panel>
      ) : null}
    </div>
  )
}
