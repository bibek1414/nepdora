import { Metadata } from "next";
import Link from "next/link";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, Star, BarChart3, Rocket, Heart, Globe } from "lucide-react";

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
      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-8 text-4xl font-black tracking-tight text-slate-900 md:text-7xl">
            Built for <span className="text-primary italic">every</span>{" "}
            industry.
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-600">
            From local restaurants in Kathmandu to global e-commerce brands,
            Nepdora provides the specific tools each industry needs to thrive
            online.
          </p>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map(slug => (
              <Link
                key={slug}
                href={`/industries/${slug}`}
                className="group hover:border-primary hover:shadow-primary/5 flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 text-center transition-all duration-300 hover:shadow-2xl"
              >
                <div className="group-hover:bg-primary/5 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 transition-colors">
                  {getIndustryIcon(slug)}
                </div>
                <h3 className="group-hover:text-primary mb-4 text-xl font-bold text-slate-900 transition-colors">
                  {INDUSTRY_LABELS[slug] || slug}
                </h3>
                <p className="mb-8 line-clamp-2 text-sm text-slate-500">
                  Tailored features and professional templates specifically
                  designed for {INDUSTRY_LABELS[slug]?.toLowerCase() || slug}{" "}
                  businesses.
                </p>
                <div className="group-hover:text-primary mt-auto flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors">
                  Explore Solutions
                  <MoveRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="bg-primary/20 pointer-events-none absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]" />
        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">
            Don't see your industry?
          </h2>
          <p className="mb-12 text-xl leading-relaxed text-slate-400">
            Our flexible builder can handle any business model. Talk to our
            experts about creating a custom digital presence for your unique
            niche.
          </p>
          <Link
            href="/contact"
            className="bg-primary shadow-primary/20 inline-flex items-center gap-4 rounded-full px-10 py-5 font-black text-white shadow-xl transition-all hover:scale-105"
          >
            Get a Custom Consultation
            <MoveRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
