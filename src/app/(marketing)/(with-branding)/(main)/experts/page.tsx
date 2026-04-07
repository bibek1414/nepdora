import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import {
  BadgeCheck,
  MessageSquare,
  Star,
  Globe,
  ShieldCheck,
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StandardMarketingHero
        badgeText="Verified partners"
        badgeIcon={BadgeCheck}
        title={
          <>
            Hire a <span className="text-sky-600">Nepdora</span> expert.
          </>
        }
        description="Don't have time to build it yourself? Work with verified local pros who know the Nepali market inside out."
        breadcrumbs={[{ label: "Experts", href: "/experts" }]}
      />

      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {EXPERTS.map(expert => (
              <div
                key={expert.name}
                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                    <Globe className="h-full w-full text-slate-400" />
                  </div>
                  {expert.verified && (
                    <div className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-semibold tracking-tight text-green-600">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                  {expert.name}
                </h3>
                
                <div className="mb-6 flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{expert.rating}</span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <span>{expert.projects} projects</span>
                  <span className="text-slate-200">|</span>
                  <span>{expert.location}</span>
                </div>

                <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-slate-500 font-medium">
                  {expert.description}
                </p>

                <div className="mb-10 flex flex-wrap gap-2">
                  {expert.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="mt-auto flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                >
                  Contact expert
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StandardMarketingCTA
        title="Are you a pro?"
        description="Join our expert marketplace and help businesses across Nepal build their digital dreams on the world's most localized builder."
        buttonText="Apply to join"
        buttonHref="/support"
      />
    </div>
  );
}
