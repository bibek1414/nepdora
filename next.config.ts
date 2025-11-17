import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development practices
  reactStrictMode: true,

  // Image optimization settings
  images: {
    // Image formats
    formats: ["image/avif", "image/webp"],

    // SVG support
    dangerouslyAllowSVG: true,

    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.nepdora.baliyoventures.com",
      },
      {
        protocol: "https",
        hostname: "*.nepdora.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "*.nepdora.baliyoventures.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tailwindcss.com",
      },
    ],
  },
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

  // Production source maps (disable for faster builds)
  productionBrowserSourceMaps: false,

  // Output configuration
  output: "standalone",

  // PoweredBy header (remove for security)
  poweredByHeader: false,
};

export default nextConfig;
