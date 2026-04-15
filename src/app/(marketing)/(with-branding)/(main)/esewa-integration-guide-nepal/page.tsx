import EsewaPage from "../esewa-integration-guide-in-nepdora/page";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title:
    "eSewa Payment Gateway Integration in Nepal | Step-by-Step Guide | Nepdora",
  description:
    "Learn how to integrate eSewa payment gateway into your website in Nepal. Step-by-step guide with no-code setup, secure payments, and fast integration using Nepdora.",
  path: "/esewa-integration-guide-nepal",
});

export default function LegacyEsewaPage() {
  return (
    <>
      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs
          items={[
            { label: "eSewa Guide", href: "/esewa-integration-guide-nepal" },
          ]}
        />
      </div>
      <EsewaPage />
    </>
  );
}
