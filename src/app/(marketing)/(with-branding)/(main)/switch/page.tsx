import { Metadata } from "next";
import Link from "next/link";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  ChevronRight,
  ArrowLeftRight,
  CreditCard,
  ShieldAlert,
  BadgePercent,
  Zap,
  ArrowRight,
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Switch to Nepdora | Migrate Your Website Seamlessly | Nepal",
  description:
    "Tired of Shopify's high fees or Wix's payment issues in Nepal? Switch to Nepdora. Local payments, lower costs, and expert migration support.",
  path: "/switch",
  ogLabel: "Migration Hub",
});

export default function SwitchHubPage() {
  const topCompetitors = ["shopify", "wix", "wordpress", "squarespace"];
  const featuredCompetitors = ALL_COMPETITORS.filter(c =>
    topCompetitors.includes(c.slug)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <MarketingPageHero
        badgeText="Migration Center"
        badgeIcon={ArrowLeftRight}
        title="Stop overpaying. Start growing in Nepal."
        description="Global builders aren't built for Nepal. We are. Experience local payment integrations, 24/7 Nepali support, and up to 80% lower costs when you migrate to Nepdora."
        breadcrumbs={[{ label: "Switch", href: "/switch" }]}
      />

      {/* Visual Mockup Section - Comparison */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Seamless migration from any platform.
              </h2>
              <p className="mb-8 text-lg text-slate-500">
                Moving your store shouldn't be a nightmare. We've optimized the
                migration process to ensure you don't lose any data, SEO rankings,
                or customer trust.
              </p>
              <ul className="space-y-4">
                {[
                  "Automatic product and customer import",
                  "Preserve your SEO and URL structures",
                  "Expert-led manual verification",
                  "Zero downtime during transition",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Zap className="h-3 w-3 fill-current" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual Mockup: Migration Flow */}
            <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-400">Shopify</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Old Store</span>
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="h-[2px] w-full bg-slate-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 border border-slate-200 rounded-full shadow-sm">
                      <ArrowLeftRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                    <span className="font-bold text-primary">Nepdora</span>
                  </div>
                  <span className="text-xs font-bold text-primary uppercase">New Store</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full w-full bg-primary/20 animate-pulse" />
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                  <span>Migrating Products...</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="h-20 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    Inventory.csv
                  </div>
                  <div className="h-20 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    Customers.json
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why businesses are moving to Nepdora.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            Join hundreds of Nepali brands that have escaped high fees and technical limitations.
          </p>
        </div>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Local Payment Issues?</h3>
              <p className="leading-relaxed text-slate-500">
                Struggling with international payment gateways? Nepdora comes
                with eSewa, Khalti, and Fonepay built-in for a 100% success rate.
              </p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-transform group-hover:scale-110">
                <BadgePercent className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-xl font-bold">High Subscription Fees?</h3>
              <p className="leading-relaxed text-slate-500">
                Stop paying $30+/month plus transaction fees. Our plans start at a
                fraction of that cost, tailored specifically for the Nepali economy.
              </p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition-transform group-hover:scale-110">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Complex to Use?</h3>
              <p className="leading-relaxed text-slate-500">
                WordPress too technical? Shopify too rigid? Nepdora offers the
                perfect balance of drag-and-drop power and deep local customization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Paths */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Compare & Switch
            </h2>
            <p className="text-slate-400">Select your current platform to see how much you can save.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCompetitors.map(c => (
              <Link
                key={c.slug}
                href={`/switch/from-${c.slug}-to-nepdora`}
                className="group hover:border-primary rounded-3xl border border-slate-700 bg-slate-800 p-8 transition-all hover:bg-slate-800/50"
              >
                <div className="mb-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Migrate from
                </div>
                <h3 className="group-hover:text-primary mb-8 text-2xl font-black transition-colors">
                  {c.name}
                </h3>
                <div className="text-primary flex items-center gap-2 font-bold text-sm">
                  View Comparison
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h4 className="mb-8 text-xs font-bold tracking-widest text-slate-500 uppercase">
              OTHER PLATFORMS WE SUPPORT MIGRATION FROM:
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {ALL_COMPETITORS.filter(c => !topCompetitors.includes(c.slug))
                .slice(0, 10)
                .map(c => (
                  <Link
                    key={c.slug}
                    href={`/switch/from-${c.slug}-to-nepdora`}
                    className="rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:border-slate-700 hover:text-white"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-24 border-t border-slate-100">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-12 rounded-[40px] border border-slate-200 bg-white p-12 shadow-xl md:flex-row">
            <div className="bg-primary/10 flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl">
              <Zap className="text-primary h-10 w-10" />
            </div>
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-bold">
                Want us to handle the migration?
              </h2>
              <p className="mb-0 text-lg leading-relaxed text-slate-500">
                Our expert team can help you move your existing products,
                customers, and design from any platform to Nepdora in less than
                48 hours. Let us handle the technical heavy lifting.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-2xl bg-slate-900 px-8 py-5 font-bold text-white transition-all hover:scale-105 active:scale-95"
            >
              Talk to Migration Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

