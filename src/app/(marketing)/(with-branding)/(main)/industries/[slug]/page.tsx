import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, CheckCircle2, Zap, Layout, Laptop, Palette, Globe, Target } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!industries.includes(slug)) return notFound();

  const label = INDUSTRY_LABELS[slug] || slug;

  return buildMarketingMetadata({
    title: `Best Website Builder for ${label}s in Nepal | Nepdora`,
    description: `Build a professional ${label.toLowerCase()} website in minutes. Integrated tools for ${label.toLowerCase()} businesses in Nepal. Ready-to-use templates.`,
    path: `/industries/${slug}`,
    ogLabel: "Industry Solution",
  });
}

export default async function IndustryDeepDivePage({ params }: Props) {
  const { slug } = await params;
  if (!industries.includes(slug)) return notFound();

  const label = INDUSTRY_LABELS[slug] || slug;

  const getIndustryDetails = (industry: string) => {
    switch (industry) {
      case "restaurant":
        return {
          header: "Take your restaurant online with seamless ordering.",
          features: ["Digital Menu Management", "Online Ordering System", "Table Booking", "Customer CRM"],
          title: "Restaurant Management Unleashed",
        };
      case "ecommerce":
      case "clothing-store":
        return {
          header: "Sell across Nepal with a powerful online store.",
          features: ["Inventory Management", "eSewa & Khalti Payments", "Pathao Delivery Sync", "Promotions & Coupons"],
          title: "The Ultimate E-commerce Engine",
        };
      default:
        return {
          header: `A professional digital home for your ${label.toLowerCase()} business.`,
          features: ["Mobile-Responsive Design", "Local SEO Optimization", "Fast Loading Speeds", "Integrated Analytics"],
          title: "Made for Professional Excellence",
        };
    }
  };

  const details = getIndustryDetails(slug);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1e293b,transparent)] opacity-40" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <Target className="w-4 h-4" />
            <span>Built for {label}s</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8">
            {details.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {details.header}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/create-website"
              className="px-10 py-5 rounded-full bg-primary text-white font-black hover:scale-105 transition-all w-full sm:w-auto"
            >
              Build Your {label} Site
            </Link>
            <Link 
              href="/templates"
              className="px-10 py-5 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all w-full sm:w-auto border border-white/20 backdrop-blur-sm"
            >
              Browse Industry Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 border-l-8 border-primary pl-8">
                Everything you need <br />
                <span className="text-primary italic">to dominate locally.</span>
              </h2>
              <div className="space-y-6">
                {details.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all border border-transparent hover:border-slate-100">
                    <div className="p-3 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{feature}</h4>
                      <p className="text-slate-600">Optimized specifically for the Nepali market and local consumers.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-4/5 rounded-[48px] bg-slate-100 relative overflow-hidden border-8 border-slate-200 shadow-2xl">
                 <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 animate-pulse" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                   <p className="text-slate-400 font-medium mb-4 italic uppercase tracking-widest text-sm">Previewing Industry Blueprint</p>
                   <p className="text-2xl font-black text-slate-900 opacity-20 uppercase tracking-tighter leading-none italic">{label} Showcase</p>
                 </div>
              </div>
              {/* Decorative Floating Elements */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 blur-[60px] rounded-full sm:block hidden" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full sm:block hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="py-24 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">100% Mobile Ready</h3>
                <p className="text-slate-500">Over 85% of Nepali customers shop on mobile. We're ready for them.</p>
            </div>
            <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Dot Com Dot NP</h3>
                <p className="text-slate-500">Full support for your local domain registration and web presence.</p>
            </div>
            <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                    <Palette className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold">Premium Designs</h3>
                <p className="text-slate-500">Pixel-perfect templates that make you look like a market leader.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="bg-slate-900 rounded-[56px] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">
                Start your <span className="text-primary">{label}</span> journey <br /> in Nepal today.
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                No credit card required. Free plan available forever. Experience the power of Nepdora for your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/create-website"
                  className="px-10 py-5 rounded-full bg-white text-slate-950 font-black hover:bg-slate-100 transition-all flex items-center gap-3"
                >
                  Create Your Free Website
                  <MoveRight className="w-5 h-5 text-sky-500" />
                </Link>
                <Link 
                  href="/ecommerce-website"
                  className="px-10 py-5 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
