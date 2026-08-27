"use client"

import { useState } from "react"
import { ArrowUpRight, Heart } from "lucide-react"
import {
  CARRIES_AMOUNT,
  PROVIDER_LABEL,
  SUPPORT,
  donateUrl,
  donationsEnabled,
} from "@/lib/support"
import { cn } from "@/lib/utils"

/**
 * The give-what-you-want control. Any amount is accepted: the presets are
 * shortcuts and the box next to them takes anything.
 *
 * Renders nothing but the note when no link is configured — see lib/support.ts.
 */
export function DonateBox() {
  const enabled = donationsEnabled()
  const withAmount = CARRIES_AMOUNT[SUPPORT.provider]

  const [amount, setAmount] = useState<number | null>(SUPPORT.suggested)
  const [custom, setCustom] = useState("")

  const chosen = custom.trim() ? Number(custom) : amount
  const valid = Number.isFinite(chosen) && (chosen as number) > 0
  const href = donateUrl(valid ? chosen : null)

  if (!enabled) {
    return (
      <p className="text-[12.5px] leading-relaxed text-muted-foreground text-pretty">
        The donation link isn&apos;t live yet. It will be here the moment it is.
        {process.env.NODE_ENV === "development" ? (
          <span className="mt-1 block font-mono text-[11px] text-accent">
            dev note: set SUPPORT.url in lib/support.ts
          </span>
        ) : null}
      </p>
    )
  }

  return (
    <div>
      {withAmount ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {SUPPORT.presets.map((p) => {
              const on = !custom.trim() && amount === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setAmount(p)
                    setCustom("")
                  }}
                  aria-pressed={on}
                  className={cn(
                    "rounded-lg border px-3.5 py-2 font-mono text-[13px] font-medium tabular-nums transition-colors",
                    on
                      ? "border-accent/60 bg-accent/12 text-accent"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  ${p}
                </button>
              )
            })}

            <label className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40">
              <span aria-hidden className="font-mono text-[13px] text-muted-foreground">
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="other"
                aria-label="Enter any amount"
                className="w-[5.5rem] bg-transparent font-mono text-[13px] tabular-nums outline-none placeholder:font-sans placeholder:text-muted-foreground/70"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={href ?? undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!valid}
              onClick={(e) => {
                if (!valid) e.preventDefault()
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-opacity",
                valid
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "pointer-events-none bg-secondary text-muted-foreground",
              )}
            >
              <Heart className="size-4" />
              {valid ? `Give $${chosen}` : "Pick an amount"}
              <ArrowUpRight className="size-3.5 opacity-70" />
            </a>
            <span className="text-[12px] text-muted-foreground">
              Any amount. Opens {PROVIDER_LABEL[SUPPORT.provider]}.
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={href ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Heart className="size-4" />
            Give any amount
            <ArrowUpRight className="size-3.5 opacity-70" />
          </a>
          <span className="text-[12px] text-muted-foreground">
            You pick the amount on {PROVIDER_LABEL[SUPPORT.provider]}.
          </span>
        </div>
      )}
    </div>
  )
}
