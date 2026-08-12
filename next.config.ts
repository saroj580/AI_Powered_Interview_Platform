import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.84.192.183", "192.0.0.2", "172.31.64.1"],
  // Externalize native/optional deps that don't bundle cleanly
  serverExternalPackages: ["canvas"],
  turbopack: {
    // Ensure Turbopack resolves `next` from this app directory (not a parent folder).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
