import Link from "next/link";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import {
  GraduationCap,
  PlayCircle,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Nepdora Academy | Learn How to Build and Grow your Business",
  description:
    "Free courses, tutorials, and guides to help you master website building, e-commerce, and digital marketing in Nepal.",
  path: "/learn",
  ogLabel: "Growth Academy",
});

const COURSES = [
  {
    title: "How to sell on Facebook in Nepal",
    slug: "how-to-sell-on-facebook-nepal",
    description:
      "Connect your Nepdora store to Facebook and Instagram for maximum sales.",
    duration: "15 min",
    category: "Social selling",
  },
  {
    title: "Nepal courier services comparison",
    slug: "nepal-courier-services-comparison",
    description:
      "Deep dive into Pathao, Upaya, and others for your delivery needs.",
    duration: "20 min",
    category: "Logistics",
  },
  {
    title: "Setting up eSewa & Khalti",
    slug: "esewa-khalti-setup-guide",
    description:
      "Step-by-step guide to verifying your merchant accounts and linking them.",
    duration: "10 min",
    category: "Payments",
  },
];

export default function LearnHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <StandardMarketingHero
        badgeText="Nepdora academy"
        badgeIcon={GraduationCap}
        title={
          <>
            Master your <span className="text-sky-600">digital brand.</span>
          </>
        }
        description="Free education to help Nepali entrepreneurs go from zero to hero."
        breadcrumbs={[{ label: "Academy", href: "/learn" }]}
        centered
      />

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Featured courses
            </h2>
            <Link
              href="/blog"
              className="group flex items-center gap-2 text-sm font-bold text-sky-600 transition-all hover:gap-3"
            >
              View all resources
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {COURSES.map(course => (
              <Link
                key={course.slug}
                href={`/learn/${course.slug}`}
                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-6 flex items-center justify-between font-semibold">
                  <div className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] text-slate-400">
                    {course.category}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                  {course.title}
                </h3>
                <p className="mb-8 grow text-sm font-medium leading-relaxed text-slate-500">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 transition-all group-hover:gap-3">
                  Start learning
                  <PlayCircle className="h-4 w-4 fill-sky-600 text-white" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-24 border-t border-slate-200 pt-24">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Expert rankings
              </h2>
              <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-[10px] font-bold text-amber-600 shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                Editor's choice 2026
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Link
                href="/best/ecommerce-platforms-in-nepal-2026"
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-4 text-xs font-bold text-sky-600">
                  E-commerce
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                  Best e-commerce platforms in Nepal
                </h3>
                <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500">
                  We compared Nepdora, Shopify, WordPress, and more based on
                  local payment success and logistics automation.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 transition-all group-hover:gap-3">
                  View rankings{" "}
                  <ChevronRight className="h-4 w-4 text-sky-500" />
                </div>
              </Link>
              <Link
                href="/best/website-builders-for-restaurants-kathmandu"
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-4 text-xs font-bold text-sky-600">
                  Restaurant tech
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                  Best restaurant website builders
                </h3>
                <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500">
                  Expert analysis for Kathmandu-based cafes and restaurants
                  looking for online ordering and menu management.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 transition-all group-hover:gap-3">
                  View rankings{" "}
                  <ChevronRight className="h-4 w-4 text-sky-500" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StandardMarketingCTA
        title="Need a 1-on-1 session?"
        description="Our business growth experts can help you design your store and optimize your marketing strategy for the Nepali market."
        buttonText="Talk to an expert"
        buttonHref="/experts"
      />
    </div>
  );
}
