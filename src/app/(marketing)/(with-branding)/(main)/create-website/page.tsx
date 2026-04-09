import {
  SITE_NAME,
  buildMarketingMetadata,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  ChevronRight,
  MousePointer2,
  Layout,
  CreditCard,
  Smartphone,
  Search,
  Clock,
  DollarSign,
  XCircle,
  Globe,
  Code2,
  Briefcase,
  Store,
  User,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { CreateWebsiteMock } from "@/components/marketing/create-website/create-website-mock";

export const metadata = buildMarketingMetadata({
  title: "How to Create a Website in Nepal | Step-by-Step Guide",
  description:
    "Learn how to create a website in Nepal with templates, domain setup, eSewa or Khalti payments, and a fast launch workflow using Nepdora.",
  path: "/create-website",
});

const schema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: `How to Create a Website in Nepal with ${SITE_NAME}`,
  description: `A step-by-step guide to launching your website in Nepal using ${SITE_NAME}.`,
  step: [
    {
      "@type": "HowToStep",
      name: "Choose a Template",
      text: "Select from over 100+ professionally designed templates tailored for Nepali businesses.",
    },
    {
      "@type": "HowToStep",
      name: "Customize Your Design",
      text: "Use our drag-and-drop builder to add your content, images, and branding.",
    },
    {
      "@type": "HowToStep",
      name: "Connect Local Payments",
      text: "Activate eSewa and Khalti with one click to start accepting payments.",
    },
    {
      "@type": "HowToStep",
      name: "Launch Your Site",
      text: "Connect your custom .com.np or .com domain and go live instantly.",
    },
  ],
};

export default function CreateWebsitePage() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="create-website-how-to" data={schema} />
      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div>
              <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Create Your Website{" "}
                <span className="text-primary">in Minutes.</span>
              </h1>
              <p className="mb-8 text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
                Launch a professional website for your business instantly with
                Nepdora. Customize, publish, and grow — all in one place. No
                coding required.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Start Building for Free
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Explore Templates
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <CreateWebsiteMock />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Building in Nepal has never been easier.
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-slate-500">
            Whether you are starting a business, selling products, or showcasing
            your work, Nepdora gives you everything you need to create a
            powerful online presence without writing a single line of code.
          </p>
        </div>
      </section>

      {/* What You Can Create Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              What you can <span className="text-primary">create.</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Everything is designed to help you launch faster and grow your
              brand.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Business websites",
                desc: "Professional presence for your company.",
              },
              {
                icon: Store,
                title: "Online stores",
                desc: "Sell products across Nepal with ease.",
              },
              {
                icon: User,
                title: "Portfolio websites",
                desc: "Showcase your work and skills.",
              },
              {
                icon: Rocket,
                title: "Landing pages",
                desc: "High-converting pages for your campaigns.",
              },
              {
                icon: Briefcase,
                title: "Service websites",
                desc: "Book clients and manage your services.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
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

      {/* Why Use Nepdora Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Why use <span className="text-primary">Nepdora?</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Traditional website development can take weeks and cost a lot of
                money. With Nepdora, you get a faster and more affordable
                solution.
              </p>
              <div className="space-y-4">
                {[
                  "No need to hire developers",
                  "No hosting management required",
                  "No worrying about technical updates",
                  "Focus on your business growth",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-500">
                    Efficiency Score
                  </div>
                  <div className="text-primary font-semibold">99%</div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="bg-primary h-full w-[99%]" />
                </div>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <div className="mb-1 text-2xl font-bold text-slate-900">
                      10x
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      Faster Launch
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-2xl font-bold text-slate-900">
                      1/5
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      The Cost
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Powerful <span className="text-primary">Features.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MousePointer2,
                title: "Drag & Drop Builder",
                desc: "Easily design your website with a visual editor. No coding required.",
              },
              {
                icon: Layout,
                title: "Ready Templates",
                desc: "Choose from modern, professionally designed templates.",
              },
              {
                icon: Zap,
                title: "Fast Performance",
                desc: "Optimized for speed to give your users the best experience.",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                desc: "Your website looks perfect on all devices.",
              },
              {
                icon: Search,
                title: "Built-in Tools",
                desc: "SEO, analytics, and integrations included.",
              },
              {
                icon: CreditCard,
                title: "Payment Integration",
                desc: "Accept payments using eSewa, Khalti, and more.",
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
                title: "Choose a Template",
                desc: "Select a design that matches your business.",
              },
              {
                step: "2",
                title: "Customize Your Website",
                desc: "Edit text, images, and layout using the builder.",
              },
              {
                step: "3",
                title: "Add Features",
                desc: "Integrate payments, forms, and pages as needed.",
              },
              {
                step: "4",
                title: "Publish & Go Live",
                desc: "Launch your website instantly and start growing.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="bg-primary absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold text-white shadow-md">
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

      {/* Who Is This For Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Nepdora is perfect for{" "}
            <span className="text-primary">everyone.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Entrepreneurs",
              "Small businesses",
              "Freelancers",
              "Startups",
              "eCommerce stores",
              "Creators and agencies",
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50 px-6 py-3 text-base font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Fast Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Build Fast, Grow Faster.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed font-medium text-slate-500">
            Your website should not slow you down. With Nepdora, you can go from
            idea to live website in minutes. No delays. No coding. No
            complexity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-4 w-4" />
              No Delays
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-4 w-4" />
              No Coding
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-4 w-4" />
              No Complexity
            </div>
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
                Ready to create your website?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Start building with Nepdora today and launch your website in
                minutes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/signup"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Start for Free
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  View Templates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
