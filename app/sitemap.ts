/**
 * @file Sitemap generation for Next.js 15+ applications
 * @description Generates dynamic and static sitemaps following Next.js conventions
 *
 * Usage:
 * 1. Static routes:
 * ```ts
 * // Add to routes array
 * {
 *   url: '/about',
 *   lastModified: new Date(),
 *   changeFrequency: 'monthly',
 *   priority: 0.8
 * }
 * ```
 *
 * 2. Dynamic routes:
 * ```ts
 * // Uncomment and modify database queries
 * const products = await db.product.findMany({...})
 * ```
 */

import { MetadataRoute } from "next";

import { sitemapConfig } from "@/config/sitemap.config";
import { baseURL } from "@/lib/utils";

interface RouteConfig {
  url: string;
  lastModified: Date;
  changeFrequency?: typeof sitemapConfig.defaultChangeFreq;
  priority?: number;
}

const routes: RouteConfig[] = [
  {
    url: "/",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/about",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

/**
 * Generates sitemap index for large sites
 * @returns Array of sitemap segments
 */
export async function generateSitemaps() {
  // For dynamic routes, fetch total count from your database
  // const totalProducts = await db.product.count();
  // const totalSitemaps = Math.ceil(totalProducts / sitemapConfig.urlsPerSitemap);

  return [{ id: 0 }];
}

/**
 * Generates sitemap for a specific segment
 * @param {Object} params - Sitemap parameters
 * @param {number} params.id - Sitemap segment ID
 * @returns {Promise<MetadataRoute.Sitemap>} Generated sitemap
 */
export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  console.log("sitemap: id", id);
  // For dynamic routes:
  // const start = id * sitemapConfig.urlsPerSitemap;
  // const end = start + sitemapConfig.urlsPerSitemap;

  // const products = await db.product.findMany({
  //   skip: start,
  //   take: end - start,
  //   select: { id: true, updatedAt: true },
  // });

  return routes.map((route) => ({
    url: `${baseURL.toString()}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency ?? sitemapConfig.defaultChangeFreq,
    priority: route.priority ?? sitemapConfig.defaultPriority,
  }));
}
