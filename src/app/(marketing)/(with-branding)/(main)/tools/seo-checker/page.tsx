import { Metadata } from "next";
import {
  Search,
  TrendingUp,
  MapPin,
  Globe,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Target,
  FileText,
  Link2,
  Smartphone,
  Zap,
  Award,
  Users,
  Eye,
  Hash,
  Star,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title:
    "Free SEO Checker for Nepali Websites | Rank Higher on Google | Nepdora",
  description:
    "Analyze your website's SEO performance and get actionable tips to rank #1 in Nepal. Specialized for the Nepalese search landscape with local keyword targeting.",
  path: "/tools/seo-checker",
  noIndex: true,
  keywords: [
    "seo checker nepal",
    "free seo tool nepal",
    "website audit nepal",
    "rank higher nepal",
    "nepdora seo",
  ],
});

export default function SEOChecker() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Nepali SEO Checker",
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
              Built for Nepali Businesses
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Free <span className="text-primary">SEO Checker</span> for Nepal
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Get a detailed SEO report for your website. Learn how to beat your
              competitors in the Nepali search market with
              <span className="text-primary font-semibold"> Nepdora</span>.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Tool Placeholder */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <Search className="text-primary mb-4 h-12 w-12" />
              <div className="text-primary mb-2 font-mono text-sm font-semibold">
                NEPDORA SEO ANALYZER
              </div>
              <p className="mb-6 text-sm font-medium text-slate-400">
                Enter your website URL to get a free SEO analysis
              </p>
              <div className="flex w-full max-w-md gap-3">
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  className="focus:border-primary focus:ring-primary flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none"
                />
                <button className="bg-primary rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105">
                  Analyze SEO
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SEO Matters in Nepal */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why SEO is different{" "}
              <span className="text-primary">in Nepal</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Ranking in Nepal requires a unique blend of local and global
              strategies
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Local keywords matter",
                desc: "Target city-specific searches like 'best restaurant in Kathmandu' or 'IT company in Pokhara'.",
              },
              {
                icon: Smartphone,
                title: "Mobile-first indexing",
                desc: "70%+ of searches in Nepal happen on mobile. Google prioritizes mobile-friendly sites.",
              },
              {
                icon: Globe,
                title: "Bilingual searches",
                desc: "Nepali users search in both Nepali and English. Optimize for both languages.",
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

      {/* SEO Statistics Nepal */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="bg-primary/5 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-medium">
              Nepali Search Data
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              The <span className="text-primary">opportunity</span> is huge
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Understanding Nepal's digital landscape gives you an edge
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "70%+", label: "Mobile searches", icon: Smartphone },
              {
                value: "40%+",
                label: "Businesses have no website",
                icon: AlertCircle,
              },
              {
                value: "3x",
                label: "Higher CTR for #1 position",
                icon: TrendingUp,
              },
              { value: "85%", label: "Users ignore paid ads", icon: Eye },
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

      {/* What Nepdora Checks */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                What <span className="text-primary">Nepdora</span> SEO Checker
                analyzes
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Our free tool gives you a comprehensive SEO audit with
                actionable recommendations tailored for the Nepali market.
              </p>
              <div className="space-y-4">
                {[
                  "Meta titles & descriptions optimization",
                  "Mobile responsiveness score",
                  "Local keyword targeting (Nepali cities)",
                  "Page speed on Nepali networks",
                  "Image alt tags & structure",
                  "Internal & external link analysis",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Meta Title
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    Good ✓
                  </span>
                </div>
                <p className="text-sm text-slate-900">
                  Best Restaurant in Kathmandu | Your Brand
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Mobile Score
                  </span>
                  <span className="text-sm font-semibold text-amber-600">
                    Needs Work ⚠
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Your site is not fully responsive
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Local Keywords
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    Good ✓
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Targeting 5+ Nepali cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local SEO Tips */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Local SEO tips for{" "}
              <span className="text-primary">Nepali businesses</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Actionable strategies to rank higher in your city
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Add location pages",
                desc: "Create dedicated pages for each city you serve (Kathmandu, Pokhara, Chitwan, etc.)",
              },
              {
                icon: Hash,
                title: "Use local keywords",
                desc: "Include 'near me' and city names in your content naturally.",
              },
              {
                icon: Star,
                title: "Google Business Profile",
                desc: "Claim and optimize your GBP with accurate NAP info.",
              },
              {
                icon: Users,
                title: "Get Nepali backlinks",
                desc: "Build links from local directories and Nepali news sites.",
              },
              {
                icon: FileText,
                title: "Write in Nepali",
                desc: "Create content in Nepali language for broader reach.",
              },
              {
                icon: Smartphone,
                title: "Mobile optimization",
                desc: "Ensure your site loads fast on NTC/Ncell networks.",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <tip.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    {tip.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {tip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Nepdora Helps SEO */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              <span className="text-primary">Nepdora</span> gives you SEO
              superpowers
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Built-in SEO features that help you rank higher without technical
              knowledge
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Auto meta tags",
                desc: "Automatic meta title and description generation based on your content.",
              },
              {
                icon: Link2,
                title: "Clean URLs",
                desc: "SEO-friendly URL structure that Google loves.",
              },
              {
                icon: Zap,
                title: "Fast loading",
                desc: "Speed optimized for Nepal's networks (improves Core Web Vitals).",
              },
              {
                icon: FileText,
                title: "Schema markup",
                desc: "Built-in structured data for rich snippets in search results.",
              },
              {
                icon: Search,
                title: "XML sitemap",
                desc: "Auto-generated sitemap submitted to Google.",
              },
              {
                icon: Award,
                title: "Local business SEO",
                desc: "Specialized templates for Nepali businesses.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After SEO Results */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Real SEO results from{" "}
              <span className="text-primary">Nepdora clients</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              See how businesses improved their search rankings
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                business: "Brainstorm Global Education",
                result: "#1 for 'study abroad Nepal'",
                improvement: "+340% organic traffic",
              },
              {
                business: "xInfin Consultants",
                result: "#1 for 'accounting services Kathmandu'",
                improvement: "+200% leads",
              },
              {
                business: "Bato Ma Tours",
                result: "#1 for 'Nepal tour packages'",
                improvement: "+280% bookings",
              },
              {
                business: "Urban Style",
                result: "#1 for 'online shopping Nepal'",
                improvement: "+400% revenue",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Award className="text-primary h-5 w-5" />
                  <span className="text-primary text-sm font-semibold">
                    Success Story
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  {story.business}
                </h3>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  {story.result}
                </p>
                <p className="text-sm font-medium text-emerald-600">
                  {story.improvement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common SEO Mistakes */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Common SEO mistakes{" "}
              <span className="text-primary">Nepali businesses make</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Avoid these pitfalls to rank higher
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "No mobile-friendly website design",
              "Ignoring local keywords and city names",
              "Slow loading times on Nepali networks",
              "Missing or poor meta descriptions",
              "No Google Business Profile setup",
              "Not optimizing for Nepali language searches",
              "Broken internal and external links",
              "No structured data/schema markup",
            ].map((mistake, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <span className="font-medium text-slate-700">{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free SEO Consultation Offer */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <BarChart3 className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Get a free SEO consultation
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Our SEO experts will analyze your site and show you exactly how
                to rank #1 in Nepal.
              </p>
              <Link
                href="/contact"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Book Free Consultation
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - SEO Specific */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                q: "How long does SEO take in Nepal?",
                a: "Typically 3-6 months to see significant results. With Nepdora's built-in SEO, you start with a strong foundation from day one.",
              },
              {
                q: "Does Nepdora handle SEO automatically?",
                a: "Nepdora provides automatic meta tags, sitemaps, schema markup, and speed optimization. You just need to add quality content.",
              },
              {
                q: "Do I need to hire an SEO expert?",
                a: "Not necessarily. Nepdora handles technical SEO. For content and local strategy, our guides and tools help you do it yourself.",
              },
              {
                q: "Can Nepdora help with local SEO?",
                a: "Yes! Our templates are designed for Nepali businesses with local SEO features built-in.",
              },
              {
                q: "Will my site be mobile-friendly?",
                a: "Absolutely. All Nepdora websites are fully responsive and mobile-optimized.",
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

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Rocket className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to rank #1 in Nepal?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Build your SEO-optimized website with Nepdora today and start
                getting found by customers.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
                >
                  Start Building for Free
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/showcase"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  See SEO Success Stories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
