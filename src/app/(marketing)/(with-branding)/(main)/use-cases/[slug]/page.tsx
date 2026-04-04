import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

const USE_CASES = [
  "website-for-small-business",
  "website-for-freelancers",
  "sell-products-online-nepal",
  "start-online-business-nepal",
];

export async function generateStaticParams() {
  return USE_CASES.map(slug => ({ slug }));
}

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!USE_CASES.includes(slug)) {
    notFound();
  }
  const title = capitalizeWords(slug.replace(/-/g, " "));
  const description = `Discover how Nepdora helps with ${slug.replace(/-/g, " ")}. The best website builder for Nepali entrepreneurs and businesses.`;

  return buildMarketingMetadata({
    title: `${title} | Professional Solutions for Nepal`,
    description,
    path: `/use-cases/${slug}`,
  });
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  if (!USE_CASES.includes(slug)) {
    notFound();
  }
  const title = capitalizeWords(slug.replace(/-/g, " "));
  const url = absoluteUrl(`/use-cases/${slug}`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    areaServed: {
      "@type": "Country",
      name: "Nepal",
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
        name: "Use Cases",
        item: absoluteUrl("/features"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  return (
    <main>
      <JsonLd id="use-case-schema" data={schema} />
      <JsonLd id="use-case-breadcrumb-schema" data={breadcrumbSchema} />
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h1 className="mb-8 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-600">
            Whether you are a solo freelancer or a growing small business in
            Nepal, Nepdora provides the perfect set of tools to achieve your
            goals online. Focus on your passion, while we handle the pixels.
          </p>
          <Link
            href="/create-website"
            className="bg-primary hover:bg-primary/90 inline-block rounded-full px-10 py-5 text-lg font-bold text-white transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      <FeaturesSection />

      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Specifically Designed for Your Success
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-10 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-4 text-xl font-bold">Local Payment Gateway</h3>
              <p className="text-slate-600">
                Native support for eSewa, Khalti, and IME Pay. Sell to anyone,
                anywhere in Nepal.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-10 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                Nepali Language Support
              </h3>
              <p className="text-slate-600">
                Build your website in Nepali or English. Our builder handles
                font and layout seamlessly.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-10 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-4 text-xl font-bold">No Coding Required</h3>
              <p className="text-slate-600">
                If you can use Facebook or WhatsApp, you can build a
                professional website with Nepdora.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </main>
  );
}
