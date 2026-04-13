import { Metadata } from "next";
import {
  ExternalLink,
  Smartphone,
  Laptop,
  Heart,
  Layout,
  Trophy,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Globe,
  Zap,
  ShieldCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildMarketingMetadata, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { ShowcaseVisualMock } from "@/components/marketing/showcase/showcase-visual-mock";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Showcase | Built with Nepdora | Real Success Stories",
  description:
    "Discover real success stories from businesses across Nepal that have grown with Nepdora. From local startups to established brands, see how modern websites are transforming their growth.",
  path: "/showcase",
});

const CASE_STUDIES = [
  {
    id: 1,
    storyHeadline: "Education Consultancy",
    company: "Brainstorm Global Education",
    location: "Baneshwor, Kathmandu",
    metric: "3× Reservation Growth",
    desc: "Brainstorm Global Education partnered with Nepdora to create a modern, user-friendly website that allows students to book appointments, explore courses, and receive personalized guidance. As a result, they experienced a significant boost in student reservations and improved engagement with potential clients.",
    link: "https://www.brainstorm.edu.np/",
    category: "Education",
  },
  {
    id: 2,
    storyHeadline: "Accounting Consultants",
    company: "xInfin Consultants",
    location: "Baluwatar-04, Kathmandu",
    metric: "3× Website Traffic",
    desc: "xInfin Consultants leveraged Nepdora to build a professional online presence that showcases their services and expertise. With improved visibility and easier access for clients, they saw a substantial increase in website traffic and inquiries.",
    link: "https://infinconsultants.com/",
    category: "Consulting",
  },
  {
    id: 3,
    storyHeadline: "Automobile Rental Agency",
    company: "Bato Ma Tours",
    location: "Baluwatar, Kathmandu",
    metric: "2× Booking Growth",
    desc: "Bato Ma Tours upgraded their booking experience with a Nepdora-powered website, allowing customers to explore tours and book online effortlessly. This digital transformation helped them double their bookings and streamline their operations.",
    link: "https://batomatours.com/",
    category: "Travel & Tours",
  },
];

const SHOWCASE_ITEMS = [
  {
    name: "Kathmandu Kitchen",
    category: "Restaurant",
    description:
      "A modern dining experience with online reservations and digital menus.",
    slug: "kathmandu-kitchen",
  },
  {
    name: "Urban Style",
    category: "E-commerce",
    description:
      "Leading clothing brand in Nepal with seamless eSewa checkout.",
    slug: "urban-style",
  },
  {
    name: "Elite Fitness",
    category: "Gym & fitness",
    description: "Member management and online coaching platform.",
    slug: "elite-fitness",
  },
  {
    name: "Namaste Travels",
    category: "Travel & tours",
    description: "Booking engine for trekking and tours across the Himalayas.",
    slug: "namaste-travels",
  },
  {
    name: "Tech Solutions",
    category: "Digital agency",
    description: "Service showcase and lead generation for IT consultants.",
    slug: "tech-solutions",
  },
  {
    name: "Green Grocery",
    category: "Grocery store",
    description:
      "Daily essentials delivered across Pokhara with real-time tracking.",
    slug: "green-grocery",
  },
];

const showcaseSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Nepdora Customer Showcase",
  description:
    "Discover real success stories from businesses across Nepal built with Nepdora.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: CASE_STUDIES.map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: study.company,
        description: study.desc,
        url: study.link,
      },
    })),
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
      name: "Showcase",
      item: absoluteUrl("/showcase"),
    },
  ],
};

export default function ShowcasePage() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="showcase-schema-itemlist" data={showcaseSchema} />
      <JsonLd id="showcase-breadcrumb" data={breadcrumbSchema} />
      
      <div className="container mx-auto max-w-6xl px-6 pt-4">
        <Breadcrumbs items={[{ label: "Showcase", href: "/showcase" }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Stories of success. Built with{" "}
              <span className="text-primary">Nepdora.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
              Discover real success stories from businesses across Nepal that
              have grown with Nepdora. From local startups to established
              brands, see how modern websites are transforming their growth.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Explore how businesses in Nepal are achieving real results.
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-slate-500">
            These case studies highlight how our platform helps companies build
            powerful websites that drive more traffic, generate more leads, and
            increase revenue. Each story reflects real growth, real impact, and
            real success.
          </p>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Featured <span className="text-primary">Success Stories.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              From education consultancies to travel agencies and e-commerce
              brands, Nepdora is helping businesses across industries establish
              a strong digital presence.
            </p>
          </div>

          <div className="space-y-24">
            {CASE_STUDIES.map((study, i) => (
              <div
                key={study.id}
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                  <div className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                    {study.storyHeadline}
                  </div>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {study.company}
                  </h3>
                  <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400">
                    <MapPin className="h-4 w-4" />
                    {study.location}
                  </div>
                  <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                    {study.desc}
                  </p>

                  <div className="mb-8 grid grid-cols-2 gap-6">
                    <div className="-sm rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-primary mb-1 text-2xl font-bold">
                        {study.metric.split(" ")[0]}
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {study.metric.split(" ").slice(1).join(" ")}
                      </div>
                    </div>
                    <div className="-sm rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="mb-1 text-2xl font-bold text-slate-900">
                        100%
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        Digital Ready
                      </div>
                    </div>
                  </div>

                  <Link
                    href={study.link}
                    target="_blank"
                    className="text-primary inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
                <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                  <ShowcaseVisualMock
                    title={study.company}
                    category={study.category}
                    metric={study.metric}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}

      {/* Stats Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="bg-primary/5 border-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
              <Trophy className="h-4 w-4" />
              Trusted by leaders
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why Businesses Trust Nepdora.
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Nepdora is trusted by growing businesses across Nepal because it
              delivers reliable performance, fast loading speeds, and tools
              designed specifically for the local market.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Uptime guarantee", value: "99.9%" },
              { label: "Active stores", value: "2k+" },
              { label: "Nepali support", value: "100%" },
              { label: "Ready to launch", value: "5min" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all"
              >
                <div className="text-primary mb-2 text-3xl font-bold tracking-tight md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Clean white background */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Your success story{" "}
                <span className="text-primary">could be next.</span>
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Join hundreds of businesses across Nepal that are already
                growing with Nepdora. Build your website today and take the
                first step toward scaling your business.
              </p>
              <Link
                href="/admin/signup"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95"
              >
                Build Your Website
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
