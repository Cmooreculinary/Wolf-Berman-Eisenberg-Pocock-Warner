/**
 * Writes the machine-readable half of this site.
 *
 * Route handlers are dropped by `output: "export"`, and the deploy targets are
 * static sites with no server, so the API cannot be computed per request. It is
 * computed here instead — once, at build time, from the same modules the pages
 * import — and served as ordinary files. Same bytes on Vercel, on Render, on a
 * Hugging Face Space and in `pnpm dev`.
 *
 *   pnpm api
 */
import { mkdir, rm, writeFile } from "node:fs/promises"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { DISCOVERY, ENDPOINT_BY_ID, type EndpointId } from "../lib/site"
import {
  datasetPayload,
  deckPayload,
  funnelPayload,
  indexPayload,
  inventoryPayload,
  nichesPayload,
  reposPayload,
  skillsPayload,
  vaultPayload,
  windowPayload,
} from "../lib/api"
import { buildAgentManifest, buildLlmsTxt, buildOpenApi } from "../lib/discovery"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PUBLIC = join(ROOT, "public")

const generatedAt = new Date().toISOString()

/** Endpoint id → payload. Keys must match `ENDPOINTS` in lib/site.ts. */
const payloads: Record<EndpointId, () => unknown> = {
  index: () => indexPayload(generatedAt),
  dataset: () => datasetPayload(generatedAt),
  window: () => windowPayload(),
  repos: () => reposPayload(),
  skills: () => skillsPayload(),
  inventory: () => inventoryPayload(),
  niches: () => nichesPayload(),
  vault: () => vaultPayload(),
  deck: () => deckPayload(),
  funnel: () => funnelPayload(),
}

const written: [string, number][] = []

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`

async function write(sitePath: string, body: string) {
  const dest = join(PUBLIC, sitePath)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, body)
  written.push([sitePath, Buffer.byteLength(body)])
}

async function main() {
  // Start clean so a renamed endpoint cannot linger as a stale file.
  await rm(join(PUBLIC, "api"), { recursive: true, force: true })
  await rm(join(PUBLIC, ".well-known"), { recursive: true, force: true })

  for (const [id, build] of Object.entries(payloads) as [EndpointId, () => unknown][]) {
    const endpoint = ENDPOINT_BY_ID[id]
    if (!endpoint) throw new Error(`No endpoint registered for payload "${id}" — add it to ENDPOINTS in lib/site.ts.`)
    await write(endpoint.path, json(build()))
  }

  for (const id of Object.keys(ENDPOINT_BY_ID) as EndpointId[]) {
    if (!(id in payloads)) throw new Error(`Endpoint "${id}" is published but has no payload builder in this script.`)
  }

  await write(DISCOVERY.openapi, json(buildOpenApi(generatedAt)))
  await write(DISCOVERY.agent, json(buildAgentManifest(generatedAt)))
  await write(DISCOVERY.llms, buildLlmsTxt())

  const total = written.reduce((n, [, size]) => n + size, 0)
  for (const [path, size] of written) {
    console.log(`  ${path.padEnd(28)} ${(size / 1024).toFixed(1)} kB`)
  }
  console.log(`api: ${written.length} files, ${(total / 1024).toFixed(0)} kB → ${relative(ROOT, PUBLIC)}/`)
}

main().catch((err) => {
  console.error(`api: ${err instanceof Error ? err.message : err}`)
  process.exit(1)
})
