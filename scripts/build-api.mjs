/**
 * Writes the machine-readable half of this site.
 *
 * Route handlers are dropped by `output: "export"`, and the Render deploy is a
 * static site with no server, so the API cannot be computed per request. It is
 * computed here instead — once, at build time, from the same modules the pages
 * import — and served as ordinary files. Same bytes on Vercel, on Render and in
 * `pnpm dev`.
 *
 * Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/build-api.mjs
 */
import { mkdir, rm, writeFile } from "node:fs/promises"
import { register } from "node:module"
import { dirname, join, relative } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

register("./ts-hooks.mjs", import.meta.url)

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PUBLIC = join(ROOT, "public")
const lib = (name) => import(pathToFileURL(join(ROOT, "lib", name)).href)

const { ENDPOINT_BY_ID, DISCOVERY } = await lib("site.ts")
const api = await lib("api.ts")
const { buildAgentManifest, buildLlmsTxt, buildOpenApi } = await lib("discovery.ts")

const generatedAt = new Date().toISOString()

/** Endpoint id → payload. Keys must match `ENDPOINTS` in lib/site.ts. */
const payloads = {
  index: () => api.indexPayload(generatedAt),
  dataset: () => api.datasetPayload(generatedAt),
  window: () => api.windowPayload(),
  repos: () => api.reposPayload(),
  skills: () => api.skillsPayload(),
  inventory: () => api.inventoryPayload(),
  niches: () => api.nichesPayload(),
  vault: () => api.vaultPayload(),
  deck: () => api.deckPayload(),
  funnel: () => api.funnelPayload(),
}

const written = []

async function write(sitePath, body) {
  const dest = join(PUBLIC, sitePath)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, body)
  written.push([sitePath, Buffer.byteLength(body)])
}

const json = (value) => `${JSON.stringify(value, null, 2)}\n`

// Start clean so a renamed endpoint cannot linger as a stale file.
await rm(join(PUBLIC, "api"), { recursive: true, force: true })
await rm(join(PUBLIC, ".well-known"), { recursive: true, force: true })

for (const [id, build] of Object.entries(payloads)) {
  const endpoint = ENDPOINT_BY_ID[id]
  if (!endpoint) throw new Error(`No endpoint registered for payload "${id}" — add it to ENDPOINTS in lib/site.ts.`)
  await write(endpoint.path, json(build()))
}

for (const id of Object.keys(ENDPOINT_BY_ID)) {
  if (!(id in payloads)) throw new Error(`Endpoint "${id}" is published but has no payload builder in this script.`)
}

await write(DISCOVERY.openapi, json(buildOpenApi(generatedAt)))
await write(DISCOVERY.agent, json(buildAgentManifest(generatedAt)))
await write(DISCOVERY.llms, buildLlmsTxt())

const total = written.reduce((n, [, size]) => n + size, 0)
for (const [path, size] of written) {
  console.log(`  ${path.padEnd(28)} ${(size / 1024).toFixed(1)} kB`)
}
console.log(
  `api: ${written.length} files, ${(total / 1024).toFixed(0)} kB → ${relative(ROOT, PUBLIC)}/`,
)
