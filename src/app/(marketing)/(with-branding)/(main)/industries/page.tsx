import { Metadata } from "next";
import Link from "next/link";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  ChevronRight,
  Star,
  BarChart3,
  Rocket,
  Heart,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Industry Solutions | Built for Your Business | Nepdora",
  description:
    "Explore industry-specific website solutions for Restaurants, E-commerce, Schools, and more in Nepal. Professional designs with built-in business tools.",
  path: "/industries",
  ogLabel: "Industry Hub",
});

const getIndustryIcon = (slug: string) => {
  if (slug.includes("restaurant"))
    return <Star className="h-6 w-6 text-orange-500" />;
  if (slug.includes("ecommerce") || slug.includes("store"))
    return <Rocket className="h-6 w-6 text-sky-500" />;
  if (slug.includes("school") || slug.includes("educational"))
    return <Globe className="h-6 w-6 text-blue-500" />;
  if (slug.includes("clinic") || slug.includes("medical"))
    return <Heart className="h-6 w-6 text-rose-500" />;
  return <BarChart3 className="h-6 w-6 text-slate-500" />;
};

export default function IndustriesHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingPageHero
        badgeText="Industry Solutions"
        badgeIcon={Sparkles}
        title={<>Built for <span className="text-primary italic">every</span> industry.</>}
        description="From local restaurants in Kathmandu to global e-commerce brands, Nepdora provides the specific tools each industry needs to thrive online."
        breadcrumbs={[{ label: "Industries", href: "/industries" }]}
        centered
      />

      {/* Industry Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 text-center mb-16">
           <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
             Explore tailored solutions.
           </h2>
           <p className="mx-auto max-w-2xl text-lg text-slate-500">
             Choose your niche to see how Nepdora can automate your unique business workflows.
           </p>
        </div>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map(slug => (
              <Link
                key={slug}
                href={`/industries/${slug}`}
                className="group flex flex-col items-center rounded-[40px] border border-slate-200 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 transition-colors group-hover:bg-primary/5 group-hover:scale-110">
                  {getIndustryIcon(slug)}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {INDUSTRY_LABELS[slug] || slug}
                </h3>
                <p className="mb-10 line-clamp-2 text-base leading-relaxed text-slate-500">
                  Tailored features and professional templates specifically
                  designed for {INDUSTRY_LABELS[slug]?.toLowerCase() || slug} businesses.
                </p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-all group-hover:text-primary group-hover:gap-3">
                  Explore Solutions
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="py-24">
         <div className="container mx-auto max-w-5xl px-4">
            <div className="relative overflow-hidden rounded-[48px] bg-slate-900 px-8 py-20 text-center text-white md:px-16 md:py-24">
               <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
                     <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-6xl">
                     Don't see your industry?
                  </h2>
                  <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
                     Our flexible builder can handle any business model. Talk to our experts about creating a custom digital presence for your unique niche.
                  </p>
                  <Link
                     href="/contact"
                     className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-base font-bold text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  >
                     Get a Custom Consultation
                     <ArrowRight className="h-5 w-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

