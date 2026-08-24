"use client"

import { useEffect, useState } from "react"
import {
  Aperture,
  Bot,
  FileDown,
  GitBranch,
  LayoutDashboard,
  Library,
  Moon,
  Presentation,
  Sun,
  Wrench,
  X,
} from "lucide-react"
import { ConvergenceView } from "@/components/views/convergence"
import { BlueprintView } from "@/components/views/blueprint"
import { InventoryView } from "@/components/views/inventory"
import { ToolboxView } from "@/components/views/toolbox"
import { VaultView } from "@/components/views/vault"
import { DeckView } from "@/components/views/deck"
import { ReposView } from "@/components/views/repos"
import { cn } from "@/lib/utils"

type ViewId = "convergence" | "blueprint" | "inventory" | "repos" | "toolbox" | "vault" | "deck"

const NAV: {
  group: string
  items: { id: ViewId; label: string; icon: typeof Bot; caption: string }[]
}[] = [
  {
    group: "Thesis",
    items: [
      { id: "convergence", label: "Convergence", icon: Aperture, caption: "Three pillars, one plate" },
      { id: "blueprint", label: "Blueprint", icon: LayoutDashboard, caption: "ACP engine & risk model" },
    ],
  },
  {
    group: "Core",
    items: [
      { id: "inventory", label: "Inventory", icon: Bot, caption: "Agents, methods, protocols" },
      { id: "repos", label: "Repos reviewed", icon: GitBranch, caption: "Rolling 4 weeks" },
      { id: "toolbox", label: "Toolbox", icon: Wrench, caption: "Founder instruments" },
      { id: "vault", label: "Vault", icon: Library, caption: "Audio & documents" },
    ],
  },
  {
    group: "Output",
    items: [{ id: "deck", label: "Slide deck", icon: Presentation, caption: "13 slides + .pptx" }],
  },
]

const TITLES: Record<ViewId, string> = {
  convergence: "Convergence",
  blueprint: "2026 Blueprint",
  inventory: "Technical Core",
  repos: "Repos Reviewed",
  toolbox: "Founder Toolbox",
  vault: "Masterclass Vault",
  deck: "Slide Deck",
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

function FoundersNote({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/25 p-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Founder's note"
        className="mac-card w-full max-w-lg p-0"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-3 place-items-center rounded-full bg-destructive/90 text-transparent hover:text-foreground/70"
          >
            <X className="size-2" />
          </button>
          <span className="mx-auto text-[12px] font-medium text-muted-foreground">Founder&apos;s Note</span>
        </div>
        <div className="p-6">
          <h2 className="text-[20px] font-semibold leading-snug tracking-tight text-balance">
            Verification is the product.
          </h2>
          <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-muted-foreground">
            <p className="text-pretty">
              Anyone can point a model at a repository and watch the line count climb. The hard part in 2026 is proving
              that what came out is correct, compliant, and shippable — at the same speed it was written.
            </p>
            <p className="text-pretty">
              So the stack is deliberately boring where it matters: deny-by-default egress, identity for every machine
              principal, declarative policy with a derivation for each denial, and a critic whose only job is to find the
              defect the author missed.
            </p>
            <p className="text-pretty">
              Distribution follows the same rule. Own the channel, pay the creators who actually sell, and ship a free
              utility instead of buying attention that resets every month.
            </p>
          </div>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Eisenberg, Peacock &amp; Warner
          </p>
        </div>
      </div>
    </div>
  )
}

export function Workspace() {
  const [view, setView] = useState<ViewId>("convergence")
  // BCA ships dark by default; `light` is the opt-in counterpart.
  const [light, setLight] = useState(false)
  const [note, setNote] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("light", light)
  }, [light])

  return (
    <div className="min-h-dvh bg-background">
      {/* menu bar */}
      <div className="sticky top-0 z-30 flex h-7 items-center gap-4 border-b border-border/70 mac-glass px-4 text-[12px] text-muted-foreground">
        <span aria-hidden className="h-3 w-4 shrink-0 bca-hatch" />
        <a
          href="https://bcappz.com"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-foreground hover:text-accent"
        >
          Blue Collar Appz
        </a>
        <span className="hidden text-border-strong sm:inline">/</span>
        <span className="hidden sm:inline">Builders Sentinel</span>
        <button className="hidden hover:text-foreground sm:inline" onClick={() => setNote(true)}>
          Note
        </button>
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
            <nav className="scroll-slim flex-1 overflow-auto px-2.5 pb-3">
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
              <button
                onClick={() => setNote(true)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
              >
                <FileDown className="size-3.5" />
                Founder&apos;s note
              </button>
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
                  Eisenberg, Peacock &amp; Warner — 2026
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
              {view === "toolbox" && <ToolboxView />}
              {view === "vault" && <VaultView />}
              {view === "deck" && <DeckView />}
            </main>
          </div>
        </div>
      </div>

      {note ? <FoundersNote onClose={() => setNote(false)} /> : null}
    </div>
  )
}
