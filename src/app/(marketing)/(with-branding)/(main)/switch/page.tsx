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
} from "lucide-react";

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
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Migration Center</span>
            </div>
            <h1 className="mb-8 text-4xl font-black tracking-tighter text-slate-900 italic md:text-6xl">
              Stop overpaying. <br />
              <span className="text-primary tracking-tight not-italic">
                Start growing in Nepal.
              </span>
            </h1>
            <p className="mb-10 text-xl leading-relaxed text-slate-600">
              Global builders aren't built for Nepal. We are. Experience local
              payment integrations, 24/7 Nepali support, and up to 80% lower
              costs when you migrate to Nepdora.
            </p>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <CreditCard className="text-primary mb-6 h-10 w-10" />
              <h3 className="mb-4 text-xl font-bold">Local Payment Issues?</h3>
              <p className="text-slate-500">
                Struggling with international payment gateways? Nepdora comes
                with eSewa, Khalti, and Fonepay built-in.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <BadgePercent className="mb-6 h-10 w-10 text-green-500" />
              <h3 className="mb-4 text-xl font-bold">
                High Subscription Fees?
              </h3>
              <p className="text-slate-500">
                Stop paying $30+/month for basic features. Our plans start at a
                fraction of that cost, tailored for the Nepali economy.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <ShieldAlert className="mb-6 h-10 w-10 text-orange-500" />
              <h3 className="mb-4 text-xl font-bold">Complex to Use?</h3>
              <p className="text-slate-500">
                WordPress too technical? Shopify too rigid? Nepdora offers the
                perfect balance of power and simplicity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Paths */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="mb-16 text-center text-3xl font-black md:text-5xl">
            Compare & Switch
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCompetitors.map(c => (
              <Link
                key={c.slug}
                href={`/switch/from-${c.slug}-to-nepdora`}
                className="group hover:border-primary rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center transition-all hover:bg-slate-800/50"
              >
                <div className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Migrate from
                </div>
                <h3 className="group-hover:text-primary mb-8 text-2xl font-black transition-colors">
                  {c.name}
                </h3>
                <div className="text-primary flex items-center justify-center gap-2 font-bold">
                  View Comparison
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h4 className="mb-8 font-bold text-slate-500">
              OTHER PLATFORMS WE SUPPORT MIGRATION FROM:
            </h4>
            <div className="flex flex-wrap justify-center gap-4 opacity-50">
              {ALL_COMPETITORS.filter(c => !topCompetitors.includes(c.slug))
                .slice(0, 8)
                .map(c => (
                  <Link
                    key={c.slug}
                    href={`/switch/from-${c.slug}-to-nepdora`}
                    className="rounded-lg bg-slate-800 px-4 py-2 transition-opacity hover:opacity-100"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-12 rounded-[40px] border border-slate-200 bg-white p-12 shadow-xl md:flex-row">
            <div className="bg-primary/10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full">
              <Zap className="text-primary h-10 w-10" />
            </div>
            <div>
              <h2 className="mb-4 text-3xl font-bold">
                Want us to handle the migration?
              </h2>
              <p className="mb-0 text-lg text-slate-600">
                Our expert team can help you move your existing products,
                customers, and design from any platform to Nepdora in less than
                48 hours.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-slate-900 px-8 py-4 font-bold whitespace-nowrap text-white transition-all hover:bg-slate-800"
            >
              Talk to Migration Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
