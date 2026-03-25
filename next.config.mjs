/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
