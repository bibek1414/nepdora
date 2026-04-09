import Link from "next/link";
import {
  GraduationCap,
  Clock,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  CreditCard,
  Search,
  Building2,
  FileText,
  Users,
  Zap,
  Rocket,
  Globe,
} from "lucide-react";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora Learn | Learn to Start & Grow Your Online Business in Nepal",
  description:
    "Free guides and tutorials to help you start an online business in Nepal. Learn about company registration, payment gateways, SEO, and more.",
  path: "/learn",
  ogLabel: "Growth Academy",
});

const GUIDES = [
  {
    slug: "how-to-start-online-business-in-nepal",
    title: "How to start an online business in Nepal",
    description:
      "A complete step-by-step guide to launching your online business. From idea to first sale, learn everything you need to succeed.",
    duration: "15 min read",
    category: "Getting Started",
    icon: Rocket,
  },
  {
    slug: "register-company-in-nepal-online",
    title: "How to register a company in Nepal online",
    description:
      "Learn the legal requirements, documents needed, and step-by-step process to register your business in Nepal.",
    duration: "12 min read",
    category: "Legal",
    icon: Building2,
  },
  {
    slug: "pan-vs-vat-for-online-shops-nepal",
    title: "PAN vs VAT for online shops in Nepal",
    description:
      "Understand the difference between PAN and VAT registration, and which one your online business needs.",
    duration: "10 min read",
    category: "Tax & Compliance",
    icon: FileText,
  },
  {
    slug: "best-payment-gateways-nepal",
    title: "Best payment gateways in Nepal for 2026",
    description:
      "Compare eSewa, Khalti, IME Pay, and other payment solutions. Learn which gateway is best for your business.",
    duration: "14 min read",
    category: "Payments",
    icon: CreditCard,
  },
  {
    slug: "seo-guide-for-nepali-businesses",
    title: "SEO guide for Nepali businesses",
    description:
      "Master SEO to attract free traffic from Google. Learn keyword research, on-page optimization, and local SEO strategies.",
    duration: "18 min read",
    category: "Marketing",
    icon: Search,
  },
];

export default function LearnHubPage() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="border-primary/10 bg-primary/5 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium">
              <GraduationCap className="h-4 w-4" />
              Free Learning Resources
            </div>
            <h1 className="mb-8 text-5xl leading-[0.95] font-bold tracking-tighter text-slate-900 md:text-7xl">
              Learn to start & grow{" "}
              <span className="text-primary">your online business.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
              Free guides, tutorials, and resources to help Nepali entrepreneurs
              build successful online businesses with Nepdora.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#guides"
                className="bg-primary shadow-primary/20 hover:shadow-primary/40 inline-flex items-center justify-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Browse Guides
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/create-website"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-10 py-5 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50"
              >
                Build Your Website
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <div className="text-sm font-medium">Popular topics:</div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Getting Started
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Legal & Tax
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Payments
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  SEO & Marketing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              Nepdora Learn
            </div>
            <h2 className="mt-4 mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Everything you need to{" "}
              <span className="text-primary">succeed online.</span>
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              From choosing your business idea to scaling with SEO and payments,
              we've got you covered with practical, Nepal-focused guides.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Rocket,
                title: "Start Your Business",
                desc: "Learn how to launch your online business from scratch.",
                color: "bg-orange-50 text-orange-500",
              },
              {
                icon: Building2,
                title: "Legal & Tax",
                desc: "PAN, VAT, and company registration explained.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: CreditCard,
                title: "Payment Gateways",
                desc: "Integrate eSewa, Khalti, and more.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Search,
                title: "SEO & Growth",
                desc: "Attract customers with free traffic.",
                color: "bg-blue-50 text-blue-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group hover:border-primary/20 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg"
              >
                <div
                  className={`h-12 w-12 rounded-xl ${item.color} mb-4 flex items-center justify-center`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Guides Section */}
      <section id="guides" className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Free guides for Nepali entrepreneurs
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Practical, step-by-step tutorials to help you build and grow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map(guide => (
              <Link
                key={guide.slug}
                href={`/learn/${guide.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <Clock className="h-3 w-3" />
                    {guide.duration}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors">
                  {guide.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed font-medium text-slate-500">
                  {guide.description}
                </p>
                <div className="text-primary flex items-center gap-2 text-sm font-medium">
                  Read guide
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn with Nepdora */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
                Learn from experts who{" "}
                <span className="text-primary">understand Nepal.</span>
              </h2>
              <p className="mb-8 text-lg font-medium text-slate-500">
                Our guides are written specifically for the Nepali market,
                covering local regulations, payment systems, and customer
                behavior.
              </p>
              <div className="space-y-4">
                {[
                  "Practical, step-by-step tutorials",
                  "Focus on Nepal-specific solutions",
                  "Free for all Nepdora users",
                  "Regularly updated with latest trends",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Users className="text-primary h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">
                  Join 5,000+ entrepreneurs
                </h3>
                <p className="font-medium text-slate-500">
                  Who have started their online journey with Nepdora
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="mb-8 max-w-4xl text-5xl leading-[0.9] font-semibold tracking-tighter">
                Ready to start your online business?
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-xl font-medium text-slate-600">
                Build your website with Nepdora and get access to all our free
                guides and resources.
              </p>
              <Link
                href="/create-website"
                className="bg-primary inline-flex items-center gap-3 rounded-full px-12 py-6 text-lg font-semibold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Build Your Website Now
                <ChevronRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
