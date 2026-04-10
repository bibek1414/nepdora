import { Metadata } from "next";
import { SITE_NAME, buildMarketingMetadata, absoluteUrl } from "@/lib/seo";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  ChevronRight,
  Users,
  Star,
  MessageSquare,
  Search,
  Globe,
  Layout,
  Smartphone,
  CreditCard,
  Clock,
  Award,
  Briefcase,
  TrendingUp,
  UserCheck,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { ExpertsVisualMock } from "@/components/marketing/experts/experts-visual-mock";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata = buildMarketingMetadata({
  title: "Hire Expert Website Builders in Nepal | Nepdora Expert Hub",
  description:
    "Connect with experienced designers and developers to build fast, modern, and high-converting websites with Nepdora. Hire verified professionals in Nepal.",
  path: "/experts",
  keywords: [
    "hire web developer nepal",
    "website designers kathmandu",
    "nepdora experts",
    "freelance website builder nepal",
    "ecommerce experts nepal",
  ],
});

export default function ExpertsPage() {
  const expertsSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Nepdora Expert Hub",
    description:
      "Hire verified website developers and designers in Nepal to build and scale your business.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    areaServed: "NP",
    serviceType: "Website Development",
  };

  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="experts-schema" data={expertsSchema} />
      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div>
              <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Hire Expert Website{" "}
                <span className="text-primary">Builders in Nepal.</span>
              </h1>
              <p className="mb-8 text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
                Work with experienced designers and developers to build fast,
                modern, and high-converting websites with Nepdora.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/experts"
                  className="bg-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white -md transition-all hover:scale-105 active:scale-95"
                >
                  Find Experts
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/experts"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Hire Now
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <ExpertsVisualMock />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Finding the right expert shouldn't be hard.
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-slate-500">
            Finding the right website expert in Nepal can be challenging. With
            Nepdora Expert Hub, you can connect with skilled professionals who
            understand your business needs and can help you build, customize,
            and optimize your website quickly and efficiently.
          </p>
        </div>
      </section>

      {/* What are Nepdora Experts Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                What are <span className="text-primary">Nepdora Experts?</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Nepdora Experts are experienced designers, developers, and
                digital professionals who specialize in building websites using
                modern tools and best practices.
              </p>
              <div className="space-y-4">
                {[
                  "Design professional websites",
                  "Build and customize your online presence",
                  "Optimize for speed and SEO",
                  "Integrate payment systems like eSewa and Khalti",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 -sm">
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-xl">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      Verified Skills
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                      Every expert is vetted by Nepdora.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Star className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      Top Rated
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                      Work with the best talent in Nepal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Hire an Expert Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why hire an <span className="text-primary">Expert?</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Hiring a website expert saves you time and ensures quality
              results.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 -sm">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                Save Time & Effort
              </h3>
              <p className="mb-6 leading-relaxed font-medium text-slate-500">
                Instead of figuring everything out yourself, you can work with
                professionals who know how to build scalable, high-performing
                websites.
              </p>
              <div className="text-primary flex items-center gap-3 font-semibold">
                <Clock className="h-5 w-5" />
                Focus on your business
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 -sm">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                Ensure Quality
              </h3>
              <p className="mb-6 leading-relaxed font-medium text-slate-500">
                Experts help you avoid common mistakes, improve performance, and
                deliver a better experience to your customers.
              </p>
              <div className="text-primary flex items-center gap-3 font-semibold">
                <TrendingUp className="h-5 w-5" />
                Better ROI for your site
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Expert <span className="text-primary">Benefits.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: UserCheck,
                title: "Skilled Professionals",
                desc: "Access to verified and skilled professionals in Nepal.",
              },
              {
                icon: Zap,
                title: "Faster Completion",
                desc: "Get your project completed in record time.",
              },
              {
                icon: Layout,
                title: "High-Quality Design",
                desc: "Modern and professional design for your brand.",
              },
              {
                icon: Rocket,
                title: "Better Performance",
                desc: "Optimized for speed and user experience.",
              },
              {
                icon: Search,
                title: "SEO-Optimized",
                desc: "Built with search engines in mind from day one.",
              },
              {
                icon: MessageSquare,
                title: "Reliable Support",
                desc: "Direct communication and ongoing support.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed font-medium text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Use This Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Who is this <span className="text-primary">for?</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Building2, title: "Businesses" },
              { icon: Rocket, title: "Startups" },
              { icon: Users, title: "Agencies" },
              { icon: Briefcase, title: "Entrepreneurs" },
              { icon: UserCheck, title: "Everyone" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex w-36 flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center -sm transition-all hover:-md"
              >
                <item.icon className="text-primary mx-auto mb-3 h-8 w-8" />
                <h4 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
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
                title: "Find an Expert",
                desc: "Browse and choose from verified Nepdora experts.",
              },
              {
                step: "2",
                title: "Connect & Discuss",
                desc: "Share your requirements and goals with them.",
              },
              {
                step: "3",
                title: "Build Your Website",
                desc: "The expert creates or improves your website.",
              },
              {
                step: "4",
                title: "Launch & Grow",
                desc: "Go live with a professional, high-performing website.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 -sm"
              >
                <div className="bg-primary absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold text-white -md">
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

      {/* Why Nepdora Experts Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Expertise without{" "}
                <span className="text-primary">the complexity.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Unlike traditional hiring, Nepdora Experts are already familiar
                with modern website-building workflows. This means faster
                delivery, better quality, and smoother communication.
              </p>
              <div className="border-primary/20 bg-primary/5 rounded-2xl border p-6">
                <div className="flex gap-4">
                  <Zap className="text-primary h-6 w-6 shrink-0" />
                  <div>
                    <div className="text-primary mb-1 text-sm font-semibold">
                      Pro Tip
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Even if you plan to build your website yourself,
                      consulting an expert can save time and help you avoid
                      costly mistakes. A short consultation can significantly
                      improve your final result.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 -sm">
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Zap className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    Modern Workflows
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    Faster Delivery
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <ShieldCheck className="text-primary h-5 w-5" />
                  <span className="font-medium text-slate-700">
                    Better Quality
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Clean white background */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center -sm">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to build with an expert?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Connect with a Nepdora expert today and take your business to
                the next level.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/experts"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white -md transition-all hover:scale-105 active:scale-95"
                >
                  Find Experts
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/experts"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
