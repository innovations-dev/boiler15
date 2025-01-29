/**
 * @file Sitemap configuration for Next.js 15+ applications
 * @description Provides configuration options for sitemap generation
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 */

import { baseURL } from "@/lib/utils";

export interface SitemapConfig {
  /** Base URL of your website */
  baseUrl: string;
  /** Maximum number of URLs per sitemap file (Google's limit is 50,000) */
  urlsPerSitemap: number;
  /** Default change frequency for pages without specified frequency */
  defaultChangeFreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /** Default priority for pages without specified priority (0.0 to 1.0) */
  defaultPriority: number;
}

export const sitemapConfig: SitemapConfig = {
  baseUrl: baseURL.toString(),
  urlsPerSitemap: 45000,
  defaultChangeFreq: "weekly",
  defaultPriority: 0.7,
};
