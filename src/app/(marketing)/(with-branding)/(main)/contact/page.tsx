import ContactSection from "@/components/marketing/contact-us/contact-us";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Contact Nepdora – Website Builder Support in Nepal",
  description:
    "Contact Nepdora for website builder support in Nepal. Get help with ecommerce, payments (eSewa & Khalti), and building your website. سریع response via chat, email, or phone.",
  path: "/contact",
  keywords: [
    "contact Nepdora",
    "Nepdora support Nepal",
    "website builder support Nepal",
    "ecommerce support Nepal",
    "website help Nepal",
    "Nepal website builder contact",
    "customer support Nepal software",
  ],
});

import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import FAQPage from "../faq/page";
import FAQSection from "@/components/marketing/faq-section/faq-section";

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

      <ContactSection />
      <FAQSection />
    </>
  );
}
