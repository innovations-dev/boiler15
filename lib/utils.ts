import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseURL = (() => {
  try {
    return new URL(
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : env.NEXT_PUBLIC_APP_URL
    );
  } catch (error) {
    console.error("Invalid URL configuration:", error);
    return new URL("http://localhost:3000");
  }
})();

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
