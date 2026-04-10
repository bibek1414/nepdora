import { Metadata } from "next";
import {
  Zap,
  Smartphone,
  Globe,
  Clock,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Server,
  Wifi,
  Activity,
  Rocket,
  Database,
  Cloud,
  Timer,
  Gauge,
  Network,
} from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Website Speed Test Nepal | Optimize for Local Networks | Nepdora",
  description:
    "Check how fast your website loads in Nepal. Nepdora builds websites pre-optimized for NTC, Ncell, WorldLink, and all local ISPs.",
  path: "/tools/website-speed-test",
  noIndex: true,
  keywords: [
    "website speed test nepal",
    "ntc ncell speed test",
    "nepdora speed optimization",
    "optimize website nepal",
    "fast website builder nepal",
  ],
});

export default function SpeedTest() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Nepali Website Speed Test",
          provider: {
            "@type": "Organization",
            name: "Nepdora",
          },
        }}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Built for Nepal
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Website <span className="text-primary">Speed Test</span> Nepal
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Test your website's performance on Nepalese networks.
              <span className="text-primary font-semibold"> Nepdora</span>{" "}
              builds websites pre-optimized for NTC, Ncell, WorldLink, and all
              local ISPs.
            </p>
          </div>
        </div>
      </section>

      {/* Speed Test Tool Placeholder */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <Activity className="text-primary mb-4 h-12 w-12" />
              <div className="text-primary mb-2 font-mono text-sm font-semibold">
                NEPDORA SPEED ANALYZER
              </div>
              <p className="mb-6 text-sm font-medium text-slate-400">
                Enter your website URL to test performance on Nepali networks
              </p>
            <div className="flex w-full max-w-md gap-3">
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  className="focus:border-primary focus:ring-primary flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none"
                />
                <Link href="/admin/signup">
                  <button className="bg-primary rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 whitespace-nowrap">
                    Test Speed
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Speed Matters for Nepali Businesses */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why speed matters for{" "}
              <span className="text-primary">Nepali businesses</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              In Nepal's unique internet landscape, every second counts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Nepali users are impatient",
                desc: "53% of mobile users in Nepal abandon sites taking over 3 seconds to load.",
              },
              {
                icon: TrendingUp,
                title: "Speed = Revenue",
                desc: "Nepdora clients see 2-3x higher conversions after switching to our optimized platform.",
              },
              {
                icon: Users,
                title: "Local network challenges",
                desc: "Nepali ISPs have variable speeds. Nepdora sites are tested on all major networks.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <item.icon className="text-primary mb-4 h-8 w-8" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepdora Speed Stats */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="bg-primary/5 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Nepdora Performance Data
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Built on Nepdora ={" "}
              <span className="text-primary">Faster by default</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Real performance data from websites built with Nepdora
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                value: "93+",
                label: "Average Google PageSpeed Score",
                icon: Gauge,
              },
              {
                value: "1.8s",
                label: "Average load time on NTC 4G",
                icon: Timer,
              },
              {
                value: "100%",
                label: "Mobile responsive out of box",
                icon: Smartphone,
              },
              { value: "0", label: "Manual optimization needed", icon: Zap },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <stat.icon className="text-primary mx-auto mb-3 h-8 w-8" />
                <div className="text-primary mb-1 text-3xl font-bold">
                  {stat.value}
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepdora Optimization Features */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                How <span className="text-primary">Nepdora</span> makes your
                site faster
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Every Nepdora website comes with enterprise-grade speed
                optimizations built-in. No plugins. No complex setups.
              </p>
              <div className="space-y-4">
                {[
                  "Nepal-optimized CDN with local edge locations",
                  "Automatic image compression without quality loss",
                  "Minified CSS, JS, and HTML out of the box",
                  "Lazy loading for images and videos",
                  "Database query optimization for faster responses",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Cloud className="text-primary h-5 w-5" />
                <span className="font-medium text-slate-700">
                  Cloudflare CDN integrated
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Database className="text-primary h-5 w-5" />
                <span className="font-medium text-slate-700">
                  Optimized database queries
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Rocket className="text-primary h-5 w-5" />
                <span className="font-medium text-slate-700">
                  Server-level caching enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Test Results */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Tested on all{" "}
              <span className="text-primary">Nepali networks</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Nepdora websites are performance-tested across Nepal's major ISPs
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                network: "NTC 4G",
                speed: "1.8s",
                grade: "A",
                color: "emerald",
              },
              {
                network: "Ncell 4G",
                speed: "1.6s",
                grade: "A+",
                color: "emerald",
              },
              {
                network: "WorldLink Fiber",
                speed: "0.9s",
                grade: "A++",
                color: "emerald",
              },
              {
                network: "CG Net",
                speed: "1.1s",
                grade: "A+",
                color: "emerald",
              },
              {
                network: "Subisu",
                speed: "1.3s",
                grade: "A",
                color: "emerald",
              },
              {
                network: "Vianet",
                speed: "1.0s",
                grade: "A+",
                color: "emerald",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Network className="text-primary h-5 w-5" />
                  <span className="font-semibold text-slate-900">
                    {item.network}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold text-slate-900">
                    {item.speed}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 mt-8 rounded-2xl p-5 text-center">
            <p className="text-sm font-medium text-slate-600">
              ⚡ Based on real tests of 1,000+ Nepdora websites across Nepal
            </p>
          </div>
        </div>
      </section>

      {/* Before/After: Traditional vs Nepdora */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Traditional Website{" "}
              <span className="text-primary">vs Nepdora</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              The speed difference is visible in every metric
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-rose-500" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Traditional Development
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  { metric: "Load Time", value: "5-8 seconds", bad: true },
                  { metric: "PageSpeed Score", value: "45-65", bad: true },
                  {
                    metric: "Image Optimization",
                    value: "Manual needed",
                    bad: true,
                  },
                  {
                    metric: "CDN Setup",
                    value: "Complex configuration",
                    bad: true,
                  },
                  { metric: "Mobile Score", value: "Poor", bad: true },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between border-b border-slate-100 pb-3"
                  >
                    <span className="font-medium text-slate-600">
                      {item.metric}
                    </span>
                    <span className="font-semibold text-rose-600">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-primary/20 bg-primary/5 rounded-2xl border p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <Zap className="text-primary h-6 w-6" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Built with Nepdora
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  { metric: "Load Time", value: "0.9-2 seconds", good: true },
                  { metric: "PageSpeed Score", value: "90-100", good: true },
                  {
                    metric: "Image Optimization",
                    value: "Automatic",
                    good: true,
                  },
                  { metric: "CDN Setup", value: "Pre-configured", good: true },
                  { metric: "Mobile Score", value: "Excellent", good: true },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="border-primary/10 flex items-center justify-between border-b pb-3"
                  >
                    <span className="font-medium text-slate-700">
                      {item.metric}
                    </span>
                    <span className="text-primary font-semibold">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Real results from{" "}
              <span className="text-primary">Nepdora clients</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              See how businesses improved their speed and conversions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                business: "Brainstorm Global Education",
                before: "6.2s",
                after: "1.4s",
                improvement: "78%",
              },
              {
                business: "xInfin Consultants",
                before: "5.8s",
                after: "1.6s",
                improvement: "72%",
              },
              {
                business: "Bato Ma Tours",
                before: "7.1s",
                after: "1.9s",
                improvement: "73%",
              },
              {
                business: "Urban Style",
                before: "4.9s",
                after: "1.2s",
                improvement: "76%",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-4 font-semibold text-slate-900">
                  {story.business}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-500">
                      Before
                    </div>
                    <div className="text-2xl font-bold text-rose-500">
                      {story.before}
                    </div>
                  </div>
                  <ChevronRight className="text-primary h-6 w-6" />
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-500">
                      After
                    </div>
                    <div className="text-primary text-2xl font-bold">
                      {story.after}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-500">
                      Faster
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      {story.improvement}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Speed Audit Offer */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <BarChart3 className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Get a free speed audit
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Our team will analyze your current website and show you exactly
                how much faster it could be with Nepdora.
              </p>
              <Link
                href="/contact"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Request Free Audit
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Nepdora Specific */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                q: "How fast are Nepdora websites on Nepali networks?",
                a: "Nepdora websites load in under 2 seconds on average across all major Nepali ISPs including NTC, Ncell, WorldLink, and CG Net.",
              },
              {
                q: "Do I need to do anything to optimize speed?",
                a: "No. Every Nepdora website comes pre-optimized. Just build your site and it's automatically fast.",
              },
              {
                q: "Can I migrate my slow website to Nepdora?",
                a: "Yes! Our team can help migrate your existing content to a faster Nepdora website.",
              },
              {
                q: "Does Nepdora include CDN?",
                a: "Yes, every Nepdora website includes Cloudflare CDN with edge locations optimized for Nepal.",
              },
              {
                q: "Will my site be mobile-friendly automatically?",
                a: "Yes. All Nepdora templates are fully responsive and optimized for mobile devices.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Build with Nepdora */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Rocket className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to build a faster website with Nepdora?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Join 2,000+ Nepali businesses that trust Nepdora for speed and
                reliability.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
                >
                  Build a Faster Website
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/showcase"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  See Live Examples
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
