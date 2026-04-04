import SupportHeader from "@/components/site-owners/admin/support/support-header";
import SupportFAQ from "@/components/site-owners/admin/support/support-faq";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora Support | Help Center & FAQs",
  description:
    "Get help with Nepdora. Visit our Support Center to find answers to common questions, explore FAQs, and contact our team for personalized assistance.",
  path: "/support",
  keywords: [
    "Nepdora support",
    "help center",
    "website FAQ",
    "ecommerce help",
    "customer support Nepal",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";

const supportSchema = {
  "@context": "https://schema.org",
  "@type": "HelpPage",
  name: "Nepdora Support Center",
  description:
    "Find answers to common questions about web development, e-commerce, and digital marketing in Nepal.",
  mainEntity: {
    "@type": "FAQPage",
    name: "Frequently Asked Questions",
  },
};

export default function SupportPage() {
  return (
    <>
      <JsonLd id="support-schema" data={supportSchema} />
      <SupportHeader />
      <div className="mx-auto max-w-6xl">
        <SupportFAQ />
      </div>
    </>
  );
}
