import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "bibek.nepdora.baliyoventures.com",
      },
      {
        protocol: "https",
        hostname: "nepdora.baliyoventures.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
