import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/simulations", destination: "/vibecoded", permanent: true },
      { source: "/simulations/:path*", destination: "/vibecoded/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
