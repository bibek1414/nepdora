import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Build Free E-Commerce Website in Nepal With Nepdora",
  description:
    "Start your online store in Nepal today. E-Commerce system with order management, inventory and payment gateway integration with Nepdora. Start Free!",
  keywords: [
    "ecommerce website Nepal",
    "online store Nepal",
    "Nepdora ecommerce",
    "sell online Nepal",
    "website builder features",
    "ecommerce tools",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/ecommerce-website",
  },
  openGraph: {
    title: "Build Free E-Commerce Website in Nepal With Nepdora",
    description:
      "Start your online store in Nepal today. E-Commerce system with order management, inventory and payment gateway integration with Nepdora. Start Free!",
    url: "https://www.nepdora.com/ecommerce-website",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Build Free E-Commerce Website in Nepal",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Free E-Commerce Website in Nepal With Nepdora",
    description:
      "Start your online store in Nepal today. E-Commerce system with order management, inventory and payment gateway integration with Nepdora.",
    images: ["/nepdora-image.jpg"],
  },
};

const ecommerceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora E-commerce Website Builder",
  description:
    "A comprehensive e-commerce platform for businesses in Nepal to start selling online with integrated payments and inventory management.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: "https://www.nepdora.com",
  },
  areaServed: "NP",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "E-commerce Features",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Order Management",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Inventory System",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Payment Gateway Integration",
        },
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd id="ecommerce-schema" data={ecommerceSchema} />
      <CitiesLandingPage category="ecommerce" city="nepal" />
    </>
  );
}
