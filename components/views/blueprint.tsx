"use client"

import { useMemo, useState } from "react"
import { TrendingUp, AlertTriangle, ArrowUpRight, GitCompare } from "lucide-react"
import { Panel, PanelHeader, Slider, Stat, Chip, CopyButton, currency, compact } from "@/components/kit"
import {
  EXIT_MULTIPLE,
  FUNNEL_DEFAULTS,
  FUNNEL_FIELDS,
  MRR_TARGET,
  roundOutputs,
  simulateFunnel,
  type FunnelField,
  type FunnelInputs,
} from "@/lib/funnel"
import { API_BASE } from "@/lib/site"
import { cn } from "@/lib/utils"

/** How each published unit reads on a slider. */
const FORMAT: Record<FunnelField["unit"], (v: number) => string> = {
  count: compact,
  percent: (v) => `${v}%`,
  usd: currency,
}

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: "accent" | "slate" }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100))
  return (
    <div>
      <div className="flex items-baseline justify-between text-[12px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold tabular-nums">{compact(value)}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", tone === "accent" ? "bg-accent" : "bg-chart-2")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function BlueprintView() {
  const [audience, setAudience] = useState(FUNNEL_DEFAULTS.audience)
  const [toCommunity, setToCommunity] = useState(FUNNEL_DEFAULTS.communityConversionPct)
  const [toProduct, setToProduct] = useState(FUNNEL_DEFAULTS.productConversionPct)
  const [price, setPrice] = useState(FUNNEL_DEFAULTS.pricePerMonth)
  const [affiliate, setAffiliate] = useState(FUNNEL_DEFAULTS.affiliateSharePct)

  // The arithmetic lives in lib/funnel.ts because it is also published at
  // /api/v1/funnel.json and exposed as an MCP tool. Three copies of a formula
  // is three chances to disagree about the same number.
  const { inputs, outputs: m } = useMemo(
    () =>
      simulateFunnel({
        audience,
        communityConversionPct: toCommunity,
        productConversionPct: toProduct,
        pricePerMonth: price,
        affiliateSharePct: affiliate,
      }),
    [audience, toCommunity, toProduct, price, affiliate],
  )

  const pctOfTarget = m.pctOfTarget

  // Bounds and labels come from the same field spec the API publishes, so a
  // slider cannot offer a value the documented model would clamp away.
  const setters: Record<keyof FunnelInputs, (v: number) => void> = {
    audience: setAudience,
    communityConversionPct: setToCommunity,
    productConversionPct: setToProduct,
    pricePerMonth: setPrice,
    affiliateSharePct: setAffiliate,
  }

  const payload = JSON.stringify({ inputs, outputs: roundOutputs(m) }, null, 2)

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">2026 AI Venture Blueprint</Chip>
        <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">
          The ACP growth engine, priced to clear ${compact(MRR_TARGET)} a month.
        </h1>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader
            title="Funnel simulator"
            hint="Audience → Community → Product, with affiliate rev-share applied to gross."
            right={<CopyButton payload={payload} label="JSON" />}
          />
          <div className="mt-5 space-y-5">
            {FUNNEL_FIELDS.map((f) => (
              <Slider
                key={f.key}
                label={f.label}
                value={inputs[f.key]}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={setters[f.key]}
                format={FORMAT[f.unit]}
              />
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeader
              title="Projected economics"
              hint={`${pctOfTarget.toFixed(0)}% of the ${currency(MRR_TARGET)}/mo target.`}
              right={
                <a
                  href={`${API_BASE}/funnel.json`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowUpRight className="size-3.5" />
                  model JSON
                </a>
              }
            />
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${pctOfTarget}%` }} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Stat label="Gross MRR" value={currency(m.grossMRR)} emphasis sub={`${Math.round(m.customers).toLocaleString()} customers`} />
              <Stat label="Affiliate payout" value={currency(m.affiliatePayout)} sub={`${affiliate}% rev-share`} />
              <Stat label="Net MRR" value={currency(m.netMRR)} sub="after creator loops" />
              <Stat label="ARR" value={currency(m.arr)} />
              <Stat label={`Exit at ${EXIT_MULTIPLE}x ARR`} value={currency(m.exitAt5x)} sub="100% equity retained" />
              <Stat label="Headcount" value="0" sub="automated operations" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Bar label="Audience" value={audience} max={audience} tone="slate" />
              <Bar label="Community" value={m.community} max={audience} tone="slate" />
              <Bar label="Customers" value={m.customers} max={audience} tone="accent" />
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-accent" />
              <h3 className="text-[15px] font-semibold tracking-tight">Speed gap & quality debt spiral</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="AI code surge" value="+76%" sub="7,839 lines / mo" emphasis />
              <Stat label="Logic defects" value="1.7x" sub="vs human-authored" />
              <Stat label="Review capacity" value="flat" sub="human-paced" />
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground text-pretty">
              Generation accelerated; verification did not. The queue in front of a human reviewer is where velocity turns
              into deferred failure — so the gate has to run at machine speed too.
            </p>
          </Panel>
        </div>
      </div>

      <Panel className="mt-5">
        <div className="flex items-center gap-2">
          <GitCompare className="size-4 text-accent" />
          <h3 className="text-[15px] font-semibold tracking-tight">2015 VC treadmill vs 2026 multipreneur matrix</h3>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-secondary/40 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">2015 — Treadmill</div>
            <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
              {[
                "Priced round every 18 months, dilution compounding",
                "Venture debt covering payroll, not product",
                "Headcount as the proxy for progress",
                "Exit controlled by the preference stack",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-accent/40 bg-accent/8 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              2026 — Multipreneur
            </div>
            <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
              {[
                "100% equity retained, no preference stack",
                "Affiliate rev-share instead of ad spend",
                "Agent swarms instead of a hiring plan",
                "Multiple small products, one shared technical core",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <TrendingUp className="mt-1 size-3.5 shrink-0 text-accent" />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  )
}
