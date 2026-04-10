import { Metadata } from "next";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  ArrowRight,
  ChevronRight,
  MousePointer2,
  Layout,
  CreditCard,
  Smartphone,
  Search,
  Clock,
  DollarSign,
  XCircle,
  Globe,
  Code2,
  Briefcase,
  Store,
  User,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { DeveloperComparisonMock } from "@/components/marketing/comparison/developer-comparison-mock";
import { JsonLd } from "@/components/shared/json-ld";
import {
  nepdoraAddress,
  nepdoraEmail,
  nepdoraPhone,
} from "@/constants/contact";

export const metadata = buildMarketingMetadata({
  title: "Website Developer in Nepal - Build Professional Sites with Nepdora",
  description:
    "Looking for a website developer in Nepal? Build a professional website for your business in minutes without coding. Launch faster and cheaper with Nepdora.",
  path: "/website-developer-nepal",
  keywords: [
    "website developer nepal",
    "web design nepal",
    "best website builder nepal",
    "hire web developer nepal",
    "nepdora website builder",
  ],
});

export default function WebsiteDeveloperNepalPage() {
  const pageUrl = absoluteUrl("/website-developer-nepal");

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Website Developer in Nepal - Build Professional Sites with Nepdora",
    description:
      "Looking for a website developer in Nepal? Build a professional website for your business in minutes without coding.",
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: absoluteUrl("/nepdora-logooo.svg"),
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
        name: "Website Developer Nepal",
        item: pageUrl,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
    logo: absoluteUrl("/nepdora-logooo.svg"),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: nepdoraPhone,
      contactType: "customer service",
      email: nepdoraEmail,
      areaServed: "NP",
      availableLanguage: ["en", "ne"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: nepdoraAddress.split(",")[0],
      addressLocality: nepdoraAddress.split(",")[1],
      addressRegion: nepdoraAddress.split(",")[1],
      addressCountry: "NP",
    },
    sameAs: [
      "https://www.facebook.com/NepdoraWebBuilder",
      "https://www.instagram.com/nep_dora",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Website Development Services in Nepal",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },
    description:
      "Professional website development services for businesses in Nepal, including eCommerce, business sites, and portfolios.",
  };

  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="webpage-schema" data={webpageSchema} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema} />
      <JsonLd id="organization-schema" data={organizationSchema} />
      <JsonLd id="service-schema" data={serviceSchema} />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="max-w-2xl">
              <div className="border-primary/10 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium">
                <Zap className="h-4 w-4" />
                The Modern Way to Build
              </div>
              <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Website Developer in Nepal Without the Hassle.
              </h1>

              <p className="mb-7 text-base leading-relaxed text-slate-500 sm:text-lg">
                Build a professional website for your business in minutes. No
                coding, no delays. Launch faster with Nepdora.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary shadow-primary/20 hover:shadow-primary/40 inline-flex items-center justify-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Build My High-End Website
                  <ChevronRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-10 py-5 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50"
                >
                  View Templates
                </Link>
              </div>

              {/* TRUST */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="font-medium text-slate-700">
                  Trusted across Nepal
                </span>
                <div className="flex gap-4 text-slate-400">
                  <span>Kathmandu</span>
                  <span>Pokhara</span>
                  <span>Butwal</span>
                  <span>Biratnagar</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative ml-auto">
              <DeveloperComparisonMock />
            </div>
          </div>
        </div>
      </section>

      {/* Why You Need a Website Section */}
      <section className="py-10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              Why It Matters
            </div>
            <h2 className="mt-4 mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Why You Need a{" "}
              <span className="text-primary">Website in Nepal.</span>
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              In today's digital world, every business in Nepal needs a strong
              online presence. Whether you run a local shop, a service business,
              or an eCommerce store, your website is the foundation of your
              growth.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
              <Globe className="text-primary mb-6 h-8 w-8" />
              <h3 className="mb-3 text-2xl font-semibold text-slate-900">
                Global Reach
              </h3>
              <p className="leading-relaxed font-medium text-slate-500">
                Be discovered by customers across the entire country, not just
                in your local area.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
              <ShieldCheck className="text-primary mb-6 h-8 w-8" />
              <h3 className="mb-3 text-2xl font-semibold text-slate-900">
                Brand Trust
              </h3>
              <p className="leading-relaxed font-medium text-slate-500">
                A professional website builds instant credibility with potential
                customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              The Problem with{" "}
              <span className="text-rose-500">Traditional Developers.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Hiring a website developer in Nepal can be expensive and
              time-consuming. Projects can take weeks or even months to
              complete.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Delays in delivery",
                desc: "Waiting weeks for a simple site.",
              },
              {
                icon: DollarSign,
                title: "High upfront costs",
                desc: "Expensive development fees.",
              },
              {
                icon: XCircle,
                title: "Lack of control",
                desc: "Can't edit your own content.",
              },
              {
                icon: Zap,
                title: "Difficulty scaling",
                desc: "Hard to add new features.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <item.icon className="mb-4 h-8 w-8 text-rose-500" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
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

      {/* The Better Alternative Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
                The Better Alternative{" "}
                <span className="text-primary">— Nepdora.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Nepdora is a modern website builder designed for businesses in
                Nepal. Instead of relying on developers, you can create, manage,
                and scale your website yourself — quickly and easily.
              </p>
              <div className="space-y-3">
                {[
                  "Fast hosting and performance",
                  "Full control over your content",
                  "Launch in minutes, not weeks",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                <CheckCircle2 className="text-primary h-6 w-6" />
                <span className="font-medium text-slate-900">
                  No-code website creation
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                <CheckCircle2 className="text-primary h-6 w-6" />
                <span className="font-medium text-slate-900">
                  Ready-to-use templates
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                <CheckCircle2 className="text-primary h-6 w-6" />
                <span className="font-medium text-slate-900">
                  eSewa & Khalti Integration
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Everything you need{" "}
              <span className="text-primary">in one platform.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {[
              {
                icon: MousePointer2,
                title: "Drag & Drop",
                desc: "Create visually without code.",
              },
              {
                icon: Layout,
                title: "Templates",
                desc: "Professionally designed.",
              },
              {
                icon: CreditCard,
                title: "Payments",
                desc: "eSewa & Khalti ready.",
              },
              {
                icon: Smartphone,
                title: "Mobile Optimized",
                desc: "Perfect on all screens.",
              },
              {
                icon: Search,
                title: "SEO Ready",
                desc: "Rank on Google Nepal.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md"
              >
                <item.icon className="text-primary mx-auto mb-4 h-8 w-8" />
                <h4 className="mb-1 text-base font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Perfect for <span className="text-primary">every business.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Nepdora is built to support the diverse needs of the Nepali
              market.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Small Businesses",
                desc: "Get online quickly and affordably.",
              },
              {
                icon: Rocket,
                title: "Startups",
                desc: "Scale your ideas with ease.",
              },
              {
                icon: User,
                title: "Freelancers",
                desc: "Showcase your portfolio professionally.",
              },
              {
                icon: Store,
                title: "eCommerce",
                desc: "Sell products across Nepal.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="hover:border-primary/20 rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-colors"
              >
                <item.icon className="text-primary mb-4 h-8 w-8" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nepdora Over Developers Section */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Why Choose Nepdora{" "}
              <span className="text-primary">Over Developers.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              It's a smarter, modern way to build websites in Nepal.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <h3 className="mb-6 text-xl font-semibold text-slate-900">
                Traditional Developer
              </h3>
              <ul className="space-y-4">
                {[
                  "Weeks to launch",
                  "High development fees",
                  "Developer dependency",
                  "Manual SEO setup",
                ].map(item => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-medium text-slate-500"
                  >
                    <XCircle className="h-5 w-5 text-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary rounded-3xl p-8 text-white shadow-xl">
              <h3 className="mb-6 text-xl font-semibold">Nepdora Builder</h3>
              <ul className="space-y-4">
                {[
                  "Minutes to launch",
                  "Free to start",
                  "Full self-control",
                  "Built-in SEO tools",
                ].map(item => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Block Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter text-slate-900">
            Building the Future of Web in Nepal
          </h2>
          <div className="space-y-4 text-base leading-relaxed font-medium text-slate-500">
            <p>
              If you are searching for a website developer in Nepal, it's
              important to choose a solution that is fast, affordable, and
              scalable. While traditional developers are still an option, modern
              platforms like Nepdora provide a better alternative by reducing
              complexity and giving you full control over your website.
            </p>
            <p>
              Nepdora is designed specifically for the Nepali market, supporting
              local payments, business needs, and growth strategies. Whether you
              need a simple business website or a complete online store, you can
              build and launch everything from one platform.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="l">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="mb-8 max-w-4xl text-5xl leading-[0.9] font-semibold tracking-tighter">
                Ready to build without hiring a developer?
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-xl font-medium text-slate-600">
                Start your website with Nepdora today and go live in minutes.
              </p>
              <Link
                href="/create-website"
                className="bg-primary inline-flex items-center gap-3 rounded-full px-12 py-6 text-lg font-semibold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Start for Free
                <ChevronRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
