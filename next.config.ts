import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Only redirect the exact /simulations page. Don't catch
      // /simulations/:path* — public/simulations/* (FST Explorer's
      // fractal-seed.html + fst-preview.mp4) lives there as static files.
      { source: "/simulations", destination: "/vibecoded", permanent: true },
    ];
  },
};

export default nextConfig;
