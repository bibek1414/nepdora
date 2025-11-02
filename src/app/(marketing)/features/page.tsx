import FeaturesSection from "@/components/marketing/features-section/features-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Features | Powerful Tools to Build and Grow",
  description:
    "Discover Nepdoras powerful features designed to help you create, manage, and scale your online presence with ease and flexibility.",
};

export default function FeaturesPage() {
  return <FeaturesSection />;
}
