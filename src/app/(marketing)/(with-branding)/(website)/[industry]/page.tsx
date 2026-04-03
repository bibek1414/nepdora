import { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { JsonLd } from "@/components/shared/json-ld";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return industries.map(industry => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  if (!industries.includes(industry)) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  
  // SEO Blueprint Logic
  const isBooking = ["booking", "travel", "tours", "medical", "clinic", "dental", "education"].some(s => industry.toLowerCase().includes(s));
  const action = isBooking ? "Create" : "Build";
  const niche = industryLabel;
  const valueProp = isBooking ? "(Fast Setup)" : "(Start Selling Today)";
  
  const title = `${action} a ${niche} Website in Nepal ${valueProp} | Nepdora`;
  const description = `Launch your professional ${niche.toLowerCase()} website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from Nepdora.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.nepdora.com/${industry}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.nepdora.com/${industry}`,
      siteName: "Nepdora",
      images: [
        {
          url: "/nepdora-image.jpg",
          width: 1200,
          height: 630,
          alt: `Nepdora - ${niche} Website Builder`,
        },
      ],
      locale: "en_NP",
      type: "website",
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;
  if (!industries.includes(industry)) {
    notFound();
  }
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Nepdora ${industryLabel} Website Builder`,
    description: `Professional website building solutions for ${industryLabel.toLowerCase()}s in Nepal.`,
    provider: {
      "@type": "Organization",
      name: "Nepdora",
      url: "https://www.nepdora.com",
    },
  };

  return (
    <>
      <JsonLd id="industry-schema" data={schema} />
      <CitiesLandingPage category={industry} city="nepal" />
    </>
  );
}
