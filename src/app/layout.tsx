import "./globals.css";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CustomerAuthProvider } from "@/contexts/customer/AuthContext";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { QueryProvider } from "@/providers/query-provider";
import SmartTopLoader from "@/components/smart-top-loader";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalyticsStatic } from "@/components/site-owners/admin/google-analytics/google-analytics-static";
import { SchemaOrg } from "@/components/shared/schema-org";
import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nepdora : Website Builder - Create a Free Website In Minutes",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  description:
    "Launch your business online quickly with our free website builder, free hosting, and a comprehensive suite of essential business tools. Start now!",
  openGraph: {
    title: "Nepdora : Website Builder - Create a Free Website In Minutes",
    description:
      "Launch your business online quickly with our free website builder, free hosting, and a comprehensive suite of essential business tools. Start now!",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora - Free Website Builder",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepdora : Website Builder - Create a Free Website In Minutes",
    description:
      "Launch your business online quickly with our free website builder, free hosting, and a comprehensive suite of essential business tools. Start now!",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalyticsStatic />
        <SchemaOrg />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CustomerAuthProvider>
              <QueryProvider>
                <TextSelectionProvider>
                  <CartProvider>
                    <Suspense fallback={null}>
                      <SmartTopLoader />
                    </Suspense>
                    {children}
                    <Analytics />
                    <Toaster
                      position="bottom-right"
                      richColors
                      closeButton
                      duration={3000}
                    />
                  </CartProvider>
                </TextSelectionProvider>
              </QueryProvider>
            </CustomerAuthProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
