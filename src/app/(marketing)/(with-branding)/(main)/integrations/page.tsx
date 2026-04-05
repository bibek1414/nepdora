import { Metadata } from "next";
import Link from "next/link";
import { INTEGRATIONS } from "@/constants/integrations";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  MoveRight,
  Zap,
  Shield,
  CreditCard,
  Truck,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Integration Marketplace | Connect Your Favorite Tools | Nepdora",
  description:
    "Connect eSewa, Khalti, Pathao, and 50+ other Nepali tools with your Nepdora website. Automate your payments, deliveries, and marketing effortlessly.",
  path: "/integrations",
  ogLabel: "Integration Hub",
});

export default function IntegrationsPage() {
  const categories = Array.from(new Set(INTEGRATIONS.map(i => i.category)));

  const getIcon = (category: string) => {
    switch (category) {
      case "Payment":
        return <CreditCard className="h-5 w-5" />;
      case "Logistics":
        return <Truck className="h-5 w-5" />;
      case "Communication":
        return <MessageCircle className="h-5 w-5" />;
      case "Marketing":
        return <Zap className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-sky-900/40 via-transparent to-transparent" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-400">
              <Zap className="h-4 w-4 text-sky-400" />
              <span>Integration Marketplace</span>
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Connect the tools you{" "}
              <span className="text-sky-400">already love.</span>
            </h1>
            <p className="mb-10 text-xl leading-relaxed text-slate-400">
              Supercharge your website with native integrations for Nepal's
              leading platforms. No coding, no complex setups-just seamless
              connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter (Simulated for Now) */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="scrollbar-hide container mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-4 whitespace-nowrap">
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            All Integrations
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map(app => (
              <Link
                key={app.slug}
                href={`/integrations/${app.slug}`}
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    {/* Placeholder for Dynamic Logo */}
                    <div className="h-full w-full animate-pulse rounded-lg bg-slate-200" />
                  </div>
                  <div className="group-hover:text-primary flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase transition-colors">
                    {getIcon(app.category)}
                    <span>{app.category}</span>
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                  {app.name}
                </h3>
                <p className="mb-8 line-clamp-2 leading-relaxed text-slate-600">
                  {app.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 transition-all group-hover:gap-4">
                  View Integration Details
                  <MoveRight className="h-4 w-4 text-sky-500" />
                </div>

                {app.isPopular && (
                  <div className="absolute top-4 right-4 rounded bg-amber-100 px-2 py-1 text-[10px] font-black tracking-tighter text-amber-700 uppercase">
                    Popular
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest Tool */}
      <section className="border-y border-slate-100 bg-white py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-[40px] bg-slate-950 p-12 text-center md:p-20">
            <div className="bg-primary/20 absolute top-0 right-0 -mt-48 -mr-48 h-96 w-96 rounded-full blur-[100px]" />
            <h2 className="relative z-10 mb-6 text-3xl font-bold text-white md:text-5xl">
              Missing a tool?
            </h2>
            <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg text-slate-400">
              We're constantly adding new integrations. If you need a specific
              tool connected to your Nepdora site, let us know.
            </p>
            <Link
              href="/contact"
              className="relative z-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-slate-950 transition-all hover:scale-105"
            >
              Request an Integration
              <MoveRight className="h-5 w-5 text-sky-500" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
