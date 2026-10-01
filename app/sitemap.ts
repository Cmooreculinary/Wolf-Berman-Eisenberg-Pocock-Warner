import type { MetadataRoute } from 'next'
import { DISCOVERY, ENDPOINTS, absolute } from '@/lib/site'
import { dataUpdated } from '@/lib/api'

/**
 * One page, plus every machine-readable file. Listing the JSON here is the
 * point: a crawler that only follows HTML sees a single-page app and stops.
 */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${dataUpdated()}T00:00:00Z`)
  return [
    { url: absolute('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    ...ENDPOINTS.map((e) => ({ url: absolute(e.path), lastModified, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...Object.values(DISCOVERY).map((p) => ({ url: absolute(p), lastModified, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
