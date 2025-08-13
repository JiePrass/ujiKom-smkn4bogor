import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "2304", // sesuaikan port backend kamu
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
