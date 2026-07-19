import type { NextConfig } from "next";

const gatewayURL = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: gatewayURL,
      },
    ],
  },
};

export default nextConfig;
