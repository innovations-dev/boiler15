import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// import remarkFrontmatter from "remark-frontmatter";
// import remarkMdxFrontmatter from "remark-mdx-frontmatter";

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
    mdxRs: true,
  },
};

// Remove the options object completely since it's causing serialization issues
const withMDX = createMDX();

export default withMDX(nextConfig);
