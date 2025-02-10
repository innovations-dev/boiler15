import { readdirSync } from "fs";
import { join } from "path";

interface StaticParam {
  slug: string[];
}

/**
 * Recursively get all MDX files from a directory
 */
function getMdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => !dirent.name.startsWith("_"))
    .flatMap((dirent) => {
      const path = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getMdxFiles(path);
      }
      return dirent.name === "page.mdx" ? [path] : [];
    });
}

/**
 * Generate static params for MDX documentation pages
 */
export function generateStaticParams(): StaticParam[] {
  const contentDir = join(process.cwd(), "content/docs");
  return getMdxFiles(contentDir).map((file) => ({
    slug: file.replace(contentDir, "").split("/").filter(Boolean).slice(0, -1),
  }));
}

/**
 * Get all possible doc paths for sitemap generation
 */
export function getAllDocPaths(): string[] {
  return generateStaticParams().map(({ slug }) => `/docs/${slug.join("/")}`);
}
