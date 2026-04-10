import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Repeat,
  Calendar,
  TrendingUp,
  Globe,
  Zap,
  ShoppingBag,
  Megaphone,
  Briefcase,
  Store,
  Users,
  Rocket,
  Heart,
  ChevronRight,
} from "lucide-react";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Use Cases | How Businesses Use Nepdora in Nepal",
  description:
    "Explore how different businesses use Nepdora to automate sales, take bookings, and build a digital identity in Nepal.",
  path: "/use-cases",
});

const USE_CASES = [
  {
    title: "Switching from Social Media",
    description:
      "Move your business beyond 'DM for Price'. Build a professional storefront and automate your inventory.",
    icon: Repeat,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    slug: "social-media-to-storefront",
  },
  {
    title: "Appointment Booking",
    description:
      "Perfect for clinics, consultancies, and salons. Let clients book their own slots 24/7.",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    slug: "online-appointments",
  },
  {
    title: "High-Volume E-commerce",
    description:
      "Scale your inventory and handle thousands of orders with automated courier and payment sync.",
    icon: ShoppingBag,
    color: "from-primary to-primary/80",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    slug: "high-volume-sales",
  },
  {
    title: "Global Export",
    description:
      "Built for Nepali brands selling $USD abroad while managing everything from Kathmandu.",
    icon: Globe,
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
    slug: "global-export",
  },
  {
    title: "Digital Portfolios",
    description:
      "Showcase your work and land higher-paying clients with a premium personal brand site.",
    icon: Zap,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    slug: "creative-portfolios",
  },
  {
    title: "Launch Campaigns",
    description:
      "Create high-converting landing pages for your new products or seasonal offers in minutes.",
    icon: Megaphone,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    slug: "launch-campaigns",
  },
  {
    title: "Small Business Website",
    description:
      "Establish your brand online with a professional website that builds trust and attracts customers.",
    icon: Store,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    slug: "website-for-small-business",
  },
  {
    title: "Freelancer Portfolio",
    description:
      "Showcase your skills, attract high-paying clients, and build your personal brand.",
    icon: Briefcase,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    slug: "website-for-freelancers",
  },
  {
    title: "Sell Products Online",
    description:
      "Launch your e-commerce store with local payments and automated shipping.",
    icon: ShoppingBag,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    slug: "sell-products-online-nepal",
  },
  {
    title: "Start Online Business",
    description:
      "Everything you need to launch and grow your online business in Nepal.",
    icon: Rocket,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    slug: "start-online-business-nepal",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Real World Impact
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Build for <span className="text-primary">any</span> scenario.
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Whether you're starting a new brand or scaling an existing empire,
              Nepdora adapts to your specific business logic.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/create-website"
                className="bg-primary /admin/signup-md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
              >
                Start Building
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Cases Matter */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-lg leading-relaxed font-medium text-slate-600">
            Every business is unique. That's why we've created tailored
            solutions for different needs. Explore how Nepdora can help you
            achieve your specific goals.
          </p>
        </div>
      </section>

      {/* Use Case Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map(useCase => (
              <Link
                key={useCase.slug}
                href={`/use-cases/${useCase.slug}`}
                className="group /admin/signup-sm hover:/admin/signup-md rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3`}>
                  <useCase.icon className={`h-6 w-6 ${useCase.textColor}`} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {useCase.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div>
              <div className="text-primary text-2xl font-bold">10,000+</div>
              <div className="text-xs text-slate-500">Businesses Powered</div>
            </div>
            <div>
              <div className="text-primary text-2xl font-bold">50+</div>
              <div className="text-xs text-slate-500">Use Cases Covered</div>
            </div>
            <div>
              <div className="text-primary text-2xl font-bold">24/7</div>
              <div className="text-xs text-slate-500">Nepali Support</div>
            </div>
            <div>
              <div className="text-primary text-2xl font-bold">99.9%</div>
              <div className="text-xs text-slate-500">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="/admin/signup-sm rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
            <div className="flex flex-col items-center">
              <div className="/admin/signup-sm mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <Heart className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Have a unique challenge?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Our team specializes in building custom workflows for complex
                business logic. Let's talk about how to solve your specific
                hurdle.
              </p>
              <Link
                href="/contact"
                className="bg-primary /admin/signup-md inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              >
                Talk to an Expert
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
