"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, FileDown, Loader2 } from "lucide-react"
import { SLIDES } from "@/lib/data"
import { exportDeck } from "@/lib/pptx"
import { Chip } from "@/components/kit"
import { cn } from "@/lib/utils"

export function DeckView() {
  const [i, setI] = useState(0)
  const [busy, setBusy] = useState(false)
  const slide = SLIDES[i]

  const next = useCallback(() => setI((v) => Math.min(SLIDES.length - 1, v + 1)), [])
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev])

  async function download() {
    setBusy(true)
    try {
      await exportDeck()
    } catch (err) {
      console.log("[v0] pptx export failed:", err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Chip tone="accent">Presentation</Chip>
          <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.02em]">
            Thirteen slides, one PowerPoint file.
          </h1>
        </div>
        <button
          onClick={download}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
          {busy ? "Generating…" : "Export .pptx"}
        </button>
      </div>

      {/* 16:9 stage */}
      <div className="mac-card mt-6 overflow-hidden p-0">
        <div className="relative aspect-video w-full bg-card">
          <div className="absolute inset-0 flex flex-col px-10 py-9 sm:px-14 sm:py-12">
            <span className="h-1 w-10 rounded-full bg-accent" />
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
              {slide.kicker}
            </div>
            <h2 className="mt-2 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-[38px]">
              {slide.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
              {slide.body}
            </p>
            {slide.bullets.length ? (
              <ul className="mt-5 space-y-2 sm:mt-6 sm:space-y-2.5">
                {slide.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[12px] leading-relaxed sm:text-[14px]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent sm:mt-2" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto flex items-end justify-between pt-4 font-mono text-[10px] text-muted-foreground">
              <span>Builders Sentinel · Eisenberg, Peacock &amp; Warner</span>
              <span>
                {slide.n} / {SLIDES.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border bg-secondary/40 px-4 py-3">
          <button
            onClick={prev}
            disabled={i === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[12px] font-medium disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" /> Prev
          </button>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.n}
                onClick={() => setI(idx)}
                aria-label={`Slide ${s.n}`}
                aria-current={idx === i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === i ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={i === SLIDES.length - 1}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[12px] font-medium disabled:opacity-40"
          >
            Next <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
        Use ← / → to navigate. Export writes the full deck in the Slate &amp; Amber palette.
      </p>
    </div>
  )
}
