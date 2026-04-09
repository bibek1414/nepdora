import Link from "next/link";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import {
  GraduationCap,
  PlayCircle,
  Clock,
  ChevronRight,
  Star,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { buildMarketingMetadata } from "@/lib/seo";

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
      <MarketingPageHero
        badgeText="Growth Academy"
        badgeIcon={GraduationCap}
        title={<>Master your <span className="text-primary italic">digital brand.</span></>}
        description="Free education, deep-dives, and guides to help Nepali entrepreneurs go from zero to market leader."
        breadcrumbs={[{ label: "Academy", href: "/learn" }]}
        centered
      />

      {/* Featured Courses */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
               <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                 Featured courses
               </h2>
               <p className="mt-2 text-lg text-slate-500 font-medium">Step-by-step guides for the local ecosystem.</p>
            </div>
            <Link
              href="/blog"
              className="group flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition-all hover:shadow-md"
            >
              View all resources
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {COURSES.map(course => (
              <Link
                key={course.slug}
                href={`/learn/${course.slug}`}
                className="group relative flex flex-col rounded-[40px] border border-slate-200 bg-white p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {course.title}
                </h3>
                <p className="mb-10 grow text-base leading-relaxed text-slate-500">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase transition-all group-hover:gap-4">
                  Start learning
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* Expert Rankings / Comparisons */}
          <div className="mt-32 pt-24 border-t border-slate-200">
            <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                   Expert rankings
                 </h2>
                 <p className="mt-2 text-lg text-slate-500 font-medium">Objective analysis of tools available in Nepal.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-[10px] font-bold text-amber-700 uppercase tracking-widest shadow-sm">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                Editor's choice 2026
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <Link
                href="/best/ecommerce-platforms-in-nepal-2026"
                className="group relative overflow-hidden rounded-[48px] border border-slate-200 bg-white p-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                   <TrendingUp className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                   <div className="mb-6 inline-block rounded-full bg-slate-50 px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     Benchmarks 2026
                   </div>
                   <h3 className="mb-4 text-3xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                     Best e-commerce platforms in Nepal
                   </h3>
                   <p className="mb-10 text-lg leading-relaxed text-slate-500 max-w-md font-medium">
                     We compared Nepdora, Shopify, WordPress, and more based on
                     local payment success and logistics automation.
                   </p>
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-900 transition-all group-hover:gap-4">
                     View full rankings
                     <ChevronRight className="h-5 w-5 text-primary" />
                   </div>
                </div>
              </Link>
              <Link
                href="/best/website-builders-for-restaurants-kathmandu"
                className="group relative overflow-hidden rounded-[48px] border border-slate-200 bg-white p-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                 <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                    <BookOpen className="h-24 w-24" />
                 </div>
                 <div className="relative z-10">
                   <div className="mb-6 inline-block rounded-full bg-slate-50 px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     Restaurant Tech
                   </div>
                   <h3 className="mb-4 text-3xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                     Best restaurant builders in Kathmandu
                   </h3>
                   <p className="mb-10 text-lg leading-relaxed text-slate-500 max-w-md font-medium">
                     Expert analysis for cafes and restaurants looking for 
                     integrated online ordering and digital menu management.
                   </p>
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-900 transition-all group-hover:gap-4">
                     View analysis
                     <ChevronRight className="h-5 w-5 text-primary" />
                   </div>
                 </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Expert CTA */}
      <section className="py-24">
         <div className="container mx-auto max-w-5xl px-4 text-center">
            <div className="relative overflow-hidden rounded-[56px] bg-slate-900 p-12 text-white md:p-24 shadow-2xl">
               <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent" />
               <div className="relative z-10">
                  <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-6xl">
                     Need a 1-on-1 session?
                  </h2>
                  <p className="mx-auto mb-12 max-w-xl text-xl text-slate-400 font-medium">
                     Our business growth experts can help you design your store and optimize your marketing strategy for the Nepali market.
                  </p>
                  <Link
                     href="/experts"
                     className="inline-flex items-center gap-3 rounded-[24px] bg-white px-10 py-6 text-lg font-bold text-slate-900 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                     Talk to an Expert
                     <ArrowRight className="h-5 w-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

