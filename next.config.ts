import type { NextConfig } from "next";

import { env } from "@/env";

const _env = env;

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  outputFileTracingIncludes: {
    "/**/*": ["./content/*.mdx"],
  },
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
      mdxType: "gfm",
    },
    turbo: {
      rules: {
        // Support import .svg as react components in dev builds
        "*.react.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack(config) {
    // Find the existing .svg rule used by Next.js and exclude .react.svg files
    const existingSvgRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    );
    existingSvgRule.exclude = /\.react\.svg$/i;

    // Support import .svg as react components in production builds
    config.module.rules.push({
      test: /\.react\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Disable CSS minification
    config.optimization.minimizer = config.optimization.minimizer.filter(
      (fn: any) => {
        return !fn.toString().includes("CssMinimizerPlugin");
      }
    );

    return config;
  },
};
const withMDX = require("@next/mdx")();
export default withMDX(nextConfig);
