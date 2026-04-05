import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  Clock,
  ChevronRight,
  Zap,
  Star,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Nepdora Academy | Learn How to Build and Grow your Business",
  description:
    "Free courses, tutorials, and guides to help you master website building, e-commerce, and digital marketing in Nepal.",
  path: "/learn",
  ogLabel: "Growth Academy",
});

const COURSES = [
  {
    title: "How to Sell on Facebook in Nepal",
    slug: "how-to-sell-on-facebook-nepal",
    description:
      "Connect your Nepdora store to Facebook and Instagram for maximum sales.",
    duration: "15 min",
    category: "Social Selling",
  },
  {
    title: "Nepal Courier Services Comparison",
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
      <section className="bg-primary/5 border-primary/10 border-b pt-24 pb-20">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <Breadcrumbs items={[{ label: "Academy", href: "/learn" }]} />
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="bg-primary/20 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              <GraduationCap className="h-4 w-4" />
              Nepdora Academy
            </div>
            <h1 className="mb-8 text-4xl leading-none font-black tracking-tight text-slate-900 uppercase italic md:text-7xl">
              Master your{" "}
              <span className="text-primary italic">Digital Brand.</span>
            </h1>
            <p className="text-xl leading-relaxed font-medium text-slate-600">
              Free education to help Nepali entrepreneurs go from zero to hero.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic md:text-4xl">
              Featured Courses
            </h2>
            <Link
              href="/blog"
              className="text-primary flex items-center gap-2 text-sm font-bold hover:underline"
            >
              View All Resources
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {COURSES.map(course => (
              <Link
                key={course.slug}
                href={`/learn/${course.slug}`}
                className="group hover:border-primary/30 hover:shadow-primary/5 flex flex-col rounded-[40px] border border-slate-100 bg-white p-8 transition-all hover:shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {course.category}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </div>
                </div>
                <h3 className="group-hover:text-primary mb-4 text-2xl leading-tight font-black text-slate-900 transition-colors">
                  {course.title}
                </h3>
                <p className="mb-8 grow text-slate-600">{course.description}</p>
                <div className="text-primary mt-auto flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                  Start Learning
                  <PlayCircle className="fill-primary h-4 w-4 text-white" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-24 border-t border-slate-100 pt-24">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tighter uppercase italic md:text-4xl">
                Expert Rankings
              </h2>
              <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-[10px] font-black tracking-widest text-amber-600 uppercase shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                Editor's Choice 2026
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Link
                href="/best/ecommerce-platforms-in-nepal-2026"
                className="group hover:border-primary/50 rounded-[40px] border border-slate-100 bg-slate-50 p-8 transition-all hover:bg-white hover:shadow-2xl"
              >
                <div className="text-primary mb-4 text-xs font-bold tracking-widest uppercase">
                  E-commerce
                </div>
                <h3 className="group-hover:text-primary mb-4 text-2xl font-black tracking-tighter uppercase italic transition-colors">
                  Best E-commerce Platforms in Nepal
                </h3>
                <p className="mb-6 text-sm text-slate-600">
                  We compared Nepdora, Shopify, WordPress, and more based on
                  local payment success and logistics automation.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  View Rankings{" "}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
              <Link
                href="/best/website-builders-for-restaurants-kathmandu"
                className="group hover:border-primary/50 rounded-[40px] border border-slate-100 bg-slate-50 p-8 transition-all hover:bg-white hover:shadow-2xl"
              >
                <div className="text-primary mb-4 text-xs font-bold tracking-widest uppercase">
                  Restaurant Tech
                </div>
                <h3 className="group-hover:text-primary mb-4 text-2xl font-black tracking-tighter uppercase italic transition-colors">
                  Best Restaurant Website Builders
                </h3>
                <p className="mb-6 text-sm text-slate-600">
                  Expert analysis for Kathmandu-based cafes and restaurants
                  looking for online ordering and menu management.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  View Rankings{" "}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>

          <div className="relative mt-20 overflow-hidden rounded-[56px] bg-slate-900 p-12 text-white">
            <div className="bg-primary/20 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col items-center justify-between gap-12 text-center md:flex-row md:text-left">
              <div className="max-w-xl">
                <h3 className="mb-4 text-3xl font-black tracking-tighter uppercase italic">
                  Need a <span className="text-primary">1-on-1 Consulting</span>{" "}
                  Session?
                </h3>
                <p className="font-medium text-slate-400">
                  Our business growth experts can help you design your store and
                  optimize your marketing strategy for the Nepali market.
                </p>
              </div>
              <Link
                href="/experts"
                className="rounded-full bg-white px-8 py-4 text-xs font-black tracking-widest text-slate-950 uppercase shadow-xl transition-all hover:bg-slate-100"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
