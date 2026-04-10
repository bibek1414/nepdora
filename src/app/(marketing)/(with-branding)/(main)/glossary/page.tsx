import { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/constants/glossary";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { BookOpen, ChevronRight, Zap, TrendingUp } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { GlossaryList } from "@/components/marketing/glossary/glossary-list";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

export const metadata = buildMarketingMetadata({
  title: "Web Glossary | Website & Tech Terms Explained | Nepdora",
  description:
    "Understand key website and tech terms with our simple glossary. Perfect for Nepali business owners starting their online journey.",
  path: "/glossary",
  keywords: [
    "web glossary nepal",
    "website terms explained",
    "tech glossary for beginners",
    "domain hosting definition",
    "ssl certificate meaning",
  ],
});

// Group terms by category
const getTermCategory = (term: string): string => {
  const categories: Record<string, string[]> = {
    "Hosting & Infrastructure": [
      "Shared Hosting",
      "VPS Hosting",
      "Dedicated Server",
      "Cloud Hosting",
      "Server",
      "Bandwidth",
    ],
    "Security & Privacy": [
      "SSL Certificate",
      "HTTPS",
      "Firewall",
      "Data Encryption",
      "Two-Factor Authentication",
    ],
    "Domains & URLs": ["Domain Name", "Subdomain", "URL", "DNS", "TLD"],
    "Payments & E-commerce": [
      "Payment Gateway",
      "eSewa",
      "Khalti",
      "Shopping Cart",
      "COD",
    ],
    "SEO & Marketing": [
      "SEO",
      "Keywords",
      "Meta Tags",
      "Backlinks",
      "Google Analytics",
    ],
    "Design & Development": [
      "Responsive Design",
      "CMS",
      "Drag and Drop",
      "Template",
      "UI/UX",
    ],
    "Performance & Speed": [
      "Page Speed",
      "Core Web Vitals",
      "CDN",
      "Caching",
      "Load Time",
    ],
    "Local Nepal Terms": [".com.np", "NTC", "Ncell", "Fonepay", "ConnectIPS"],
  };

  for (const [category, terms] of Object.entries(categories)) {
    if (terms.includes(term)) {
      return category;
    }
  }
  return "General Terms";
};

// Extended glossary with more terms
const EXTENDED_GLOSSARY: GlossaryTerm[] = [
  ...GLOSSARY_TERMS,
  {
    term: "VPS Hosting",
    slug: "what-is-vps-hosting",
    definition:
      "Virtual Private Server hosting that gives you dedicated resources on a shared server.",
    detailedExplanation:
      "VPS hosting is a step up from shared hosting, offering more control and dedicated resources. Perfect for growing businesses in Nepal that need more power without the cost of a dedicated server.",
  },
  {
    term: "HTTPS",
    slug: "what-is-https",
    definition:
      "Hypertext Transfer Protocol Secure - the secure version of HTTP.",
    detailedExplanation:
      "HTTPS is essential for any website that collects user data. Google also uses HTTPS as a ranking signal, making it crucial for SEO in Nepal.",
  },
  {
    term: "SEO",
    slug: "what-is-seo",
    definition:
      "Search Engine Optimization - the practice of improving your website to rank higher on Google.",
    detailedExplanation:
      "SEO helps your business get found by customers searching for your products or services in Nepal. Local SEO is especially important for targeting Nepali cities.",
  },
  {
    term: "Responsive Design",
    slug: "what-is-responsive-design",
    definition:
      "A web design approach that makes websites look good on all devices.",
    detailedExplanation:
      "With over 70% of Nepali users browsing on mobile, responsive design is not optional. It ensures your website works perfectly on phones, tablets, and desktops.",
  },
  {
    term: "CDN",
    slug: "what-is-cdn",
    definition:
      "Content Delivery Network - a system of distributed servers that deliver content quickly.",
    detailedExplanation:
      "A CDN helps your website load faster for visitors in Nepal by serving content from nearby servers. This is crucial for providing a good user experience.",
  },
  {
    term: "CMS",
    slug: "what-is-cms",
    definition:
      "Content Management System - software that helps you create and manage website content.",
    detailedExplanation:
      "A CMS like Nepdora allows you to update your website without any coding knowledge. You can add products, write blog posts, and change images easily.",
  },
  {
    term: "Domain",
    slug: "what-is-domain",
    definition:
      "Your website's unique address on the internet (e.g., yourbusiness.com).",
    detailedExplanation:
      "Your domain name is how customers find you online. Choose something memorable and related to your business. .com.np domains are available for registered Nepali businesses.",
  },
  {
    term: "Web Hosting",
    slug: "what-is-web-hosting",
    definition:
      "A service that stores your website files and makes them accessible online.",
    detailedExplanation:
      "Web hosting is like renting space on the internet. Good hosting ensures your website is fast, secure, and always available to your customers in Nepal.",
  },
  {
    term: "eSewa",
    slug: "what-is-esewa",
    definition: "Nepal's most popular digital wallet for online payments.",
    detailedExplanation:
      "eSewa allows customers to pay for products and services online using their mobile wallet. Integrating eSewa is essential for any e-commerce store targeting Nepali customers.",
  },
  {
    term: "Khalti",
    slug: "what-is-khalti",
    definition: "A leading digital wallet and payment gateway in Nepal.",
    detailedExplanation:
      "Khalti is widely used for online payments, mobile recharges, and utility bill payments. It's a must-have payment option for Nepali online stores.",
  },
];

const ALL_GLOSSARY_TERMS = [...EXTENDED_GLOSSARY];

export default function GlossaryHubPage() {
  const groupedTerms: Record<string, GlossaryTerm[]> = {};

  ALL_GLOSSARY_TERMS.forEach(term => {
    const category = getTermCategory(term.term);
    if (!groupedTerms[category]) {
      groupedTerms[category] = [];
    }
    groupedTerms[category].push(term);
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Website Glossary for Nepali Businesses",
    description: "Simple explanations of website and tech terms",
    numberOfItems: ALL_GLOSSARY_TERMS.length,
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
        name: "Glossary",
        item: absoluteUrl("/glossary"),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="glossary-schema" data={schema} />
      <JsonLd id="glossary-breadcrumb" data={breadcrumbSchema} />

      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Glossary", href: "/glossary" }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Tech Glossary
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Web & Tech Terms{" "}
              <span className="text-primary">Simply Explained</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Understand key website and tech terms with our simple glossary.
              Perfect for Nepali business owners starting their online journey.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-lg leading-relaxed font-medium text-slate-600">
            Confused by technical jargon? Our glossary breaks down complex web
            terms into simple, easy-to-understand explanations. Whether you're
            just starting out or looking to expand your knowledge, we've got you
            covered.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-primary mb-2 text-2xl font-bold">
                {ALL_GLOSSARY_TERMS.length}+
              </div>
              <div className="text-xs font-medium text-slate-500">
                Terms Explained
              </div>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-primary mb-2 text-2xl font-bold">10+</div>
              <div className="text-xs font-medium text-slate-500">
                Categories
              </div>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-primary mb-2 text-2xl font-bold">Simple</div>
              <div className="text-xs font-medium text-slate-500">
                Plain English
              </div>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-primary mb-2 text-2xl font-bold">Free</div>
              <div className="text-xs font-medium text-slate-500">
                For Everyone
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Glossary List */}
      <GlossaryList groupedTerms={groupedTerms} />

      {/* Popular Terms Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Most Popular Terms
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Start with these commonly searched terms
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "SSL Certificate",
              "Domain Name",
              "Payment Gateway",
              "SEO",
              "Responsive Design",
              "Web Hosting",
              "eSewa",
              "Khalti",
            ].map(termName => {
              const term = ALL_GLOSSARY_TERMS.find(t => t.term === termName);
              if (!term) return null;
              return (
                <Link
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="hover:border-primary hover:text-primary rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all"
                >
                  {term.term}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Learn These Terms */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
                Why understanding these terms matters
              </h2>
              <p className="mx-auto max-w-2xl text-base font-medium text-slate-500">
                Knowing the basics of web technology helps you make better
                decisions for your business. From choosing the right hosting to
                optimizing your site for local customers, every term you learn
                brings you closer to online success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to build your website?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Now that you understand the terms, put your knowledge into
                action. Create your website with Nepdora today.
              </p>
              <Link
                href="/create-website"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              >
                Build My Professional Website
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Closing Paragraph */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-base leading-relaxed font-medium text-slate-500">
            Our glossary is designed to help Nepali business owners understand
            essential web and tech terms. Whether you're looking up SSL
            certificates, domain names, or payment gateways like eSewa and
            Khalti, we've got simple explanations to guide you.
          </p>
        </div>
      </section>
    </div>
  );
}
