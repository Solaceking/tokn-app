import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Allow Tailscale and other network access in development
  allowedDevOrigins: [
    "100.119.155.13", // Tailscale IP
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
