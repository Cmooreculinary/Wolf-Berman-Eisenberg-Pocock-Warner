/**
 * The ACP funnel model — Audience → Community → Product.
 *
 * The simulator on the Blueprint view is the visible face of this function, but
 * it is not the definition of it: the same model is published at
 * `/api/v1/funnel.json` and exposed as an MCP tool, so an agent can run the
 * numbers without a browser and get the answer the page would have shown.
 * Keeping the arithmetic here is what makes those three agree.
 */

export type FunnelInputs = {
  /** Owned reach — followers, subscribers, list members. */
  audience: number
  /** Percent of the audience that joins the community. */
  communityConversionPct: number
  /** Percent of the community that buys the product. */
  productConversionPct: number
  /** Subscription price per month, in dollars. */
  pricePerMonth: number
  /** Percent of gross paid out to affiliates and creators. */
  affiliateSharePct: number
}

export type FunnelOutputs = {
  community: number
  customers: number
  grossMRR: number
  affiliatePayout: number
  netMRR: number
  arr: number
  exitAt5x: number
  /** Gross MRR as a percent of `MRR_TARGET`, capped at 100. */
  pctOfTarget: number
}

export type FunnelField = {
  key: keyof FunnelInputs
  label: string
  min: number
  max: number
  step: number
  default: number
  unit: "count" | "percent" | "usd"
}

/** The month the blueprint is priced to clear. */
export const MRR_TARGET = 50_000

/** Multiple applied to ARR for the modelled exit. */
export const EXIT_MULTIPLE = 5

export const FUNNEL_FIELDS: FunnelField[] = [
  { key: "audience", label: "Audience (owned reach)", min: 1_000, max: 200_000, step: 1_000, default: 10_000, unit: "count" },
  { key: "communityConversionPct", label: "Audience → Community", min: 1, max: 25, step: 1, default: 6, unit: "percent" },
  { key: "productConversionPct", label: "Community → Product", min: 1, max: 30, step: 1, default: 4, unit: "percent" },
  { key: "pricePerMonth", label: "Price per month", min: 9, max: 499, step: 1, default: 79, unit: "usd" },
  { key: "affiliateSharePct", label: "Affiliate rev-share", min: 0, max: 60, step: 1, default: 45, unit: "percent" },
]

export const FUNNEL_DEFAULTS: FunnelInputs = Object.fromEntries(
  FUNNEL_FIELDS.map((f) => [f.key, f.default]),
) as unknown as FunnelInputs

/** Written out so a caller can reimplement the model and check it matches. */
export const FUNNEL_FORMULAS = {
  community: "audience * communityConversionPct / 100",
  customers: "community * productConversionPct / 100",
  grossMRR: "customers * pricePerMonth",
  affiliatePayout: "grossMRR * affiliateSharePct / 100",
  netMRR: "grossMRR - affiliatePayout",
  arr: "grossMRR * 12",
  exitAt5x: `arr * ${EXIT_MULTIPLE}`,
  pctOfTarget: `min(100, grossMRR / ${MRR_TARGET} * 100)`,
} as const

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/**
 * Coerce partial, untrusted input into a valid set of inputs. Anything missing
 * falls back to the default; anything out of range is clamped rather than
 * rejected, so a caller that asks for a million-strong audience gets the
 * top of the modelled range instead of an error.
 */
export function normalizeFunnelInputs(input: Partial<FunnelInputs> = {}): FunnelInputs {
  const out = {} as FunnelInputs
  for (const f of FUNNEL_FIELDS) {
    const raw = Number(input[f.key])
    out[f.key] = Number.isFinite(raw) ? clamp(raw, f.min, f.max) : f.default
  }
  return out
}

export function simulateFunnel(input: Partial<FunnelInputs> = {}): {
  inputs: FunnelInputs
  outputs: FunnelOutputs
} {
  const inputs = normalizeFunnelInputs(input)
  const community = inputs.audience * (inputs.communityConversionPct / 100)
  const customers = community * (inputs.productConversionPct / 100)
  const grossMRR = customers * inputs.pricePerMonth
  const affiliatePayout = grossMRR * (inputs.affiliateSharePct / 100)
  const arr = grossMRR * 12
  return {
    inputs,
    outputs: {
      community,
      customers,
      grossMRR,
      affiliatePayout,
      netMRR: grossMRR - affiliatePayout,
      arr,
      exitAt5x: arr * EXIT_MULTIPLE,
      pctOfTarget: Math.min(100, (grossMRR / MRR_TARGET) * 100),
    },
  }
}

/** Whole-dollar / whole-person figures, which is how the API publishes them. */
export function roundOutputs(o: FunnelOutputs): FunnelOutputs {
  return {
    community: Math.round(o.community),
    customers: Math.round(o.customers),
    grossMRR: Math.round(o.grossMRR),
    affiliatePayout: Math.round(o.affiliatePayout),
    netMRR: Math.round(o.netMRR),
    arr: Math.round(o.arr),
    exitAt5x: Math.round(o.exitAt5x),
    pctOfTarget: Math.round(o.pctOfTarget * 10) / 10,
  }
}
