import { WebsiteAnalyzer } from "@/components/marketing/tools/website-analyzer";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Website Analyzer | Audit Your Site in Nepal | Nepdora";
  const description =
    "Audit your website's SEO, speed, and mobile responsiveness for the Nepalese market. Get actionable insights to beat your local competitors.";
  const url = "https://www.nepdora.com/free-website-analyzer";
  const imageUrl = "https://www.nepdora.com/nepdora-tool-og.jpg"; // Placeholder or use a real tool image if available

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Nepdora",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Nepdora Free Website Analyzer Tool",
        },
      ],
      locale: "en_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

import { JsonLd } from "@/components/shared/json-ld";

const analyzerSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nepdora Website Analyzer",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NPR",
  },
  description:
    "A free tool to audit your website's SEO, speed, and mobile responsiveness for the Nepalese market.",
};

export default function FreeWebsiteAnalyzerPage() {
  return (
    <>
      <JsonLd id="analyzer-schema" data={analyzerSchema} />
      <WebsiteAnalyzer />
    </>
  );
}
