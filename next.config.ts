import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.84.192.183", "192.0.0.2"],
  // Externalize native/optional deps that don't bundle cleanly
  serverExternalPackages: ["canvas", "pdf-parse"],
  turbopack: {},
};

export default nextConfig;
