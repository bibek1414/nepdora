import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import CTASection from "@/components/marketing/cta-section/cta-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import { HomePricingSection } from "@/components/marketing/pricing-section/home-pricing-section";
import { HomeFAQSection } from "@/components/marketing/faq-section/home-faq-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Globe,
  Smartphone,
  Shield,
  Users,
  Rocket,
  Layout,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title:
    "Free Website Builder in Nepal | Create Websites Without Coding | Nepdora",
  description:
    "Build a professional website for free in Nepal with Nepdora. No coding required—use ready-made templates, drag-and-drop tools, and launch your site instantly.",
  path: "/free-website-builder",
  keywords: [
    "free website builder Nepal",
    "create free website Nepal",
    "no code website builder Nepal",
    "free website maker Nepal",
    "zero cost website builder",
    "website builder without coding Nepal",
  ],
});

export default function FreeWebsiteBuilder() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} Free Website Builder`,
    description: "Start building your online presence for free with Nepdora.",
    url: absoluteUrl("/free-website-builder"),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  // Free plan features
  const freeFeatures = [
    "1 professional website",
    "Nepdora subdomain (yourstore.nepdora.com)",
    "Up to 10 products",
    "Mobile-responsive design",
    "SSL certificate included",
    "Email support",
    "Basic SEO tools",
    "Contact forms",
    "Social media integration",
    "Analytics dashboard",
  ];

  // Benefits of starting free
  const benefits = [
    {
      icon: Rocket,
      title: "Launch in minutes",
      desc: "Get your website online quickly without any technical knowledge.",
    },
    {
      icon: Layout,
      title: "Professional templates",
      desc: "Choose from beautifully designed templates for any business type.",
    },
    {
      icon: Smartphone,
      title: "Mobile optimized",
      desc: "Your site looks great on all devices automatically.",
    },
    {
      icon: CreditCard,
      title: "No credit card required",
      desc: "Start building immediately with zero financial commitment.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="free-software-schema" data={schema} />

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Zero initial investment
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Nepal's best{" "}
              <span className="text-primary">free website builder.</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              We believe every Nepali business deserves a place online. Start
              with our free tier, pick a professional template, and launch your
              site in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/admin/signup"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Start Building for Free
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                View Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Start your business with zero initial investment
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Nepdora is dedicated to helping local entrepreneurs. Our free plan
              includes everything you need to test your idea and grow at your
              own pace. Upgrade only when you're ready.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Plan Features Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                Free Forever
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Everything you need to{" "}
                <span className="text-primary">start for free</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed font-medium text-slate-500">
                Our free plan gives you all the essential tools to create a
                professional website for your business.
              </p>
              <ul className="space-y-3">
                {freeFeatures.slice(0, 6).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-center text-xl font-bold text-slate-900">
                Free Plan Includes
              </h3>
              <ul className="space-y-3">
                {freeFeatures.slice(6).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="bg-primary/5 mt-6 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No credit card required. No time limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Free Tier Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why start with our free tier?
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Perfect for testing your business idea
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Test Your Idea",
                desc: "Validate your business concept without any financial risk.",
              },
              {
                icon: Users,
                title: "Build an Audience",
                desc: "Start collecting customers and grow your email list.",
              },
              {
                icon: Globe,
                title: "Learn the Platform",
                desc: "Master Nepdora's tools before upgrading to premium.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
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

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <HomePricingSection />

      {/* FAQ Section */}
      <HomeFAQSection />

      <CTASection />

      {/* SEO Closing Paragraph */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-base leading-relaxed font-medium text-slate-500">
            Looking for a free website builder in Nepal? Nepdora offers the best
            free plan to get your business online. No credit card required, no
            hidden fees. Start building your professional website today and
            upgrade only when you need more features.
          </p>
        </div>
      </section>
    </main>
  );
}
