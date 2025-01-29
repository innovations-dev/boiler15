/**
 * @file Metadata configuration for Next.js 15+ applications
 * @description Provides type-safe metadata generation following Next.js metadata API conventions
 *
 * Usage:
 * 1. Static pages:
 * ```tsx
 * export const metadata = generateMetadata({
 *   title: 'Page Title',
 *   description: 'Page description'
 * })
 * ```
 *
 * 2. Dynamic pages:
 * ```tsx
 * export async function generateMetadata(
 *   { params, searchParams }: MetaProps,
 *   parent: ResolvingMetadata
 * ) {
 *   return generateMetadata({ params, searchParams }, parent)
 * }
 * ```
 */

import { Metadata, ResolvingMetadata } from "next";
import { Robots } from "next/dist/lib/metadata/types/metadata-types";

// import { env } from "@/env.mjs"; // @TODO: update with t3oss
import { baseURL } from "@/lib/utils";

/**
 * @interface MetaProps
 * @description Type definition for metadata generation props
 */
interface MetaProps {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * @interface MetaConfig
 * @description Base configuration interface for site metadata
 */
interface MetaConfig {
  default: Metadata;
  templateTitle: string;
  // openGraph: Metadata["openGraph"];
  // twitter: Metadata["twitter"];
  // robots: Robots;
}

/**
 * @const siteConfig
 * @description Base site configuration for metadata
 */
export const siteConfig: MetaConfig = {
  default: {
    title: {
      default: "Your Site Name",
      template: "%s | Your Site Name",
    },
    description:
      "Your site description goes here - keep it between 150-160 characters for optimal SEO",
    keywords: ["keyword1", "keyword2", "keyword3"],
    authors: [
      {
        name: "Your Name",
        url: baseURL.toString(),
      },
    ],
    creator: "Your Name",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseURL.toString(),
      siteName: "Your Site Name",
      images: [
        {
          url: "/og-default.webp",
          width: 1200,
          height: 630,
          alt: "Your Site Name",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Your Site Name",
      creator: "@yourhandle",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  },
  templateTitle: "%s | Your Site Name",
};

/**
 * @function generateMetadata
 * @description Generates metadata for Next.js pages following the App Router conventions
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 *
 * @param {Object} options - Metadata generation options
 * @param {string} [options.title] - Page title
 * @param {string} [options.description] - Page description
 * @param {string} [options.image] - OG image URL
 * @param {boolean} [options.noIndex] - Whether to prevent indexing
 * @param {MetaProps['params']} [options.params] - Route parameters
 * @param {MetaProps['searchParams']} [options.searchParams] - Search parameters
 * @param {ResolvingMetadata} [parent] - Parent metadata for inheritance
 *
 * @returns {Promise<Metadata>} Generated metadata object
 */
export async function generateMetadata(
  {
    title,
    description,
    image,
    noIndex = false,
    path,
    // params = {},
    // searchParams = {},
  }: {
    title?: string | (() => Promise<string>);
    description?: string | (() => Promise<string>);
    image?: string;
    noIndex?: boolean;
    path?: string;
    params?: MetaProps["params"];
    searchParams?: MetaProps["searchParams"];
  } = {},
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  // Resolve dynamic values
  const resolvedTitle = typeof title === "function" ? await title() : title;
  const resolvedDescription =
    typeof description === "function" ? await description() : description;

  const ogImageUrl = image ? null : new URL(`${baseURL.toString()}/api/og`);

  if (ogImageUrl) {
    ogImageUrl.searchParams.set(
      "title",
      resolvedTitle ?? (siteConfig.default.title as string) ?? "",
    );
    ogImageUrl.searchParams.set(
      "description",
      resolvedDescription ?? siteConfig.default.description ?? "",
    );
  }
  // Resolve parent metadata if provided
  const previousImages = (parent && (await parent).openGraph?.images) || [];

  return {
    ...siteConfig.default,
    title: resolvedTitle ?? siteConfig.default.title,
    description: resolvedDescription ?? siteConfig.default.description,

    // Enhanced robots handling
    robots: {
      ...(siteConfig.default.robots as Robots),
      index: !noIndex,
      follow: !noIndex,
      nocache: process.env.NODE_ENV !== "production",
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    // Enhanced OpenGraph with parent image inheritance
    openGraph: {
      ...siteConfig.default.openGraph,
      title: resolvedTitle ?? siteConfig.default.openGraph?.title,
      description:
        resolvedDescription ?? siteConfig.default.openGraph?.description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt:
                resolvedTitle ?? siteConfig.default.openGraph?.siteName ?? "",
            },
            ...previousImages,
          ]
        : ogImageUrl
          ? [
              {
                url: ogImageUrl.toString(),
                width: 1200,
                height: 630,
                alt:
                  resolvedTitle ?? siteConfig.default.openGraph?.siteName ?? "",
              },
              ...previousImages,
            ]
          : previousImages.length
            ? previousImages
            : siteConfig.default.openGraph?.images,

      // Additional recommended OG properties
      locale: siteConfig.default.openGraph?.locale ?? "en_US",
      siteName: siteConfig.default.openGraph?.siteName ?? "Your Site Name",
    },

    // Enhanced verification handling
    verification: {
      ...siteConfig.default.verification,
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },

    // Enhanced alternates handling
    alternates: {
      ...siteConfig.default.alternates,
      canonical: path
        ? new URL(path, baseURL.toString()).toString()
        : baseURL.toString(),
    },
  };
}
