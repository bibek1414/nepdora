import { Metadata, Viewport } from "next";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

import { buildMarketingMetadata } from "@/lib/seo";

// ✅ Metadata for SEO
export const metadata = buildMarketingMetadata({
  title: "Nepdora — Build, Grow & Showcase Your Digital Presence",
  description:
    "Nepdora helps creators, businesses, and professionals build modern websites, portfolios, and digital brands effortlessly in Nepal and beyond.",
  path: "/",
  keywords: [
    "Nepdora",
    "Website Builder Nepal",
    "Digital Platform Nepal",
    "Portfolio Builder",
    "Website Templates Nepal",
  ],
});

// ✅ Viewport configuration
export const viewport: Viewport = {
  initialScale: 1.0,
  width: "device-width",
  themeColor: "#ffffff",
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <main className="flex-1">{children}</main>
    </div>
  );
}
