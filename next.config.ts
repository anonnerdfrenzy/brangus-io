import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Only redirect the exact /simulations page. Don't catch
      // /simulations/:path* — public/simulations/* (FST Explorer's
      // fractal-seed.html + fst-preview.mp4) lives there as static files.
      { source: "/simulations", destination: "/vibecoded", permanent: true },
      // Pulse Crawler (the browser game, its own Vercel project) lives at /pulse-crawler. Its page loads its files by
      // relative paths, so it is served from /pulse-crawler/index.html (a trailing-slash URL would be stripped by Next).
      { source: "/pulse-crawler", destination: "/pulse-crawler/index.html", permanent: false },
    ];
  },
  async rewrites() {
    return [
      // Everything under /pulse-crawler/ comes from the game's own deployment (its files and its feedback function).
      { source: "/pulse-crawler/:path*", destination: "https://pulse-crawler.vercel.app/:path*" },
    ];
  },
};

export default nextConfig;
