import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

const USE_CASES = [
  "website-for-small-business",
  "website-for-freelancers",
  "sell-products-online-nepal",
  "start-online-business-nepal"
];

export async function generateStaticParams() {
  return USE_CASES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = capitalizeWords(slug.replace(/-/g, " "));

  return {
    title: `${title} | Professional Solutions for Nepal`,
    description: `Discover how Nepdora helps with ${slug.replace(/-/g, " ")}. The best website builder for Nepali entrepreneurs and businesses.`,
  };
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const title = capitalizeWords(slug.replace(/-/g, " "));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "provider": {
      "@type": "Organization",
      "name": "Nepdora"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    }
  };

  return (
    <main>
      <JsonLd id="use-case-schema" data={schema} />
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 leading-tight">
                {title}
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Whether you are a solo freelancer or a growing small business in Nepal, 
                Nepdora provides the perfect set of tools to achieve your goals online. 
                Focus on your passion, while we handle the pixels.
            </p>
            <Link href="/create-website" className="px-10 py-5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all text-lg inline-block">
                Get Started Now
            </Link>
        </div>
      </div>

      <FeaturesSection />

      <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">Specifically Designed for Your Success</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="p-10 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold mb-4">Local Payment Gateway</h3>
                      <p className="text-slate-600">Native support for eSewa, Khalti, and IME Pay. Sell to anyone, anywhere in Nepal.</p>
                  </div>
                  <div className="p-10 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold mb-4">Nepali Language Support</h3>
                      <p className="text-slate-600">Build your website in Nepali or English. Our builder handles font and layout seamlessly.</p>
                  </div>
                  <div className="p-10 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold mb-4">No Coding Required</h3>
                      <p className="text-slate-600">If you can use Facebook or WhatsApp, you can build a professional website with Nepdora.</p>
                  </div>
              </div>
          </div>
      </section>

      <FAQSection />
      <CTASection />
    </main>
  );
}
