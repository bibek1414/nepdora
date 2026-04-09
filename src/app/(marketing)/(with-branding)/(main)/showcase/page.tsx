import { Metadata } from "next";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import {
  ExternalLink,
  Smartphone,
  Laptop,
  Heart,
  Layout,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Showcase | Built with Nepdora | Real Success Stories",
  description:
    "Browse the best websites across Nepal built with Nepdora. From modern restaurants to high-traffic e-commerce stores, see what's possible.",
  path: "/showcase",
  ogLabel: "Customer Showcase",
});

const SHOWCASE_ITEMS = [
  {
    name: "Kathmandu Kitchen",
    category: "Restaurant",
    description:
      "A modern dining experience with online reservations and digital menus.",
    image: "/images/showcase/kathmandu-kitchen.jpg",
    slug: "kathmandu-kitchen",
  },
  {
    name: "Urban Style",
    category: "E-commerce",
    description:
      "Leading clothing brand in Nepal with seamless eSewa checkout.",
    image: "/images/showcase/urban-style.jpg",
    slug: "urban-style",
  },
  {
    name: "Elite Fitness",
    category: "Gym & fitness",
    description: "Member management and online coaching platform.",
    image: "/images/showcase/elite-fitness.jpg",
    slug: "elite-fitness",
  },
  {
    name: "Namaste Travels",
    category: "Travel & tours",
    description: "Booking engine for trekking and tours across the Himalayas.",
    image: "/images/showcase/namaste-travels.jpg",
    slug: "namaste-travels",
  },
  {
    name: "Tech Solutions",
    category: "Digital agency",
    description: "Service showcase and lead generation for IT consultants.",
    image: "/images/showcase/tech-solutions.jpg",
    slug: "tech-solutions",
  },
  {
    name: "Green Grocery",
    category: "Grocery store",
    description:
      "Daily essentials delivered across Pokhara with real-time tracking.",
    image: "/images/showcase/green-grocery.jpg",
    slug: "green-grocery",
  },
];

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingPageHero
        badgeText="Made in Nepal"
        badgeIcon={Heart}
        title={<>Stories of success. Built with <span className="text-primary italic">Nepdora.</span></>}
        description="Join 1,000+ creators, entrepreneurs, and businesses across Nepal who have launched their digital presence with our localized platform."
        breadcrumbs={[{ label: "Showcase", href: "/showcase" }]}
        centered
      />

      {/* Gallery Grid */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE_ITEMS.map(item => (
              <div key={item.slug} className="group relative">
                <div className="relative mb-8 aspect-16/10 overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Placeholder for images/Mockup */}
                  <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-white flex items-center justify-center p-8">
                     <div className="w-full h-full rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col">
                        <div className="h-4 border-b border-slate-100 bg-slate-50/50 flex items-center px-3 gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        </div>
                        <div className="flex-1 p-4">
                           <div className="h-3 w-1/3 bg-slate-50 rounded mb-4" />
                           <div className="grid grid-cols-3 gap-2 mb-6">
                              <div className="h-12 rounded-lg bg-slate-50" />
                              <div className="h-12 rounded-lg bg-slate-50" />
                              <div className="h-12 rounded-lg bg-slate-50" />
                           </div>
                           <div className="space-y-2">
                              <div className="h-2 w-full bg-slate-50 rounded" />
                              <div className="h-2 w-5/6 bg-slate-50 rounded" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/60 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl">
                        <Laptop className="h-6 w-6" />
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl">
                        <Smartphone className="h-6 w-6" />
                      </div>
                    </div>
                    <Link
                      href="#"
                      className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:scale-110 active:scale-95 shadow-xl"
                    >
                      Visit live site
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 px-6">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-base leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Mockup feel */}
      <section className="bg-white py-24 border-y border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="text-center mb-20">
             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-bold text-primary tracking-widest uppercase">
                <Trophy className="h-4 w-4" />
                Trusted by leaders
             </div>
             <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
               Why Businesses Trust Nepdora.
             </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Uptime guarantee", value: "99.9%" },
              { label: "Active stores", value: "2k+" },
              { label: "Nepali support", value: "100%" },
              { label: "Ready to launch", value: "5min" },
            ].map((stat, idx) => (
              <div key={idx} className="p-8 rounded-[32px] border border-slate-50 bg-slate-50/50 text-center transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                <div className="text-3xl font-bold text-slate-900 md:text-5xl mb-2 tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to be featured? */}
      <section className="py-24">
         <div className="container mx-auto max-w-5xl px-4">
            <div className="relative overflow-hidden rounded-[48px] bg-slate-900 px-8 py-20 text-center text-white md:px-16 md:py-24">
               <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
                     <Layout className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-6xl">
                     Ready to be featured?
                  </h2>
                  <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
                     Join the elite group of Nepali businesses building the future digital economy. Your success story starts with one click.
                  </p>
                  <Link
                     href="/create-website"
                     className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-base font-bold text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  >
                     Build Your Website
                     <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

