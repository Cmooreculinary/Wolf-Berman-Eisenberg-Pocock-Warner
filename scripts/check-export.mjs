/**
 * Asserts that a finished build actually publishes the machine-readable half.
 *
 * The failure this catches is quiet: the site renders perfectly while every
 * agent integration 404s. Run it after `STATIC_EXPORT=true pnpm build`, or
 * against `public/` after `pnpm api`.
 */
import { readFile, stat } from "node:fs/promises"
import { register } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

register("./ts-hooks.mjs", import.meta.url)

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const { ENDPOINTS, DISCOVERY } = await import(pathToFileURL(join(ROOT, "lib", "site.ts")).href)

const dir = join(ROOT, process.argv[2] ?? "out")
const expected = [...ENDPOINTS.map((e) => e.path), ...Object.values(DISCOVERY)]

const failures = []
for (const path of expected) {
  const file = join(dir, path)
  try {
    const { size } = await stat(file)
    if (size === 0) throw new Error("empty")
    if (path.endsWith(".json")) JSON.parse(await readFile(file, "utf8"))
    console.log(`  ok   ${path}  ${(size / 1024).toFixed(1)} kB`)
  } catch (err) {
    failures.push(`  FAIL ${path}  ${err.message}`)
  }
}

if (failures.length) {
  console.error(`\n${failures.join("\n")}\n\n${failures.length} of ${expected.length} missing or invalid in ${dir}`)
  process.exit(1)
}
console.log(`\nall ${expected.length} machine-readable files present in ${dir}`)
