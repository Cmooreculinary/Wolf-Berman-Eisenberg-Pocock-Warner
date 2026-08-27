/**
 * The three files an agent looks for before it reads anything else:
 *
 *   /openapi.json          a typed contract for the JSON endpoints
 *   /llms.txt              a plain-text map of the site, in the llms.txt convention
 *   /.well-known/agent.json  what this app is, and every way to plug into it
 *
 * All three are generated from `lib/site.ts`, so adding an endpoint there
 * publishes it in all three places at once and cannot leave one behind.
 */

import { API_VERSION, DISCOVERY, ENDPOINTS, LICENSE, PUBLISHER, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, absolute } from "./site"
import { FUNNEL_FIELDS } from "./funnel"

export function buildOpenApi(generatedAt: string) {
  const paths: Record<string, unknown> = {}
  for (const e of ENDPOINTS) {
    paths[e.path] = {
      get: {
        operationId: `get${e.id[0].toUpperCase()}${e.id.slice(1)}`,
        summary: e.title,
        description: `${e.summary}\n\nReturns: \`${e.returns}\`.`,
        tags: ["dataset"],
        responses: {
          "200": {
            description: e.summary,
            content: {
              "application/json": {
                schema:
                  e.returns === "object"
                    ? { type: "object" }
                    : {
                        type: "object",
                        required: ["resource", "version", "updated", "count", "items"],
                        properties: {
                          resource: { type: "string" },
                          version: { type: "string" },
                          updated: { type: "string", format: "date" },
                          count: { type: "integer" },
                          items: { type: "array", items: { type: "object" } },
                        },
                      },
              },
            },
          },
        },
      },
    }
  }

  return {
    openapi: "3.1.0",
    info: {
      title: `${SITE_NAME} — dataset`,
      version: `${API_VERSION}+${generatedAt.slice(0, 10)}`,
      summary: SITE_TAGLINE,
      description:
        `${SITE_DESCRIPTION}\n\n` +
        "Every endpoint is a static JSON file on a CDN: read-only, unauthenticated, " +
        "CORS-open, and safe to poll. There is no write surface and no rate limit to " +
        "negotiate — but the data only changes when a new week is ingested, so " +
        "fetching more than daily buys nothing.",
      contact: { name: PUBLISHER.name, url: PUBLISHER.url },
      license: { name: LICENSE.name, url: LICENSE.url },
    },
    externalDocs: { description: "Integration guide", url: `${REPO_URL}/blob/main/INTEGRATE.md` },
    servers: [{ url: SITE_URL, description: "Production" }],
    tags: [{ name: "dataset", description: "Read-only editorial data, regenerated at build time." }],
    paths,
  }
}

export function buildLlmsTxt() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE} ${SITE_DESCRIPTION}`,
    "",
    "The site is a static export with no server-side rendering, so fetching the HTML",
    "gets you a shell. Read the JSON instead — it is the same data the pages render,",
    "and it is licensed for reuse with attribution.",
    "",
    "## Data",
    "",
    ...ENDPOINTS.map((e) => `- [${e.title}](${absolute(e.path)}): ${e.summary}`),
    "",
    "## Contracts",
    "",
    `- [OpenAPI 3.1](${absolute(DISCOVERY.openapi)}): typed contract for every endpoint above.`,
    `- [Agent manifest](${absolute(DISCOVERY.agent)}): what this app is and every way to plug into it.`,
    `- [Integration guide](${REPO_URL}/blob/main/INTEGRATE.md): MCP server, client snippets, embedding.`,
    "",
    "## Terms",
    "",
    `- License: ${LICENSE.name} (${LICENSE.url}) — attribute as "${LICENSE.attribution}".`,
    "- The dataset is editorial: it records what was covered on five public feeds.",
    "  Figures in the funnel model and the niche board are models, not forecasts.",
    "- Published by " + `${PUBLISHER.name} (${PUBLISHER.url}).`,
    "",
  ]
  return lines.join("\n")
}

export function buildAgentManifest(generatedAt: string) {
  return {
    /** Our own manifest shape — not a claim of conformance to any agent-to-agent spec. */
    kind: "data-source",
    schemaVersion: "1.0",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    generatedAt,
    publisher: PUBLISHER,
    repository: REPO_URL,
    license: LICENSE,
    /** No auth, no writes, no server. Say so plainly so nobody probes for one. */
    access: {
      auth: "none",
      methods: ["GET"],
      cors: "*",
      writes: false,
      rateLimit: null,
      transport: "static-json",
    },
    discovery: {
      openapi: absolute(DISCOVERY.openapi),
      llms: absolute(DISCOVERY.llms),
      index: absolute(ENDPOINTS[0].path),
    },
    endpoints: ENDPOINTS.map((e) => ({
      id: e.id,
      url: absolute(e.path),
      title: e.title,
      description: e.summary,
      returns: e.returns,
    })),
    /** What a caller can actually ask this dataset for. */
    capabilities: [
      {
        id: "repos-reviewed",
        description: "Which repositories were reviewed on air in the last four weeks, by host, pillar or week.",
        endpoints: ["window", "repos"],
      },
      {
        id: "skills-taught",
        description: "Which skills were taught inside the window, the lessons that taught them and the repos demoed.",
        endpoints: ["skills"],
      },
      {
        id: "technical-core",
        description: "The agent, method and protocol inventory behind the thesis.",
        endpoints: ["inventory"],
      },
      {
        id: "funnel-model",
        description:
          "Reproduce the ACP funnel simulator: inputs, bounds and formulas are published so the caller can compute it.",
        endpoints: ["funnel"],
        inputs: FUNNEL_FIELDS.map((f) => f.key),
      },
    ],
    mcp: {
      description: "A zero-dependency MCP server that exposes the endpoints above as tools.",
      transport: "stdio",
      source: `${REPO_URL}/blob/main/integrations/mcp/server.mjs`,
      command: "node",
      args: ["integrations/mcp/server.mjs"],
      env: { EPWWB_BASE_URL: SITE_URL },
    },
  }
}
