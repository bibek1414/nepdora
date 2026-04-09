import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
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
  Globe,
  Plus,
  Image as ImageIcon,
  Type,
  Settings,
  Eye,
  Trophy,
  Heart,
  Store,
  User,
  Building2,
  Briefcase,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { BuilderVisualMock } from "@/components/marketing/website-builder-nepal/website-builder-visual-mock";

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Website Builder in Nepal - Build Your Website Without Coding | Nepdora",
  description:
    "Create a professional website in minutes with Nepdora's powerful and easy-to-use website builder. No coding required. Launch faster and grow your brand in Nepal.",
  path: "/website-builder-nepal",
  keywords: [
    "website builder nepal",
    "best website builder nepal",
    "no code website builder nepal",
    "nepdora website builder",
    "create website nepal",
  ],
});

export default function WebsiteBuilderNepalPage() {
  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div>
              <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Website Builder in Nepal{" "}
                <span className="text-primary">— No Coding Required.</span>
              </h1>
              <p className="mb-8 text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
                Create a professional website in minutes with Nepdora's powerful
                and easy-to-use website builder.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary -md inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95"
                >
                  Start Building Free
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/create-website"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  View Templates
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <BuilderVisualMock />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Building a website in Nepal has never been easier.
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-slate-500">
            With Nepdora's website builder, you don't need any coding knowledge
            or technical skills. Whether you're starting a business, launching a
            startup, or growing your brand, you can create a beautiful,
            high-performing website in just a few clicks.
          </p>
        </div>
      </section>

      {/* What is Nepdora Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                What is{" "}
                <span className="text-primary">Nepdora Website Builder?</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Nepdora Website Builder is a modern platform that allows you to
                design, customize, and launch websites without writing a single
                line of code. It is designed for entrepreneurs, businesses, and
                creators in Nepal who want a fast, simple, and powerful way to
                go online.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="-sm rounded-2xl border border-slate-200 bg-white p-5">
                  <Zap className="text-primary mb-3 h-7 w-7" />
                  <h4 className="mb-1 font-semibold text-slate-900">
                    Fast Launch
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    Go live in minutes, not weeks.
                  </p>
                </div>
                <div className="-sm rounded-2xl border border-slate-200 bg-white p-5">
                  <ShieldCheck className="mb-3 h-7 w-7 text-emerald-500" />
                  <h4 className="mb-1 font-semibold text-slate-900">
                    Secure Hosting
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    Enterprise-grade security built-in.
                  </p>
                </div>
              </div>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-8">
              <div className="space-y-6">
                {[
                  {
                    icon: MousePointer2,
                    title: "No coding required",
                    color: "text-blue-500",
                  },
                  {
                    icon: Clock,
                    title: "Fast website creation",
                    color: "text-amber-500",
                  },
                  {
                    icon: DollarSign,
                    title: "Affordable pricing",
                    color: "text-emerald-500",
                  },
                  {
                    icon: Globe,
                    title: "Built for Nepal",
                    color: "text-purple-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 ${item.color}`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use a Website Builder Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why use a <span className="text-primary">website builder?</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Using a website builder saves time, money, and effort. Instead of
              hiring a full development team, you can build your website
              yourself with complete control.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Launch your website in minutes",
              "Save development costs",
              "Customize designs easily",
              "Manage everything in one place",
              "Update content anytime without developers",
              "Scale as your business grows",
            ].map((item, i) => (
              <div
                key={i}
                className="-sm flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything you need{" "}
              <span className="text-primary">to succeed online.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MousePointer2,
                title: "Drag-and-drop builder",
                desc: "Design visually without code.",
              },
              {
                icon: Layout,
                title: "Ready-made templates",
                desc: "Professionally designed for Nepal.",
              },
              {
                icon: Smartphone,
                title: "Mobile-friendly",
                desc: "Perfect on all screen sizes.",
              },
              {
                icon: Search,
                title: "SEO optimization",
                desc: "Rank higher on Google search.",
              },
              {
                icon: Zap,
                title: "Fast hosting",
                desc: "Localized servers for speed.",
              },
              {
                icon: CreditCard,
                title: "Local Payments",
                desc: "eSewa & Khalti integration.",
              },
              {
                icon: Globe,
                title: "Custom domains",
                desc: "Use your own .com or .np.",
              },
              {
                icon: ShieldCheck,
                title: "Secure & Scalable",
                desc: "Built to handle any traffic.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="-sm hover:-md rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all"
              >
                <div className="text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">
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

      {/* Who Should Use This Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Perfect for <span className="text-primary">every creator.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500">
                Nepdora Website Builder is perfect for those who want a
                professional website without complexity.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Building2, label: "Small businesses" },
                  { icon: Rocket, label: "Startups" },
                  { icon: User, label: "Freelancers" },
                  { icon: Briefcase, label: "Agencies" },
                  { icon: Store, label: "Online stores" },
                  { icon: Users, label: "Personal brands" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="-sm flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <item.icon className="text-primary h-4 w-4" />
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="-sm rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-6 text-center">
                <div className="bg-primary/10 text-primary mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium">
                  Pro Tip
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Focus on your brand, not the code.
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium text-slate-500">
                    Spend your time growing your business while we handle the
                    technical heavy lifting.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium text-slate-500">
                    Launch landing pages for your campaigns in minutes to test
                    new ideas quickly.
                  </p>
                </div>
              </div>
            </div>
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
                title: "Choose a Template",
                desc: "Pick a design that fits your business.",
              },
              {
                step: "2",
                title: "Customize",
                desc: "Edit text, images, and layout easily.",
              },
              {
                step: "3",
                title: "Add Content",
                desc: "Upload your products and services.",
              },
              {
                step: "4",
                title: "Launch",
                desc: "Publish your site and go live instantly.",
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

      {/* Benefits Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Benefits of using <span className="text-primary">Nepdora.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MousePointer2,
                title: "No coding required",
                desc: "Built for everyone, regardless of skill.",
              },
              {
                icon: Zap,
                title: "Fast website creation",
                desc: "The quickest way to get online in Nepal.",
              },
              {
                icon: DollarSign,
                title: "Affordable pricing",
                desc: "Localized plans for every budget.",
              },
              {
                icon: Building2,
                title: "Built for Nepal",
                desc: "Localized features and support.",
              },
              {
                icon: Search,
                title: "SEO-friendly",
                desc: "Optimized structure for search engines.",
              },
              {
                icon: ShieldCheck,
                title: "Secure and scalable",
                desc: "Grow without worrying about limits.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-primary -sm flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <div className="bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            <Trophy className="h-3 w-3" />
            Trusted by businesses across Nepal
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            From Kathmandu to Pokhara,{" "}
            <span className="text-primary">thousands trust Nepdora.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-slate-500">
            Our platform helps you create websites that not only look great but
            also perform well and grow your business.
          </p>
          <div className="flex flex-wrap justify-center gap-6 opacity-40">
            {[
              "Kathmandu",
              "Pokhara",
              "Biratnagar",
              "Butwal",
              "Dharan",
              "Janakpur",
              "Hetauda",
              "Bharatpur",
              "Lalitpur",
              "Bhaktapur",
            ].map((city, i) => (
              <span
                key={i}
                className="text-base font-bold tracking-tight text-slate-500"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Clean white background */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <div className="-sm mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <Layout className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Start building your website today.
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Turn your idea into a live website in minutes with the easiest
                website builder in Nepal.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary -md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
                >
                  Start Building
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/create-website"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Explore Templates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Closing Section */}
      <section className="border-t border-slate-100 bg-white py-16">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <p className="text-base leading-relaxed font-medium text-slate-500">
            If you are looking for a website builder in Nepal, Nepdora provides
            the fastest and easiest way to create a professional website without
            coding. With powerful tools, modern templates, and local features,
            you can build, customize, and launch your website quickly and
            efficiently.
          </p>
        </div>
      </section>
    </div>
  );
}
