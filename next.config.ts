import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow Tailscale and other network access in development
  allowedDevOrigins: [
    "100.119.155.13", // Tailscale IP
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
