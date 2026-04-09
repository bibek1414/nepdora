import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, 
  ShoppingBag, 
  Globe, 
  Layout, 
  BarChart3,
  Rocket,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Solutions | Built for Every Business Stage | Nepdora",
  description: "From startups to enterprises, Nepdora provides the foundation your business needs to grow online in Nepal.",
  path: "/solutions",
});

const SOLUTIONS = [
  {
    title: "E-commerce Solutions",
    description: "Full-stack digital commerce with local payments, shipping automation, and inventory management.",
    icon: ShoppingBag,
    color: "text-primary",
    href: "/solutions/ecommerce",
  },
  {
    title: "Business Marketing",
    description: "High-performance websites designed to capture leads, build brand authority, and grow your local presence.",
    icon: Layout,
    color: "text-sky-500",
    href: "/solutions/marketing",
  },
  {
    title: "Portfolio & Personal Branding",
    description: "Stunning, fast-loading sites for creatives and professionals wishing to stand out in the digital crowd.",
    icon: Smartphone,
    color: "text-amber-500",
    href: "/solutions/portfolio",
  },
  {
    title: "Enterprise & Custom Build",
    description: "Advanced infrastructure for high-scale needs with dedicated support and custom integrations.",
    icon: ShieldCheck,
    color: "text-slate-900",
    href: "/solutions/enterprise",
  },
];

export default function SolutionsHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingPageHero
        badgeText="Core Solutions"
        badgeIcon={Rocket}
        title={<>Fueling <span className="text-primary italic">growth</span> at every scale.</>}
        description="Nepdora isn't just a website builder; it's a complete operating system for your digital business in Nepal."
        breadcrumbs={[{ label: "Solutions", href: "/solutions" }]}
        centered
      />

      {/* Solutions Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {SOLUTIONS.map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group relative overflow-hidden rounded-[56px] border border-slate-200 bg-white p-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 transition-colors group-hover:bg-primary/5">
                  <solution.icon className={`h-10 w-10 ${solution.color} transition-transform group-hover:scale-110`} />
                </div>
                <h3 className="mb-4 text-3xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {solution.title}
                </h3>
                <p className="mb-12 text-lg leading-relaxed text-slate-500 font-medium">
                  {solution.description}
                </p>
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest text-primary uppercase transition-all group-hover:gap-5">
                  Explore Solution
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Metric Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
           <div className="relative overflow-hidden rounded-[64px] bg-slate-900 px-8 py-24 text-center text-white md:px-24">
              <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent opacity-50" />
              <div className="relative z-10">
                 <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
                    <BarChart3 className="h-10 w-10 text-primary" />
                 </div>
                 <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-7xl">
                    Built for <span className="text-primary italic">performance.</span>
                 </h2>
                 <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-400 font-medium leading-relaxed">
                    Our solutions are optimized for the local internet infrastructure in Nepal, 
                    ensuring your site loads instantly on Ncell, NTC, and major ISPs.
                 </p>
                 <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {[
                       { label: "Uptime", value: "99.9%" },
                       { label: "SEO Score", value: "100/100" },
                       { label: "Mobile Ready", value: "Native" },
                       { label: "Integrated", value: "Local" },
                    ].map((stat) => (
                       <div key={stat.label}>
                          <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
         <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
               Not sure which solution fits?
            </h2>
            <Link 
               href="/contact"
               className="inline-flex items-center gap-4 rounded-[28px] bg-primary px-12 py-6 text-xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
            >
               Talk to a Strategist
               <ArrowRight className="h-6 w-6" />
            </Link>
         </div>
      </section>
    </div>
  );
}
