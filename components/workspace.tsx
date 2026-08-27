"use client"

import { useEffect, useState } from "react"
import {
  Aperture,
  Bot,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Library,
  Moon,
  PenLine,
  Presentation,
  Sun,
  Wrench,
} from "lucide-react"
import { DISCLAIMER } from "@/lib/data"
import { ConvergenceView } from "@/components/views/convergence"
import { BlueprintView } from "@/components/views/blueprint"
import { InventoryView } from "@/components/views/inventory"
import { ToolboxView } from "@/components/views/toolbox"
import { VaultView } from "@/components/views/vault"
import { DeckView } from "@/components/views/deck"
import { ReposView } from "@/components/views/repos"
import { FoundersView } from "@/components/views/founders"
import { SkillsView } from "@/components/views/skills"
import { cn } from "@/lib/utils"

type ViewId =
  | "convergence"
  | "blueprint"
  | "inventory"
  | "repos"
  | "skills"
  | "toolbox"
  | "vault"
  | "deck"
  | "founders"

const NAV: {
  group: string
  items: { id: ViewId; label: string; icon: typeof Bot; caption: string }[]
}[] = [
  {
    group: "Thesis",
    items: [
      { id: "convergence", label: "Convergence", icon: Aperture, caption: "Five sources, three pillars" },
      { id: "blueprint", label: "Blueprint", icon: LayoutDashboard, caption: "ACP engine & risk model" },
    ],
  },
  {
    group: "Core",
    items: [
      { id: "inventory", label: "Inventory", icon: Bot, caption: "Agents, methods, protocols" },
      { id: "repos", label: "Repos reviewed", icon: GitBranch, caption: "Rolling 4 weeks" },
      { id: "skills", label: "Skills covered", icon: GraduationCap, caption: "Curriculum, last month" },
      { id: "toolbox", label: "Toolbox", icon: Wrench, caption: "Founder instruments" },
      { id: "vault", label: "Vault", icon: Library, caption: "Audio & documents" },
    ],
  },
  {
    group: "Output",
    items: [{ id: "deck", label: "Slide deck", icon: Presentation, caption: "13 slides + .pptx" }],
  },
  {
    group: "Shop",
    items: [
      { id: "founders", label: "Founder's note", icon: PenLine, caption: "Why this exists" },
    ],
  },
]

const TITLES: Record<ViewId, string> = {
  convergence: "Convergence",
  blueprint: "2026 Blueprint",
  inventory: "Technical Core",
  repos: "Repos Reviewed",
  skills: "Skills Covered",
  toolbox: "Founder Toolbox",
  vault: "Masterclass Vault",
  deck: "Slide Deck",
  founders: "Founder's Note",
}

function Clock() {
  const [now, setNow] = useState<string>("")
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) ,
      )
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])
  return <span className="font-mono tabular-nums">{now}</span>
}

export function Workspace() {
  const [view, setView] = useState<ViewId>("convergence")
  // BCA ships dark by default; `light` is the opt-in counterpart.
  const [light, setLight] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("light", light)
  }, [light])

  return (
    <div className="min-h-dvh bg-background">
      {/* menu bar */}
      <div className="sticky top-0 z-30 flex h-7 items-center gap-4 border-b border-border/70 mac-glass px-4 text-[12px] text-muted-foreground">
        <span aria-hidden className="h-3 w-4 shrink-0 bca-hatch" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
          Eisenberg, Pocock, Warner, Wolfe &amp; Berman
        </span>
        <span className="hidden text-border-strong sm:inline">/</span>
        <a
          href="https://bcappz.com"
          target="_blank"
          rel="noreferrer"
          className="hidden hover:text-foreground sm:inline"
        >
          a Blue Collar Appz build
        </a>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => setLight((l) => !l)} aria-label="Toggle appearance" className="hover:text-foreground">
            {light ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
          </button>
          <Clock />
        </div>
      </div>

      <div className="p-3 sm:p-6">
        {/* window */}
        <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-[1400px] overflow-hidden rounded-lg border border-border bg-card shadow-[0_30px_80px_-40px_oklch(0_0_0/0.45)]">
          {/* sidebar */}
          <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
            <div className="flex items-center gap-2 px-4 py-3.5">
              <span className="size-3 rounded-full bg-destructive/85" />
              <span className="size-3 rounded-full bg-accent" />
              <span className="size-3 rounded-full bg-chart-3/70" />
            </div>

            {/* masthead — the name is the hook */}
            <div className="border-y border-sidebar-border px-4 py-3.5">
              <div className="flex items-baseline gap-1.5 text-[15px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
                <span>Eisenberg, Pocock,</span>
              </div>
              <div className="text-[15px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
                Warner, Wolfe <span className="text-accent">&amp;</span> Berman
              </div>
              <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                Rolling 4-week intelligence
              </div>
            </div>

            <nav className="scroll-slim flex-1 overflow-auto px-2.5 pb-3 pt-3">
              {NAV.map((g) => (
                <div key={g.group} className="mb-4">
                  <div className="px-2.5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {g.group}
                  </div>
                  <ul className="space-y-0.5">
                    {g.items.map((it) => {
                      const Icon = it.icon
                      const on = it.id === view
                      return (
                        <li key={it.id}>
                          <button
                            onClick={() => setView(it.id)}
                            aria-current={on}
                            className={cn(
                              "flex w-full items-center gap-2.5 border-l-2 px-2.5 py-2 text-left transition-colors",
                              on
                                ? "border-accent bg-sidebar-accent text-sidebar-accent-foreground"
                                : "border-transparent text-sidebar-foreground hover:bg-sidebar-accent/60",
                            )}
                          >
                            <Icon className={cn("size-4 shrink-0", on ? "text-accent" : "text-muted-foreground")} />
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-medium leading-tight">{it.label}</span>
                              <span className="block truncate text-[11px] text-muted-foreground">{it.caption}</span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="border-t border-sidebar-border p-3">
              <a
                href="https://bcappz.com"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
              >
                <span aria-hidden className="h-3 w-4 shrink-0 bca-hatch" />
                bcappz.com
              </a>
            </div>
          </aside>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-border mac-glass px-4">
              <div className="flex items-center gap-2 md:hidden">
                <span className="size-3 rounded-full bg-destructive/85" />
                <span className="size-3 rounded-full bg-accent" />
                <span className="size-3 rounded-full bg-chart-3/70" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold tracking-tight">{TITLES[view]}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  Eisenberg, Pocock, Warner, Wolfe &amp; Berman — built by Blue Collar Appz Co.
                </div>
              </div>
              <div className="ml-auto hidden items-center gap-1 md:flex">
                {NAV.flatMap((g) => g.items).map((it) => (
                  <button
                    key={it.id}
                    onClick={() => setView(it.id)}
                    aria-label={it.label}
                    className={cn(
                      "grid size-8 place-items-center rounded-lg transition-colors",
                      it.id === view ? "bg-secondary text-accent" : "text-muted-foreground hover:bg-secondary/70",
                    )}
                  >
                    <it.icon className="size-4" />
                  </button>
                ))}
              </div>
            </header>

            {/* mobile nav */}
            <div className="scroll-slim flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
              {NAV.flatMap((g) => g.items).map((it) => (
                <button
                  key={it.id}
                  onClick={() => setView(it.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                    it.id === view ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )}
                >
                  {it.label}
                </button>
              ))}
            </div>

            <main className="scroll-slim flex-1 overflow-auto bg-background">
              {view === "convergence" && <ConvergenceView />}
              {view === "blueprint" && <BlueprintView />}
              {view === "inventory" && <InventoryView />}
              {view === "repos" && <ReposView />}
              {view === "skills" && <SkillsView />}
              {view === "toolbox" && <ToolboxView />}
              {view === "vault" && <VaultView />}
              {view === "deck" && <DeckView />}
              {view === "founders" && <FoundersView />}
            </main>

            <footer className="border-t border-border bg-background px-4 py-3">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {DISCLAIMER}{" "}
                <a
                  href="https://github.com/Cmooreculinary/Wolf-Berman-Eisenberg-Pocock-Warner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Source on GitHub
                </a>
                .
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
