import { Metadata } from "next";
import Link from "next/link";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, Zap, Shield, CreditCard, Truck, MessageCircle } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Integration Marketplace | Connect Your Favorite Tools | Nepdora",
  description: "Connect eSewa, Khalti, Pathao, and 50+ other Nepali tools with your Nepdora website. Automate your payments, deliveries, and marketing effortlessly.",
  path: "/integrations",
  ogLabel: "Integration Hub",
});

export default function IntegrationsPage() {
  const categories = Array.from(new Set(INTEGRATIONS.map(i => i.category)));

  const getIcon = (category: string) => {
    switch (category) {
      case "Payment": return <CreditCard className="w-5 h-5" />;
      case "Logistics": return <Truck className="w-5 h-5" />;
      case "Communication": return <MessageCircle className="w-5 h-5" />;
      case "Marketing": return <Zap className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-sky-900/40 via-transparent to-transparent" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Integration Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              Connect the tools you <span className="text-sky-400">already love.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              Supercharge your website with native integrations for Nepal's leading platforms. No coding, no complex setups—just seamless connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter (Simulated for Now) */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium">All Integrations</button>
          {categories.map(cat => (
            <button key={cat} className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INTEGRATIONS.map((app) => (
              <Link 
                key={app.slug}
                href={`/integrations/${app.slug}`}
                className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:shadow-sky-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                    {/* Placeholder for Dynamic Logo */}
                    <div className="w-full h-full bg-slate-200 rounded-lg animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">
                    {getIcon(app.category)}
                    <span>{app.category}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-slate-600 mb-8 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all">
                  View Integration Details
                  <MoveRight className="w-4 h-4 text-sky-500" />
                </div>

                {app.isPopular && (
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                    Popular
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest Tool */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-slate-950 rounded-[40px] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -mr-48 -mt-48" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Missing a tool?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              We're constantly adding new integrations. If you need a specific tool connected to your Nepdora site, let us know.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:scale-105 transition-all relative z-10"
            >
              Request an Integration
              <MoveRight className="w-5 h-5 text-sky-500" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
