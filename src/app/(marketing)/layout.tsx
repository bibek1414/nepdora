import React from "react";
import Header from "@/components/marketing/layout/header";
import Footer from "@/components/marketing/layout/footer";
import { Metadata } from "next";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

// Optional default metadata (can be overridden by individual pages)
export const defaultMetadata: Metadata = {
  title: "Nepdora | Innovative Digital Solutions",
  description:
    "Nepdora provides powerful tools and services to help you create and grow your online presence.",
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
