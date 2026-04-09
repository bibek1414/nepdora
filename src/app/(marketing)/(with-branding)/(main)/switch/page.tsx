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
  CheckCircle2,
  XCircle,
  Receipt,
  ShieldCheck,
  TrendingDown,
  Clock,
  Users,
  Globe,
  Smartphone,
  Headphones,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Switch to Nepdora | Migrate Your Website Seamlessly | Nepal",
  description:
    "Tired of Shopify's high fees or Wix's payment issues in Nepal? Switch to Nepdora. Local payments, lower costs, and expert migration support.",
  path: "/switch",
  ogLabel: "Migration Hub",
});

// Competitors list including Blanxer
const COMPETITORS_FOR_SWITCH = [
  {
    slug: "shopify",
    name: "Shopify",
    description: "High fees, no local payments",
  },
  { slug: "wix", name: "Wix", description: "Limited Nepal integration" },
  {
    slug: "wordpress",
    name: "WordPress",
    description: "Complex setup, needs hosting",
  },
  {
    slug: "squarespace",
    name: "Squarespace",
    description: "Not built for Nepal",
  },
  {
    slug: "blanxer",
    name: "Blanxer",
    description: "All-in-one e-commerce & POS",
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    description: "Requires technical skills",
  },
  {
    slug: "webflow",
    name: "Webflow",
    description: "Expensive, steep learning curve",
  },
  {
    slug: "bigcommerce",
    name: "BigCommerce",
    description: "International focus, costly",
  },
];

const topCompetitors = [
  "shopify",
  "wix",
  "wordpress",
  "squarespace",
  "blanxer",
];
const featuredCompetitors = COMPETITORS_FOR_SWITCH.filter(c =>
  topCompetitors.includes(c.slug)
);

export default function SwitchHubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              <ArrowLeftRight className="h-4 w-4" />
              Migration Center
            </div>
            <h1 className="mb-6 text-4xl font-bold -tight text-slate-900 md:text-5xl lg:text-6xl">
              Build your website in Nepal <br />
              <span className="text-primary">From Rs 833/Month</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Nepal's Simplest Way to Go Online. Build a professional website
              for your Nepali E-Commerce and Service business in minutes. eSewa
              & Khalti payments, Nepali language, and hosting - all included.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold -tight text-slate-900 md:text-4xl">
              How Much Does It Cost to Build a Website in Nepal?
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Transparent NPR pricing. Start free or go full-featured for Rs
              10,000/year.
            </p>
          </div>
        </div>
      </section>

      {/* Migration Flow Section */}
      <section className="border-y border-slate-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold -tight text-slate-900 md:text-4xl">
                Seamless migration from any platform.
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Moving your store shouldn't be a nightmare. We've optimized the
                migration process to ensure you don't lose any data, SEO
                rankings, or customer trust.
              </p>
              <ul className="space-y-4">
                {[
                  "Automatic product and customer import",
                  "Preserve your SEO and URL structures",
                  "Expert-led manual verification",
                  "Zero downtime during transition",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full">
                      <Zap className="h-3 w-3" />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Migration Visual */}
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex flex-col items-center gap-2">
                  <div className="-sm flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400">
                      Old
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Your Platform
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center px-4">
                  <div className="relative h-[2px] w-full bg-slate-100">
                    <div className="bg-primary -sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2">
                      <ArrowLeftRight className="text-primary h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 border-primary/20 -sm flex h-16 w-16 items-center justify-center rounded-xl border">
                    <span className="text-primary text-xs font-bold">
                      Nepdora
                    </span>
                  </div>
                  <span className="text-primary text-xs font-medium">
                    New Store
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-2 w-full overflow-hidden rounded-full border border-slate-100">
                  <div className="bg-primary h-full w-4/5" />
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Migrating your data...</span>
                  <span className="text-primary font-semibold">80%</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center">
                    <p className="text-[10px] font-medium text-slate-400">
                      Products.csv
                    </p>
                  </div>
                  <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center">
                    <p className="text-[10px] font-medium text-slate-400">
                      Customers.json
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold -tight text-slate-900 md:text-4xl">
              Why businesses are moving to{" "}
              <span className="text-primary">Nepdora.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Join thousands of Nepali brands that have escaped high fees and
              technical limitations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Local Payment Issues?
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Struggling with international payment gateways? Nepdora comes
                with eSewa, Khalti, and Fonepay built-in for 100% success rate.
              </p>
            </div>

            <div className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BadgePercent className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                High Subscription Fees?
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Stop paying $30+/month plus transaction fees. Our plans start at
                Rs 833/month, tailored specifically for the Nepali economy.
              </p>
            </div>

            <div className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Complex to Use?
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                WordPress too technical? Shopify too rigid? Nepdora offers the
                perfect balance of drag-and-drop power and deep local
                customization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="border-y border-slate-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold -tight text-slate-900 md:text-4xl">
              Nepdora vs The Rest
            </h2>
            <p className="text-lg font-medium text-slate-500">
              See how we compare against popular platforms
            </p>
          </div>

          <div className="-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-4 border-slate-100 p-4 text-center">
              <div className="font-semibold text-slate-900">Feature</div>
              <div className="font-semibold text-slate-900">Shopify</div>
              <div className="font-semibold text-slate-900">Wix</div>
              <div className="font-semibold text-slate-900">Nepdora</div>
            </div>

            {[
              {
                label: "Monthly Cost (NPR)",
                shopify: "Rs 5,000+",
                wix: "Rs 3,000+",
                nepdora: "Rs 0 - Rs 1,667",
              },
              {
                label: "Yearly Cost (NPR)",
                shopify: "Rs 60,000+",
                wix: "Rs 36,000+",
                nepdora: "Rs 0 - Rs 20,000",
              },
              {
                label: "Transaction Fees",
                shopify: "2%",
                wix: "1.5%",
                nepdora: "0%",
              },
              {
                label: "eSewa/Khalti",
                shopify: "❌",
                wix: "❌",
                nepdora: "✅",
              },
              {
                label: "Nepali Support",
                shopify: "❌",
                wix: "❌",
                nepdora: "✅",
              },
              {
                label: "Local Logistics",
                shopify: "❌",
                wix: "❌",
                nepdora: "✅",
              },
              {
                label: "Mobile Optimized",
                shopify: "✅",
                wix: "✅",
                nepdora: "✅",
              },
              {
                label: "SEO Tools",
                shopify: "Basic",
                wix: "Basic",
                nepdora: "Advanced",
              },
              {
                label: "Loading Speed (Nepal)",
                shopify: "Slow",
                wix: "Slow",
                nepdora: "Fast",
              },
              {
                label: "Nepali Language",
                shopify: "❌",
                wix: "❌",
                nepdora: "✅",
              },
              {
                label: "AI Features",
                shopify: "❌",
                wix: "Basic",
                nepdora: "Advanced",
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 border-slate-100 p-4 text-center text-sm last:border-0"
              >
                <div className="font-medium text-slate-700">{row.label}</div>
                <div className="text-slate-600">{row.shopify}</div>
                <div className="text-slate-600">{row.wix}</div>
                <div className="text-primary font-semibold">{row.nepdora}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Paths - Featured Competitors */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold -tight text-slate-900 md:text-4xl">
              Compare & Switch
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Select your current platform to see how much you can save
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCompetitors.map(c => (
              <Link
                key={c.slug}
                href={`/switch/from-${c.slug}-to-nepdora`}
                className="group -sm hover:-md rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:-translate-y-1"
              >
                <div className="mb-2 text-xs font-medium text-slate-400">
                  Migrate from
                </div>
                <h3 className="group-hover:text-primary mb-2 text-lg font-bold text-slate-900 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {c.description}
                </p>
                <div className="text-primary mt-3 flex items-center justify-center gap-1 text-sm font-medium">
                  View Comparison
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Other Platforms */}
          <div className="mt-12 text-center">
            <h4 className="mb-6 text-xs font-semibold text-slate-400">
              Other platforms we support migration from:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {COMPETITORS_FOR_SWITCH.filter(
                c => !topCompetitors.includes(c.slug)
              ).map(c => (
                <Link
                  key={c.slug}
                  href={`/switch/from-${c.slug}-to-nepdora`}
                  className="hover:border-primary hover:text-primary rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-all"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="border-y border-slate-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold -tight text-slate-900 md:text-4xl">
                How much could you <span className="text-primary">save?</span>
              </h2>
              <p className="mb-6 text-lg font-medium text-slate-500">
                Calculate your potential savings by switching to Nepdora
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-slate-200 pb-3">
                  <span className="font-medium text-slate-700">
                    Current monthly spend
                  </span>
                  <span className="font-bold text-slate-900">
                    Rs 5,000 - Rs 15,000
                  </span>
                </div>
                <div className="flex items-center justify-between border-slate-200 pb-3">
                  <span className="font-medium text-slate-700">
                    Nepdora monthly cost
                  </span>
                  <span className="text-primary font-bold">
                    Rs 0 - Rs 1,667
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-slate-900">
                    Yearly savings
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    Rs 60,000+
                  </span>
                </div>
              </div>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <TrendingDown className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                80% Average Savings
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Businesses save an average of 80% on website costs after
                switching to Nepdora
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold -tight text-slate-900 md:text-4xl">
              Success stories from{" "}
              <span className="text-primary">businesses that switched</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                business: "Urban Style",
                from: "Shopify",
                saving: "70%",
                quote: "Switching saved us Rs 50,000+ annually",
              },
              {
                business: "Namaste Travels",
                from: "Wix",
                saving: "65%",
                quote: "Local payments made all the difference",
              },
              {
                business: "Fashion Hub",
                from: "Blanxer",
                saving: "80%",
                quote: "Better features at lower cost",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="-sm rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{story.business}</h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                    Saved {story.saving}
                  </span>
                </div>
                <p className="mb-3 text-sm font-medium text-slate-500">
                  Migrated from {story.from}
                </p>
                <p className="text-sm text-slate-600 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Support CTA */}
      <section className="border-slate-100 py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="-sm flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 md:flex-row">
            <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl">
              <Headphones className="text-primary h-8 w-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Want us to handle the migration?
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Our expert team can help you move your existing products,
                customers, and design from any platform to Nepdora in less than
                48 hours.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-primary -md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
            >
              Talk to Migration Expert
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-slate-900 px-8 py-16 text-center text-white">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold -tight md:text-4xl">
                Make the switch today
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-400">
                Take the first step towards a truly local digital presence. Join
                thousands of Nepali businesses on Nepdora.
              </p>
              <Link
                href="/create-website"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              >
                Start Free Trial
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Rocket(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
