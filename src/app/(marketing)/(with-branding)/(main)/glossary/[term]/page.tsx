import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/constants/glossary";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  ShieldCheck,
  Globe,
  Lock,
  Smartphone,
  Server,
  ArrowRight,
  CreditCard,
  Zap,
  TrendingUp,
  Layout,
  CheckCircle2,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Target,
  BarChart3,
} from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ term: string }>;
}

// Extended glossary with more terms
const EXTENDED_GLOSSARY: GlossaryTerm[] = [
  ...GLOSSARY_TERMS,
  {
    term: "VPS Hosting",
    slug: "what-is-vps-hosting",
    definition:
      "Virtual Private Server hosting that gives you dedicated resources on a shared server.",
    detailedExplanation:
      "VPS hosting is a step up from shared hosting, offering more control and dedicated resources. Perfect for growing businesses in Nepal that need more power without the cost of a dedicated server. With VPS, you get guaranteed CPU, RAM, and storage, making your website faster and more reliable during traffic spikes.",
  },
  {
    term: "HTTPS",
    slug: "what-is-https",
    definition:
      "Hypertext Transfer Protocol Secure - the secure version of HTTP.",
    detailedExplanation:
      "HTTPS is essential for any website that collects user data. It encrypts information between your website and visitors, protecting sensitive data like passwords and credit card numbers. Google also uses HTTPS as a ranking signal, making it crucial for SEO in Nepal.",
  },
  {
    term: "SEO",
    slug: "what-is-seo",
    definition:
      "Search Engine Optimization - the practice of improving your website to rank higher on Google.",
    detailedExplanation:
      "SEO helps your business get found by customers searching for your products or services in Nepal. It involves optimizing your content, meta tags, images, and site structure. Local SEO is especially important for targeting Nepali cities like Kathmandu, Pokhara, and Biratnagar.",
  },
  {
    term: "Responsive Design",
    slug: "what-is-responsive-design",
    definition:
      "A web design approach that makes websites look good on all devices.",
    detailedExplanation:
      "With over 70% of Nepali users browsing on mobile, responsive design is not optional. It ensures your website automatically adjusts to fit phones, tablets, and desktops. Google also prioritizes mobile-friendly websites in search results.",
  },
  {
    term: "CDN",
    slug: "what-is-cdn",
    definition:
      "Content Delivery Network - a system of distributed servers that deliver content quickly.",
    detailedExplanation:
      "A CDN helps your website load faster for visitors in Nepal by serving content from nearby servers. Instead of loading everything from a single server, a CDN copies your content to multiple locations worldwide, reducing latency and improving page speed.",
  },
  {
    term: "CMS",
    slug: "what-is-cms",
    definition:
      "Content Management System - software that helps you create and manage website content.",
    detailedExplanation:
      "A CMS like Nepdora allows you to update your website without any coding knowledge. You can add products, write blog posts, change images, and manage pages through an easy-to-use dashboard, putting you in control of your website.",
  },
  {
    term: "eSewa",
    slug: "what-is-esewa",
    definition: "Nepal's most popular digital wallet for online payments.",
    detailedExplanation:
      "eSewa allows customers to pay for products and services online using their mobile wallet. It's widely used for online shopping, mobile recharge, utility bills, and ticket booking. Integrating eSewa is essential for any e-commerce store targeting Nepali customers.",
  },
  {
    term: "Khalti",
    slug: "what-is-khalti",
    definition: "A leading digital wallet and payment gateway in Nepal.",
    detailedExplanation:
      "Khalti is widely used for online payments, mobile recharges, and utility bill payments. It offers a seamless checkout experience with one-click payments and merchant services, allowing businesses to accept payments directly on their websites.",
  },
];

const ALL_GLOSSARY_TERMS = [...EXTENDED_GLOSSARY];

export async function generateStaticParams() {
  return ALL_GLOSSARY_TERMS.map(t => ({
    term: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const item = ALL_GLOSSARY_TERMS.find(t => t.slug === term);
  if (!item) return notFound();

  return buildMarketingMetadata({
    title: `${item.term} | Definition & Explanation | Nepdora Glossary`,
    description: `What is ${item.term}? ${item.definition.substring(0, 150)} Learn key web terms for your Nepali business.`,
    path: `/glossary/${term}`,
  });
}

// Visual card component
const TermVisual = ({ term, slug }: { term: string; slug: string }) => {
  const visuals: Record<
    string,
    { icon: React.ReactNode; bg: string; text: string }
  > = {
    default: {
      icon: <BookOpen className="h-8 w-8" />,
      bg: "from-slate-500 to-slate-600",
      text: "Learn the basics",
    },
    ssl: {
      icon: <ShieldCheck className="h-8 w-8" />,
      bg: "from-emerald-500 to-emerald-600",
      text: "Secure Connection",
    },
    https: {
      icon: <Lock className="h-8 w-8" />,
      bg: "from-emerald-500 to-emerald-600",
      text: "Encrypted Data",
    },
    domain: {
      icon: <Globe className="h-8 w-8" />,
      bg: "from-blue-500 to-blue-600",
      text: "Your Online Address",
    },
    payment: {
      icon: <CreditCard className="h-8 w-8" />,
      bg: "from-purple-500 to-purple-600",
      text: "Accept Payments",
    },
    esewa: {
      icon: <CreditCard className="h-8 w-8" />,
      bg: "from-emerald-500 to-emerald-600",
      text: "Nepali Wallet",
    },
    khalti: {
      icon: <CreditCard className="h-8 w-8" />,
      bg: "from-purple-500 to-purple-600",
      text: "Digital Wallet",
    },
    hosting: {
      icon: <Server className="h-8 w-8" />,
      bg: "from-indigo-500 to-indigo-600",
      text: "Store Your Site",
    },
    seo: {
      icon: <TrendingUp className="h-8 w-8" />,
      bg: "from-orange-500 to-orange-600",
      text: "Rank Higher",
    },
    responsive: {
      icon: <Smartphone className="h-8 w-8" />,
      bg: "from-sky-500 to-sky-600",
      text: "Works Everywhere",
    },
    cdn: {
      icon: <Zap className="h-8 w-8" />,
      bg: "from-amber-500 to-amber-600",
      text: "Lightning Fast",
    },
    cms: {
      icon: <Layout className="h-8 w-8" />,
      bg: "from-rose-500 to-rose-600",
      text: "Easy Management",
    },
  };

  let key: keyof typeof visuals = "default";
  if (slug.includes("ssl") || slug.includes("https")) key = "ssl";
  else if (slug.includes("domain")) key = "domain";
  else if (slug.includes("payment") || slug.includes("gateway"))
    key = "payment";
  else if (slug.includes("esewa")) key = "esewa";
  else if (slug.includes("khalti")) key = "khalti";
  else if (slug.includes("hosting") || slug.includes("server")) key = "hosting";
  else if (slug.includes("seo")) key = "seo";
  else if (slug.includes("responsive") || slug.includes("mobile"))
    key = "responsive";
  else if (slug.includes("cdn")) key = "cdn";
  else if (slug.includes("cms")) key = "cms";

  const visual = visuals[key];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${visual.bg} p-8 text-white shadow-lg`}
    >
      <div className="absolute -top-6 -right-6 opacity-10">{visual.icon}</div>
      <div className="relative z-10">
        <div className="mb-4">{visual.icon}</div>
        <h3 className="text-lg font-bold">{term}</h3>
        <p className="mt-1 text-sm text-white/80">{visual.text}</p>
      </div>
    </div>
  );
};

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const item = ALL_GLOSSARY_TERMS.find(t => t.slug === term);
  if (!item) return notFound();

  const relatedTerms = ALL_GLOSSARY_TERMS.filter(t => t.slug !== term).slice(
    0,
    3
  );

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: item.term,
    description: item.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Nepdora Web Glossary",
      url: `${absoluteUrl()}/glossary`,
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
        name: "Glossary",
        item: `${absoluteUrl()}/glossary`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.term,
        item: `${absoluteUrl()}/glossary/${term}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="glossary-term-schema" data={definedTermSchema} />
      <JsonLd id="glossary-breadcrumb" data={breadcrumbSchema} />
      {/* Navigation Breadcrumb */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <Link
                href="/glossary"
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                Glossary
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className="font-medium text-slate-800">{item.term}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Minimal & Clean */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <GraduationCap className="h-3 w-3" />
              Tech Term Explained
            </div>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {item.term}
            </h1>
            <div className="bg-primary mx-auto mb-6 h-1 w-12 rounded-full" />
            <p className="text-lg leading-relaxed text-slate-500 md:text-xl">
              {item.definition}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-8 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content - Left (2/3) */}
            <div className="space-y-10 lg:col-span-2">
              {/* Detailed Explanation Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    What is {item.term}?
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-slate-600">
                  {item.detailedExplanation}
                </p>
              </div>

              {/* Why It Matters in Nepal */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Why it matters in Nepal
                  </h2>
                </div>
                <p className="leading-relaxed text-slate-600">
                  For Nepali business owners, understanding {item.term} is
                  crucial for building a successful online presence. With
                  Nepal's rapidly growing digital economy and increasing
                  internet penetration, mastering these concepts helps you make
                  informed decisions about your website, reach more customers,
                  and stay ahead of competitors in cities like Kathmandu,
                  Pokhara, and beyond.
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Key Takeaways
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Impacts your website's performance and user experience",
                    "Helps you communicate better with developers",
                    "Improves your search engine rankings in Nepal",
                    "Local businesses that master this outperform competitors",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Right (1/3) */}
            <div className="space-y-8">
              {/* Visual Card */}
              <TermVisual term={item.term} slug={item.slug} />

              {/* Quick Info */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-slate-900">
                  Quick Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-700">
                      Web Technology
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Difficulty</span>
                    <span className="font-medium text-slate-700">Beginner</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reading Time</span>
                    <span className="font-medium text-slate-700">2 min</span>
                  </div>
                </div>
              </div>

              {/* Related Terms */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-slate-900">
                  Related Terms
                </h3>
                <div className="space-y-3">
                  {relatedTerms.map(related => (
                    <Link
                      key={related.slug}
                      href={`/glossary/${related.slug}`}
                      className="group -mx-2 flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50"
                    >
                      <span className="group-hover:text-primary text-sm text-slate-600 transition-colors">
                        {related.term}
                      </span>
                      <ChevronRight className="group-hover:text-primary h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Footer */}
      <section className="py-8">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs text-slate-400">
            Part of Nepdora's complete website glossary for Nepali businesses.
            Learn web terms, build better websites, and grow your online
            presence.
          </p>
        </div>
      </section>
    </div>
  );
}
