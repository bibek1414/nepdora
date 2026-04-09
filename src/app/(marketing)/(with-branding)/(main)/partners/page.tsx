import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import { 
  Users, 
  Handshake, 
  TrendingUp, 
  LifeBuoy, 
  ArrowRight,
  ShieldCheck,
  Globe
} from "lucide-react";
import Link from "next/link";

export const metadata = buildMarketingMetadata({
  title: "Become a Nepdora Partner | Join Our Agency Program in Nepal",
  description:
    "Partner with Nepal's #1 website builder. Agencies, freelancers, and consultants can earn commissions and grow their business with Nepdora.",
  path: "/partners",
  keywords: [
    "Nepdora partner",
    "agency program Nepal",
    "freelancer commissions",
    "website builder affiliate",
  ],
});

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingPageHero
        badgeText="Partner Program"
        badgeIcon={Handshake}
        title={<>Build the future of <span className="text-primary italic">Nepal's internet</span> with us.</>}
        description="Join an ecosystem of creators, agencies, and entrepreneurs building modern digital experiences with the most localized platform."
        breadcrumbs={[{ label: "Partners", href: "/partners" }]}
        centered
      />

      {/* Program Types */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* For Agencies */}
            <div className="group relative overflow-hidden rounded-[48px] bg-white p-12 border border-slate-200 transition-all hover:shadow-2xl hover:shadow-primary/5">
               <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Globe className="h-8 w-8" />
               </div>
               <h3 className="mb-4 text-3xl font-bold text-slate-900">For Agencies</h3>
               <p className="mb-10 text-lg leading-relaxed text-slate-500">
                  Build faster, deliver better results to your clients, and get dedicated 
                  priority support. Scalable solutions for agencies of all sizes.
               </p>
               <ul className="space-y-4 mb-10">
                  {["Dedicated Account Manager", "Co-marketing Opportunities", "White-label Options"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                       <ShieldCheck className="h-5 w-5 text-primary" />
                       {item}
                    </li>
                  ))}
               </ul>
               <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest transition-all hover:gap-4"
               >
                  Join as Agency <ArrowRight className="h-4 w-4" />
               </Link>
            </div>

            {/* For Affiliates */}
            <div className="group relative overflow-hidden rounded-[48px] bg-slate-900 p-12 text-white transition-all hover:shadow-2xl hover:shadow-slate-900/20">
               <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-50" />
               <div className="relative z-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                     <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold">For Affiliates</h3>
                  <p className="mb-10 text-lg leading-relaxed text-slate-400">
                     Earn recurring commissions for every business you bring online with Nepdora. 
                     The simplest way to monetize your network in Nepal.
                  </p>
                  <ul className="space-y-4 mb-10">
                     {["Up to 30% Recurring Commission", "90-day Cookie Duration", "Real-time Tracking Dashboard"].map((item) => (
                       <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          {item}
                       </li>
                     ))}
                  </ul>
                  <Link 
                     href="/contact" 
                     className="inline-flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest transition-all hover:gap-4"
                  >
                     Join as Affiliate <ArrowRight className="h-4 w-4" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section with Visual Mockup */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
           <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                 <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                    Why partner with <span className="text-primary italic">Nepdora?</span>
                 </h2>
                 <div className="space-y-8">
                    <div className="flex gap-6">
                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                          <LifeBuoy className="h-6 w-6" />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-900 mb-2">Priority Support</h4>
                          <p className="text-slate-500 font-medium">Get a direct line to our engineers and product team for complex integrations.</p>
                       </div>
                    </div>
                    <div className="flex gap-6">
                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                          <Users className="h-6 w-6" />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-900 mb-2">Community Access</h4>
                          <p className="text-slate-500 font-medium">Join private events and workshops with other top digital creators in Nepal.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Visual Mockup - Partner Dashboard */}
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/10 rounded-[48px] rotate-3 blur-3xl" />
                 <div className="relative bg-white rounded-[40px] border border-slate-200 shadow-2xl p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-sm font-bold uppercase tracking-widest text-slate-400 font-inter">Partner Dashboard</span>
                       <div className="h-8 w-32 bg-slate-50 rounded-full border border-slate-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                          <div className="text-2xl font-black text-slate-900 mb-1 tracking-tighter">Rs. 45k</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Paid Commissions</div>
                       </div>
                       <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                          <div className="text-2xl font-black text-primary mb-1 tracking-tighter">128</div>
                          <div className="text-[10px] font-bold text-primary/60 uppercase">Active Referrals</div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                             <div className="h-2 w-32 bg-slate-100 rounded" />
                             <div className="h-2 w-12 bg-green-100 rounded" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-100 text-center">
         <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl text-slate-900">
               Ready to scale your business?
            </h2>
            <p className="mb-12 text-xl text-slate-500 mx-auto max-w-2xl">
               Join 50+ partners across Nepal who are building their digital empire with Nepdora. 
               Your partnership starts with a single conversation.
            </p>
            <Link 
               href="/contact"
               className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
            >
               Get Started as Partner
               <ArrowRight className="h-5 w-5" />
            </Link>
         </div>
      </section>
    </div>
  );
}

