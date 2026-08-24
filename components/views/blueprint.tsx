"use client"

import { useMemo, useState } from "react"
import { TrendingUp, AlertTriangle, GitCompare } from "lucide-react"
import { Panel, PanelHeader, Slider, Stat, Chip, CopyButton, currency, compact } from "@/components/kit"
import { cn } from "@/lib/utils"

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
  const [audience, setAudience] = useState(10_000)
  const [toCommunity, setToCommunity] = useState(6)
  const [toProduct, setToProduct] = useState(4)
  const [price, setPrice] = useState(79)
  const [affiliate, setAffiliate] = useState(45)

  const m = useMemo(() => {
    const community = audience * (toCommunity / 100)
    const customers = community * (toProduct / 100)
    const gross = customers * price
    const affiliatePayout = gross * (affiliate / 100)
    const net = gross - affiliatePayout
    const arr = gross * 12
    const exit = arr * 5
    return { community, customers, gross, affiliatePayout, net, arr, exit }
  }, [audience, toCommunity, toProduct, price, affiliate])

  const target = 50_000
  const pctOfTarget = Math.min(100, (m.gross / target) * 100)

  const payload = JSON.stringify(
    {
      inputs: { audience, communityConversionPct: toCommunity, productConversionPct: toProduct, pricePerMonth: price, affiliateSharePct: affiliate },
      outputs: {
        community: Math.round(m.community),
        customers: Math.round(m.customers),
        grossMRR: Math.round(m.gross),
        affiliatePayout: Math.round(m.affiliatePayout),
        netMRR: Math.round(m.net),
        arr: Math.round(m.arr),
        exitAt5x: Math.round(m.exit),
      },
    },
    null,
    2,
  )

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">2026 AI Venture Blueprint</Chip>
        <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">
          The ACP growth engine, priced to clear $50k a month.
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
            <Slider label="Audience (owned reach)" value={audience} min={1000} max={200_000} step={1000} onChange={setAudience} format={compact} />
            <Slider label="Audience → Community" value={toCommunity} min={1} max={25} onChange={setToCommunity} format={(v) => `${v}%`} />
            <Slider label="Community → Product" value={toProduct} min={1} max={30} onChange={setToProduct} format={(v) => `${v}%`} />
            <Slider label="Price per month" value={price} min={9} max={499} onChange={setPrice} format={currency} />
            <Slider label="Affiliate rev-share" value={affiliate} min={0} max={60} onChange={setAffiliate} format={(v) => `${v}%`} />
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Projected economics" hint={`${pctOfTarget.toFixed(0)}% of the $50k/mo target.`} />
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${pctOfTarget}%` }} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Stat label="Gross MRR" value={currency(m.gross)} emphasis sub={`${Math.round(m.customers).toLocaleString()} customers`} />
              <Stat label="Affiliate payout" value={currency(m.affiliatePayout)} sub={`${affiliate}% rev-share`} />
              <Stat label="Net MRR" value={currency(m.net)} sub="after creator loops" />
              <Stat label="ARR" value={currency(m.arr)} />
              <Stat label="Exit at 5x ARR" value={currency(m.exit)} sub="100% equity retained" />
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
          <div className="rounded-xl border border-border bg-secondary/40 p-5">
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
          <div className="rounded-xl border border-accent/40 bg-accent/8 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-foreground dark:text-accent">
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
