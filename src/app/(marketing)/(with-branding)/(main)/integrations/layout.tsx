import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Integration Marketplace | Connect Your Favorite Tools | Nepdora",
  description:
    "Connect eSewa, Khalti, ConnectIPS, Dash Logistics, and other Nepali tools with your Nepdora website. Automate your payments, deliveries, and marketing effortlessly.",
  path: "/integrations",
  ogLabel: "Integration Hub",
});

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
