import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pluckr/design-system", "@pluckr/supabase"]
};

export default nextConfig;
