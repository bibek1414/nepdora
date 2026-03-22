import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

const LEARN_GUIDES = [
  "how-to-start-online-business-in-nepal",
  "register-company-in-nepal-online",
  "pan-vs-vat-for-online-shops-nepal",
  "best-payment-gateways-nepal",
  "seo-guide-for-nepali-businesses"
];

export async function generateStaticParams() {
  return LEARN_GUIDES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = `${capitalizeWords(slug.replace(/-/g, " "))} | Ultimate Guide for Nepal`;
  const description = `Read our comprehensive guide on ${slug.replace(/-/g, " ")}. Essential knowledge for business owners and entrepreneurs in Nepal.`;

  return {
    title,
    description,
  };
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;
  const title = capitalizeWords(slug.replace(/-/g, " "));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": {
      "@type": "Organization",
      "name": "Nepdora"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nepdora",
      "url": "https://www.nepdora.com"
    }
  };

  return (
    <main className="py-16 md:py-24 bg-white">
      <JsonLd id="learn-article-schema" data={schema} />
      <div className="container mx-auto px-4 max-w-4xl">
        <nav className="mb-8 text-sm text-slate-500">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <span className="mx-2">/</span>
           <Link href="/blog" className="hover:text-primary transition-colors">Resources</Link>
           <span className="mx-2">/</span>
           <span className="text-slate-900 font-medium">Guide</span>
        </nav>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>

        <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-12">
                Starting and growing a business in Nepal comes with its own unique set of challenges. 
                In this guide, we break down everything you need to know about {title.toLowerCase()} 
                so you can focus on what matters most: your customers.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <ul className="mb-0">
                    <li>Comprehensive overview of the Nepali market environment.</li>
                    <li>Step-by-step practical implementation advice.</li>
                    <li>Common pitfalls to avoid and how to navigate local regulations.</li>
                    <li>Tools and resources to help you succeed faster.</li>
                </ul>
            </div>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Introduction to {title}</h2>
                <p>
                    Across the Nepalese business landscape, {title.toLowerCase()} has become a critical topic 
                    for both new entrepreneurs and established companies. As digital adoption increases, 
                    understanding the nuances of {title.toLowerCase()} can be the difference between success and struggle.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Key Steps for Implementation</h2>
                <p>
                    Whether you are based in Kathmandu or operating from Pokhara, the following steps 
                    are essential for any business owner looking to master {title.toLowerCase()}:
                </p>
                <ol className="space-y-4 py-4">
                    <li><strong>Market Research:</strong> Understand who your customers are and what they need.</li>
                    <li><strong>Compliance:</strong> Ensure you are following all local laws and regulations.</li>
                    <li><strong>Digital Strategy:</strong> Use the right tools to reach your audience online.</li>
                    <li><strong>Sustainability:</strong> Plan for long-term growth and customer retention.</li>
                </ol>
            </section>

            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4 text-primary">Pro Tip for Nepali Entrepreneurs</h2>
                <p className="mb-0 text-slate-800">
                    Always prioritize local integration. From using Nepali languages in your marketing 
                    to accepting eSewa and Khalti, removing friction for your local customers is the fastest way to grow.
                </p>
            </div>
        </div>

        <div className="mt-20 border-t border-slate-100 pt-16 text-center">
            <h2 className="text-3xl font-bold mb-6">Accelerate Your Business with Nepdora</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                Nepdora handles all the technical heavy lifting—from design to payments—so you can spend your time 
                applying the lessons from this guide to grow your business.
            </p>
            <Link href="/create-website" className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all text-lg">
                Start Building for Free
            </Link>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
