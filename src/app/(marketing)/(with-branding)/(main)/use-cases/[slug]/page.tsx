import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import { JsonLd } from "@/components/shared/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMarketingMetadata, absoluteUrl, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

import {
  CheckCircle2,
  ChevronRight,
  Globe,
  CreditCard,
  Smartphone,
  Users,
  Star,
} from "lucide-react";
import CityCTA from "@/components/marketing/cta-section/cta-section";

interface Props {
  params: Promise<{ slug: string }>;
}

const USE_CASES = [
  "social-media-to-storefront",
  "online-appointments",
  "high-volume-sales",
  "global-export",
  "creative-portfolios",
  "launch-campaigns",
  "website-for-small-business",
  "website-for-freelancers",
  "sell-products-online-nepal",
  "start-online-business-nepal",
];

export async function generateStaticParams() {
  return USE_CASES.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!USE_CASES.includes(slug)) notFound();

  const title = capitalizeWords(slug.replace(/-/g, " "));
  return buildMarketingMetadata({
    title: `${title} | Professional Solutions`,
    description: `Professional website solutions for ${title} in Nepal.`,
    path: `/use-cases/${slug}`,
  });
}

const getUseCaseContent = (slug: string) => {
  const content: Record<string, any> = {
    "online-appointments": {
      title: "Online appointment booking",
      subtitle: "Automated scheduling for clinics and consultancies.",
      description:
        "Stop wasting hours on phone calls. Nepdora's system automates your entire booking workflow, allowing clients to book, reschedule, or cancel 24/7.",
      problem:
        "Businesses lose revenue due to missed calls and manual scheduling errors.",
      solution:
        "A 24/7 automated booking portal that integrates with your calendar and sends SMS reminders.",
      benefits: [
        "Reduce no-shows with reminders",
        "Save 20+ hours per week",
        "Accept eSewa/Khalti deposits",
        "Sync with Google Calendar",
      ],
      features: [
        "Staff management",
        "Time slot control",
        "Automated SMS",
        "Payment integration",
      ],
      stats: { growth: "200%", time: "1 week" },
      industries: ["Clinics", "Salons", "Consultancies", "Fitness"],
      integrations: ["Google Calendar", "eSewa", "Khalti", "SMS Gateway"],
      testimonial: {
        quote:
          "Our clinic saw a 40% increase in bookings and zero no-shows. The reminders are a game-changer.",
        author: "Dr. Sarah Sharma",
        position: "Founder, Kathmandu Wellness",
      },
    },
  };
  return content[slug] || content["online-appointments"];
};

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  if (!USE_CASES.includes(slug)) notFound();

  const content = getUseCaseContent(slug);
  const title = capitalizeWords(slug.replace(/-/g, " "));

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <JsonLd
        id="use-case-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: content.title,
        }}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-black md:text-4xl">
                {content.title}
              </h1>
              <p className="mb-8 max-w-2xl text-xl leading-relaxed text-slate-600">
                {content.description}
              </p>

              <div className="mb-10 flex flex-wrap gap-4">
                <Link
                  href="/admin/signup"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                >
                  Get started
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-sm font-bold text-black transition-colors hover:border-black"
                >
                  View templates
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 border-t border-slate-100 pt-10">
                <div>
                  <div className="text-3xl font-bold text-black">
                    {content.stats.growth}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    Growth
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">
                    {content.stats.time}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    Setup
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">24/7</div>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    Support
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-12 lg:col-span-5">
              <div className="border-l border-slate-100 pl-8">
                <h3 className="mb-2 text-xs font-bold text-slate-400">
                  The challenge
                </h3>
                <p className="text-base text-slate-700">{content.problem}</p>
              </div>

              <div className="border-l-2 border-black pl-8">
                <h3 className="mb-2 text-xs font-bold text-black">
                  The solution
                </h3>
                <p className="text-base font-medium text-slate-900">
                  {content.solution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Testimonial */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-black">Key benefits</h2>
              <div className="grid gap-6">
                {content.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-black" />
                    <p className="text-lg text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-3xl bg-slate-200/50 p-12 text-black">
              <Star className="mb-6 h-8 w-8 fill-black text-black" />
              <p className="mb-8 text-2xl leading-snug font-medium">
                "{content.testimonial.quote}"
              </p>
              <div>
                <p className="text-lg font-bold">
                  {content.testimonial.author}
                </p>
                <p className="text-sm text-slate-500">
                  {content.testimonial.position}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="border-b border-slate-100 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-xs font-bold text-slate-400">
            Industry ecosystem
          </h2>
          <div className="flex flex-wrap gap-3">
            {content.industries.map((item: string) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-black"
              >
                {item}
              </span>
            ))}
            {content.integrations.map((item: string) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-6 py-2 text-sm font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Localization */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-left text-4xl font-bold text-black">
            Built for Nepal.
          </h2>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CreditCard,
                title: "Local payments",
                desc: "eSewa & Khalti pre-integrated.",
              },
              {
                icon: Smartphone,
                title: "Optimized speed",
                desc: "Fast on local networks.",
              },
              {
                icon: Users,
                title: "Local support",
                desc: "Assistance in Nepali.",
              },
              {
                icon: Globe,
                title: "Regional SEO",
                desc: "Rank higher locally.",
              },
            ].map((item, i) => (
              <div key={i} className="group text-left">
                <item.icon className="mb-4 h-6 w-6 text-black" />
                <h3 className="mb-2 font-bold text-black">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pb-24">
        <CityCTA />
      </div>
    </div>
  );
}
