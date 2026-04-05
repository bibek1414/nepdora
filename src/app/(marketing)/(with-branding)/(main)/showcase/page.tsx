import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  MoveRight,
  ExternalLink,
  Smartphone,
  Laptop,
  Globe,
  Heart,
} from "lucide-react";

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
    description:
      "Daily essentials delivered across Pokhara with real-time tracking.",
    image: "/images/showcase/green-grocery.jpg",
    slug: "green-grocery",
  },
];

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 text-center">
          <div className="bg-primary/20 border-primary/30 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
            <Heart className="fill-primary h-4 w-4" />
            <span>Made in Nepal</span>
          </div>
          <h1 className="mb-8 text-5xl leading-none font-black tracking-tighter uppercase italic md:text-8xl">
            The Best of <br />
            <span className="text-primary not-italic">Nepdora.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-400 md:text-2xl">
            Join 1,000+ creators, entrepreneurs, and businesses who have
            launched their digital presence with us.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE_ITEMS.map(item => (
              <div key={item.slug} className="group relative">
                <div className="relative mb-8 aspect-16/10 overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200">
                  <div className="absolute inset-0 animate-pulse bg-linear-to-br from-slate-200 to-slate-300" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur-md">
                        <Laptop className="h-6 w-6" />
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur-md">
                        <Smartphone className="h-6 w-6" />
                      </div>
                    </div>
                    <Link
                      href="#"
                      className="hover:bg-primary flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold tracking-tighter text-slate-900 uppercase transition-all hover:text-white"
                    >
                      Visit Live Site
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-3 px-2">
                  <div className="text-primary text-xs font-black tracking-widest uppercase italic">
                    {item.category}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    {item.name}
                  </h3>
                  <p className="pr-4 leading-relaxed text-slate-500 italic">
                    "{item.description}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-16 text-3xl font-black tracking-tighter md:text-5xl">
            Why businesses trust{" "}
            <span className="text-primary italic">Nepdora.</span>
          </h2>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="text-5xl leading-none font-black text-slate-900 md:text-7xl">
                99.9%
              </div>
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Uptime Guarantee
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl leading-none font-black text-slate-900 md:text-7xl">
                2k+
              </div>
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Active Stores
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl leading-none font-black text-slate-900 md:text-7xl">
                100%
              </div>
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Nepali Support
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl leading-none font-black text-slate-900 md:text-7xl">
                5min
              </div>
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Setup Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-slate-950" />
        <div className="bg-primary/20 absolute top-1/2 left-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[100%] blur-[150px]" />

        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tighter text-white uppercase italic md:text-7xl">
            Ready to be{" "}
            <span className="text-primary not-italic">Featured?</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-400">
            Start your journey now and join the elite group of businesses
            building the future of Nepal's digital economy.
          </p>
          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
            <Link
              href="/create-website"
              className="bg-primary shadow-primary/30 rounded-full px-12 py-6 text-lg font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:scale-110"
            >
              Start Your Website
            </Link>
            <Link
              href="/pricing"
              className="hover:text-primary hover:decoration-primary font-bold tracking-widest text-white uppercase underline decoration-slate-600 underline-offset-8 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
