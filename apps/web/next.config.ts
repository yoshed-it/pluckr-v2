import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pluckr/app-core",
    "@pluckr/design-system",
    "@pluckr/supabase"
  ],
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web"
    }
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "react-native$": "react-native-web"
    };

    return config;
  }
};

export default nextConfig;
