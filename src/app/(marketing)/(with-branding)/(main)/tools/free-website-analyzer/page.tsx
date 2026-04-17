import { WebsiteAnalyzer } from "@/components/marketing/tools/website-analyzer";
import { JsonLd } from "@/components/shared/json-ld";
import {
  BarChart,
  Zap,
  Search,
  Smartphone,
  Globe,
  ShieldCheck,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { buildMarketingMetadata } from "@/lib/seo";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata = buildMarketingMetadata({
  title:
    "Free Website SEO Analyzer in Nepal | Audit Speed, SEO & Mobile | Nepdora",
  description:
    "Analyze your website for SEO, speed, and mobile performance in seconds. Get a free website audit with actionable insights to improve rankings and beat competitors in Nepal.",
  path: "/free-website-analyzer",
  keywords: [
    "website analyzer Nepal",
    "free SEO audit Nepal",
    "website SEO checker Nepal",
    "website speed test Nepal",
    "mobile friendly test Nepal",
    "website audit tool Nepal",
  ],
});

const analyzerSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nepdora Website Analyzer",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NPR",
  },
  description:
    "A free tool to audit your website's SEO, speed, and mobile responsiveness for the Nepalese market.",
};

export default function FreeWebsiteAnalyzerPage() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="analyzer-schema" data={analyzerSchema} />

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              <BarChart className="h-4 w-4" />
              Free SEO Tool
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Free website <span className="text-primary">analyzer.</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Audit your website's SEO, speed, and mobile responsiveness for the
              Nepalese market. Discover how to improve your presence in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Analyzer Tool Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <WebsiteAnalyzer />
        </div>
      </section>

      {/* What We Analyze Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What our analyzer checks
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Get a comprehensive audit of your website's performance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: "SEO Optimization",
                desc: "Meta tags, headings, alt texts, and keyword analysis",
                color: "text-blue-500",
              },
              {
                icon: Zap,
                title: "Page Speed",
                desc: "Loading time, Core Web Vitals, and performance score",
                color: "text-amber-500",
              },
              {
                icon: Smartphone,
                title: "Mobile Responsiveness",
                desc: "Mobile-friendly design and touch-friendly elements",
                color: "text-emerald-500",
              },
              {
                icon: Globe,
                title: "Local SEO",
                desc: "Nepali market optimization and local keywords",
                color: "text-purple-500",
              },
              {
                icon: ShieldCheck,
                title: "Security",
                desc: "SSL certificate, HTTPS, and security headers",
                color: "text-red-500",
              },
              {
                icon: TrendingUp,
                title: "Competitor Analysis",
                desc: "Compare your site with local competitors",
                color: "text-indigo-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all"
              >
                <div
                  className={`bg-slate-50 ${item.color} mb-4 flex h-12 w-12 items-center justify-center rounded-xl`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
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

      {/* Why Website Audit Matters for Nepal */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium">
                🇳🇵 Nepal Focus
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Why website audit matters for{" "}
                <span className="text-primary">Nepali businesses</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed font-medium text-slate-500">
                In Nepal's unique digital landscape, a well-optimized website
                can be the difference between success and failure.
              </p>
              <ul className="space-y-3">
                {[
                  "Mobile internet users dominate - optimize for 3G/4G speeds",
                  "Local search behavior requires Nepali language optimization",
                  "Competition is growing - stay ahead with data-driven insights",
                  "Page speed directly impacts conversions on slow networks",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-center">
                <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Did you know?
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  53% of Nepali mobile users abandon websites that take more
                  than 3 seconds to load.
                </p>
                <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="bg-primary h-full w-[53%]" />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  53% bounce rate on slow sites
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What you'll get
            </h2>
            <p className="text-lg font-medium text-slate-500">
              A detailed report with actionable recommendations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "SEO Score",
                value: "0-100",
                desc: "Overall SEO health score",
                color: "text-blue-500",
              },
              {
                title: "Speed Score",
                value: "0-100",
                desc: "Page load performance",
                color: "text-amber-500",
              },
              {
                title: "Mobile Score",
                value: "0-100",
                desc: "Mobile responsiveness",
                color: "text-emerald-500",
              },
              {
                title: "Security Score",
                value: "0-100",
                desc: "Security best practices",
                color: "text-purple-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <div className={`text-3xl font-bold ${item.color} mb-2`}>
                  {item.value}
                </div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              📊 Plus detailed recommendations for improvement, competitor
              insights, and a custom action plan.
            </p>
          </div>
        </div>
      </section>

      {/* How to Improve Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How to improve your website
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Common issues and how to fix them
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                issue: "Slow loading speed",
                solution: "Optimize images, enable caching, use a CDN",
                impact: "High",
              },
              {
                issue: "Poor mobile experience",
                solution: "Use responsive design, test on multiple devices",
                impact: "High",
              },
              {
                issue: "Missing meta tags",
                solution: "Add title tags and meta descriptions to all pages",
                impact: "Medium",
              },
              {
                issue: "No SSL certificate",
                solution: "Install SSL certificate for HTTPS",
                impact: "Critical",
              },
              {
                issue: "Broken links",
                solution: "Regularly check and fix 404 errors",
                impact: "Medium",
              },
              {
                issue: "No local SEO",
                solution: "Add location pages and Nepali language content",
                impact: "High",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{item.issue}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.impact === "Critical"
                        ? "bg-red-100 text-red-700"
                        : item.impact === "High"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.impact} impact
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  💡 {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Better with Nepdora */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Zap className="h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Build a better website with Nepdora
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-slate-500">
                Create a website that's optimized for Nepal from day one. Fast,
                secure, and SEO-friendly out of the box.
              </p>
              <Link
                href="/admin/signup"
                className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              >
                Create My High-Speed Website
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is the website analyzer free?",
                a: "Yes, our website analyzer is completely free to use. No sign-up required.",
              },
              {
                q: "How accurate is the analysis?",
                a: "Our analyzer uses industry-standard metrics and is specifically calibrated for the Nepalese market.",
              },
              {
                q: "How often should I audit my website?",
                a: "We recommend auditing your website monthly to track improvements and catch issues early.",
              },
              {
                q: "Can I analyze my competitor's website?",
                a: "Yes, you can analyze any public website to see how you compare.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all"
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

      <CTASection />

      {/* SEO Closing Paragraph */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-base leading-relaxed font-medium text-slate-500">
            If you are looking to improve your website's performance in Nepal,
            our free website analyzer gives you the insights you need. From SEO
            to speed, get actionable recommendations to beat your competition.
          </p>
        </div>
      </section>
    </main>
  );
}
