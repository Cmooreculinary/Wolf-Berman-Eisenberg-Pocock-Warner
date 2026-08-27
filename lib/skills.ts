import { EPISODES, mondayOf, shiftDays, type RepoPillar } from "./repos"

export type SkillTier = "foundational" | "working" | "advanced"

export type SkillHost = "Eisenberg" | "Pocock" | "Warner" | "Wolfe" | "Berman"

/**
 * One time a skill was actually taught on air. The air date is deliberately not
 * written down here — it lives once, in the review log, and is resolved by
 * episode number in `buildCurriculum`. Two copies of a date is two chances to
 * be wrong about it.
 */
export type SkillLesson = {
  host: SkillHost
  ep: number
  /** Repos used on air to demonstrate the skill. */
  demos: string[]
}

/** A lesson with its air date (and canonical host) resolved from the log. */
export type DatedLesson = SkillLesson & { date: string }

export type Skill = {
  id: string
  name: string
  pillar: RepoPillar
  tier: SkillTier
  /** What you can actually do once you have it. */
  outcome: string
  /** The trap that catches founders who skip it. */
  pitfall: string
  lessons: SkillLesson[]
}

export const TIER_LABEL: Record<SkillTier, string> = {
  foundational: "Foundational",
  working: "Working",
  advanced: "Advanced",
}

export const TIER_ORDER: SkillTier[] = ["foundational", "working", "advanced"]

/**
 * The teaching curriculum, transcribed from the three feeds. A skill is listed
 * once; every airing that covered it is a lesson. `buildCurriculum` decides
 * which lessons fall inside the live four-week window.
 */
export const SKILLS: Skill[] = [
  /* ─────────────── Agent autonomy & swarms ─────────────── */
  {
    id: "graph-state",
    name: "Modelling agents as state graphs",
    pillar: "agents",
    tier: "foundational",
    outcome:
      "Draw an agent as nodes and edges instead of a prompt chain, so you can point at exactly where a run failed and resume from that node.",
    pitfall: "Building a linear chain, then discovering you cannot retry step 4 without replaying steps 1 through 3.",
    lessons: [
      { host: "Warner", ep: 208, demos: ["LangGraph"] },
      { host: "Warner", ep: 214, demos: ["LangGraph", "Temporal"] },
    ],
  },
  {
    id: "durable-exec",
    name: "Durable execution and replay",
    pillar: "agents",
    tier: "advanced",
    outcome:
      "Survive a crash mid-run. Checkpoint state, replay deterministically, and make every side effect idempotent so a retry cannot double-charge or double-post.",
    pitfall: "Treating a 40-minute agent run as a single HTTP request. It will time out, and you will lose the work.",
    lessons: [{ host: "Warner", ep: 214, demos: ["Temporal", "LangGraph"] }],
  },
  {
    id: "handoff",
    name: "Multi-agent handoff and role design",
    pillar: "agents",
    tier: "working",
    outcome:
      "Split work across specialised agents with explicit handoff contracts, and know when one good agent beats a committee of five.",
    pitfall: "Adding agents to fix a quality problem. Coordination overhead grows faster than capability does.",
    lessons: [
      { host: "Pocock", ep: 213, demos: ["CrewAI", "AutoGen"] },
      { host: "Warner", ep: 212, demos: ["OpenAI Agents SDK", "Swarm (archived)"] },
    ],
  },
  {
    id: "tool-schema",
    name: "Typed tool definitions",
    pillar: "agents",
    tier: "foundational",
    outcome:
      "Give a model tools with validated schemas so a malformed call is rejected at the boundary instead of throwing deep inside your handler.",
    pitfall: "Hand-parsing JSON out of a completion. It works in the demo and fails in production on the first stray token.",
    lessons: [
      { host: "Warner", ep: 211, demos: ["AI SDK", "Pydantic AI"] },
      { host: "Pocock", ep: 210, demos: ["Semantic Kernel"] },
    ],
  },
  {
    id: "agent-memory",
    name: "Memory that is not just a bigger prompt",
    pillar: "agents",
    tier: "working",
    outcome:
      "Separate working context from long-term recall, and decide what gets written back after a run rather than stuffing history into every call.",
    pitfall: "Paying for the full transcript on every turn, and still watching the agent forget what matters.",
    lessons: [{ host: "Warner", ep: 206, demos: ["Letta (MemGPT)", "Mem0"] }],
  },
  {
    id: "sandboxed-code",
    name: "Running model-written code safely",
    pillar: "agents",
    tier: "advanced",
    outcome:
      "Execute generated code in a disposable sandbox with no ambient credentials, a wall-clock limit, and deny-by-default egress.",
    pitfall: "Letting an agent shell out on your machine. One bad command is all it takes.",
    lessons: [{ host: "Pocock", ep: 207, demos: ["E2B"] }],
  },
  {
    id: "browser-agents",
    name: "Driving a real browser",
    pillar: "agents",
    tier: "working",
    outcome:
      "Automate a site that has no API, and understand why a screenshot-and-click loop is slower and flakier than reading the accessibility tree.",
    pitfall: "Selecting by CSS class. The next deploy renames it and your agent goes blind.",
    lessons: [{ host: "Pocock", ep: 207, demos: ["Browser Use"] }],
  },
  {
    id: "coding-agents",
    name: "Putting an agent on your own repo",
    pillar: "agents",
    tier: "working",
    outcome:
      "Scope a coding agent to a real issue, give it the test command as its ground truth, and review the diff instead of the chat log.",
    pitfall: "Judging the agent by whether it sounds confident rather than whether the suite goes green.",
    lessons: [{ host: "Warner", ep: 209, demos: ["Aider", "SWE-agent", "OpenHands"] }],
  },
  {
    id: "retrieval",
    name: "Retrieval that actually retrieves",
    pillar: "agents",
    tier: "foundational",
    outcome:
      "Chunk on document structure, pick a distance metric on purpose, and measure recall before you blame the model for hallucinating.",
    pitfall: "Fixed 512-token chunks that cut tables in half, then concluding the model is bad at reasoning.",
    lessons: [
      { host: "Pocock", ep: 210, demos: ["LlamaIndex"] },
      { host: "Pocock", ep: 186, demos: ["Qdrant", "Unstructured"] },
    ],
  },
  {
    id: "gateway-routing",
    name: "Provider routing and cost control",
    pillar: "agents",
    tier: "working",
    outcome:
      "Put one gateway in front of every model, then move traffic to a cheaper model per route without touching application code.",
    pitfall: "Hardcoding one provider SDK everywhere, so a price change becomes a refactor.",
    lessons: [{ host: "Pocock", ep: 205, demos: ["LiteLLM"] }],
  },
  {
    id: "visual-orchestration",
    name: "Visual orchestration, and its ceiling",
    pillar: "agents",
    tier: "foundational",
    outcome:
      "Ship an internal automation in an afternoon on a node canvas, and recognise the point where it must become real code.",
    pitfall: "Running the business on a flow nobody can code-review, test, or roll back.",
    lessons: [
      { host: "Warner", ep: 189, demos: ["Flowise"] },
      { host: "Pocock", ep: 205, demos: ["n8n"] },
    ],
  },

  /* ─────────────── Zero-trust governance & legal ─────────────── */
  {
    id: "policy-as-code",
    name: "Policy as code",
    pillar: "governance",
    tier: "working",
    outcome:
      "Write authorisation as declarative rules evaluated outside your handlers, so a denial comes with a derivation you can show an auditor.",
    pitfall: "Permission logic scattered across if-statements in forty routes. Nobody can answer why access was denied.",
    lessons: [
      { host: "Eisenberg", ep: 204, demos: ["Mangle"] },
      { host: "Eisenberg", ep: 199, demos: ["Open Policy Agent"] },
    ],
  },
  {
    id: "machine-identity",
    name: "Identity for machine principals",
    pillar: "governance",
    tier: "advanced",
    outcome:
      "Issue every workload a short-lived, attested identity so an agent authenticates as itself instead of sharing a long-lived key.",
    pitfall: "One service account with god rights, its key pasted into four environments and rotated never.",
    lessons: [{ host: "Eisenberg", ep: 202, demos: ["SPIRE", "Keycloak"] }],
  },
  {
    id: "authn-flows",
    name: "Auth flows without the footguns",
    pillar: "governance",
    tier: "foundational",
    outcome:
      "Run login, session, and recovery on a hardened implementation, and know why cookie attributes decide whether your preview even works.",
    pitfall: "Rolling your own session layer. The bug you ship is the one you cannot see.",
    lessons: [{ host: "Eisenberg", ep: 202, demos: ["Ory Kratos"] }],
  },
  {
    id: "pii-redaction",
    name: "Finding and redacting PII before the model sees it",
    pillar: "governance",
    tier: "working",
    outcome:
      "Detect and mask personal data on the way into a prompt and on the way into logs, with a recogniser set you can extend.",
    pitfall: "Shipping customer records to a third-party model, then discovering it in your own log retention.",
    lessons: [
      { host: "Eisenberg", ep: 200, demos: ["Presidio"] },
      { host: "Eisenberg", ep: 203, demos: ["Presidio"] },
    ],
  },
  {
    id: "guardrails",
    name: "Runtime guardrails on model output",
    pillar: "governance",
    tier: "working",
    outcome:
      "Constrain what a model is allowed to say and do at runtime, with a defined action when a rail trips rather than a silent pass.",
    pitfall: "Putting the rules in the system prompt and calling it a control. A prompt is a request, not a boundary.",
    lessons: [{ host: "Eisenberg", ep: 197, demos: ["Guardrails AI", "NeMo Guardrails"] }],
  },
  {
    id: "red-teaming",
    name: "Red-teaming your own agent",
    pillar: "governance",
    tier: "advanced",
    outcome:
      "Run adversarial probes as a build step and track which attack classes your system fails, instead of waiting for a user to find them.",
    pitfall: "Testing only the happy path, then meeting prompt injection for the first time in production.",
    lessons: [{ host: "Pocock", ep: 196, demos: ["garak", "PyRIT"] }],
  },
  {
    id: "supply-chain",
    name: "Signing and provenance",
    pillar: "governance",
    tier: "advanced",
    outcome:
      "Attach verifiable provenance to a build and refuse to deploy an artifact whose signature does not check out.",
    pitfall: "Trusting a container because it came from your own registry. Provenance is a claim you verify, not assume.",
    lessons: [{ host: "Eisenberg", ep: 201, demos: ["SLSA", "in-toto", "Cosign"] }],
  },
  {
    id: "secret-hygiene",
    name: "Secret and dependency hygiene",
    pillar: "governance",
    tier: "foundational",
    outcome:
      "Block committed credentials at the pre-commit boundary and scan images for known vulnerabilities before they reach a registry.",
    pitfall: "Rotating a leaked key but leaving it in git history, where it stays readable forever.",
    lessons: [{ host: "Eisenberg", ep: 198, demos: ["Gitleaks", "Trivy", "TruffleHog"] }],
  },
  {
    id: "agent-protocols",
    name: "Speaking MCP without leaking the shop",
    pillar: "governance",
    tier: "working",
    outcome:
      "Expose tools over a standard protocol with a scoped, auditable surface, so adding a client does not mean widening access.",
    pitfall: "Mounting your whole filesystem as a tool because the quickstart did it that way.",
    lessons: [{ host: "Eisenberg", ep: 204, demos: ["MCP Reference Servers"] }],
  },
  {
    id: "e-signature",
    name: "Contracts and e-signature you control",
    pillar: "governance",
    tier: "foundational",
    outcome:
      "Run a self-hosted signing flow with a real audit trail, and understand what makes a signature hold up later.",
    pitfall: "Per-seat signature pricing quietly becoming a line item bigger than your infrastructure bill.",
    lessons: [{ host: "Eisenberg", ep: 194, demos: ["Documenso"] }],
  },

  /* ─────────────── Media distribution & SaaS ─────────────── */
  {
    id: "eval-harness",
    name: "Evals as a build gate",
    pillar: "media",
    tier: "working",
    outcome:
      "Score prompt and model changes against a fixed dataset in CI, so you can prove a change was an improvement rather than a vibe.",
    pitfall: "Shipping a prompt tweak on the strength of three manual spot checks.",
    lessons: [
      { host: "Pocock", ep: 195, demos: ["promptfoo", "Katalon Studio"] },
      { host: "Pocock", ep: 186, demos: ["Ragas"] },
    ],
  },
  {
    id: "tracing",
    name: "Tracing a non-deterministic system",
    pillar: "media",
    tier: "working",
    outcome:
      "Capture spans for every model call, tool call, and retry, then answer what a run cost and where the latency went.",
    pitfall: "Debugging an agent from console output. You cannot reconstruct a failed run you never traced.",
    lessons: [{ host: "Pocock", ep: 193, demos: ["Phoenix", "Langfuse"] }],
  },
  {
    id: "e2e-testing",
    name: "End-to-end tests that survive a redesign",
    pillar: "media",
    tier: "foundational",
    outcome:
      "Drive your app by accessible role and label so tests break when behaviour breaks, not when a class name changes.",
    pitfall: "A suite so brittle the team starts skipping it, which is the same as not having one.",
    lessons: [{ host: "Pocock", ep: 195, demos: ["Playwright"] }],
  },
  {
    id: "programmatic-video",
    name: "Video as code",
    pillar: "media",
    tier: "working",
    outcome:
      "Render hundreds of variants from data on a schedule, and keep a media pipeline that does not need a human in the editor.",
    pitfall: "Hand-editing every clip, so distribution volume is capped by your own hours.",
    lessons: [
      { host: "Warner", ep: 188, demos: ["Remotion"] },
      { host: "Warner", ep: 192, demos: ["FFmpeg", "ComfyUI"] },
    ],
  },
  {
    id: "owned-ingest",
    name: "Owning your ingest pipeline",
    pillar: "media",
    tier: "working",
    outcome:
      "Crawl and normalise sources into clean structured text on your own schedule, with rate limits and failure handling you set.",
    pitfall: "Depending on a scraping API that changes terms, and losing the corpus your product is built on.",
    lessons: [{ host: "Pocock", ep: 191, demos: ["Firecrawl", "Crawl4AI", "GPT Researcher"] }],
  },
  {
    id: "free-utility",
    name: "Distribution software instead of ad spend",
    pillar: "media",
    tier: "advanced",
    outcome:
      "Ship a genuinely useful free tool as the top of the funnel, and measure it on qualified signups rather than impressions.",
    pitfall: "Renting attention monthly. The moment you stop paying, the pipeline resets to zero.",
    lessons: [{ host: "Pocock", ep: 190, demos: ["Supabase", "Cal.com"] }],
  },
  {
    id: "own-the-interface",
    name: "Owning the chat interface",
    pillar: "media",
    tier: "foundational",
    outcome:
      "Self-host the front door to your models so conversation history, branding, and access rules stay yours.",
    pitfall: "Building your brand inside someone else's product, on their terms of service.",
    lessons: [
      { host: "Warner", ep: 187, demos: ["LibreChat"] },
      { host: "Warner", ep: 189, demos: ["LibreChat"] },
    ],
  },
]

/* ────────────────────────────────────────────────────────────────────────────
   Curriculum window

   Skills are folded onto the same rolling four-week window as the repo log, so
   "covered in the last month" means the same thing everywhere in the app. A
   skill is live if at least one of its lessons aired inside the window.
   ──────────────────────────────────────────────────────────────────────── */

export type CoveredSkill = Skill & {
  /** Lessons that aired inside the live window, newest first. */
  taught: DatedLesson[]
  /** Lessons that have rolled out of the window. */
  archived: DatedLesson[]
  /** Distinct hosts that covered it inside the window. */
  hosts: SkillHost[]
  /** Most recent airing inside the window. */
  lastTaught: string
  /** Week slot 1-4 of the most recent airing. */
  slot: number
  /** Repos used on air inside the window, deduped. */
  demos: string[]
}

export type Curriculum = {
  anchor: string
  windowStart: string
  windowEnd: string
  covered: CoveredSkill[]
  /** In the catalog but not taught inside the window. */
  dormant: Skill[]
  lessonCount: number
  hostTally: Record<SkillHost, number>
}

/**
 * Resolve a lesson against the review log: the episode carries the air date and
 * the canonical host, so a lesson can never claim an episode aired on a day the
 * repo table disagrees with. An episode missing from the log resolves to an
 * empty date, which parks the lesson outside the window rather than inventing one.
 */
function hydrate(l: SkillLesson): DatedLesson {
  const meta = EPISODES[l.ep]
  return { ...l, host: (meta?.host as SkillHost) ?? l.host, date: meta?.date ?? "" }
}

export function buildCurriculum(skills: Skill[] = SKILLS): Curriculum {
  const lessonsBySkill = new Map(skills.map((s) => [s.id, s.lessons.map(hydrate)]))
  const newest = [...lessonsBySkill.values()]
    .flatMap((ls) => ls.map((l) => l.date))
    .reduce((max, d) => (d > max ? d : max), "0000-00-00")
  const anchor = mondayOf(newest)
  const windowStart = shiftDays(anchor, -28)
  const windowEnd = shiftDays(anchor, -1)

  // Slots are whole weeks back from the anchor Monday, so measure Monday to
  // Monday. Measuring from the airing date itself pushed anything that aired on
  // a Monday into the next slot down.
  const slotOfDate = (iso: string) =>
    Math.round(
      (new Date(anchor + "T00:00:00Z").getTime() - new Date(mondayOf(iso) + "T00:00:00Z").getTime()) / 604_800_000,
    )

  const covered: CoveredSkill[] = []
  const dormant: Skill[] = []
  let lessonCount = 0
  const hostTally: Record<SkillHost, number> = { Eisenberg: 0, Pocock: 0, Warner: 0, Wolfe: 0, Berman: 0 }

  for (const s of skills) {
    const lessons = lessonsBySkill.get(s.id)!
    const taught = lessons
      .filter((l) => l.date >= windowStart && l.date <= windowEnd)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    const archived = lessons.filter((l) => l.date < windowStart || l.date > windowEnd)

    if (taught.length === 0) {
      dormant.push(s)
      continue
    }

    lessonCount += taught.length
    for (const l of taught) hostTally[l.host] += 1

    covered.push({
      ...s,
      taught,
      archived,
      hosts: [...new Set(taught.map((l) => l.host))],
      lastTaught: taught[0].date,
      slot: slotOfDate(taught[0].date),
      demos: [...new Set(taught.flatMap((l) => l.demos))],
    })
  }

  covered.sort((a, b) => (a.lastTaught < b.lastTaught ? 1 : a.lastTaught > b.lastTaught ? -1 : 0))

  return { anchor, windowStart, windowEnd, covered, dormant, lessonCount, hostTally }
}

