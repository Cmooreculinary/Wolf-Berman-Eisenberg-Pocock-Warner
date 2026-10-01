import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * The dataset is published to be read, by people and by agents alike, so there
 * is nothing here to disallow. The sitemap and llms.txt lines are the useful
 * part: they point a crawler at the JSON instead of leaving it to scrape a
 * client-rendered shell.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
