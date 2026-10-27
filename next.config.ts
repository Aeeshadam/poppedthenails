import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // A gallery upload sends one photo in two sizes (up to 3.5 MB together).
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default nextConfig;
