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
  Megaphone
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Use Cases | How Businesses Use Nepdora in Nepal",
  description: "Explore how different businesses use Nepdora to automate sales, take bookings, and build a digital identity in Nepal.",
  path: "/use-cases",
});

const USE_CASES = [
  {
    title: "Switching from Social Media",
    description: "Move your business beyond 'DM for Price'. Build a professional storefront and automate your inventory.",
    icon: Repeat,
    color: "text-rose-500",
    slug: "social-media-to-storefront",
  },
  {
    title: "Appointment Booking",
    description: "Perfect for clinics, consultancies, and salons. Let clients book their own slots 24/7.",
    icon: Calendar,
    color: "text-blue-500",
    slug: "online-appointments",
  },
  {
    title: "High-Volume E-commerce",
    description: "Scale your inventory and handle thousands of orders with automated courier and payment sync.",
    icon: ShoppingBag,
    color: "text-primary",
    slug: "high-volume-sales",
  },
  {
    title: "Global Export",
    description: "Built for Nepali brands selling $USD abroad while managing everything from Kathmandu.",
    icon: Globe,
    color: "text-sky-500",
    slug: "global-export",
  },
  {
    title: "Digital Portfolios",
    description: "Showcase your work and land higher-paying clients with a premium personal brand site.",
    icon: Zap,
    color: "text-amber-500",
    slug: "creative-portfolios",
  },
  {
    title: "Launch Campaigns",
    description: "Create high-converting landing pages for your new products or seasonal offers in minutes.",
    icon: Megaphone,
    color: "text-green-500",
    slug: "launch-campaigns",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingPageHero
        badgeText="Real World Impact"
        badgeIcon={TrendingUp}
        title={<>Build for <span className="text-primary italic">any</span> scenario.</>}
        description="Whether you're starting a new brand or scaling an existing empire, Nepdora adapts to your specific business logic."
        breadcrumbs={[{ label: "Use Cases", href: "/use-cases" }]}
        centered
      />

      {/* Use Case Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 text-center mb-16">
           <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
             Explore what's possible.
           </h2>
           <p className="mx-auto max-w-2xl text-lg text-slate-500">
             Discover how leaders across Nepal are using Nepdora to digitize their operations.
           </p>
        </div>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((useCase) => (
              <div
                key={useCase.slug}
                className="group flex flex-col rounded-[48px] border border-slate-200 bg-white p-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 transition-colors group-hover:bg-primary/5">
                  <useCase.icon className={`h-10 w-10 ${useCase.color} transition-transform group-hover:scale-110`} />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {useCase.title}
                </h3>
                <p className="mb-10 text-base leading-relaxed text-slate-500">
                  {useCase.description}
                </p>
                <Link
                  href={`/use-cases/${useCase.slug}`}
                  className="mt-auto flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-all group-hover:text-primary group-hover:gap-4"
                >
                  View Solution Detail
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
         <div className="container mx-auto max-w-5xl px-4">
            <div className="relative overflow-hidden rounded-[48px] bg-slate-900 px-8 py-20 text-center text-white md:px-16 md:py-24 shadow-2xl">
               <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
               <div className="relative z-10 flex flex-col items-center">
                  <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-6xl">
                     Have a unique challenge?
                  </h2>
                  <p className="mx-auto mb-12 max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
                     Our team specializes in building custom workflows for complex business logic. Let's talk about how to solve your specific hurdle.
                  </p>
                  <Link
                     href="/contact"
                     className="inline-flex items-center gap-3 rounded-[24px] bg-white px-10 py-5 text-base font-bold text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  >
                     Talk to an Expert
                     <ArrowRight className="h-5 w-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
