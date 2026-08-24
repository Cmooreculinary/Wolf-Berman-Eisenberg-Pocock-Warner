export type InventoryKind = "agent" | "skill" | "protocol"

export type InventoryItem = {
  id: string
  name: string
  kind: InventoryKind
  pillar: "autonomy" | "governance" | "distribution"
  role: string
  detail: string
  tags: string[]
  metrics?: { label: string; value: string }[]
}

export const PILLARS = [
  {
    id: "autonomy" as const,
    title: "AI Agent Autonomy & Swarms",
    short: "Autonomy",
    line: "14+ specialized machine roles, SLM circuit breakers, distributed execution.",
    points: [
      "Deterministic loop hashing prevents runaway recursion",
      "Small-language-model circuit breakers cap spend per task",
      "Cogent swarm roles hand off work without a human in the loop",
    ],
  },
  {
    id: "governance" as const,
    title: "Zero-Trust Governance & Legal Compliance",
    short: "Governance",
    line: "Non-human identity, endpoint DLP, QA gating, work-product privilege.",
    points: [
      "Non-human identity (NHI) lifecycle for every agent credential",
      "Endpoint DLP and NER/PII scrubbing before any egress",
      "Katalon QA gates block merges on logic defects, not just lint",
    ],
  },
  {
    id: "distribution" as const,
    title: "Media Distribution & SaaS Unbundling",
    short: "Distribution",
    line: "ACP funnel, 50% affiliate loops, free micro-utilities, vertical microdramas.",
    points: [
      "Audience → Community → Product, owned channels only",
      "40–50% creator rev-share turns buyers into the sales team",
      "Free 'distribution software' replaces paid acquisition",
    ],
  },
]

export const SOURCE_NOTE =
  "Eisenberg, Peacock and Warner are the three best rooms I have found for a founder who is new to this game. Most outlets serve a leisurely meal — forty minutes of preamble wrapped around one usable idea. These three go straight at the work: agents, compliance, distribution. Down and dirty, pure information. This agent holds the same standard, which is why nothing here is padded."

export const INVENTORY: InventoryItem[] = [
  {
    id: "zuma-ai",
    name: "Zuma AI",
    kind: "agent",
    pillar: "autonomy",
    role: "Lead orchestrator",
    detail:
      "Owns the task graph. Decomposes an objective into signed sub-tasks, assigns swarm roles, and refuses any plan that cannot be verified by a downstream gate.",
    tags: ["orchestration", "planning", "task-graph"],
    metrics: [
      { label: "Max depth", value: "6" },
      { label: "Verify gate", value: "required" },
    ],
  },
  {
    id: "cimon-2",
    name: "CIMON-2",
    kind: "agent",
    pillar: "autonomy",
    role: "Retrieval & synthesis",
    detail:
      "Long-context research agent. Pulls primary sources, dedupes claims, and emits a citation-bound brief with confidence intervals per claim.",
    tags: ["retrieval", "synthesis", "citations"],
    metrics: [{ label: "Context", value: "long" }],
  },
  {
    id: "cimon-3",
    name: "CIMON-3",
    kind: "agent",
    pillar: "autonomy",
    role: "Multi-model consensus",
    detail:
      "Runs the same prompt across frontier models, diffs the outputs, and returns only the intersection plus flagged disagreements.",
    tags: ["consensus", "eval", "frontier"],
    metrics: [{ label: "Quorum", value: "3 of 4" }],
  },
  {
    id: "pyash",
    name: "Pyash",
    kind: "agent",
    pillar: "autonomy",
    role: "Code execution runner",
    detail:
      "Sandboxed execution worker. Every run is content-addressed so identical inputs never burn a second inference.",
    tags: ["sandbox", "execution", "cache"],
    metrics: [{ label: "Cache hit", value: "61%" }],
  },
  {
    id: "plum",
    name: "Plum",
    kind: "agent",
    pillar: "distribution",
    role: "Distribution scheduler",
    detail:
      "Cuts one long-form asset into channel-native derivatives and schedules them against owned-channel engagement windows.",
    tags: ["repurposing", "scheduling", "owned-channels"],
  },
  {
    id: "onish",
    name: "Onish",
    kind: "agent",
    pillar: "distribution",
    role: "AI SEO analyst",
    detail:
      "Optimizes for answer-engine surfaces: entity coverage, schema completeness, and citation-worthiness rather than keyword density.",
    tags: ["ai-seo", "entities", "schema"],
  },
  {
    id: "piantch",
    name: "Piantch",
    kind: "agent",
    pillar: "distribution",
    role: "Offer & pricing modeler",
    detail:
      "Simulates price ladders against funnel conversion to find the smallest offer that clears the monthly revenue target.",
    tags: ["pricing", "offers", "modeling"],
  },
  {
    id: "poand-github",
    name: "Poand GitHub Agent",
    kind: "agent",
    pillar: "autonomy",
    role: "Repository maintainer",
    detail:
      "Opens scoped pull requests, keeps dependencies current, and attaches a machine-readable risk note to every diff it authors.",
    tags: ["git", "pull-requests", "dependencies"],
  },
  {
    id: "cogent-planner",
    name: "Cogent Swarm — Planner",
    kind: "agent",
    pillar: "autonomy",
    role: "Swarm role",
    detail: "Converts an objective into a dependency-ordered work plan with explicit acceptance criteria per node.",
    tags: ["swarm", "planning"],
  },
  {
    id: "cogent-critic",
    name: "Cogent Swarm — Critic",
    kind: "agent",
    pillar: "governance",
    role: "Swarm role",
    detail: "Adversarial reviewer. Its only success condition is finding a defect the author missed.",
    tags: ["swarm", "review", "adversarial"],
  },
  {
    id: "cogent-scribe",
    name: "Cogent Swarm — Scribe",
    kind: "agent",
    pillar: "governance",
    role: "Swarm role",
    detail: "Maintains the audit trail: who decided what, on which evidence, under which policy version.",
    tags: ["swarm", "audit", "provenance"],
  },
  {
    id: "circuit-breaker",
    name: "SLM Circuit Breaker",
    kind: "agent",
    pillar: "governance",
    role: "Cost & loop guard",
    detail:
      "A cheap small model watching the expensive one. Trips on token burn, repeated tool calls, or semantic drift from the original objective.",
    tags: ["guardrail", "cost", "drift"],
    metrics: [
      { label: "Trip latency", value: "<400ms" },
      { label: "Spend cap", value: "per task" },
    ],
  },
  {
    id: "sentinel-gatekeeper",
    name: "Sentinel Gatekeeper",
    kind: "agent",
    pillar: "governance",
    role: "Egress gate",
    detail:
      "Last hop before anything leaves the perimeter. Classifies payloads, strips privileged material, and denies by default.",
    tags: ["zero-trust", "egress", "dlp"],
  },
  {
    id: "privilege-warden",
    name: "Privilege Warden",
    kind: "agent",
    pillar: "governance",
    role: "Work-product custodian",
    detail:
      "Tags attorney-client and work-product material at ingestion so no downstream agent can launder it into a public surface.",
    tags: ["privilege", "legal", "tagging"],
  },
  {
    id: "loop-hashing",
    name: "Deterministic Loop Hashing",
    kind: "skill",
    pillar: "autonomy",
    role: "Method",
    detail:
      "Hash the (state, action) pair on every iteration. A repeat hash means the agent is looping, and the run is terminated instead of billed.",
    tags: ["determinism", "loops"],
  },
  {
    id: "ner-pii",
    name: "NER / PII Scrubbing",
    kind: "skill",
    pillar: "governance",
    role: "Method",
    detail: "Named-entity recognition pass that redacts identifiers before text reaches a third-party model boundary.",
    tags: ["privacy", "ner", "redaction"],
  },
  {
    id: "endpoint-dlp",
    name: "Endpoint DLP",
    kind: "skill",
    pillar: "governance",
    role: "Method",
    detail: "Device-level policy enforcement so a compromised laptop cannot become an exfiltration path for agent output.",
    tags: ["dlp", "endpoint", "policy"],
  },
  {
    id: "ai-seo",
    name: "AI SEO",
    kind: "skill",
    pillar: "distribution",
    role: "Method",
    detail: "Structuring content so answer engines can quote it: clear entities, resolvable claims, machine-readable schema.",
    tags: ["seo", "answer-engines"],
  },
  {
    id: "worldbuilding",
    name: "Procedural Worldbuilding",
    kind: "skill",
    pillar: "distribution",
    role: "Method",
    detail: "Rule-driven universe generation that keeps continuity across dozens of short-form episodes without a writers' room.",
    tags: ["narrative", "procedural"],
  },
  {
    id: "hdr-color",
    name: "HDR Color Science",
    kind: "skill",
    pillar: "distribution",
    role: "Method",
    detail: "Scene-referred grading pipeline so machine-assembled footage looks deliberately shot rather than auto-exported.",
    tags: ["color", "hdr", "grading"],
  },
  {
    id: "virtual-production",
    name: "Virtual Production",
    kind: "skill",
    pillar: "distribution",
    role: "Method",
    detail: "Real-time backgrounds and camera tracking that collapse a location shoot into a single stage day.",
    tags: ["led-volume", "realtime"],
  },
  {
    id: "unbundling",
    name: "SaaS Unbundling",
    kind: "skill",
    pillar: "distribution",
    role: "Method",
    detail:
      "Take one painful feature buried inside a bloated suite, ship it as a standalone tool, and price it against the pain instead of the suite.",
    tags: ["strategy", "micro-saas"],
  },
  {
    id: "qa-gating",
    name: "Machine-Speed QA Gating",
    kind: "skill",
    pillar: "governance",
    role: "Method",
    detail: "Verification runs at the same speed as generation, so review stops being the human bottleneck.",
    tags: ["qa", "ci", "verification"],
  },
  {
    id: "nhi-lifecycle",
    name: "Non-Human Identity Lifecycle",
    kind: "skill",
    pillar: "governance",
    role: "Method",
    detail: "Issue, rotate, and revoke agent credentials on a schedule shorter than the useful life of a stolen token.",
    tags: ["nhi", "identity", "rotation"],
  },
  {
    id: "saviynt-mcp",
    name: "Saviynt MCP",
    kind: "protocol",
    pillar: "governance",
    role: "Model Context Protocol",
    detail:
      "Exposes identity governance as tools: entitlement lookup, access certification, and just-in-time elevation for agent principals.",
    tags: ["mcp", "identity", "governance"],
    metrics: [{ label: "Surface", value: "IGA tools" }],
  },
  {
    id: "katalon-mcp",
    name: "Katalon MCP",
    kind: "protocol",
    pillar: "governance",
    role: "Model Context Protocol",
    detail: "Test authoring and execution as a tool surface, so the agent that writes the code also has to prove it.",
    tags: ["mcp", "qa", "testing"],
    metrics: [{ label: "Surface", value: "test suites" }],
  },
  {
    id: "mangle",
    name: "Google Mangle",
    kind: "protocol",
    pillar: "governance",
    role: "Datalog reasoning layer",
    detail:
      "Deductive database language used as the policy brain: rules are declarative, decisions are explainable, and every denial has a derivation.",
    tags: ["datalog", "reasoning", "policy"],
    metrics: [{ label: "Semantics", value: "declarative" }],
  },
  {
    id: "kitecyber-sse",
    name: "Kitecyber SSE",
    kind: "protocol",
    pillar: "governance",
    role: "Security service edge",
    detail: "Device-resident edge that keeps zero-trust enforcement local instead of hairpinning traffic through a cloud gateway.",
    tags: ["sse", "zero-trust", "edge"],
  },
]

export type Niche = {
  subreddit: string
  subs: number
  growth: number
  pain: string
  unbundle: string
  mrr: number
}

export const NICHES: Niche[] = [
  {
    subreddit: "r/KitchenConfidential",
    subs: 912_000,
    growth: 44,
    pain: "HACCP logs kept on paper, failed on inspection day",
    unbundle: "Temperature-log app with inspector-ready PDF export",
    mrr: 34_000,
  },
  {
    subreddit: "r/Construction",
    subs: 640_000,
    growth: 41,
    pain: "Change orders lost in text threads",
    unbundle: "Change-order capture with photo + signature in 90 seconds",
    mrr: 52_000,
  },
  {
    subreddit: "r/podcasting",
    subs: 385_000,
    growth: 47,
    pain: "Editing an hour of tape takes a full day",
    unbundle: "Filler-word and dead-air stripper with one-click chapters",
    mrr: 31_000,
  },
  {
    subreddit: "r/smallbusiness",
    subs: 2_100_000,
    growth: 38,
    pain: "Quoting jobs from a spreadsheet nobody trusts",
    unbundle: "Quote builder that versions every estimate",
    mrr: 68_000,
  },
  {
    subreddit: "r/Bookkeeping",
    subs: 92_000,
    growth: 56,
    pain: "Receipt chasing at month-end close",
    unbundle: "Receipt inbox that matches to transactions automatically",
    mrr: 38_000,
  },
  {
    subreddit: "r/Landscaping",
    subs: 210_000,
    growth: 43,
    pain: "Route planning by memory, fuel burned",
    unbundle: "Crew route optimizer with per-stop time tracking",
    mrr: 29_000,
  },
  {
    subreddit: "r/msp",
    subs: 148_000,
    growth: 49,
    pain: "Client asset inventory drifts within a week",
    unbundle: "Agentless inventory sync with drift alerts",
    mrr: 74_000,
  },
  {
    subreddit: "r/Truckers",
    subs: 330_000,
    growth: 36,
    pain: "Detention pay never gets documented",
    unbundle: "Detention timer with carrier-ready claim packets",
    mrr: 41_000,
  },
]

export type AudioItem = {
  id: string
  title: string
  speaker: "Avinash Kaushik" | "Bryan Eisenberg"
  minutes: number
  takeaway: string
  topic: string
}

export const AUDIO: AudioItem[] = [
  { id: "a1", title: "Measuring What Actually Matters", speaker: "Avinash Kaushik", minutes: 42, topic: "Analytics", takeaway: "Pick one macro conversion; everything else is a micro signal." },
  { id: "a2", title: "The See-Think-Do-Care Framework", speaker: "Avinash Kaushik", minutes: 51, topic: "Framework", takeaway: "Match the ask to intent stage or the spend is wasted." },
  { id: "a3", title: "Digital Marketing Attribution Reality", speaker: "Avinash Kaushik", minutes: 38, topic: "Attribution", takeaway: "Last click flatters the channel that closed, not the one that convinced." },
  { id: "a4", title: "Persuasion Architecture Foundations", speaker: "Bryan Eisenberg", minutes: 47, topic: "Conversion", takeaway: "Map the questions a buyer asks in order, then answer them in that order." },
  { id: "a5", title: "Buyer Legends: Story Before Funnel", speaker: "Bryan Eisenberg", minutes: 55, topic: "Narrative", takeaway: "Write the customer's story backwards from the purchase." },
  { id: "a6", title: "Be Like Amazon: Customer Obsession", speaker: "Bryan Eisenberg", minutes: 61, topic: "Strategy", takeaway: "Long-term thinking is a competitive moat because it is unpopular." },
  { id: "a7", title: "Testing Culture Over Testing Tools", speaker: "Avinash Kaushik", minutes: 35, topic: "Experimentation", takeaway: "A losing test that kills a bad idea pays for itself." },
  { id: "a8", title: "The Four Uncomfortable Questions", speaker: "Bryan Eisenberg", minutes: 29, topic: "Conversion", takeaway: "If you cannot answer why-you, the page cannot either." },
  { id: "a9", title: "Segmentation or Death", speaker: "Avinash Kaushik", minutes: 44, topic: "Analytics", takeaway: "Averages hide every decision worth making." },
  { id: "a10", title: "Waiting for Your Cat to Bark", speaker: "Bryan Eisenberg", minutes: 58, topic: "Conversion", takeaway: "Stop optimizing for the customer you wish you had." },
  { id: "a11", title: "Economic Value of a Visit", speaker: "Avinash Kaushik", minutes: 33, topic: "Analytics", takeaway: "Assign a dollar figure to non-purchase behavior or it gets ignored." },
  { id: "a12", title: "Landing Page Autopsy", speaker: "Bryan Eisenberg", minutes: 40, topic: "Conversion", takeaway: "Every element either advances the sale or delays it." },
  { id: "a13", title: "Owned Channels Beat Rented Reach", speaker: "Avinash Kaushik", minutes: 46, topic: "Distribution", takeaway: "Platform reach is a lease with no renewal terms." },
  { id: "a14", title: "Trust Signals That Survive Scrutiny", speaker: "Bryan Eisenberg", minutes: 37, topic: "Conversion", takeaway: "Specific proof outperforms decorated proof." },
  { id: "a15", title: "The Multiplicity Mindset", speaker: "Avinash Kaushik", minutes: 49, topic: "Framework", takeaway: "Data, surveys, and testing answer different questions; use all three." },
  { id: "a16", title: "Pricing as Positioning", speaker: "Bryan Eisenberg", minutes: 43, topic: "Strategy", takeaway: "The price tells the buyer who the product is for." },
  { id: "a17", title: "Dashboards Nobody Reads", speaker: "Avinash Kaushik", minutes: 31, topic: "Analytics", takeaway: "If a metric cannot change a decision, delete it." },
  { id: "a18", title: "Micro-Conversion Ladders", speaker: "Bryan Eisenberg", minutes: 39, topic: "Conversion", takeaway: "Small yeses compound into the big one." },
  { id: "a19", title: "Attribution for Creator Funnels", speaker: "Avinash Kaushik", minutes: 52, topic: "Attribution", takeaway: "Affiliate loops need cohort views, not channel views." },
  { id: "a20", title: "Scaling Without Headcount", speaker: "Bryan Eisenberg", minutes: 45, topic: "Strategy", takeaway: "Automate the handoffs before automating the work." },
]

export type DocItem = {
  id: string
  title: string
  source: string
  pages: number
  summary: string
}

export const DOCS: DocItem[] = [
  {
    id: "d1",
    title: "Saviynt 2026 Identity Trends",
    source: "Saviynt",
    pages: 18,
    summary:
      "Non-human identities now outnumber human accounts. Governance moves from quarterly certification to continuous, machine-speed entitlement review.",
  },
  {
    id: "d2",
    title: "Kitecyber SSE Architecture Brief",
    source: "Kitecyber",
    pages: 12,
    summary:
      "Device-resident security service edge. Enforcement stays local, so zero-trust policy survives a dropped tunnel and adds no hairpin latency.",
  },
  {
    id: "d3",
    title: "Katalon QA & the Quality Debt Spiral",
    source: "Katalon",
    pages: 22,
    summary:
      "AI-authored code grew 76% while logic defects rose 1.7x. Verification must be automated at the same rate that generation is.",
  },
  {
    id: "d4",
    title: "ACP Funnel Operating Manual",
    source: "Eisenberg, Peacock & Warner",
    pages: 26,
    summary:
      "Audience, Community, Product with owned-channel math, 40–50% affiliate rev-share mechanics, and a 5x ARR exit model.",
  },
  {
    id: "d5",
    title: "Agent Swarm Reference Architecture",
    source: "Eisenberg, Peacock & Warner",
    pages: 31,
    summary:
      "Role definitions for all 14 agents, circuit-breaker thresholds, deterministic loop hashing, and the egress gate contract.",
  },
  {
    id: "d6",
    title: "Work-Product Privilege in Agent Pipelines",
    source: "Eisenberg, Peacock & Warner",
    pages: 15,
    summary:
      "How to tag privileged material at ingestion so autonomous agents cannot waive protection by publishing derived output.",
  },
]

export const SLIDES = [
  {
    n: 1,
    kicker: "Rolling 4-Week Intelligence",
    title: "Eisenberg, Peacock & Warner",
    body: "A 2026 operating system for autonomous agents, zero-trust governance, and owned distribution.",
    bullets: [],
  },
  {
    n: 2,
    kicker: "The Sources",
    title: "Three feeds worth the whole week",
    body: SOURCE_NOTE,
    bullets: [],
  },
  {
    n: 3,
    kicker: "Pillar 01",
    title: "AI Agent Autonomy & Swarms",
    body: "14+ specialized machine roles executing distributed work under hard guardrails.",
    bullets: PILLARS[0].points,
  },
  {
    n: 4,
    kicker: "Pillar 02",
    title: "Zero-Trust Governance",
    body: "Identity, DLP, QA gating, and privilege preservation for non-human actors.",
    bullets: PILLARS[1].points,
  },
  {
    n: 5,
    kicker: "Pillar 03",
    title: "Media Distribution & SaaS Unbundling",
    body: "Own the channel, unbundle the suite, pay the creators who sell for you.",
    bullets: PILLARS[2].points,
  },
  {
    n: 6,
    kicker: "Engine",
    title: "The ACP Funnel",
    body: "Audience → Community → Product. 10k baseline audience, owned community, priced product.",
    bullets: [
      "Audience: 10,000 baseline reach on owned surfaces",
      "Community: Skool or Discord, not a rented feed",
      "Product: priced to clear $50k/mo without headcount",
    ],
  },
  {
    n: 7,
    kicker: "Economics",
    title: "Affiliate Loops at 40–50%",
    body: "Half the revenue buys distribution that compounds instead of ad spend that resets monthly.",
    bullets: [
      "Rev-share replaces CAC as the primary growth line",
      "Creators carry the pitch into their own audience",
      "5x ARR exit multiple on a zero-FTE operation",
    ],
  },
  {
    n: 8,
    kicker: "Risk",
    title: "The Speed Gap",
    body: "AI code output surged +76% to 7,839 lines per month per engineer while review stayed human-paced.",
    bullets: [
      "1.7x logic defect multiplier on AI-authored changes",
      "Review queue becomes the only bottleneck",
      "Unverified velocity is just deferred failure",
    ],
  },
  {
    n: 9,
    kicker: "Fix",
    title: "Machine-Speed Verification Gates",
    body: "Generation and verification must run at the same clock rate.",
    bullets: [
      "Katalon QA gates on every agent-authored diff",
      "Adversarial critic role inside the swarm",
      "Deny-by-default egress at the perimeter",
    ],
  },
  {
    n: 10,
    kicker: "Contrast",
    title: "2015 VC Treadmill vs 2026 Multipreneur",
    body: "Dilutive rounds and venture debt against 100% equity retained and automated operations.",
    bullets: [
      "2015: raise, hire, burn, raise again",
      "2026: ship, automate, retain equity, compound",
      "Zero-FTE does not mean zero-rigor",
    ],
  },
  {
    n: 11,
    kicker: "Inventory",
    title: "The Technical Core",
    body: "14 autonomous agents, 10 core methods, 4 protocol surfaces — all copyable, all documented.",
    bullets: [
      "Agents: orchestration, retrieval, consensus, execution",
      "Methods: loop hashing, PII scrubbing, DLP, AI SEO",
      "Protocols: Saviynt MCP, Katalon MCP, Mangle, Kitecyber SSE",
    ],
  },
  {
    n: 12,
    kicker: "Toolbox",
    title: "Founder Instruments",
    body: "Value-prop generator, unbundling playbook, distribution-software calculator, no-fluff prompt studio.",
    bullets: [
      "One sentence: 10 minutes instead of 10 hours",
      "Free utility as the acquisition channel",
      "Multi-model consensus, pleasantries stripped",
    ],
  },
  {
    n: 13,
    kicker: "Close",
    title: "No padding, no preamble",
    body: "Build the agents. Gate the output. Own the channel. Keep the equity.",
    bullets: [],
  },
]
