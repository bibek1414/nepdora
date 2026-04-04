import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, ExternalLink, Smartphone, Laptop, Globe, Heart } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Showcase | Built with Nepdora | Real Success Stories",
  description: "Browse the best websites across Nepal built with Nepdora. From modern restaurants to high-traffic e-commerce stores, see what's possible.",
  path: "/showcase",
  ogLabel: "Customer Showcase",
});

const SHOWCASE_ITEMS = [
  {
    name: "Kathmandu Kitchen",
    category: "Restaurant",
    description: "A modern dining experience with online reservations and digital menus.",
    image: "/images/showcase/kathmandu-kitchen.jpg",
    slug: "kathmandu-kitchen",
  },
  {
    name: "Urban Style",
    category: "E-commerce",
    description: "Leading clothing brand in Nepal with seamless eSewa checkout.",
    image: "/images/showcase/urban-style.jpg",
    slug: "urban-style",
  },
  {
    name: "Elite Fitness",
    category: "Gym & Fitness",
    description: "Member management and online coaching platform.",
    image: "/images/showcase/elite-fitness.jpg",
    slug: "elite-fitness",
  },
  {
    name: "Namaste Travels",
    category: "Travel & Tours",
    description: "Booking engine for trekking and tours across the Himalayas.",
    image: "/images/showcase/namaste-travels.jpg",
    slug: "namaste-travels",
  },
  {
    name: "Tech Solutions",
    category: "Digital Agency",
    description: "Service showcase and lead generation for IT consultants.",
    image: "/images/showcase/tech-solutions.jpg",
    slug: "tech-solutions",
  },
  {
    name: "Green Grocery",
    category: "Grocery Store",
    description: "Daily essentials delivered across Pokhara with real-time tracking.",
    image: "/images/showcase/green-grocery.jpg",
    slug: "green-grocery",
  }
];

export default function ShowcasePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                <Heart className="w-4 h-4 fill-primary" />
                <span>Made in Nepal</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none italic uppercase">
                The Best of <br />
                <span className="text-primary not-italic">Nepdora.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Join 1,000+ creators, entrepreneurs, and businesses who have launched their digital presence with us.
            </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {SHOWCASE_ITEMS.map((item) => (
              <div key={item.slug} className="group relative">
                <div className="relative aspect-16/10 rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200 mb-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 animate-pulse" />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 backdrop-blur-[2px]">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                <Laptop className="w-6 h-6" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                <Smartphone className="w-6 h-6" />
                            </div>
                        </div>
                        <Link 
                            href="#"
                            className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all uppercase tracking-tighter"
                        >
                            Visit Live Site
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="space-y-3 px-2">
                    <div className="text-xs font-black uppercase tracking-widest text-primary italic">{item.category}</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{item.name}</h3>
                    <p className="text-slate-500 leading-relaxed italic pr-4">
                        "{item.description}"
                    </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tighter">Why businesses trust <span className="text-primary italic">Nepdora.</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               <div className="space-y-4">
                   <div className="text-5xl md:text-7xl font-black text-slate-900 leading-none">99.9%</div>
                   <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Uptime Guarantee</div>
               </div>
               <div className="space-y-4">
                   <div className="text-5xl md:text-7xl font-black text-slate-900 leading-none">2k+</div>
                   <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Active Stores</div>
               </div>
               <div className="space-y-4">
                   <div className="text-5xl md:text-7xl font-black text-slate-900 leading-none">100%</div>
                   <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nepali Support</div>
               </div>
               <div className="space-y-4">
                   <div className="text-5xl md:text-7xl font-black text-slate-900 leading-none">5min</div>
                   <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Setup Time</div>
               </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-950 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-primary/20 blur-[150px] rounded-[100%] rotate-12 -z-10" />
        
        <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter italic uppercase">
                Ready to be <span className="text-primary not-italic">Featured?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Start your journey now and join the elite group of businesses building the future of Nepal's digital economy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link 
                    href="/create-website"
                    className="px-12 py-6 rounded-full bg-primary text-white font-black hover:scale-110 transition-all uppercase tracking-widest shadow-2xl shadow-primary/30 text-lg"
                >
                    Start Your Website
                </Link>
                <Link 
                    href="/pricing"
                    className="text-white font-bold underline underline-offset-8 decoration-slate-600 hover:text-primary hover:decoration-primary transition-all uppercase tracking-widest"
                >
                    View Pricing
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
