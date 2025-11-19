import "./globals.css";
import { DM_Sans, Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CustomerAuthProvider } from "@/contexts/customer/AuthContext";
import { CustomerPublishAuthProvider } from "@/contexts/publish/AuthContext";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { QueryProvider } from "@/providers/query-provider";
import TopLoader from "@/components/top-loader";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalyticsStatic } from "@/components/site-owners/admin/google-analytics/google-analytics-static";
import type { Metadata } from "next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nepdora : Website Builder - Create a Free Website In Minutes",
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
        <AuthProvider>
          <CustomerAuthProvider>
            <CustomerPublishAuthProvider>
              <QueryProvider>
                <TextSelectionProvider>
                  <CartProvider>
                    <Suspense fallback={null}>
                      <TopLoader />
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
            </CustomerPublishAuthProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
