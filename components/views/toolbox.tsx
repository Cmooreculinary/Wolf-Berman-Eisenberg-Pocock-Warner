"use client"

import { useMemo, useState } from "react"
import { NICHES } from "@/lib/data"
import { Panel, PanelHeader, Segmented, Slider, TextField, Chip, CopyButton, Stat, currency, compact } from "@/components/kit"

type Tool = "valueprop" | "unbundle" | "distribution" | "prompt"

const PRESETS = [
  { label: "Culinary HACCP", target: "independent restaurant owners", task: "food-safety compliance logs", slow: "10 hours", fast: "10 minutes" },
  { label: "Contracting", target: "residential contractors", task: "change orders and job quotes", slow: "a full afternoon", fast: "90 seconds" },
  { label: "Podcasting", target: "solo podcasters", task: "editing an hour of raw tape", slow: "a full day", fast: "12 minutes" },
]

function ValueProp() {
  const [target, setTarget] = useState(PRESETS[0].target)
  const [task, setTask] = useState(PRESETS[0].task)
  const [slow, setSlow] = useState(PRESETS[0].slow)
  const [fast, setFast] = useState(PRESETS[0].fast)

  const sentence = `I help ${target || "[target]"} do ${task || "[painful task]"} in ${fast || "10 minutes"} instead of ${slow || "10 hours"}.`
  const words = sentence.trim().split(/\s+/).length

  return (
    <Panel>
      <PanelHeader
        title="Single-sentence value proposition"
        hint="One target, one painful task, one honest time delta. No adjectives."
        right={<CopyButton payload={sentence} />}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setTarget(p.target)
              setTask(p.task)
              setSlow(p.slow)
              setFast(p.fast)
            }}
            className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField label="Target" value={target} onChange={setTarget} placeholder="independent restaurant owners" />
        <TextField label="Painful task" value={task} onChange={setTask} placeholder="food-safety compliance logs" />
        <TextField label="New duration" value={fast} onChange={setFast} placeholder="10 minutes" />
        <TextField label="Old duration" value={slow} onChange={setSlow} placeholder="10 hours" />
      </div>
      <blockquote className="mt-5 rounded-xl border-l-2 border-accent bg-secondary/50 px-4 py-3.5">
        <p className="text-[15px] font-medium leading-relaxed text-pretty">{sentence}</p>
      </blockquote>
      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
        {words} words {words > 22 ? "— cut it down" : "— within constraint"}
      </p>
    </Panel>
  )
}

function Unbundle() {
  const [minSubs, setMinSubs] = useState(50_000)
  const [minGrowth, setMinGrowth] = useState(40)

  const rows = useMemo(
    () => NICHES.filter((n) => n.subs >= minSubs && n.growth >= minGrowth).sort((a, b) => b.mrr - a.mrr),
    [minSubs, minGrowth],
  )

  return (
    <Panel>
      <PanelHeader
        title="Reddit unbundling playbook"
        hint="High-velocity niches where one buried feature is worth its own product."
        right={<CopyButton payload={JSON.stringify(rows, null, 2)} label="JSON" />}
      />
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Slider label="Minimum subscribers" value={minSubs} min={10_000} max={500_000} step={10_000} onChange={setMinSubs} format={compact} />
        <Slider label="Minimum yearly growth" value={minGrowth} min={20} max={60} onChange={setMinGrowth} format={(v) => `${v}%`} />
      </div>
      <div className="mt-5 divide-y divide-border">
        {rows.map((n) => (
          <div key={n.subreddit} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3.5">
            <div className="min-w-40">
              <div className="font-mono text-[13px] font-semibold">{n.subreddit}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {compact(n.subs)} subs · +{n.growth}%
              </div>
            </div>
            <div className="min-w-52 flex-1">
              <div className="text-[13px] leading-relaxed text-pretty">{n.unbundle}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground text-pretty">Pain: {n.pain}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-mono text-[14px] font-semibold tabular-nums text-accent-foreground dark:text-accent">
                {currency(n.mrr)}
              </div>
              <div className="text-[11px] text-muted-foreground">ceiling / mo</div>
            </div>
          </div>
        ))}
      </div>
      {rows.length === 0 ? <p className="mt-6 text-[13px] text-muted-foreground">No niches clear those thresholds.</p> : null}
    </Panel>
  )
}

function Distribution() {
  const [users, setUsers] = useState(4_000)
  const [convert, setConvert] = useState(3)
  const [price, setPrice] = useState(49)
  const [cpc, setCpc] = useState(3.2)
  const [buildHours, setBuildHours] = useState(6)

  const paidUsers = users * (convert / 100)
  const mrr = paidUsers * price
  const equivalentAdSpend = users * cpc
  const roi = buildHours > 0 ? equivalentAdSpend / buildHours : 0

  return (
    <Panel>
      <PanelHeader
        title="Distribution software calculator"
        hint="A free Saturday-afternoon utility, valued against the ad spend it replaces."
        right={
          <CopyButton
            payload={JSON.stringify(
              { users, convertPct: convert, price, cpc, buildHours, paidUsers: Math.round(paidUsers), mrr: Math.round(mrr), equivalentAdSpend: Math.round(equivalentAdSpend) },
              null,
              2,
            )}
            label="JSON"
          />
        }
      />
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Slider label="Monthly free-tool users" value={users} min={100} max={50_000} step={100} onChange={setUsers} format={compact} />
        <Slider label="Free → paid conversion" value={convert} min={0.5} max={15} step={0.5} onChange={setConvert} format={(v) => `${v}%`} />
        <Slider label="Paid product price" value={price} min={9} max={299} onChange={setPrice} format={currency} />
        <Slider label="Equivalent ad CPC" value={cpc} min={0.5} max={12} step={0.1} onChange={setCpc} format={(v) => `$${v.toFixed(2)}`} />
        <Slider label="Build hours" value={buildHours} min={1} max={80} onChange={setBuildHours} format={(v) => `${v}h`} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Paid conversions" value={Math.round(paidUsers).toLocaleString()} sub="per month" />
        <Stat label="MRR from utility" value={currency(mrr)} emphasis />
        <Stat label="Ad spend replaced" value={currency(equivalentAdSpend)} sub="at current CPC" />
        <Stat label="Value per build hour" value={currency(roi)} sub="recurring monthly" />
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground text-pretty">
        The utility is the ad. It costs once to build and keeps buying attention every month, which is the opposite of a
        campaign budget that resets to zero.
      </p>
    </Panel>
  )
}

function PromptStudio() {
  const [topic, setTopic] = useState("agent swarm cost controls")
  const [models, setModels] = useState(3)
  const [depth, setDepth] = useState<"audit" | "build" | "decide">("audit")

  const prompt = `SYSTEM: No-fluff technical operator.

OBJECTIVE
${depth === "audit" ? "Audit" : depth === "build" ? "Produce an implementation plan for" : "Make a defensible decision on"}: ${topic || "[topic]"}

CONSENSUS PROTOCOL
- Answer independently, then reconcile against ${models} frontier models.
- Report only the intersection as settled. List disagreements separately with the reasoning that splits them.
- If confidence on a claim is below 80%, label it UNVERIFIED.

OUTPUT CONSTRAINTS
- No preamble, no restatement of the question, no closing summary.
- No praise, apologies, hedging, or emotional framing.
- Specific numbers, mechanisms, and failure modes. Cite the source or mark it as inference.
- Maximum 400 words unless a table is required.

FAILURE MODE
If the objective is underspecified, return the single question that unblocks it and stop.`

  return (
    <Panel>
      <PanelHeader
        title="No-fluff prompt studio"
        hint="Multi-model consensus, pleasantries stripped, unverified claims labelled."
        right={<CopyButton payload={prompt} label="Copy prompt" />}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <TextField label="Topic" value={topic} onChange={setTopic} placeholder="agent swarm cost controls" />
        <Segmented
          value={depth}
          onChange={setDepth}
          options={[
            { value: "audit", label: "Audit" },
            { value: "build", label: "Build" },
            { value: "decide", label: "Decide" },
          ]}
        />
      </div>
      <div className="mt-5">
        <Slider label="Consensus quorum" value={models} min={2} max={5} onChange={setModels} format={(v) => `${v} models`} />
      </div>
      <pre className="scroll-slim mt-5 max-h-80 overflow-auto rounded-xl border border-border bg-secondary/50 p-4 font-mono text-[12px] leading-relaxed">
        {prompt}
      </pre>
    </Panel>
  )
}

export function ToolboxView() {
  const [tool, setTool] = useState<Tool>("valueprop")

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="max-w-2xl">
        <Chip tone="accent">Founder Toolbox</Chip>
        <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance">
          Four instruments, each one enforcing a constraint.
        </h1>
      </header>

      <div className="mt-6">
        <Segmented
          value={tool}
          onChange={setTool}
          options={[
            { value: "valueprop", label: "Value prop" },
            { value: "unbundle", label: "Unbundling" },
            { value: "distribution", label: "Distribution software" },
            { value: "prompt", label: "Prompt studio" },
          ]}
        />
      </div>

      <div className="mt-5">
        {tool === "valueprop" && <ValueProp />}
        {tool === "unbundle" && <Unbundle />}
        {tool === "distribution" && <Distribution />}
        {tool === "prompt" && <PromptStudio />}
      </div>
    </div>
  )
}
