"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { INVENTORY, type InventoryItem } from "@/lib/data"
import { Panel, Chip, Segmented, CopyButton } from "@/components/kit"

type Filter = "all" | "agent" | "skill" | "protocol"

function asText(i: InventoryItem) {
  return [
    i.name,
    `${i.kind.toUpperCase()} · ${i.role} · pillar: ${i.pillar}`,
    i.detail,
    `tags: ${i.tags.join(", ")}`,
    ...(i.metrics ?? []).map((m) => `${m.label}: ${m.value}`),
  ].join("\n")
}

function Card({ item }: { item: InventoryItem }) {
  return (
    <Panel className="flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold leading-tight tracking-tight text-pretty">{item.name}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{item.role}</p>
        </div>
        <Chip tone={item.kind === "agent" ? "accent" : "neutral"}>{item.kind}</Chip>
      </div>

      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground text-pretty">{item.detail}</p>

      {item.metrics ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {item.metrics.map((m) => (
            <span key={m.label} className="font-mono text-[11px] text-muted-foreground">
              {m.label}: <span className="font-semibold text-foreground">{m.value}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((t) => (
            <Chip key={t} tone="outline">
              {t}
            </Chip>
          ))}
        </div>
        <div className="flex gap-1.5">
          <CopyButton payload={asText(item)} label="Text" />
          <CopyButton payload={JSON.stringify(item, null, 2)} label="JSON" />
        </div>
      </div>
    </Panel>
  )
}

export function InventoryView() {
  const [filter, setFilter] = useState<Filter>("all")
  const [q, setQ] = useState("")

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return INVENTORY.filter((i) => (filter === "all" ? true : i.kind === filter)).filter((i) =>
      needle
        ? [i.name, i.role, i.detail, i.pillar, ...i.tags].join(" ").toLowerCase().includes(needle)
        : true,
    )
  }, [filter, q])

  const counts = {
    all: INVENTORY.length,
    agent: INVENTORY.filter((i) => i.kind === "agent").length,
    skill: INVENTORY.filter((i) => i.kind === "skill").length,
    protocol: INVENTORY.filter((i) => i.kind === "protocol").length,
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Unified Technical Core</Chip>
        <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">
          Every agent, method, and protocol — one click from your clipboard.
        </h1>
      </header>

      <div className="sticky top-0 z-10 -mx-6 mt-6 mac-glass px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: `All ${counts.all}` },
              { value: "agent", label: `Agents ${counts.agent}` },
              { value: "skill", label: `Methods ${counts.skill}` },
              { value: "protocol", label: `Protocols ${counts.protocol}` },
            ]}
          />
          <div className="relative ml-auto w-full max-w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter inventory"
              aria-label="Filter inventory"
              className="w-full rounded-lg border border-input bg-card py-1.5 pl-8 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <CopyButton payload={JSON.stringify(items, null, 2)} label={`Copy ${items.length}`} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((i) => (
          <Card key={i.id} item={i} />
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-center text-[13px] text-muted-foreground">No assets match that filter.</p>
      ) : null}
    </div>
  )
}
