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
  // Item URLs are derived from the entry name via titleToSlug, so renaming an
  // entry in the README moves its page. These preserve the links published
  // before the Ports section adopted the "Language (project)" naming.
  async redirects() {
    const ports = {
      angular: "angular-spartan",
      forui: "flutter-forui",
      flutter: "flutter-shadcnui",
      jollyui: "react-aria-jolly-ui",
      kotlin: "kotlin-shadcn-kotlin",
      "mkdocs-shadcn": "mkdocs-mkdocs-shadcn",
      "phoenix-liveview": "phoenix-liveview-saladui",
      "react-native": "react-native-nativecn-ui",
      "react-native-recommended": "react-native-react-native-reusables",
      ruby: "ruby-shadcn-rails",
      "rust-egui": "rust-ouroboros-ui",
      solid: "solid-shadcn-solid",
      svelte: "svelte-shadcn-svelte",
      swift: "swift-swiftcn-ui",
      "sysinfocus-simpleui": "blazor-simpleui",
      "tetra-ui": "react-native-tetra-ui",
      vue: "vue-shadcn-vue",
    };

    return Object.entries(ports).map(([from, to]) => ({
      source: `/categories/ports/${from}`,
      destination: `/categories/ports/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
