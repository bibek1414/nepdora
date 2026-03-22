import ContactSection from "@/components/marketing/contact-us/contact-us";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Nepdora: Get Web Development & E-commerce Support",
  description:
    "Need help? Contact the Nepdora team via phone, email, or live chat. Get quick answers about website, e-commerce, and social media solutions.",
  alternates: {
    canonical: "https://www.nepdora.com/contact",
  },
  keywords: [
    "Nepdora contact",
    "web development Nepal",
    "ecommerce support",
    "website help",
    "digital marketing Nepal",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Contact Nepdora: Get Web Development & E-commerce Support",
    description:
      "Need help? Contact the Nepdora team via phone, email, or live chat. Get quick answers about website, e-commerce, and social media solutions.",
    url: "https://www.nepdora.com/contact",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.jpg",
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
    images: ["https://www.nepdora.com/nepdora-image.jpg"],
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
    name: "Nepdora",
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
