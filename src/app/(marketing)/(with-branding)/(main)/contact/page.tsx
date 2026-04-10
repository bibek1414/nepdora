import ContactSection from "@/components/marketing/contact-us/contact-us";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Contact Nepdora: Get Web Development & E-commerce Support",
  description:
    "Need help? Contact the Nepdora team via phone, email, or live chat. Get quick answers about website, e-commerce, and social media solutions.",
  path: "/contact",
  keywords: [
    "Nepdora contact",
    "web development Nepal",
    "ecommerce support",
    "website help",
    "digital marketing Nepal",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Nepdora",
  description:
    "Get in touch with the Nepdora team for web development and e-commerce support in Nepal.",
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    telephone: "+977 986-6316114",
    email: "support@nepdora.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kathmandu, Nepal",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl(),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact",
      item: absoluteUrl("/contact"),
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <JsonLd id="contact-schema" data={contactSchema} />
      <JsonLd id="contact-breadcrumb" data={breadcrumbSchema} />
      <div className="container mx-auto max-w-6xl px-6 pt-4">
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      </div>
      <ContactSection />
    </>
  );
}
