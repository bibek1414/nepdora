import { Metadata } from "next";
import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  Smartphone,
  Lock,
  Globe,
  Layout,
  MousePointer2,
  Code2,
  Search,
  ChevronRight,
  Cpu,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { AiBuilderVisualMock } from "@/components/marketing/ai-builder/ai-builder-visual-mock";
import { JsonLd } from "@/components/shared/json-ld";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata = buildMarketingMetadata({
  title:
    "AI Website Builder in Nepal | Create Websites in Minutes Without Coding | Nepdora",
  description:
    "Create a professional website instantly using AI. Nepdora's AI website builder lets you generate, customize, and launch responsive websites in minutes—no coding required.",
  path: "/ai-website-builder-in-nepdora",
  keywords: [
    "AI website builder Nepal",
    "build website with AI",
    "generate website automatically",
    "no code website builder Nepal",
    "AI website generator Nepal",
    "Nepdora AI builder",
  ],
});

const aiBuilderSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nepdora AI Website Builder",
  operatingSystem: "Web",
  applicationCategory: "DeveloperApplication",
  description:
    "AI-powered website builder that creates stunning, responsive websites without coding.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NPR",
  },
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
};

export default function AiBuilderPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-500/10 selection:text-blue-600">
      <JsonLd id="ai-builder-schema" data={aiBuilderSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/2 rounded-full bg-purple-500/5 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-500/5 px-4 py-2 text-xs font-medium text-blue-600">
                AI-Powered Platform
              </div>
              <h1 className="mb-8 text-5xl leading-[0.95] font-bold tracking-tighter text-slate-900 md:text-7xl">
                Build websites <br />
                with <span className="text-blue-500">AI.</span>{" "}
                <span className="text-slate-400">Instantly.</span>
              </h1>
              <p className="mb-10 max-w-lg text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
                Nepdora's AI Website Builder turns your ideas into stunning,
                high-performance websites in minutes. No coding, no stress, just
                pure creativity.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/signup"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-500 px-10 py-5 text-base font-semibold text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
                >
                  Generate My AI Website
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-10 py-5 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50"
                >
                  See How it Works
                </Link>
              </div>

              <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="w-full text-sm font-medium md:w-auto">
                  Trusted by Creators
                </div>
                <div className="flex items-center gap-8 opacity-40">
                  <span className="cursor-default text-xl font-bold tracking-tighter">
                    AI
                  </span>
                  <span className="cursor-default text-xl font-bold tracking-tighter">
                    No-Code
                  </span>
                  <span className="cursor-default text-xl font-bold tracking-tighter">
                    Instant
                  </span>
                </div>
              </div>
            </div>

            <div className="relative lg:block">
              <AiBuilderVisualMock />
            </div>
          </div>
        </div>
      </section>

      {/* AI Smart Editing Section */}
      <section className="py-10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              AI-Powered Smart Editing
            </div>
            <h2 className="mt-4 mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Edit with <span className="text-blue-500">AI prompts</span>.
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Easily modify your website using AI. Generate sections with a
              prompt, auto-suggest design improvements, and rewrite content
              instantly.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium text-blue-500">
                    AI Prompt Example
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-6 text-lg font-medium text-slate-600 italic shadow-sm">
                  "Add a pricing section with three tiers and a FAQ section
                  below it."
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg">
                    Generating sections...
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Auto-SEO", desc: "Optimized automatically." },
                { title: "Smart Rewrite", desc: "Instant content edits." },
                { title: "Design Tips", desc: "Pro UI suggestions." },
                { title: "Quick Sections", desc: "Prompt to build." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md"
                >
                  <h4 className="mb-1 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Powerful tools for{" "}
              <span className="text-blue-500">everyone.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Whether you're a beginner or a developer, Nepdora gives you the
              flexibility to build exactly what you need.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: MousePointer2,
                title: "Drag & Drop Builder",
                desc: "Combine AI with manual control using a powerful drag-and-drop editor. Move components freely and customize styles with TailwindCSS.",
                color: "bg-orange-50 text-orange-500",
              },
              {
                icon: Globe,
                title: "Multi-Site Support",
                desc: "Manage multiple websites under one account with custom subdomains (e.g., yoursite.nepdora.com) and a centralized dashboard.",
                color: "bg-purple-50 text-purple-500",
              },
              {
                icon: Code2,
                title: "Developer Friendly",
                desc: "Built with React + TailwindCSS. JSON-based component structure and API-driven architecture for maximum flexibility.",
                color: "bg-emerald-50 text-emerald-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl"
              >
                <div
                  className={`h-16 w-16 rounded-2xl ${item.color} mb-8 flex items-center justify-center transition-transform group-hover:rotate-6`}
                >
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="leading-relaxed font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO & Performance Section */}
      <section className="relative overflow-hidden bg-white py-24 text-slate-900 md:py-32">
        <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-blue-500/5 blur-[120px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                SEO & Performance
              </div>
              <h2 className="mb-6 text-5xl font-bold tracking-tighter text-slate-900 md:text-5xl">
                Optimized for{" "}
                <span className="text-blue-500">speed & rankings.</span>
              </h2>
              <p className="mb-10 text-lg font-medium text-slate-500">
                Nepdora ensures your website is fast and discoverable with clean
                code, SEO-friendly structure, and fast loading pages.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: Search,
                    title: "Meta Tags",
                    desc: "Auto-generated tags.",
                  },
                  { icon: Zap, title: "Fast Load", desc: "Optimized assets." },
                  { icon: Lock, title: "Secure", desc: "SSL & Backups." },
                  {
                    icon: ShieldCheck,
                    title: "Reliable",
                    desc: "Scalable hosting.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs font-medium text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[48px] border border-slate-200 bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-400">
                  Performance Audit
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600">
                  Passed
                </div>
              </div>

              <div className="mb-8 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="mb-1 text-5xl font-bold text-slate-900">
                    99
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Performance
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-5xl font-bold text-slate-900">
                    100
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Accessibility
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-5xl font-bold text-slate-900">
                    98
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    SEO
                  </div>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[98%] bg-emerald-500" />
              </div>

              <div className="mt-6 text-center text-xs font-medium text-slate-400">
                *Based on Google Lighthouse scores
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section
        id="how-it-works"
        className="overflow-hidden bg-slate-50 py-24 md:py-32"
      >
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                    <Rocket className="h-24 w-24" />
                  </div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                      01
                    </div>
                    <h4 className="text-xl font-semibold text-slate-900">
                      Traditional Way
                    </h4>
                  </div>
                  <p className="mb-6 font-medium text-slate-500">
                    Hiring developers, writing thousands of lines of code, and
                    spending weeks on design and testing.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "High Development Costs",
                      "Time-Consuming Process",
                      "Technical Complexity",
                    ].map(item => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-medium text-slate-400"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="group relative overflow-hidden rounded-[32px] bg-blue-500 p-8 text-white shadow-2xl shadow-blue-500/30">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <Zap className="h-24 w-24 fill-white" />
                  </div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-blue-500">
                      02
                    </div>
                    <h4 className="text-xl font-semibold">
                      The Nepdora AI Way
                    </h4>
                  </div>
                  <p className="mb-6 font-medium text-white/80">
                    Describe what you need, and let AI generate a complete,
                    professional website in minutes.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Zero Coding Required",
                      "Instant Generation",
                      "AI-Powered Customization",
                    ].map(item => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-8 text-5xl font-semibold tracking-tighter text-slate-900 md:text-6xl">
                Stop coding. <br />
                <span className="text-blue-500">Start creating</span> with AI.
              </h2>
              <p className="mb-10 text-xl leading-relaxed font-medium text-slate-500">
                Building websites shouldn't require technical expertise. With
                Nepdora's AI, anyone can create a beautiful, functional website
                in minutes.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      No Coding Required
                    </h4>
                    <p className="text-sm text-slate-500">
                      Build without writing a single line of code
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Instant Generation
                    </h4>
                    <p className="text-sm text-slate-500">
                      Get your website in minutes, not weeks
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      AI-Powered Customization
                    </h4>
                    <p className="text-sm text-slate-500">
                      Edit with simple text prompts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                Templates
              </div>

              <h2 className="mt-4 mb-6 text-5xl leading-none font-bold tracking-tighter text-slate-900">
                Professionally <br />
                <span className="text-blue-500">designed templates.</span>
              </h2>

              <p className="text-lg font-medium text-slate-500">
                Choose from a wide collection of AI-optimized templates built
                for different industries. Each template is fully customizable
                and mobile responsive.
              </p>
            </div>

            <Link
              href="/templates"
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              View all templates
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "E-commerce",
                icon: Smartphone,
                desc: "Sell products with ease.",
              },
              {
                title: "Restaurants",
                icon: Layout,
                desc: "Showcase your menu.",
              },
              {
                title: "Portfolios",
                icon: Palette,
                desc: "Display your work.",
              },
              {
                title: "Business",
                icon: Globe,
                desc: "Professional landing pages.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-500">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-20 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
              AI Builder FAQ
            </div>

            <h2 className="mt-4 mb-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
              Common Questions
            </h2>

            <p className="text-lg font-medium text-slate-500">
              Everything you need to know about building with Nepdora AI.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                q: "Do I need coding skills?",
                a: "Not at all. Nepdora's AI Builder is designed for everyone. Just describe what you want, and the AI handles everything from layout to styling.",
              },
              {
                q: "Can I customize my website after AI generates it?",
                a: "Yes! You have full control with our drag-and-drop editor. Change colors, fonts, layouts, and content anytime.",
              },
              {
                q: "Is my website mobile responsive?",
                a: "Absolutely. All websites built with Nepdora are fully responsive and look great on all devices-desktop, tablet, and mobile.",
              },
              {
                q: "Can I use my own domain?",
                a: "Yes. You can connect your custom domain to your Nepdora website. We support custom domains with SSL certificates included.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 bg-white p-8 transition-colors hover:border-blue-500/30"
              >
                <h4 className="mb-4 flex items-center gap-3 text-xl font-semibold text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-xs text-blue-500">
                    Q
                  </div>
                  {item.q}
                </h4>

                <div className="pl-11">
                  <p className="leading-relaxed font-medium text-slate-600">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
