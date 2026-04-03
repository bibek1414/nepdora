import { Metadata, Viewport } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: "Nepdora — Build, Grow & Showcase Your Digital Presence",
  description:
    "Nepdora helps creators, businesses, and professionals build modern websites, portfolios, and digital brands effortlessly in Nepal and beyond.",
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
    creator: "@nepdora",
  },
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  authors: [{ name: "Nepdora Team" }],
  creator: "Nepdora Pvt. Ltd.",
  publisher: "Nepdora Pvt. Ltd.",
};

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
