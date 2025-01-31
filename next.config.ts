import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import { env } from "@/env";

const _env = env;

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include MDX files only (removing plain md)
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  // Add experimental mdxRs for better performance
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX({
  options: {
    // Enable source maps in development
    jsx: true,
    // Optionally, add any remark or rehype plugins here
    // but keep it minimal as plugins can impact performance
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
