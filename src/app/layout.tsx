import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CustomerAuthProvider } from "@/contexts/customer/AuthContext";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { QueryProvider } from "@/providers/query-provider";
import NextTopLoader from "nextjs-toploader";

import { Suspense } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalyticsStatic } from "@/components/site-owners/admin/google-analytics/google-analytics-static";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nepdora : Website Builder - Create a Free Website In Minutes",
  icons: {
    icon: "https://nepdora.com/favicon.ico",
    shortcut: "https://nepdora.com/favicon-16x16.png",
    apple: "https://nepdora.com/apple-touch-icon.png",
  },
  description:
    "Launch your business online quickly with our free website builder, free hosting, and a comprehensive suite of essential business tools. Start now!",
  openGraph: {
    title: "Nepdora : Website Builder - Create a Free Website In Minutes",
    description:
      "Launch your business online quickly with our free website builder, free hosting, and a comprehensive suite of essential business tools. Start now!",
    url: "https://nepdora.com",
    siteName: "Nepdora",
    images: [
      {
        url: "https://nepdora.com/og-image.png",
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
    images: ["https://nepdora.com/twitter-image.png"],
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
        <GoogleAnalyticsStatic measurementId="G-1GZLGXVXWT" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CustomerAuthProvider>
              <QueryProvider>
                <TextSelectionProvider>
                  <CartProvider>
                    <NextTopLoader color="#4b74f5" height={3} />

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
