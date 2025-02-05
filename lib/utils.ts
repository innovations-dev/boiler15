import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "@/env";

/**
 * Merges Tailwind CSS classes with proper order of precedence using clsx and tailwind-merge.
 *
 * @param inputs - Array of class values (strings, objects, or arrays) to be merged
 * @returns Merged and optimized Tailwind CSS class string
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-2 py-1', 'bg-blue-500') // => 'px-2 py-1 bg-blue-500'
 *
 * // With conditional classes
 * cn('px-2', { 'bg-blue-500': isActive, 'bg-gray-500': !isActive })
 *
 * // With dynamic values
 * cn('text-sm md:text-base', className)
 * ```
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates the base URL for the application based on environment configuration.
 * Defaults to localhost:3000 if configuration is invalid.
 *
 * Priority:
 * 1. VERCEL_URL (if deployed on Vercel)
 * 2. NEXT_PUBLIC_APP_URL (from environment)
 * 3. http://localhost:3000 (fallback)
 *
 * @returns URL object representing the application's base URL
 * @example
 * ```tsx
 * // Get the full URL for an API endpoint
 * const apiUrl = new URL('/api/users', baseURL);
 *
 * // Get the origin
 * console.log(baseURL.origin); // e.g., 'https://example.com'
 * ```
 */
export const baseURL = (() => {
  try {
    console.log(env.NEXT_PUBLIC_APP_URL);
    console.log(process.env.VERCEL_URL);
    return new URL(
      process.env.NODE_ENV === "development"
        ? env.NEXT_PUBLIC_APP_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : env.NEXT_PUBLIC_APP_URL
    );
  } catch (error) {
    console.error("Invalid URL configuration:", error);
    return new URL("http://localhost:3000");
  }
})();

/**
 * Converts a string into a URL-friendly slug.
 *
 * Transformations:
 * - Converts to lowercase
 * - Removes leading/trailing whitespace
 * - Normalizes unicode characters
 * - Removes diacritics
 * - Replaces non-alphanumeric characters with hyphens
 * - Removes duplicate hyphens
 * - Removes leading/trailing hyphens
 *
 * @param text - The string to be converted into a slug
 * @returns A URL-friendly slug string
 * @example
 * ```typescript
 * // Basic usage
 * slugify('Hello World!') // => 'hello-world'
 *
 * // With special characters
 * slugify('Café & Restaurant') // => 'cafe-restaurant'
 *
 * // With multiple spaces and special characters
 * slugify('  Web Development -- Best Practices  ') // => 'web-development-best-practices'
 * ```
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFKD") // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
}
