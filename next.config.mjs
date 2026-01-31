import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "awesome-shadcn-ui.vercel.app",
          },
        ],
        destination:
          "https://awesome-shadcn-ui.birobirobiro-dev.workers.dev/:path*",
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();