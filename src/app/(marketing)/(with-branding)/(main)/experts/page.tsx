import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import {
  BadgeCheck,
  MessageSquare,
  Star,
  Globe,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Hire Nepdora Experts | Verified Agencies & Freelancers in Nepal",
  description:
    "Find the best agencies and freelancers in Nepal to build, design, and grow your Nepdora website. Verified partners with local expertise.",
  path: "/experts",
  ogLabel: "Expert Marketplace",
});

const EXPERTS = [
  {
    name: "Kathmandu Digital Agency",
    description:
      "Full-service digital agency specializing in high-converting e-commerce stores on Nepdora.",
    tags: ["E-commerce", "SEO", "Branding"],
    location: "Kathmandu",
    rating: 5.0,
    projects: 42,
    verified: true,
  },
  {
    name: "Pokhara Web Studios",
    description:
      "Creative design studio focused on beautiful restaurant and hospitality websites.",
    tags: ["UI/UX", "Restaurant", "Hospitality"],
    location: "Pokhara",
    rating: 4.9,
    projects: 28,
    verified: true,
  },
  {
    name: "Nepal SEO Pros",
    description:
      "The leading experts in local SEO and growth marketing for Nepali businesses.",
    tags: ["SEO", "Content", "Growth"],
    location: "Lalitpur",
    rating: 4.8,
    projects: 15,
    verified: true,
  },
];

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingPageHero
        badgeText="Verified Partners"
        badgeIcon={BadgeCheck}
        title={<>Hire a <span className="text-primary italic">Nepdora</span> expert.</>}
        description="Don't have time to build it yourself? Work with verified local pros who know the Nepali market inside out and can bring your vision to life."
        breadcrumbs={[{ label: "Experts", href: "/experts" }]}
      />

      {/* Trust/Benefits Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Ready to launch, <span className="text-primary">faster.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-500">
                Our experts are more than just designers. They are strategic partners 
                who help you navigate local logistics, payment setups, and growth marketing.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                 <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                    <h4 className="font-bold mb-2">Vetted Quality</h4>
                    <p className="text-sm text-slate-500">Every expert is manually reviewed for their portfolio and client satisfaction.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <Globe className="h-8 w-8 text-sky-500 mb-4" />
                    <h4 className="font-bold mb-2">Local Context</h4>
                    <p className="text-sm text-slate-500">They understand the specific needs of businesses in Kathmandu, Pokhara, and beyond.</p>
                 </div>
              </div>
            </div>
            
            {/* Visual Mockup: Expert matching UI */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[48px] -rotate-3 blur-3xl" />
              <div className="relative bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                       <Zap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                       <div className="h-3 w-1/3 bg-slate-100 rounded mb-2" />
                       <div className="h-2 w-1/4 bg-slate-50 rounded" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-primary bg-primary/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">A</div>
                          <span className="font-bold text-sm">Agency Matching...</span>
                       </div>
                       <div className="h-2 w-12 bg-primary/20 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-primary" />
                       </div>
                    </div>
                    {[1, 2].map((i) => (
                       <div key={i} className="p-4 rounded-2xl border border-slate-100 flex items-center gap-3 opacity-50">
                          <div className="h-10 w-10 rounded-xl bg-slate-100" />
                          <div className="flex-1">
                             <div className="h-2 w-1/2 bg-slate-100 rounded mb-2" />
                             <div className="h-2 w-1/3 bg-slate-50 rounded" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Marketplace Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Meet our certified partners.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            Browse through our network of talented professionals ready to help you grow.
          </p>
        </div>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {EXPERTS.map(expert => (
              <div
                key={expert.name}
                className="group relative flex flex-col rounded-[40px] border border-slate-200 bg-white p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm transition-transform group-hover:scale-110">
                    <Globe className="h-full w-full text-slate-400" />
                  </div>
                  {expert.verified && (
                    <div className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-bold tracking-widest text-green-600 uppercase">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {expert.name}
                </h3>

                <div className="mb-6 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-slate-900">{expert.rating}</span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <span>{expert.projects} projects</span>
                  <span className="text-slate-200">|</span>
                  <span>{expert.location}</span>
                </div>

                <p className="mb-8 line-clamp-3 text-base leading-relaxed text-slate-500">
                  {expert.description}
                </p>

                <div className="mb-10 flex flex-wrap gap-2">
                  {expert.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-100 bg-slate-50/50 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="mt-auto flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Contact expert
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Expert CTA */}
      <section className="py-24">
         <div className="container mx-auto max-w-5xl px-4">
            <div className="relative overflow-hidden rounded-[48px] bg-primary px-8 py-20 text-center text-white md:px-16 md:py-24 shadow-2xl shadow-primary/20">
               <div className="absolute inset-0 bg-slate-900/10" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md">
                     <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                  <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-6xl">
                     Are you a pro?
                  </h2>
                  <p className="mx-auto mb-10 max-w-xl text-lg text-white/90">
                     Join our expert marketplace and help businesses across Nepal build their digital dreams on the world's most localized builder.
                  </p>
                  <Link
                     href="/support"
                     className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-base font-bold text-primary transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  >
                     Apply to join
                     <ArrowRight className="h-5 w-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

