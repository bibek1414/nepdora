import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Layout,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Truck,
  BarChart3,
  Globe,
  Users,
  Zap,
  CheckCircle2,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { SOLUTIONS_LIST } from "@/constants/solutions";
import { buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Business Solutions in Nepal | Ecommerce, Payments & Growth Tools | Nepdora",
  description:
    "Discover Nepdora business solutions for Nepal. Build ecommerce websites, accept eSewa & Khalti payments, manage delivery, and grow your business with fast, SEO-friendly tools.",
  path: "/solutions",
});

export default function SolutionsHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Business Solutions for Nepal",
    description:
      "Explore business solutions built for Nepal. E-commerce, payments, delivery, and growth tools.",
    url: absoluteUrl("/solutions"),
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
        name: "Solutions",
        item: absoluteUrl("/solutions"),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="solutions-schema" data={schema} />
      <JsonLd id="solutions-breadcrumb" data={breadcrumbSchema} />

      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Solutions", href: "/solutions" }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              Business Solutions
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Business Solutions Built for{" "}
              <span className="text-primary">Nepal</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Nepdora helps Nepali businesses launch, sell, accept payments, and
              deliver faster with local-first digital solutions. From e-commerce
              websites and payment gateway integration to Pathao delivery
              automation and lead-generation websites, every solution is built
              for the way businesses operate in Nepal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/admin/signup"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
              >
                Start Building
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-lg leading-relaxed font-medium text-slate-600">
            Whether you run an online store, restaurant, service company, or
            growing brand, you need more than a basic website. You need a system
            that supports local payments, mobile-first checkout, delivery
            coordination, SEO, and customer trust. Nepdora combines all of these
            into practical solutions designed for the Nepali market.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Solutions for every stage of online growth
            </h2>
            <p className="mt-2 text-slate-500">
              Choose the right solution for your business
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS_LIST.map(solution => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="group -sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3`}>
                  <solution.icon className={`h-6 w-6 ${solution.textColor}`} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {solution.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nepdora Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Why Nepali businesses choose{" "}
              <span className="text-primary">Nepdora</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CreditCard,
                title: "Local Payments",
                desc: "Supports eSewa, Khalti, IME Pay, ConnectIPS, and other local payment options",
              },
              {
                icon: Truck,
                title: "Delivery Integration",
                desc: "Works with local delivery workflows including Pathao-based fulfillment",
              },
              {
                icon: Zap,
                title: "Fast Loading",
                desc: "Optimized for mobile users in Nepal with fast-loading pages",
              },
              {
                icon: Globe,
                title: "SEO Friendly",
                desc: "SEO-friendly structure for ranking service and product pages",
              },
              {
                icon: Smartphone,
                title: "No Code Needed",
                desc: "No-code or low-code setup for non-technical teams",
              },
              {
                icon: Users,
                title: "Versatile",
                desc: "Designed for stores, restaurants, consultancies, agencies, and personal brands",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm flex items-start gap-3 rounded-2xl bg-white p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who These Solutions Are For */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Who these solutions are for
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "E-commerce Stores",
              "Restaurants",
              "Service Providers",
              "Consultancies",
              "Agencies",
              "Freelancers",
              "Personal Brands",
              "Enterprises",
            ].map(item => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What business solutions does Nepdora provide in Nepal?",
                a: "Nepdora provides website, e-commerce, payment integration, logistics integration, and digital growth solutions for businesses operating in Nepal.",
              },
              {
                q: "Can I accept eSewa and Khalti on my website?",
                a: "Yes. Nepdora supports local payment integration so businesses can accept trusted digital wallet and bank-based payments online.",
              },
              {
                q: "Does Nepdora support delivery integration?",
                a: "Yes. Businesses can automate parts of the fulfillment process through local delivery integration workflows such as Pathao-based operations.",
              },
              {
                q: "Are Nepdora solution pages SEO-friendly?",
                a: "Yes. Nepdora websites are built with fast-loading pages, structured metadata, and search-friendly architecture to help businesses rank better in Nepal.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="-sm rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
