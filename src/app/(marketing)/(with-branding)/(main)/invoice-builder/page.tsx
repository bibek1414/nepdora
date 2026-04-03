import { InvoiceBuilder } from "@/components/marketing/tools/invoice-builder";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Professional Invoice Builder for Nepal | Free & Instant | Nepdora";
  const description =
    "Create and download professional invoices for your business in Nepal instantly. Free invoice templates for freelancers, agencies, and small businesses.";
  const url = absoluteUrl("/invoice-builder");
  const imageUrl = DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Nepdora Professional Invoice Builder",
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
    metadataBase: new URL(absoluteUrl()),
  };
}

export default function InvoiceBuilderPage() {
  return <InvoiceBuilder />;
}
