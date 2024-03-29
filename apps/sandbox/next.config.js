// @ts-check
//const { PrismaPlugin } = require('experimental-prisma-webpack-plugin')

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
/**
 * @note(pnpm) pass ENV variable to determine if we should transpile
 *            ./src  == transpile
 *            ./dist != transpile
 */

const transpilePackages = ["@oxygen/design-system"];

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
    // @ts-ignore
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  },
});

const protocol = "https";

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: "",
  cleanDistDir: true,
  compress: true,
  // crossOrigin: 'same-origin',
  devIndicators: { buildActivity: true, buildActivityPosition: "bottom-right" },
  distDir: "./.next",
  // env,
  eslint: {
    // @note(eslint) handled outside of next
    ignoreDuringBuilds: true,
  },
  excludeDefaultMomentLocales: true,
  experimental: {
    appDir: false,
    legacyBrowsers: false,
    //esmExternals: "loose",
    //outputFileTracingRoot: path.join(__dirname, "../..")
  },
  transpilePackages,
  httpAgentOptions: {
    keepAlive: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    deviceSizes: [743, 744, 1127, 1128, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      "**.amazonws.com",
      "**.example.com",
      "**.googleapis.com",
      "**.zorores.com",
      "**.cloudfront.net",
      "**.thetvdb.com",
    ],
    remotePatterns: [
      {
        protocol,
        hostname: `**.${
          process.env.NEXT_PUBLIC_SITE ?? process.env.VERCEL_URL ?? ""
        }`,
      },
      // @note(remotePattern) Zoro
      {
        protocol,
        hostname: `**.zorores.com`,
      },
      // @note(remotePattern) Google Apis
      {
        protocol,
        hostname: `**.googleapis.com`,
      },
      // @note(remotePattern) Future proofing "other" websites
      {
        protocol,
        hostname: `**.example.com`,
      },
      // @note(remotePattern) AWS
      {
        protocol,
        hostname: `**.amazonaws.com`,
      },
      // @note(remotePattern) Twitter
      {
        protocol,
        hostname: `pbs.twimg.com`,
      },
      // @note(remotePattern) Unsplash
      {
        protocol,
        hostname: `images.unsplash.com`,
      },
      // @note(remotePattern) Picsum
      {
        protocol,
        hostname: `picsum.photos`,
      },
      // @note(remotePattern) Cloudfront
      {
        protocol,
        hostname: `**.cloudfront.net`,
      },
      // @note(remotePattern) TheTVDB
      {
        protocol,
        hostname: `**.thetvdb.com`,
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 18144000, // 1 month
  },
  optimizeFonts: true,
  outputFileTracing: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  typescript: {
    // @note(typescript) handled outside of next
    ignoreBuildErrors: true,
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.plugins = [...config.plugins, new PrismaPlugin()]
  //   }

  //   return config
  // },
};

/**
 * @note
 * Plugins cannot handle their own Configuration at this time.
 */
const plugins = [withBundleAnalyzer, withMDX];
module.exports = plugins.reduce((config, plugin) => plugin(config), nextConfig);
