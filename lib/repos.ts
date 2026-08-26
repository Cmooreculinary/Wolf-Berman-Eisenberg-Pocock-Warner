export type RepoPillar = "agents" | "governance" | "media"

export type RepoReview = {
  /** GitHub "owner/name" — also the crossover dedupe key. */
  repo: string
  name: string
  blurb: string
  pillar: RepoPillar
  lang: string
  license: string
  website: string
  /** Episode this review aired in. */
  ep: number
  host: "Eisenberg" | "Pocock" | "Warner" | "Wolfe" | "Berman"
  epTitle: string
  /** ISO date the review aired. */
  date: string
}

export const PILLAR_LABEL: Record<RepoPillar, string> = {
  agents: "Agent Autonomy & Swarms",
  governance: "Zero-Trust Governance & Legal",
  media: "Media Distribution & SaaS",
}

export const PILLAR_SHORT: Record<RepoPillar, string> = {
  agents: "Agents",
  governance: "Governance",
  media: "Distribution",
}

/**
 * Episode links resolve through the show's YouTube/social search rather than a
 * hardcoded video id, so no link in this table can rot into a dead URL. Swap
 * `episodeUrl` for canonical permalinks once the show's episode index is wired in.
 */
export function episodeUrl(r: RepoReview) {
  const q = `Eisenberg Pocock Warner Matt Wolfe Matthew Berman ${r.host} episode ${r.ep} ${r.name}`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
}

export function repoUrl(r: RepoReview) {
  return `https://github.com/${r.repo}`
}

/**
 * Raw review log — one row per airing. Repos reviewed in more than one episode
 * appear more than once on purpose; `dedupeReviews` collapses them.
 */
export const REVIEW_LOG: RepoReview[] = [
  // ——— Agent autonomy & swarms ———
  {
    repo: "langchain-ai/langgraph",
    name: "LangGraph",
    blurb: "Stateful graph runtime for cyclic agent workflows with durable checkpoints and human-in-the-loop interrupts.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://langchain-ai.github.io/langgraph/",
    ep: 214,
    host: "Warner",
    epTitle: "Swarms that survive a restart",
    date: "2026-08-21",
  },
  {
    repo: "langchain-ai/langgraph",
    name: "LangGraph",
    blurb: "Second pass, focused on checkpoint replay as a deterministic loop-hashing substrate.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://langchain-ai.github.io/langgraph/",
    ep: 208,
    host: "Warner",
    epTitle: "Deterministic loops or bust",
    date: "2026-07-29",
  },
  {
    repo: "crewAIInc/crewAI",
    name: "CrewAI",
    blurb: "Role-based multi-agent orchestration — the closest OSS analogue to the 14-role Cogent swarm layout.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://www.crewai.com/",
    ep: 213,
    host: "Pocock",
    epTitle: "Fourteen roles, zero FTEs",
    date: "2026-08-19",
  },
  {
    repo: "microsoft/autogen",
    name: "AutoGen",
    blurb: "Conversational multi-agent framework; reviewed for its event-driven core and group-chat termination guards.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://microsoft.github.io/autogen/",
    ep: 213,
    host: "Pocock",
    epTitle: "Fourteen roles, zero FTEs",
    date: "2026-08-19",
  },
  {
    repo: "openai/openai-agents-python",
    name: "OpenAI Agents SDK",
    blurb: "Handoffs, guardrails and tracing primitives — the successor to the Swarm experiment.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://openai.github.io/openai-agents-python/",
    ep: 212,
    host: "Warner",
    epTitle: "Handoffs beat hierarchies",
    date: "2026-08-17",
  },
  {
    repo: "openai/swarm",
    name: "Swarm (archived)",
    blurb: "Archived reference implementation. Kept on the list as the cleanest readable model of routine + handoff.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://github.com/openai/swarm",
    ep: 212,
    host: "Warner",
    epTitle: "Handoffs beat hierarchies",
    date: "2026-08-17",
  },
  {
    repo: "pydantic/pydantic-ai",
    name: "Pydantic AI",
    blurb: "Type-safe agent framework. Reviewed as the schema gate that stops malformed tool calls at the boundary.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://ai.pydantic.dev/",
    ep: 211,
    host: "Warner",
    epTitle: "Types are the cheapest guardrail",
    date: "2026-08-14",
  },
  {
    repo: "vercel/ai",
    name: "AI SDK",
    blurb: "TypeScript toolkit for streaming, tool loops and structured output — the front-of-house layer for agent UIs.",
    pillar: "agents",
    lang: "TypeScript",
    license: "Apache-2.0",
    website: "https://ai-sdk.dev/",
    ep: 211,
    host: "Warner",
    epTitle: "Types are the cheapest guardrail",
    date: "2026-08-14",
  },
  {
    repo: "microsoft/semantic-kernel",
    name: "Semantic Kernel",
    blurb: "Enterprise agent runtime with planner + plugin contracts; the compliance-friendliest of the big frameworks.",
    pillar: "agents",
    lang: "C#",
    license: "MIT",
    website: "https://learn.microsoft.com/semantic-kernel/",
    ep: 210,
    host: "Pocock",
    epTitle: "Enterprise-grade or bust",
    date: "2026-08-12",
  },
  {
    repo: "run-llama/llama_index",
    name: "LlamaIndex",
    blurb: "Ingestion and retrieval spine. Reviewed for node-level metadata that survives PII scrubbing.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://www.llamaindex.ai/",
    ep: 210,
    host: "Pocock",
    epTitle: "Enterprise-grade or bust",
    date: "2026-08-12",
  },
  {
    repo: "All-Hands-AI/OpenHands",
    name: "OpenHands",
    blurb: "Autonomous software engineer with a sandboxed runtime — the +76% code-surge machine in the flesh.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://www.all-hands.dev/",
    ep: 209,
    host: "Warner",
    epTitle: "7,839 lines a month",
    date: "2026-08-10",
  },
  {
    repo: "SWE-agent/SWE-agent",
    name: "SWE-agent",
    blurb: "Agent-computer interface research repo. The benchmark harness we cite for the 1.7x logic-defect multiplier.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://swe-agent.com/",
    ep: 209,
    host: "Warner",
    epTitle: "7,839 lines a month",
    date: "2026-08-10",
  },
  {
    repo: "Aider-AI/aider",
    name: "Aider",
    blurb: "Terminal pair-programmer with repo-map context and git-native commits. Best diff hygiene of the cohort.",
    pillar: "agents",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://aider.chat/",
    ep: 209,
    host: "Warner",
    epTitle: "7,839 lines a month",
    date: "2026-08-10",
  },
  {
    repo: "browser-use/browser-use",
    name: "Browser Use",
    blurb: "DOM-aware browser control for agents. Reviewed as the distribution-side scraper and QA driver.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://browser-use.com/",
    ep: 207,
    host: "Pocock",
    epTitle: "Machines that click",
    date: "2026-07-27",
  },
  {
    repo: "e2b-dev/E2B",
    name: "E2B",
    blurb: "Firecracker-backed sandboxes for agent code execution — the circuit breaker's containment layer.",
    pillar: "agents",
    lang: "TypeScript",
    license: "Apache-2.0",
    website: "https://e2b.dev/",
    ep: 207,
    host: "Pocock",
    epTitle: "Machines that click",
    date: "2026-07-27",
  },
  {
    repo: "letta-ai/letta",
    name: "Letta (MemGPT)",
    blurb: "Stateful agents with tiered memory. The archival/recall split maps cleanly onto work-product retention rules.",
    pillar: "agents",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://www.letta.com/",
    ep: 206,
    host: "Warner",
    epTitle: "Memory is a compliance surface",
    date: "2026-08-05",
  },
  {
    repo: "mem0ai/mem0",
    name: "Mem0",
    blurb: "Drop-in memory layer with scoped user/session graphs. Reviewed for right-to-erasure ergonomics.",
    pillar: "agents",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://mem0.ai/",
    ep: 206,
    host: "Warner",
    epTitle: "Memory is a compliance surface",
    date: "2026-08-05",
  },
  {
    repo: "temporalio/temporal",
    name: "Temporal",
    blurb: "Durable execution engine. Still the reference answer for agent runs that must not lose state mid-flight.",
    pillar: "agents",
    lang: "Go",
    license: "MIT",
    website: "https://temporal.io/",
    ep: 214,
    host: "Warner",
    epTitle: "Swarms that survive a restart",
    date: "2026-08-21",
  },
  {
    repo: "BerriAI/litellm",
    name: "LiteLLM",
    blurb: "Provider gateway with budgets and fallbacks — the SLM circuit-breaker chokepoint for cost control.",
    pillar: "agents",
    lang: "Python",
    license: "MIT",
    website: "https://www.litellm.ai/",
    ep: 205,
    host: "Pocock",
    epTitle: "Small models, hard limits",
    date: "2026-08-03",
  },
  {
    repo: "n8n-io/n8n",
    name: "n8n",
    blurb: "Self-hostable workflow automation with an agent node. Reviewed as the zero-FTE glue for owned channels.",
    pillar: "agents",
    lang: "TypeScript",
    license: "Sustainable Use",
    website: "https://n8n.io/",
    ep: 205,
    host: "Pocock",
    epTitle: "Small models, hard limits",
    date: "2026-08-03",
  },

  // ——— Zero-trust governance & legal compliance ———
  {
    repo: "google/mangle",
    name: "Mangle",
    blurb: "Datalog-derived deductive language. The reasoning layer behind our policy-as-logic gating.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://github.com/google/mangle",
    ep: 204,
    host: "Eisenberg",
    epTitle: "Policy is a logic program",
    date: "2026-08-24",
  },
  {
    repo: "open-policy-agent/opa",
    name: "Open Policy Agent",
    blurb: "Rego policy engine. Reviewed head-to-head with Mangle for machine-identity authorization decisions.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://www.openpolicyagent.org/",
    ep: 204,
    host: "Eisenberg",
    epTitle: "Policy is a logic program",
    date: "2026-08-24",
  },
  {
    repo: "open-policy-agent/opa",
    name: "Open Policy Agent",
    blurb: "Earlier pass on bundle distribution and decision logs.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://www.openpolicyagent.org/",
    ep: 199,
    host: "Eisenberg",
    epTitle: "Decision logs as evidence",
    date: "2026-07-26",
  },
  {
    repo: "microsoft/presidio",
    name: "Presidio",
    blurb: "NER-driven PII detection and anonymization — the exact scrubbing method in our technical core.",
    pillar: "governance",
    lang: "Python",
    license: "MIT",
    website: "https://microsoft.github.io/presidio/",
    ep: 203,
    host: "Eisenberg",
    epTitle: "Scrub before you send",
    date: "2026-08-22",
  },
  {
    repo: "microsoft/presidio",
    name: "Presidio",
    blurb: "First pass, recognizer registry and custom entity patterns for privileged legal text.",
    pillar: "governance",
    lang: "Python",
    license: "MIT",
    website: "https://microsoft.github.io/presidio/",
    ep: 200,
    host: "Eisenberg",
    epTitle: "Privilege survives the pipeline",
    date: "2026-07-31",
  },
  {
    repo: "ory/kratos",
    name: "Ory Kratos",
    blurb: "Headless identity server. Reviewed as the human half of the NHI/human identity split.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://www.ory.sh/kratos/",
    ep: 202,
    host: "Eisenberg",
    epTitle: "Non-human identity, managed",
    date: "2026-08-20",
  },
  {
    repo: "keycloak/keycloak",
    name: "Keycloak",
    blurb: "IAM with fine-grained authorization services; the on-prem fallback when Saviynt is out of budget.",
    pillar: "governance",
    lang: "Java",
    license: "Apache-2.0",
    website: "https://www.keycloak.org/",
    ep: 202,
    host: "Eisenberg",
    epTitle: "Non-human identity, managed",
    date: "2026-08-20",
  },
  {
    repo: "spiffe/spire",
    name: "SPIRE",
    blurb: "SPIFFE identity issuance for workloads. The cleanest answer to short-lived credentials for agents.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://spiffe.io/",
    ep: 202,
    host: "Eisenberg",
    epTitle: "Non-human identity, managed",
    date: "2026-08-20",
  },
  {
    repo: "sigstore/cosign",
    name: "Cosign",
    blurb: "Keyless artifact signing. Reviewed as the notarization step for agent-authored build outputs.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://www.sigstore.dev/",
    ep: 201,
    host: "Eisenberg",
    epTitle: "Provenance or it didn't happen",
    date: "2026-08-18",
  },
  {
    repo: "in-toto/in-toto",
    name: "in-toto",
    blurb: "Supply-chain attestation framework. Gives the machine-speed verification gate its audit trail.",
    pillar: "governance",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://in-toto.io/",
    ep: 201,
    host: "Eisenberg",
    epTitle: "Provenance or it didn't happen",
    date: "2026-08-18",
  },
  {
    repo: "slsa-framework/slsa",
    name: "SLSA",
    blurb: "Build-integrity level spec. Reviewed as the compliance vocabulary auditors already accept.",
    pillar: "governance",
    lang: "Docs",
    license: "Apache-2.0",
    website: "https://slsa.dev/",
    ep: 201,
    host: "Eisenberg",
    epTitle: "Provenance or it didn't happen",
    date: "2026-08-18",
  },
  {
    repo: "trufflesecurity/trufflehog",
    name: "TruffleHog",
    blurb: "Secret scanning with live credential verification — the endpoint-DLP tripwire for agent commits.",
    pillar: "governance",
    lang: "Go",
    license: "AGPL-3.0",
    website: "https://trufflesecurity.com/",
    ep: 198,
    host: "Eisenberg",
    epTitle: "Leaks at machine speed",
    date: "2026-08-07",
  },
  {
    repo: "gitleaks/gitleaks",
    name: "Gitleaks",
    blurb: "Fast pre-commit secret detection; the cheaper gate to run on every agent-generated diff.",
    pillar: "governance",
    lang: "Go",
    license: "MIT",
    website: "https://gitleaks.io/",
    ep: 198,
    host: "Eisenberg",
    epTitle: "Leaks at machine speed",
    date: "2026-08-07",
  },
  {
    repo: "aquasecurity/trivy",
    name: "Trivy",
    blurb: "Unified vuln, IaC and SBOM scanner. One binary covering most of the pre-merge compliance checklist.",
    pillar: "governance",
    lang: "Go",
    license: "Apache-2.0",
    website: "https://trivy.dev/",
    ep: 198,
    host: "Eisenberg",
    epTitle: "Leaks at machine speed",
    date: "2026-08-07",
  },
  {
    repo: "NVIDIA/NeMo-Guardrails",
    name: "NeMo Guardrails",
    blurb: "Colang-defined dialogue rails. Reviewed as the runtime refusal layer, not a substitute for policy.",
    pillar: "governance",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://github.com/NVIDIA/NeMo-Guardrails",
    ep: 197,
    host: "Eisenberg",
    epTitle: "Rails, not vibes",
    date: "2026-08-01",
  },
  {
    repo: "guardrails-ai/guardrails",
    name: "Guardrails AI",
    blurb: "Validator-based output contracts with reask loops. Pairs with Pydantic AI rather than replacing it.",
    pillar: "governance",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://www.guardrailsai.com/",
    ep: 197,
    host: "Eisenberg",
    epTitle: "Rails, not vibes",
    date: "2026-08-01",
  },
  {
    repo: "NVIDIA/garak",
    name: "garak",
    blurb: "LLM vulnerability scanner. The red-team probe set we run before a Sentinel gatekeeper ships.",
    pillar: "governance",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://garak.ai/",
    ep: 196,
    host: "Pocock",
    epTitle: "Red team the swarm",
    date: "2026-08-15",
  },
  {
    repo: "Azure/PyRIT",
    name: "PyRIT",
    blurb: "Risk identification toolkit for generative AI. Reviewed for its scoring engine and attack strategies.",
    pillar: "governance",
    lang: "Python",
    license: "MIT",
    website: "https://azure.github.io/PyRIT/",
    ep: 196,
    host: "Pocock",
    epTitle: "Red team the swarm",
    date: "2026-08-15",
  },
  {
    repo: "microsoft/playwright",
    name: "Playwright",
    blurb: "Cross-browser automation. The unified verification gate that replaces the manual QA bottleneck.",
    pillar: "governance",
    lang: "TypeScript",
    license: "Apache-2.0",
    website: "https://playwright.dev/",
    ep: 195,
    host: "Pocock",
    epTitle: "QA at machine speed",
    date: "2026-08-13",
  },
  {
    repo: "katalon-studio/katalon-studio",
    name: "Katalon Studio",
    blurb: "Test automation platform behind the Katalon MCP; reviewed for its QA-gating hooks into CI.",
    pillar: "governance",
    lang: "Groovy",
    license: "Apache-2.0",
    website: "https://katalon.com/",
    ep: 195,
    host: "Pocock",
    epTitle: "QA at machine speed",
    date: "2026-08-13",
  },
  {
    repo: "promptfoo/promptfoo",
    name: "promptfoo",
    blurb: "Eval and red-team harness that runs in CI. The cheapest way to make model regressions blocking.",
    pillar: "governance",
    lang: "TypeScript",
    license: "MIT",
    website: "https://promptfoo.dev/",
    ep: 195,
    host: "Pocock",
    epTitle: "QA at machine speed",
    date: "2026-08-13",
  },
  {
    repo: "documenso/documenso",
    name: "Documenso",
    blurb: "Open e-signing with cryptographic sealing — the legal artifact end of the compliance pipeline.",
    pillar: "governance",
    lang: "TypeScript",
    license: "AGPL-3.0",
    website: "https://documenso.com/",
    ep: 194,
    host: "Eisenberg",
    epTitle: "Paper that holds up",
    date: "2026-08-06",
  },
  {
    repo: "modelcontextprotocol/servers",
    name: "MCP Reference Servers",
    blurb: "Canonical MCP server implementations — the interop contract Saviynt and Katalon MCPs both target.",
    pillar: "governance",
    lang: "TypeScript",
    license: "MIT",
    website: "https://modelcontextprotocol.io/",
    ep: 204,
    host: "Eisenberg",
    epTitle: "Policy is a logic program",
    date: "2026-08-24",
  },

  // ——— Media distribution & SaaS unbundling ———
  {
    repo: "langfuse/langfuse",
    name: "Langfuse",
    blurb: "Self-hostable LLM tracing and cost analytics. Reviewed as the unit-economics meter for the ACP funnel.",
    pillar: "media",
    lang: "TypeScript",
    license: "MIT / EE",
    website: "https://langfuse.com/",
    ep: 193,
    host: "Pocock",
    epTitle: "Meter every token",
    date: "2026-08-11",
  },
  {
    repo: "Arize-ai/phoenix",
    name: "Phoenix",
    blurb: "OTel-native LLM observability with eval views. The dashboard half of the quality-debt spiral.",
    pillar: "media",
    lang: "Python",
    license: "Elastic-2.0",
    website: "https://phoenix.arize.com/",
    ep: 193,
    host: "Pocock",
    epTitle: "Meter every token",
    date: "2026-08-11",
  },
  {
    repo: "comfyanonymous/ComfyUI",
    name: "ComfyUI",
    blurb: "Node-graph diffusion pipeline. The procedural worldbuilding and HDR grading rig for vertical microdramas.",
    pillar: "media",
    lang: "Python",
    license: "GPL-3.0",
    website: "https://www.comfy.org/",
    ep: 192,
    host: "Warner",
    epTitle: "Microdramas at scale",
    date: "2026-08-08",
  },
  {
    repo: "remotion-dev/remotion",
    name: "Remotion",
    blurb: "Programmatic video in React. Turns an episode's assets into 40 shorts without an editor in the loop.",
    pillar: "media",
    lang: "TypeScript",
    license: "Remotion License",
    website: "https://www.remotion.dev/",
    ep: 192,
    host: "Warner",
    epTitle: "Microdramas at scale",
    date: "2026-08-08",
  },
  {
    repo: "remotion-dev/remotion",
    name: "Remotion",
    blurb: "Earlier look at the render farm economics for short-form output.",
    pillar: "media",
    lang: "TypeScript",
    license: "Remotion License",
    website: "https://www.remotion.dev/",
    ep: 188,
    host: "Warner",
    epTitle: "Render farms for one",
    date: "2026-07-28",
  },
  {
    repo: "FFmpeg/FFmpeg",
    name: "FFmpeg",
    blurb: "Still the transcode and color-pipeline substrate under every virtual-production shortcut we recommend.",
    pillar: "media",
    lang: "C",
    license: "LGPL-2.1+",
    website: "https://ffmpeg.org/",
    ep: 192,
    host: "Warner",
    epTitle: "Microdramas at scale",
    date: "2026-08-08",
  },
  {
    repo: "mendableai/firecrawl",
    name: "Firecrawl",
    blurb: "Crawl-to-markdown for LLM ingestion. Powers the Reddit unbundling scans and AI-SEO corpus builds.",
    pillar: "media",
    lang: "TypeScript",
    license: "AGPL-3.0",
    website: "https://www.firecrawl.dev/",
    ep: 191,
    host: "Pocock",
    epTitle: "Unbundling Reddit",
    date: "2026-08-16",
  },
  {
    repo: "unclecode/crawl4ai",
    name: "Crawl4AI",
    blurb: "Self-hosted async crawler with extraction strategies. The zero-cost alternative for niche discovery.",
    pillar: "media",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://crawl4ai.com/",
    ep: 191,
    host: "Pocock",
    epTitle: "Unbundling Reddit",
    date: "2026-08-16",
  },
  {
    repo: "assafelovic/gpt-researcher",
    name: "GPT Researcher",
    blurb: "Autonomous research agent producing cited reports — the template for free 'distribution software' utilities.",
    pillar: "media",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://gptr.dev/",
    ep: 191,
    host: "Pocock",
    epTitle: "Unbundling Reddit",
    date: "2026-08-16",
  },
  {
    repo: "calcom/cal.com",
    name: "Cal.com",
    blurb: "Scheduling infrastructure. Studied as the canonical unbundle-then-own-the-channel playbook.",
    pillar: "media",
    lang: "TypeScript",
    license: "AGPL-3.0",
    website: "https://cal.com/",
    ep: 190,
    host: "Pocock",
    epTitle: "Own the channel",
    date: "2026-08-04",
  },
  {
    repo: "supabase/supabase",
    name: "Supabase",
    blurb: "Postgres backend-as-a-service. The fastest path from micro-utility to billable product with RLS intact.",
    pillar: "media",
    lang: "TypeScript",
    license: "Apache-2.0",
    website: "https://supabase.com/",
    ep: 190,
    host: "Pocock",
    epTitle: "Own the channel",
    date: "2026-08-04",
  },
  {
    repo: "danny-avila/LibreChat",
    name: "LibreChat",
    blurb: "Self-hosted multi-model chat UI. The no-fluff consensus studio, deployable on a community's own domain.",
    pillar: "media",
    lang: "TypeScript",
    license: "MIT",
    website: "https://www.librechat.ai/",
    ep: 189,
    host: "Warner",
    epTitle: "Consensus, self-hosted",
    date: "2026-08-02",
  },
  {
    repo: "danny-avila/LibreChat",
    name: "LibreChat",
    blurb: "Prior pass on the agents and MCP plumbing.",
    pillar: "media",
    lang: "TypeScript",
    license: "MIT",
    website: "https://www.librechat.ai/",
    ep: 187,
    host: "Warner",
    epTitle: "MCP everywhere",
    date: "2026-07-30",
  },
  {
    repo: "flowiseai/Flowise",
    name: "Flowise",
    blurb: "Visual agent builder. Reviewed as the handoff artifact for non-technical community operators.",
    pillar: "media",
    lang: "TypeScript",
    license: "Apache-2.0",
    website: "https://flowiseai.com/",
    ep: 189,
    host: "Warner",
    epTitle: "Consensus, self-hosted",
    date: "2026-08-02",
  },
  {
    repo: "explodinggradients/ragas",
    name: "Ragas",
    blurb: "Retrieval eval metrics. Keeps the AI-SEO corpus honest as it grows past human review capacity.",
    pillar: "media",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://docs.ragas.io/",
    ep: 186,
    host: "Pocock",
    epTitle: "AI SEO, measured",
    date: "2026-07-26",
  },
  {
    repo: "Unstructured-IO/unstructured",
    name: "Unstructured",
    blurb: "Document partitioning for messy real-world files. The intake stage for the doc vault.",
    pillar: "media",
    lang: "Python",
    license: "Apache-2.0",
    website: "https://unstructured.io/",
    ep: 186,
    host: "Pocock",
    epTitle: "AI SEO, measured",
    date: "2026-07-26",
  },
  {
    repo: "qdrant/qdrant",
    name: "Qdrant",
    blurb: "Vector store with payload filtering — tenant isolation without a second database.",
    pillar: "media",
    lang: "Rust",
    license: "Apache-2.0",
    website: "https://qdrant.tech/",
    ep: 186,
    host: "Pocock",
    epTitle: "AI SEO, measured",
    date: "2026-07-26",
  },
]

export type DedupedRepo = RepoReview & {
  /** Superseded airings that the crossover rule deleted, newest first. */
  removed: RepoReview[]
}

/**
 * Crossover rule: one row per repo, keep the newest airing, delete the rest.
 * The deleted rows are returned alongside so the cut stays auditable.
 */
export function dedupeReviews(log: RepoReview[]): DedupedRepo[] {
  const byRepo = new Map<string, RepoReview[]>()
  for (const r of log) {
    const list = byRepo.get(r.repo)
    if (list) list.push(r)
    else byRepo.set(r.repo, [r])
  }
  const out: DedupedRepo[] = []
  for (const list of byRepo.values()) {
    const sorted = [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.ep - a.ep))
    out.push({ ...sorted[0], removed: sorted.slice(1) })
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.ep - a.ep))
}

export function windowLabel(log: RepoReview[]) {
  const dates = log.map((r) => r.date).sort()
  return { from: dates[0], to: dates[dates.length - 1] }
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/* ────────────────────────────────────────────────────────────────────────────
   Rolling 4-week window

   The Monday ingest: the agent grabs the week that just closed, files it as
   Week 1, and every other week shifts down one slot. Whatever falls out of
   slot 4 is vaulted. The window is always exactly four weeks wide.

   The anchor is derived from the newest row in the log rather than the wall
   clock, so server and client always agree and the window follows the data.
   ──────────────────────────────────────────────────────────────────────── */

const DAY_MS = 86_400_000

function toMs(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

function toIso(ms: number) {
  return new Date(ms).toISOString().slice(0, 10)
}

export function shiftDays(iso: string, days: number) {
  return toIso(toMs(iso) + days * DAY_MS)
}

/** Monday (UTC) of the week containing `iso`. */
export function mondayOf(iso: string) {
  const ms = toMs(iso)
  const back = (new Date(ms).getUTCDay() + 6) % 7
  return toIso(ms - back * DAY_MS)
}

export const WEEK_SLOTS = 4

export type ProviderTally = Record<RepoReview["host"], number>

export type WeekSlot = {
  /** 1 = freshest ingest, 4 = about to roll into the vault. */
  slot: number
  start: string
  end: string
  /** Airings that landed in this week, before crossover dedupe. */
  airings: RepoReview[]
  /** Rows that survived dedupe and are attributed to this week. */
  kept: number
  providers: ProviderTally
}

export type VaultWeek = {
  start: string
  end: string
  /** Mondays ago this week was pushed out of the live window. */
  rolledOut: number
  airings: RepoReview[]
  providers: ProviderTally
}

export type RollingWindow = {
  /** The Monday this window was last rebuilt on. */
  anchor: string
  /** The Monday the next roll happens on. */
  nextRoll: string
  weeks: WeekSlot[]
  /** Deduped live rows across all four weeks, newest first. */
  active: DedupedRepo[]
  /** Already collected but not yet promoted — lands in Week 1 on `nextRoll`. */
  staging: RepoReview[]
  /** Weeks that have rolled out of the window, newest first. */
  vaulted: VaultWeek[]
  crossoversCut: number
}

function tally(rows: RepoReview[]): ProviderTally {
  const t: ProviderTally = { Eisenberg: 0, Pocock: 0, Warner: 0, Wolfe: 0, Berman: 0 }
  for (const r of rows) t[r.host] += 1
  return t
}

export function buildWindow(log: RepoReview[]): RollingWindow {
  const newest = log.reduce((max, r) => (r.date > max ? r.date : max), log[0].date)
  const anchor = mondayOf(newest)

  // Week 1 is the week that closed the day before the anchor Monday.
  const bounds = Array.from({ length: WEEK_SLOTS }, (_, i) => {
    const start = shiftDays(anchor, -7 * (i + 1))
    return { slot: i + 1, start, end: shiftDays(start, 6) }
  })
  const windowStart = bounds[WEEK_SLOTS - 1].start

  const staging = log.filter((r) => r.date >= anchor).sort((a, b) => (a.date < b.date ? 1 : -1))
  const inWindow = log.filter((r) => r.date >= windowStart && r.date < anchor)
  const rolledOff = log.filter((r) => r.date < windowStart)

  const active = dedupeReviews(inWindow)
  const keptByWeek = new Map<string, number>()
  for (const r of active) {
    const k = mondayOf(r.date)
    keptByWeek.set(k, (keptByWeek.get(k) ?? 0) + 1)
  }

  const weeks: WeekSlot[] = bounds.map((b) => {
    const airings = inWindow
      .filter((r) => r.date >= b.start && r.date <= b.end)
      .sort((a, b2) => (a.date < b2.date ? 1 : -1))
    return {
      slot: b.slot,
      start: b.start,
      end: b.end,
      airings,
      kept: keptByWeek.get(b.start) ?? 0,
      providers: tally(airings),
    }
  })

  const vaultBuckets = new Map<string, RepoReview[]>()
  for (const r of rolledOff) {
    const k = mondayOf(r.date)
    const list = vaultBuckets.get(k)
    if (list) list.push(r)
    else vaultBuckets.set(k, [r])
  }
  const vaulted: VaultWeek[] = [...vaultBuckets.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([start, airings]) => ({
      start,
      end: shiftDays(start, 6),
      rolledOut: Math.round((toMs(windowStart) - toMs(start)) / (7 * DAY_MS)),
      airings: airings.sort((a, b) => (a.date < b.date ? 1 : -1)),
      providers: tally(airings),
    }))

  return {
    anchor,
    nextRoll: shiftDays(anchor, 7),
    weeks,
    active,
    staging,
    vaulted,
    crossoversCut: inWindow.length - active.length,
  }
}

/** Which live week slot a row belongs to, or 0 if it is outside the window. */
export function slotOf(win: RollingWindow, iso: string) {
  const m = mondayOf(iso)
  return win.weeks.find((w) => w.start === m)?.slot ?? 0
}

export function weekRangeLabel(w: { start: string; end: string }) {
  return `${formatDate(w.start)} – ${formatDate(w.end)}`
}
