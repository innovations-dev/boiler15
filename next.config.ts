import type { NextConfig } from "next";

import { env } from "@/env";

const _env = env;

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
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
  experimental: {
    mdxRs: {
      // Enable GitHub Flavored Markdown
      mdxType: "gfm",
    },
  },
};

export default nextConfig;
