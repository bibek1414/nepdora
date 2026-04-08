import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import OnboardingClient from "./onboarding-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Onboarding",
    pageDescription:
      "Complete your {storeName} setup with our step-by-step onboarding process. Configure your store settings and get started.",
    pageRoute: "/admin/onboarding",
  });
}

export default function OnboardingPage() {
  return <OnboardingClient />;
}
