import { Metadata } from "next";
import Link from "next/link";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, Star, BarChart3, Rocket, Heart, Globe } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Industry Solutions | Built for Your Business | Nepdora",
  description: "Explore industry-specific website solutions for Restaurants, E-commerce, Schools, and more in Nepal. Professional designs with built-in business tools.",
  path: "/industries",
  ogLabel: "Industry Hub",
});

const getIndustryIcon = (slug: string) => {
  if (slug.includes("restaurant")) return <Star className="w-6 h-6 text-orange-500" />;
  if (slug.includes("ecommerce") || slug.includes("store")) return <Rocket className="w-6 h-6 text-sky-500" />;
  if (slug.includes("school") || slug.includes("educational")) return <Globe className="w-6 h-6 text-blue-500" />;
  if (slug.includes("clinic") || slug.includes("medical")) return <Heart className="w-6 h-6 text-rose-500" />;
  return <BarChart3 className="w-6 h-6 text-slate-500" />;
};

export default function IndustriesHubPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
            Built for <span className="text-primary italic">every</span> industry.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            From local restaurants in Kathmandu to global e-commerce brands, Nepdora provides the specific tools each industry needs to thrive online.
          </p>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((slug) => (
              <Link 
                key={slug}
                href={`/industries/${slug}`}
                className="group p-8 rounded-3xl border border-slate-200 bg-white hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                  {getIndustryIcon(slug)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {INDUSTRY_LABELS[slug] || slug}
                </h3>
                <p className="text-sm text-slate-500 mb-8 line-clamp-2">
                  Tailored features and professional templates specifically designed for {INDUSTRY_LABELS[slug]?.toLowerCase() || slug} businesses.
                </p>
                <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                  Explore Solutions
                  <MoveRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Don't see your industry?</h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed">
            Our flexible builder can handle any business model. Talk to our experts about creating a custom digital presence for your unique niche.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-primary text-white font-black hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            Get a Custom Consultation
            <MoveRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
