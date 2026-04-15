import SupportHeader from "@/components/site-owners/admin/support/support-header";
import SupportFAQ from "@/components/site-owners/admin/support/support-faq";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora Support Center | Help, FAQs & Customer Support Nepal",
  description:
    "Get help with Nepdora website builder. Find answers in FAQs, learn how to use features, fix issues, and contact our support team for quick assistance in Nepal.",
  path: "/support",
  keywords: [
    "Nepdora support",
    "Nepdora help center",
    "website builder support Nepal",
    "Nepal customer support software",
    "website FAQ Nepal",
    "ecommerce support Nepal",
    "how to use Nepdora",
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
