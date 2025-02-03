/**
 * @file Sitemap generation for Next.js 15+ applications
 * @description Generates dynamic and static sitemaps following Next.js conventions
 *
 * @example
 * // Basic static route configuration
 * const routes = [
 *   {
 *     url: '/',
 *     lastModified: new Date(),
 *     changeFrequency: 'daily',
 *     priority: 1
 *   }
 * ];
 *
 * @example
 * // Dynamic route generation with database
 * const products = await db.product.findMany({
 *   select: { id: true, updatedAt: true }
 * });
 *
 * const dynamicRoutes = products.map(product => ({
 *   url: `/products/${product.id}`,
 *   lastModified: product.updatedAt,
 *   changeFrequency: 'weekly',
 *   priority: 0.7
 * }));
 *
 * @useCase
 * 1. Static Pages: Homepage, About, Contact pages
 * 2. Dynamic Product Pages: E-commerce product listings
 * 3. Blog Posts: Dynamic blog article pages
 * 4. User Profiles: Public user profile pages
 *
 * @configuration
 * Configure defaults in config/sitemap.config.ts:
 * - defaultChangeFreq: Default change frequency for routes
 * - defaultPriority: Default priority for routes
 * - urlsPerSitemap: Number of URLs per sitemap segment
 *
 * @performance
 * For large sites (>50,000 URLs):
 * - Enable sitemap segmentation via generateSitemaps()
 * - Adjust urlsPerSitemap in config based on URL complexity
 * - Implement database pagination for dynamic routes
 */

import { MetadataRoute } from "next";

import { sitemapConfig } from "@/config/sitemap.config";
import { baseURL } from "@/lib/utils";

/**
 * @interface RouteConfig
 * @description Configuration for individual sitemap routes
 * @property {string} url - The route path (e.g., '/about')
 * @property {Date} lastModified - Last modification date
 * @property {string} [changeFrequency] - How frequently the page changes
 * @property {number} [priority] - Priority of this URL relative to other URLs (0.0 to 1.0)
 */

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
 * @function generateSitemaps
 * @description Generates sitemap index for large sites requiring multiple sitemap files
 * @returns {Promise<Array<{id: number}>>} Array of sitemap segment identifiers
 *
 * @example
 * // Enable sitemap segmentation for large sites
 * export async function generateSitemaps() {
 *   const totalProducts = await db.product.count();
 *   const totalSitemaps = Math.ceil(totalProducts / sitemapConfig.urlsPerSitemap);
 *   return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }));
 * }
 */

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
 * @function sitemap
 * @description Generates sitemap entries for a specific segment
 * @param {Object} params - Sitemap parameters
 * @param {number} params.id - Sitemap segment ID
 * @returns {Promise<MetadataRoute.Sitemap>} Generated sitemap entries
 *
 * @example
 * // Generate sitemap for dynamic product pages
 * const products = await db.product.findMany({
 *   skip: id * sitemapConfig.urlsPerSitemap,
 *   take: sitemapConfig.urlsPerSitemap,
 *   select: { id: true, updatedAt: true }
 * });
 *
 * return [
 *   ...routes,
 *   ...products.map(product => ({
 *     url: `${baseURL}/products/${product.id}`,
 *     lastModified: product.updatedAt,
 *     changeFrequency: 'weekly',
 *     priority: 0.7
 *   }))
 * ];
 */

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
