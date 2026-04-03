import ContactSection from "@/components/marketing/contact-us/contact-us";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Nepdora: Get Web Development & E-commerce Support",
  description:
    "Need help? Contact the Nepdora team via phone, email, or live chat. Get quick answers about website, e-commerce, and social media solutions.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  keywords: [
    "Nepdora contact",
    "web development Nepal",
    "ecommerce support",
    "website help",
    "digital marketing Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL(absoluteUrl()),
  openGraph: {
    title: "Contact Nepdora: Get Web Development & E-commerce Support",
    description:
      "Need help? Contact the Nepdora team via phone, email, or live chat. Get quick answers about website, e-commerce, and social media solutions.",
    url: absoluteUrl("/contact"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Contact the Nepdora support team",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Nepdora: Get Web Development & E-commerce Support",
    description:
      "Need help? Contact the Nepdora team via phone, email, or live chat for quick support.",
    images: [DEFAULT_OG_IMAGE],
  },
};

import { JsonLd } from "@/components/shared/json-ld";

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

export default function ContactPage() {
  return (
    <>
      <JsonLd id="contact-schema" data={contactSchema} />
      <ContactSection />
    </>
  );
}
