import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /** Local files in /public are optimized by default (unoptimized defaults to false). */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.espncdn.com", pathname: "/**" },
      { protocol: "https", hostname: "**.nfl.com", pathname: "/**" },
      { protocol: "https", hostname: "**.nbcsports.com", pathname: "/**" },
      { protocol: "https", hostname: "**.bleacherreport.com", pathname: "/**" },
      { protocol: "https", hostname: "a.espncdn.com", pathname: "/**" },
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "preview.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "**.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "i.redd.it", pathname: "/**" },
      { protocol: "https", hostname: "www.pro-football-reference.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
