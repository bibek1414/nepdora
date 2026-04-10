import EsewaPage from "../esewa-integration-guide-in-nepdora/page";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "eSewa Integration Guide for Nepali Websites | Nepdora",
  description: "Step-by-step guide to integrate eSewa payment gateway on your website in Nepal. Native integration, no-code required.",
  path: "/esewa-integration-guide-nepal",
});

export default function LegacyEsewaPage() {
  return (
    <>
      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "eSewa Guide", href: "/esewa-integration-guide-nepal" }]} />
      </div>
      <EsewaPage />
    </>
  );
}
