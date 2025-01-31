import type { NextConfig } from "next";
import createMDX from "@next/mdx";

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

// Merge MDX config with Next.js config
export default createMDX()(nextConfig);
