/**
 * Two deploy targets share this config:
 *
 *   - Vercel / v0 preview — the default. Next.js serves the app and applies
 *     the security headers below itself.
 *   - Render static site — set STATIC_EXPORT=true. Next.js writes plain HTML
 *     to `out/` and Render serves it. There is no server to run headers(), so
 *     the same headers are declared in render.yaml instead.
 *
 * Every route in this app is prerendered, so the export loses nothing. The
 * machine-readable API is not a route at all: `pnpm api` writes it into
 * `public/` before the build, which is why it survives the export.
 */
const staticExport = process.env.STATIC_EXPORT === 'true'

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/**
 * The dataset is public, read-only and meant to be fetched from someone else's
 * page or agent, so it is CORS-open. It is regenerated only when a build runs,
 * so a short cache with a long stale window costs nothing and keeps a polling
 * client off the origin.
 */
const PUBLIC_DATA_HEADERS = [
  { key: 'Access-Control-Allow-Origin', value: '*' },
  { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
  { key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=86400' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(staticExport
    ? { output: 'export' }
    : {
        async headers() {
          return [
            { source: '/:path*', headers: SECURITY_HEADERS },
            { source: '/api/:path*', headers: PUBLIC_DATA_HEADERS },
            { source: '/.well-known/:path*', headers: PUBLIC_DATA_HEADERS },
            { source: '/openapi.json', headers: PUBLIC_DATA_HEADERS },
            { source: '/llms.txt', headers: PUBLIC_DATA_HEADERS },
          ]
        },
      }),
}

export default nextConfig
