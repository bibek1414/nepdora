import React from "react";
import Header from "@/components/marketing/layout/header";
import Footer from "@/components/marketing/layout/footer";
import { Metadata, Viewport } from "next";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: "Nepdora — Build, Grow & Showcase Your Digital Presence",
  description:
    "Nepdora helps creators, businesses, and professionals build modern websites, portfolios, and digital brands effortlessly in Nepal and beyond.",
  keywords: [
    "Nepdora",
    "Website Builder Nepal",
    "Digital Platform Nepal",
    "Portfolio Builder",
    "Website Templates Nepal",
  ],
  openGraph: {
    title: "Nepdora — Innovative Digital Solutions for Everyone",
    description:
      "Create your website, grow your brand, and go digital with Nepdora. Build your online presence with powerful tools and AI-driven design.",
    url: "https://nepdora.com",
    siteName: "Nepdora",
    images: [
      {
        url: "https://nepdora.com/nepdora-logoo.svg",
        width: 1200,
        height: 630,
        alt: "Nepdora — Digital Solutions",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora — Build Your Online Presence",
    description:
      "Nepdora empowers you to build websites, grow your digital business, and go live fast.",
    images: ["https://nepdora.com/nepdora-logoo.svg"],
    creator: "@nepdora",
  },
  icons: {
    icon: "https://nepdora.com/favicon.ico",
    shortcut: "https://nepdora.com/favicon-16x16.png",
    apple: "https://nepdora.com/apple-touch-icon.png",
  },
  authors: [{ name: "Nepdora Team" }],
  creator: "Nepdora Pvt. Ltd.",
  publisher: "Nepdora Pvt. Ltd.",
};

// ✅ Viewport configuration
export const viewport: Viewport = {
  initialScale: 1.0,
  width: "device-width",
  height: "device-height",
  minimumScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
