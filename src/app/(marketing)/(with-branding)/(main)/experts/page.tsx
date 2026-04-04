import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { BadgeCheck, MessageSquare, Star, Globe, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Hire Nepdora Experts | Verified Agencies & Freelancers in Nepal",
  description: "Find the best agencies and freelancers in Nepal to build, design, and grow your Nepdora website. Verified partners with local expertise.",
  path: "/experts",
  ogLabel: "Expert Marketplace",
});

const EXPERTS = [
  {
    name: "Kathmandu Digital Agency",
    description: "Full-service digital agency specializing in high-converting e-commerce stores on Nepdora.",
    tags: ["E-commerce", "SEO", "Branding"],
    location: "Kathmandu",
    rating: 5.0,
    projects: 42,
    verified: true,
  },
  {
    name: "Pokhara Web Studios",
    description: "Creative design studio focused on beautiful restaurant and hospitality websites.",
    tags: ["UI/UX", "Restaurant", "Hospitality"],
    location: "Pokhara",
    rating: 4.9,
    projects: 28,
    verified: true,
  },
  {
    name: "Nepal SEO Pros",
    description: "The leading experts in local SEO and growth marketing for Nepali businesses.",
    tags: ["SEO", "Content", "Growth"],
    location: "Lalitpur",
    rating: 4.8,
    projects: 15,
    verified: true,
  }
];

export default function ExpertsPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#1e293b,transparent)] opacity-50" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <Breadcrumbs 
            items={[{ label: "Experts", href: "/experts" }]} 
          />
          
          <div className="mt-12 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8 leading-none italic uppercase">
                Hire a <span className="text-primary italic">Nepdora</span> Expert.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-12">
                Don't have time to build it yourself? Work with verified local pros who know the Nepali market inside out.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-primary">
                    <BadgeCheck className="w-4 h-4" />
                    Verified Partners
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Payment Protection
                </div>
            </div>
        </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERTS.map((expert) => (
              <div key={expert.name} className="group p-8 rounded-[40px] border border-slate-100 bg-white hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all relative">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                        <Globe className="w-8 h-8 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    {expert.verified && (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-[10px] font-black text-green-600 uppercase tracking-widest border border-green-100">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">{expert.name}</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-600">{expert.rating}</span>
                    </div>
                    <span className="text-slate-200">|</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{expert.projects} Projects</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{expert.location}</span>
                </div>

                <p className="text-slate-600 mb-8 border-l-2 border-slate-100 pl-4">
                    {expert.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                    {expert.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                            {tag}
                        </span>
                    ))}
                </div>

                <Link 
                    href="/contact"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-primary transition-all group-hover:scale-105 active:scale-95 shadow-xl"
                >
                    Contact Expert
                    <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 rounded-[56px] bg-slate-50 text-center border-2 border-dashed border-slate-200">
            <h4 className="text-2xl font-black mb-4 uppercase tracking-tight italic">Are you an agency or freelancer in Nepal?</h4>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                Join our expert marketplace and help businesses across Nepal build their digital dreams on the world's most localized builder.
            </p>
            <Link 
                href="/support"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-900 font-bold hover:border-primary transition-all shadow-sm"
            >
                Apply to join
                <Mail className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
