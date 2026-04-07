import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  ChevronRight,
  CheckCircle2,
  Zap,
  Layout,
  Laptop,
  Palette,
  Globe,
  Target,
  Star,
} from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map(slug => ({
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
          features: [
            "Digital Menu Management",
            "Online Ordering System",
            "Table Booking",
            "Customer CRM",
          ],
          title: "Restaurant Management Unleashed",
          integrations: [
            {
              name: "eSewa Payments",
              slug: "esewa-payment",
              color: "text-green-600",
            },
            {
              name: "Pathao Logistics",
              slug: "pathao-logistics",
              color: "text-orange-600",
            },
          ],
        };
      case "ecommerce":
      case "clothing-store":
        return {
          header: "Sell across Nepal with a powerful online store.",
          features: [
            "Inventory Management",
            "eSewa & Khalti Payments",
            "Pathao Delivery Sync",
            "Promotions & Coupons",
          ],
          title: "The Ultimate E-commerce Engine",
          integrations: [
            {
              name: "eSewa Payments",
              slug: "esewa-payment",
              color: "text-green-600",
            },
            {
              name: "Khalti Wallet",
              slug: "khalti-payment",
              color: "text-purple-600",
            },
            {
              name: "Pathao Delivery",
              slug: "pathao-logistics",
              color: "text-orange-600",
            },
          ],
        };
      default:
        return {
          header: `A professional digital home for your ${label.toLowerCase()} business.`,
          features: [
            "Mobile-Responsive Design",
            "Local SEO Optimization",
            "Fast Loading Speeds",
            "Integrated Analytics",
          ],
          title: "Made for Professional Excellence",
          integrations: [
            {
              name: "eSewa Checkout",
              slug: "esewa-payment",
              color: "text-green-600",
            },
          ],
        };
    }
  };

  const details = getIndustryDetails(slug);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-24 pb-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1e293b,transparent)] opacity-40" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4">
          <Breadcrumbs
            items={[
              { label: "Industries", href: "/industries" },
              { label: label, href: `/industries/${slug}` },
            ]}
          />

          <div className="mt-12 text-center">
            <div className="bg-primary/20 border-primary/30 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
              <Target className="h-4 w-4" />
              <span>Built for {label}s</span>
            </div>
            <h1 className="mb-8 text-4xl font-black tracking-tight md:text-7xl">
              {details.title}
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-400 md:text-2xl">
              {details.header}
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/create-website"
                className="bg-primary w-full rounded-full px-10 py-5 font-black text-white transition-all hover:scale-105 sm:w-auto"
              >
                Build Your {label} Site
              </Link>
              <Link
                href="/templates"
                className="w-full rounded-full border border-white/20 bg-white/10 px-10 py-5 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
              >
                Browse Industry Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <div>
              <h2 className="border-primary mb-8 border-l-8 pl-8 text-3xl font-extrabold text-slate-900 md:text-5xl">
                Everything you need <br />
                <span className="text-primary italic">
                  to dominate locally.
                </span>
              </h2>
              <div className="space-y-6">
                {details.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-5 rounded-3xl border border-transparent bg-slate-50 p-6 transition-all hover:border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200"
                  >
                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                      <Zap className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-xl font-bold text-slate-900">
                        {feature}
                      </h4>
                      <p className="text-slate-600">
                        Optimized specifically for the Nepali market and local
                        consumers.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-[48px] border-8 border-slate-200 bg-slate-100 shadow-2xl">
                <div className="absolute inset-0 animate-pulse bg-linear-to-br from-slate-200 to-slate-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <p className="mb-4 text-sm font-medium tracking-widest text-slate-400 uppercase italic">
                    Previewing Industry Blueprint
                  </p>
                  <p className="text-2xl leading-none font-black tracking-tighter text-slate-900 uppercase italic opacity-20">
                    {label} Showcase
                  </p>
                </div>
              </div>
              {/* Decorative Floating Elements */}
              <div className="bg-primary/20 absolute -top-10 -right-10 hidden h-48 w-48 rounded-full blur-[60px] sm:block" />
              <div className="absolute -bottom-10 -left-10 hidden h-64 w-64 rounded-full bg-sky-500/10 blur-[80px] sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Integration Cross-Linking */}
      <section className="relative overflow-hidden border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h3 className="mb-6 text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                Native{" "}
                <span className="text-primary italic">Integrations </span>
                Included.
              </h3>
              <p className="mb-8 border-l-4 border-slate-200 pl-6 text-lg text-slate-600">
                Don't waste time on coding. Unlike global platforms like Wix,
                Shopify, or WordPress which require complex 3rd-party scripts
                for Nepal, your {label} site comes pre-connected with local
                partners.
              </p>

              {/* Best-of Recommendation Link */}
              {slug === "restaurant" && (
                <Link
                  href="/best/website-builders-for-restaurants-kathmandu"
                  className="hover:text-primary group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:shadow-md"
                >
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 transition-transform group-hover:scale-125" />
                  Read: Best Website Builders for Restaurants in Kathmandu
                </Link>
              )}
              {slug === "ecommerce" && (
                <Link
                  href="/best/ecommerce-platforms-in-nepal-2026"
                  className="hover:text-primary group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:shadow-md"
                >
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 transition-transform group-hover:scale-125" />
                  Read: Top Ecommerce Platforms in Nepal (2026 Comparison)
                </Link>
              )}
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-6 lg:grid-cols-3">
              {details.integrations.map(integration => (
                <Link
                  key={integration.slug}
                  href={`/integrations/${integration.slug}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="group-hover:bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-colors">
                    <Globe className="group-hover:text-primary h-6 w-6 text-slate-400" />
                  </div>
                  <div
                    className={`text-xs font-black tracking-tighter uppercase italic ${integration.color}`}
                  >
                    {integration.name}
                  </div>
                  <div className="mt-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Active Support
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold">100% Mobile Ready</h3>
              <p className="text-slate-500">
                Over 85% of Nepali customers shop on mobile. We're ready for
                them.
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Dot Com Dot NP</h3>
              <p className="text-slate-500">
                Full support for your local domain registration and web
                presence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
                <Palette className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold">Premium Designs</h3>
              <p className="text-slate-500">
                Pixel-perfect templates that make you look like a market leader.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-[56px] bg-slate-900 p-12 text-center md:p-24">
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
              <h2 className="mb-8 text-4xl leading-none font-black tracking-tighter text-white md:text-6xl">
                Start your <span className="text-primary">{label}</span> journey{" "}
                <br /> in Nepal today.
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-400">
                No credit card required. Free plan available forever. Experience
                the power of Nepdora for your business.
              </p>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link
                  href="/create-website"
                  className="flex items-center gap-3 rounded-full bg-white px-10 py-5 font-black text-slate-950 transition-all hover:bg-slate-100"
                >
                  Create Your Free Website
                  <ChevronRight className="h-5 w-5 text-sky-500" />
                </Link>
                <Link
                  href="/ecommerce-website"
                  className="rounded-full bg-slate-800 px-10 py-5 font-bold text-white transition-all hover:bg-slate-700"
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
