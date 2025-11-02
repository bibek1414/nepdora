import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Pricing | Flexible Plans for Every Need",
  description:
    "Explore Nepdora’s affordable and flexible pricing plans. Choose the perfect plan to build, launch, and grow your online presence with powerful tools and support.",
};

export default function PricingPage() {
  return <PricingSection />;
}
