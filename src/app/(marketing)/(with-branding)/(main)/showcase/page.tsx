import { Metadata } from "next";
import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import {
  ChevronRight,
  ExternalLink,
  Smartphone,
  Laptop,
  Heart,
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
      <StandardMarketingHero
        badgeText="Made in Nepal"
        badgeIcon={Heart}
        title={
          <>
            The best of <span className="text-sky-600">Nepdora.</span>
          </>
        }
        description="Join 1,000+ creators, entrepreneurs, and businesses who have launched their digital presence with us."
        centered
      />

      {/* Gallery Grid */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE_ITEMS.map(item => (
              <div key={item.slug} className="group relative">
                <div className="relative mb-8 aspect-16/10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/50">
                  {/* Placeholder for images if they don't exist */}
                  <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-slate-100" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
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
                      className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 transition-all hover:scale-105"
                    >
                      Visit live site
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-3 px-2">
                  <div className="text-xs font-bold text-sky-600">
                    {item.category}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-100 bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-16 text-3xl font-extrabold text-slate-900 md:text-5xl">
            Why businesses trust <span className="text-sky-600">Nepdora.</span>
          </h2>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            {[
              { label: "Uptime guarantee", value: "99.9%" },
              { label: "Active stores", value: "2k+" },
              { label: "Nepali support", value: "100%" },
              { label: "Setup time", value: "5min" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl font-extrabold text-slate-900 md:text-6xl">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StandardMarketingCTA
        title="Ready to be featured?"
        description="Start your journey now and join the elite group of businesses building the future of Nepal's digital economy."
        buttonText="Start your website"
        buttonHref="/create-website"
      />
    </div>
  );
}
