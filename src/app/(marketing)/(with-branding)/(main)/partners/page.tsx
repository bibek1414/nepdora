import { SITE_NAME, buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  ChevronRight,
  Users,
  TrendingUp,
  Globe,
  Briefcase,
  Code2,
  Building2,
  User,
  Store,
  DollarSign,
  Headphones,
  Layout,
  MousePointer2,
  Smartphone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { PartnersVisualMock } from "@/components/marketing/patners/partners-visual-mock";

import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

export const metadata = buildMarketingMetadata({
  title: "Nepdora Partner Program - Grow Your Agency or Freelance Business",
  description:
    "Join the Nepdora Partner Program and earn by helping others build websites. Perfect for agencies, freelancers, and developers in Nepal.",
  path: "/partners",
  keywords: [
    "nepdora partner program",
    "website agency nepal",
    "freelance web developer nepal",
    "earn money building websites nepal",
    "nepdora affiliate nepal",
  ],
});

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${SITE_NAME} Partner Program`,
  description:
    "Join the Nepdora Partner Program and earn by helping others build websites. Perfect for agencies, freelancers, and developers in Nepal.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  areaServed: {
    "@type": "Country",
    name: "Nepal",
  },
};

export default function PartnersPage() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="partners-program-schema" data={schema} />
      
      <div className="container mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Partners", href: "/partners" }]} />
      </div>
      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div>
              <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Become a Partner &{" "}
                <span className="text-primary">Grow Faster.</span>
              </h1>
              <p className="mb-8 text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
                Earn by helping others build websites. Join the Nepdora Partner
                Program and unlock new income opportunities for your agency or
                freelance business.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/partners"
                  className="bg-primary -md inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95"
                >
                  Join as a Partner
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Become a Partner
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <PartnersVisualMock />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Scale your agency with Nepdora.
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-slate-500">
            Nepdora's Partner Program is designed for agencies, freelancers,
            developers, and entrepreneurs who want to grow their income by
            helping others build and launch websites. Instead of working alone,
            you can leverage Nepdora's powerful platform to serve more clients
            faster and more efficiently.
          </p>
        </div>
      </section>

      {/* Why Become a Partner Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Why become a{" "}
                <span className="text-primary">Nepdora Partner?</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed font-medium text-slate-500">
                Becoming a Nepdora partner allows you to expand your services
                without increasing your workload. You can build websites for
                clients, manage multiple projects, and deliver high-quality
                results using Nepdora's tools.
              </p>
              <p className="text-lg leading-relaxed font-medium text-slate-500">
                This means more clients, faster delivery, and better scalability
                for your business.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="-sm rounded-2xl border border-slate-200 bg-white p-6">
                <TrendingUp className="text-primary mb-4 h-8 w-8" />
                <h4 className="mb-2 text-lg font-semibold text-slate-900">
                  Better Scale
                </h4>
                <p className="text-sm font-medium text-slate-500">
                  Handle 10x more clients with automated workflows.
                </p>
              </div>
              <div className="-sm mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <Zap className="mb-4 h-8 w-8 text-amber-500" />
                <h4 className="mb-2 text-lg font-semibold text-slate-900">
                  Fast Delivery
                </h4>
                <p className="text-sm font-medium text-slate-500">
                  Go from brief to live in days, not months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Partner <span className="text-primary">Benefits.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Everything you need to grow your agency business.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Layout,
                title: "Powerful Tools",
                desc: "Access to powerful website-building tools and templates.",
              },
              {
                icon: Zap,
                title: "Faster Delivery",
                desc: "Deliver high-quality projects for your clients in record time.",
              },
              {
                icon: Globe,
                title: "Multi-site Management",
                desc: "Ability to manage multiple websites easily from one hub.",
              },
              {
                icon: DollarSign,
                title: "Increased Earnings",
                desc: "Unlock new revenue streams and higher profit margins.",
              },
              {
                icon: Headphones,
                title: "Priority Support",
                desc: "Get priority support and exclusive partner resources.",
              },
              {
                icon: TrendingUp,
                title: "Business Growth",
                desc: "Opportunity to grow your business alongside Nepdora.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 transition-all"
              >
                <div className="text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
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

      {/* Who Should Join Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Who should <span className="text-primary">join?</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              If you build or manage websites, this program is built for you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Code2, title: "Freelance Devs" },
              { icon: Building2, title: "Web Agencies" },
              { icon: TrendingUp, title: "Digital Marketers" },
              { icon: Briefcase, title: "IT Companies" },
              { icon: User, title: "Consultants" },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm hover:-md flex w-40 flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all"
              >
                <item.icon className="text-primary mx-auto mb-4 h-8 w-8" />
                <h4 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How it <span className="text-primary">works.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Join the Program",
                desc: "Sign up as a Nepdora partner and get access to the platform.",
              },
              {
                step: "2",
                title: "Build for Clients",
                desc: "Use Nepdora to create professional websites quickly.",
              },
              {
                step: "3",
                title: "Manage & Scale",
                desc: "Handle multiple clients and projects from one dashboard.",
              },
              {
                step: "4",
                title: "Earn & Grow",
                desc: "Grow your income while helping businesses succeed online.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm relative rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="bg-primary -md absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold text-white">
                  {item.step}
                </div>
                <h4 className="mt-4 mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nepdora Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Focus on <span className="text-primary">Value Delivery.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Nepdora helps you focus on what matters - delivering value to
                your clients. Instead of spending time on complex development,
                hosting, and maintenance, you can use Nepdora to streamline your
                workflow and increase productivity.
              </p>
              <div className="border-primary/20 bg-primary/5 rounded-2xl border p-6">
                <div className="flex gap-4">
                  <Zap className="text-primary h-6 w-6 shrink-0" />
                  <div>
                    <div className="text-primary mb-1 text-sm font-semibold">
                      Pro Tip
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Instead of building everything from scratch, use Nepdora
                      to speed up your workflow. This allows you to take more
                      clients, deliver faster, and increase your overall
                      revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <MousePointer2 className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    Visual Drag & Drop Builder
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Smartphone className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    Mobile-First Architecture
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Search className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    Automated SEO Optimization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grow Your Business Section - Clean white background */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Grow Your Business.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-medium text-slate-500">
            The demand for websites in Nepal is growing rapidly. By becoming a
            Nepdora partner, you can tap into this demand and build a strong,
            scalable business. Whether you are a freelancer or a full-scale
            agency, Nepdora gives you the tools to succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-4 w-4" />
              Scalable Business
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-4 w-4" />
              High Demand
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-4 w-4" />
              Modern Tools
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Clean white background */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to grow your business with Nepdora?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Join the Partner Program today and start building websites for
                your clients with ease.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/partners"
                  className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95"
                >
                  Join Now
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
