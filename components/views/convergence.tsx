"use client"

import { useState } from "react"
import { Bot, ShieldCheck, Radio, ArrowRight } from "lucide-react"
import { PILLARS, SOURCE_FEEDS, SOURCE_NOTE, INVENTORY } from "@/lib/data"
import { Panel, Chip, Stat } from "@/components/kit"
import { cn } from "@/lib/utils"

const ICONS = {
  autonomy: Bot,
  governance: ShieldCheck,
  distribution: Radio,
}

// three nodes on a circle: top, bottom-right, bottom-left
const POSITIONS = [
  { top: "2%", left: "50%" },
  { top: "72%", left: "92%" },
  { top: "72%", left: "8%" },
]

export function ConvergenceView() {
  const [active, setActive] = useState<(typeof PILLARS)[number]["id"]>("autonomy")
  const pillar = PILLARS.find((p) => p.id === active)!
  const Icon = ICONS[active]

  const counts = PILLARS.map((p) => ({
    id: p.id,
    n: INVENTORY.filter((i) => i.pillar === p.id).length,
  }))

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="max-w-3xl">
        <Chip tone="accent">Rolling 4-Week Intelligence</Chip>

        {/* the name is the hook — it carries the page */}
        <h1 className="mt-4 text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-balance sm:text-[56px]">
          Eisenberg, Pocock, Warner,
          <br />
          Wolfe <span className="text-accent">&amp;</span> Berman
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">{SOURCE_NOTE}</p>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {SOURCE_FEEDS.map((source) => (
            <li key={source.name}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-lg border border-border bg-card/60 p-3 transition-colors hover:border-accent/50 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-[12px] font-semibold tracking-tight">{source.name}</span>
                <span className="mt-1 block text-[10px] leading-relaxed text-muted-foreground">{source.focus}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="text-accent">Commended</span>
          <span aria-hidden className="text-border-strong">
            /
          </span>
          <span>Agents</span>
          <span aria-hidden className="text-border-strong">
            /
          </span>
          <span>Governance</span>
          <span aria-hidden className="text-border-strong">
            /
          </span>
          <span>Distribution</span>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
        {/* focal circle */}
        <div className="relative mx-auto aspect-square w-full max-w-[440px]">
          <div className="absolute inset-[9%] rounded-full border border-border" />
          <div className="absolute inset-[22%] rounded-full border border-dashed border-border" />

          <div className="absolute inset-[30%] flex flex-col items-center justify-center rounded-full bg-card shadow-[0_18px_50px_-24px_oklch(0_0_0/0.35)]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Convergence
            </span>
            <span className="mt-1 text-center text-[15px] font-semibold leading-tight tracking-tight">
              Builders
              <br />
              Sentinel
            </span>
            <span className="mt-2 h-px w-8 bg-accent" />
          </div>

          {PILLARS.map((p, i) => {
            const NodeIcon = ICONS[p.id]
            const on = p.id === active
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                aria-pressed={on}
                style={{ top: POSITIONS[i].top, left: POSITIONS[i].left }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3.5 py-3 text-left transition-all duration-200",
                  on
                    ? "border-accent/60 bg-card shadow-[0_10px_30px_-14px_oklch(0_0_0/0.3)] scale-[1.03]"
                    : "border-border bg-card/70 hover:bg-card",
                )}
              >
                <NodeIcon className={cn("size-4", on ? "text-accent" : "text-muted-foreground")} />
                <div className="mt-1.5 text-[12px] font-semibold tracking-tight">{p.short}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {counts.find((c) => c.id === p.id)!.n} assets
                </div>
              </button>
            )
          })}
        </div>

        {/* detail */}
        <Panel className="p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-accent/18">
              <Icon className="size-4.5 text-accent" />
            </span>
            <Chip tone="outline">Pillar {String(PILLARS.findIndex((p) => p.id === active) + 1).padStart(2, "0")}</Chip>
          </div>
          <h2 className="mt-4 text-[20px] font-semibold leading-snug tracking-tight text-balance">{pillar.title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{pillar.line}</p>
          <ul className="mt-5 space-y-3">
            {pillar.points.map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[13px] leading-relaxed">
                <ArrowRight className="mt-1 size-3.5 shrink-0 text-accent" />
                <span className="text-pretty">{pt}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Autonomous agents" value="14" sub="specialized machine roles" emphasis />
        <Stat label="Core methods" value="10" sub="documented techniques" />
        <Stat label="Protocol surfaces" value="4" sub="MCP, Datalog, SSE" />
        <Stat label="Human FTEs" value="0" sub="verification is automated" />
      </div>
    </div>
  )
}
