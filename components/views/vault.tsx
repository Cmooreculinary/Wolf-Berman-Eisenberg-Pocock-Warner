"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Play, Pause, FileText, Download } from "lucide-react"
import { AUDIO, DOCS } from "@/lib/data"
import { Panel, PanelHeader, Chip, Segmented, CopyButton } from "@/components/kit"
import { cn } from "@/lib/utils"

const BARS = 44

function mmss(total: number) {
  const m = Math.floor(total / 60)
  const s = Math.floor(total % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VaultView() {
  const [speaker, setSpeaker] = useState<"all" | "Avinash Kaushik" | "Bryan Eisenberg">("all")
  const [activeId, setActiveId] = useState(AUDIO[0].id)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const raf = useRef<number | null>(null)

  const list = useMemo(() => (speaker === "all" ? AUDIO : AUDIO.filter((a) => a.speaker === speaker)), [speaker])
  const active = AUDIO.find((a) => a.id === activeId)!
  const duration = active.minutes * 60

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setElapsed((e) => (e + 1 >= duration ? 0 : e + 1))
    }, 250)
    return () => window.clearInterval(id)
  }, [playing, duration])

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current) }, [])

  const progress = elapsed / duration

  function select(id: string) {
    setActiveId(id)
    setElapsed(0)
    setPlaying(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Masterclass & Document Vault</Chip>
        <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">
          Twenty sessions on measurement and persuasion, plus the briefings behind them.
        </h1>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <Panel className="p-0">
          {/* now playing */}
          <div className="border-b border-border p-5">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95"
              >
                {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {active.speaker} · {active.topic}
                </div>
                <h2 className="mt-0.5 truncate text-[16px] font-semibold tracking-tight">{active.title}</h2>
                <div className="mt-3 flex h-8 items-end gap-[3px]" aria-hidden="true">
                  {Array.from({ length: BARS }).map((_, i) => {
                    const played = i / BARS <= progress
                    const h = 20 + Math.abs(Math.sin(i * 1.7 + active.minutes)) * 80
                    return (
                      <span
                        key={i}
                        className={cn(
                          "flex-1 rounded-full transition-colors",
                          played ? "bg-accent" : "bg-border",
                          playing && played && "opacity-90",
                        )}
                        style={{ height: `${h}%` }}
                      />
                    )
                  })}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[11px] tabular-nums text-muted-foreground">
                  <span>{mmss(elapsed)}</span>
                  <span>{mmss(duration)}</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                  <span className="font-medium text-foreground">Takeaway. </span>
                  {active.takeaway}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <Segmented
              value={speaker}
              onChange={setSpeaker}
              options={[
                { value: "all", label: "All" },
                { value: "Avinash Kaushik", label: "Kaushik" },
                { value: "Bryan Eisenberg", label: "Eisenberg" },
              ]}
            />
            <span className="font-mono text-[11px] text-muted-foreground">{list.length} sessions</span>
          </div>

          <ul className="scroll-slim max-h-[420px] divide-y divide-border overflow-auto border-t border-border">
            {list.map((a, idx) => {
              const on = a.id === activeId
              return (
                <li key={a.id}>
                  <button
                    onClick={() => select(a.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary/60",
                      on && "bg-secondary",
                    )}
                  >
                    <span className="w-6 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{a.title}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {a.speaker} · {a.topic}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{a.minutes}m</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="Document vault" hint="Executive summaries and briefings, copy-ready." />
          <ul className="mt-4 space-y-3">
            {DOCS.map((d) => (
              <li key={d.id} className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="flex items-start gap-2.5">
                  <FileText className="mt-0.5 size-4 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold leading-snug tracking-tight text-pretty">{d.title}</h4>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {d.source} · {d.pages}pp
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground text-pretty">{d.summary}</p>
                <div className="mt-3 flex gap-1.5">
                  <CopyButton payload={`${d.title} — ${d.source} (${d.pages}pp)\n\n${d.summary}`} label="Summary" />
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${d.title}\n${d.source} · ${d.pages} pages\n\n${d.summary}\n`)}`}
                    download={`${d.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Download className="size-3.5" />
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
