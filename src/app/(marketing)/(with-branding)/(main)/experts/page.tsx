import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import {
  BadgeCheck,
  MessageSquare,
  Star,
  Globe,
  ShieldCheck,
  Mail,
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
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-24 pb-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#1e293b,transparent)] opacity-50" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 text-center">
          <Breadcrumbs items={[{ label: "Experts", href: "/experts" }]} />

          <div className="mx-auto mt-12 max-w-4xl">
            <h1 className="mb-8 text-4xl leading-none font-black tracking-tight uppercase italic md:text-7xl">
              Hire a <span className="text-primary italic">Nepdora</span>{" "}
              Expert.
            </h1>
            <p className="mb-12 text-xl text-slate-400 md:text-2xl">
              Don't have time to build it yourself? Work with verified local
              pros who know the Nepali market inside out.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="text-primary flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest uppercase">
                <BadgeCheck className="h-4 w-4" />
                Verified Partners
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest uppercase">
                <ShieldCheck className="h-4 w-4" />
                Payment Protection
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {EXPERTS.map(expert => (
              <div
                key={expert.name}
                className="group hover:border-primary/30 hover:shadow-primary/5 relative rounded-[40px] border border-slate-100 bg-white p-8 transition-all hover:shadow-2xl"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="group-hover:bg-primary/5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 transition-colors">
                    <Globe className="group-hover:text-primary h-8 w-8 text-slate-300 transition-colors" />
                  </div>
                  {expert.verified && (
                    <div className="flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-black tracking-widest text-green-600 uppercase">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>

                <h3 className="mb-2 text-2xl font-black tracking-tighter text-slate-900 uppercase italic">
                  {expert.name}
                </h3>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-600">
                      {expert.rating}
                    </span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    {expert.projects} Projects
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    {expert.location}
                  </span>
                </div>

                <p className="mb-8 border-l-2 border-slate-100 pl-4 text-slate-600">
                  {expert.description}
                </p>

                <div className="mb-10 flex flex-wrap gap-2">
                  {expert.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="hover:bg-primary flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all group-hover:scale-105 active:scale-95"
                >
                  Contact Expert
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[56px] border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
            <h4 className="mb-4 text-2xl font-black tracking-tight uppercase italic">
              Are you an agency or freelancer in Nepal?
            </h4>
            <p className="mx-auto mb-8 max-w-xl text-slate-500">
              Join our expert marketplace and help businesses across Nepal build
              their digital dreams on the world's most localized builder.
            </p>
            <Link
              href="/support"
              className="hover:border-primary inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-4 font-bold text-slate-900 shadow-sm transition-all"
            >
              Apply to join
              <Mail className="text-primary h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
