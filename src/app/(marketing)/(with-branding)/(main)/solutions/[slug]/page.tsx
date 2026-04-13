import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMarketingMetadata, absoluteUrl, SITE_NAME } from "@/lib/seo";
import { SOLUTIONS_LIST } from "@/constants/solutions";

export const dynamic = "force-dynamic";
import {
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Zap,
  Globe,
  CreditCard,
  Smartphone,
  Users,
  TrendingUp,
  Clock,
  ShieldCheck,
  Heart,
  Star,
  Truck,
  ShoppingBag,
  Layout,
  BarChart3,
  Rocket,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SOLUTIONS_LIST.map(solution => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = SOLUTIONS_LIST.find(s => s.slug === slug);
  if (!solution) return notFound();

  const metadataMap: Record<string, any> = {
    ecommerce: {
      title: "E-commerce Solutions in Nepal | Online Store Builder | Nepdora",
      description:
        "Launch your online store in Nepal with built-in eSewa, Khalti, and Pathao delivery. Start selling products online with Nepdora's complete e-commerce solution.",
    },
    "accept-esewa-payments-online": {
      title: "Accept eSewa, Khalti & Online Payments in Nepal | Nepdora",
      description:
        "Accept eSewa, Khalti, IME Pay, ConnectIPS, and more on your website in Nepal. Launch faster with Nepdora's built-in online payment solution.",
    },
    "local-delivery-integration-pathao": {
      title: "Pathao Delivery Integration for E-commerce in Nepal | Nepdora",
      description:
        "Automate local delivery for your online store in Nepal with Pathao and courier-friendly workflows. Manage fulfillment faster with Nepdora.",
    },
    marketing: {
      title:
        "Digital Marketing Solutions for Business Growth in Nepal | Nepdora",
      description:
        "Grow your business with SEO-friendly websites, lead generation tools, and marketing automation. Built for Nepali businesses.",
    },
    portfolio: {
      title:
        "Portfolio Website Builder for Creatives & Professionals | Nepdora",
      description:
        "Showcase your work with stunning portfolio websites. Perfect for designers, photographers, and creative professionals in Nepal.",
    },
    enterprise: {
      title: "Enterprise Website Solutions & Custom Development | Nepdora",
      description:
        "Custom website development and enterprise solutions for large organizations in Nepal. Scalable, secure, and built for growth.",
    },
  };

  const meta = metadataMap[slug] || {
    title: `${solution.title} | Business Solutions for Nepal | Nepdora`,
    description: `Professional ${solution.title.toLowerCase()} solution for businesses in Nepal. Launch faster with local payments and delivery integration.`,
  };

  return buildMarketingMetadata({
    title: meta.title,
    description: meta.description,
    path: `/solutions/${slug}`,
  });
}

// Solution content data
const getSolutionContent = (slug: string) => {
  const contentMap: Record<string, any> = {
    "accept-esewa-payments-online": {
      title: "Accept Online Payments in Nepal Without Complex Integration",
      subtitle:
        "Accept eSewa, Khalti, IME Pay, ConnectIPS, and more on your website instantly",
      intro:
        "Online businesses in Nepal need trusted local payment methods to convert visitors into paying customers. Nepdora helps you accept eSewa, Khalti, IME Pay, ConnectIPS, and other popular options without building a complex payment workflow from scratch.",
      whyMatters:
        "Most customers in Nepal prefer familiar wallet and bank-based payment methods over international card-only checkout. If your website does not support local payment behavior, you lose trust and sales. Nepdora solves this by giving businesses a payment-ready website experience built for the Nepali market.",
      whatYouGet: [
        "Support for eSewa, Khalti, IME Pay, ConnectIPS, and local payment flows",
        "Mobile-friendly checkout experience",
        "Faster setup without custom gateway development",
        "Better conversion through trusted local payment options",
        "Secure payment flow for stores and service businesses",
      ],
      howItWorks: [
        "Enable payment gateways from your Nepdora dashboard",
        "Enter your merchant credentials",
        "Test payments in sandbox mode",
        "Go live and start accepting payments",
      ],
      whoItsFor:
        "This solution is ideal for e-commerce businesses, restaurants, service providers, booking businesses, and any company in Nepal that wants to collect payments online.",
      whyNepdora:
        "Manual payment integration often creates delays, testing issues, callback errors, and maintenance overhead. Nepdora reduces complexity by giving businesses a cleaner setup path with local-first payment support already aligned with real business needs in Nepal.",
      faqs: [
        {
          q: "Which payment methods can I accept with Nepdora?",
          a: "You can support major payment options used in Nepal, including eSewa, Khalti, IME Pay, ConnectIPS, and other locally relevant methods depending on your setup.",
        },
        {
          q: "Do I need coding knowledge to accept payments online?",
          a: "No. Nepdora is designed to reduce technical setup so businesses can go live faster without building payment workflows from scratch.",
        },
        {
          q: "Is this suitable for service businesses as well as online stores?",
          a: "Yes. The payment solution can support businesses that sell products, services, bookings, or digital offers.",
        },
      ],
    },
    "local-delivery-integration-pathao": {
      title: "Automate Local Delivery and Fulfillment in Nepal",
      subtitle:
        "Streamline your delivery operations with Pathao and local courier integration",
      intro:
        "Managing orders is only half the job for an online business in Nepal. The real challenge starts after checkout, when you need to dispatch, track, and complete deliveries quickly. Nepdora helps businesses streamline fulfillment with Pathao-oriented and local logistics-ready delivery workflows.",
      whyMatters:
        "Customers expect fast confirmation, reliable delivery updates, and smooth communication after placing an order. Manual coordination slows operations and increases errors. A connected delivery workflow helps businesses save time, reduce confusion, and improve customer satisfaction.",
      whatYouGet: [
        "Faster order-to-dispatch workflow",
        "Cleaner delivery coordination for local fulfillment",
        "Better customer communication and order visibility",
        "Operational efficiency for growing online stores",
        "A system designed for Nepal's urban delivery use cases",
      ],
      howItWorks: [
        "Customer places an order on your website",
        "Order details move into your fulfillment workflow",
        "Delivery coordination is triggered faster",
        "Your team tracks progress from a central dashboard",
      ],
      whoItsFor:
        "This solution works best for e-commerce stores, restaurants, grocery businesses, fashion brands, and other businesses in Nepal that rely on local delivery operations.",
      whyNepdora:
        "Generic website builders rarely solve local fulfillment well. Nepdora focuses on the practical side of commerce in Nepal, where payment, dispatch, mobile use, and local delivery are tightly connected.",
      faqs: [
        {
          q: "Is this only for Pathao delivery?",
          a: "While optimized for Pathao, the solution supports broader local courier and fulfillment workflows where relevant.",
        },
        {
          q: "Who should use a delivery integration page?",
          a: "Any business in Nepal that sells products online and needs faster local order fulfillment should use it.",
        },
        {
          q: "Does delivery integration improve customer experience?",
          a: "Yes. Faster dispatch and clearer order handling improve trust, repeat purchases, and operational reliability.",
        },
      ],
    },
    // Add more solutions as needed
  };

  return (
    contentMap[slug] || {
      title: `${SOLUTIONS_LIST.find(s => s.slug === slug)?.title || "Business Solution"} for Nepal`,
      subtitle: "Professional solution designed for Nepali businesses",
      intro:
        "Nepdora provides complete business solutions tailored for the Nepali market. From website building to payment integration and delivery automation, we have everything you need to succeed online.",
      whyMatters:
        "In Nepal's growing digital economy, having the right tools makes all the difference. Nepdora's solutions are built specifically for local businesses, ensuring you can compete effectively in the online space.",
      whatYouGet: [
        "Professional website design",
        "Mobile-responsive layout",
        "Local payment integration",
        "SEO optimization for Nepal",
        "24/7 customer support",
      ],
      howItWorks: [
        "Sign up for a Nepdora account",
        "Choose a template or design your site",
        "Add your products and services",
        "Launch your website and start growing",
      ],
      whoItsFor:
        "This solution is ideal for businesses of all sizes in Nepal, from startups to established enterprises, looking to establish or enhance their online presence.",
      whyNepdora:
        "Unlike generic platforms, Nepdora is built specifically for Nepal. We understand local payment methods, delivery challenges, and customer behavior, making us the ideal partner for your online business.",
      faqs: [
        {
          q: "Is this solution suitable for my business?",
          a: "Yes, our solutions are designed to work for various business types including retail, services, restaurants, and more.",
        },
        {
          q: "Do I need technical skills?",
          a: "No, Nepdora is designed to be user-friendly with drag-and-drop functionality and no coding required.",
        },
        {
          q: "Can I upgrade later?",
          a: "Yes, you can start with our free plan and upgrade as your business grows.",
        },
      ],
    }
  );
};

export default async function SolutionsSlugPage({ params }: Props) {
  const { slug } = await params;
  const solution = SOLUTIONS_LIST.find(s => s.slug === slug);
  if (!solution) return notFound();

  const content = getSolutionContent(slug);
  const url = absoluteUrl(`/solutions/${slug}`);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: "Solutions",
        item: absoluteUrl("/solutions"),
      },
      { "@type": "ListItem", position: 3, name: solution.title, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq: any) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.title,
    description: content.intro,
    provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
    areaServed: { "@type": "Country", name: "Nepal" },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="faq-schema" data={faqSchema} />
      <JsonLd id="service-schema" data={serviceSchema} />

      {/* Navigation */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-slate-400 hover:text-slate-600">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <Link
                href="/solutions"
                className="text-slate-400 hover:text-slate-600"
              >
                Solutions
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className="font-medium text-slate-800">
                {solution.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div
                className={`${solution.bgColor} ${solution.textColor} mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium`}
              >
                <solution.icon className="h-3 w-3" />
                Solution
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {content.title}
              </h1>
              <p className="text-primary mb-4 text-lg font-medium">
                {content.subtitle}
              </p>
              <p className="mb-6 text-base leading-relaxed text-slate-500">
                {content.intro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admin/signup"
                  className="bg-primary -md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
                >
                  Get Started Now <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Talk to an Expert
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-rose-700">
                      Why this matters in Nepal
                    </p>
                    <p className="text-xs text-rose-600">
                      {content.whyMatters.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-emerald-700">
                      What you get
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {content.whatYouGet
                        .slice(0, 4)
                        .map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-xs text-emerald-600"
                          >
                            <CheckCircle2 className="h-2 w-2" />
                            <span className="truncate">
                              {item.substring(0, 30)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="-sm rounded-2xl bg-white p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  What you get
                </h2>
              </div>
              <ul className="space-y-3">
                {content.whatYouGet.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="-sm rounded-2xl bg-white p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  How it works
                </h2>
              </div>
              <div className="space-y-4">
                {content.howItWorks.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-slate-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-2xl border border-slate-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Who it's for</h2>
            </div>
            <p className="text-slate-600">{content.whoItsFor}</p>
          </div>
        </div>
      </section>

      {/* Why Nepdora */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-2xl bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Star className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Why Nepdora instead of generic platforms
              </h2>
            </div>
            <p className="text-slate-600">{content.whyNepdora}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {content.faqs.map((faq: any, idx: number) => (
              <div
                key={idx}
                className="-sm rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl bg-white px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900">
                Ready to get started?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Join thousands of Nepali businesses already using Nepdora
              </p>
              <Link
                href="/admin/signup"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              >
                Start Building for Free <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper components
function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Lightbulb(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
