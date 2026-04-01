import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface ResourceCard {
  title: string;
  desc: string;
  gradient: string;
  imageAlt: string;
}

const resources: ResourceCard[] = [
  {
    title: "Nepdora Guide: Local SEO for Businesses",
    desc: "How to rank for localized searches in Nepal. Practical tips for Google Maps and more with Nepdora.",
    gradient:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=400&q=80",
    imageAlt: "Local SEO Guide",
  },
  {
    title: "Mastering Online Payments",
    desc: "Everything you need to know about eSewa, Khalti, and IME Pay integration on Nepdora.",
    gradient:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80",
    imageAlt: "Online Payments Guide",
  },
  {
    title: "Nepdora AI Website Strategy",
    desc: "How to use AI to build a professional website in under 10 minutes with our signature wizard.",
    gradient:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80",
    imageAlt: "AI Website Strategy",
  },
];

export const CityResources: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h3 className="mb-4 text-center text-3xl font-normal text-slate-900">
          Nepdora Intelligence Resources & Guides
        </h3>
        <p className="mb-16 text-center text-lg font-light text-slate-500">
          Unlock the tools you need to grow your digital presence in Nepal.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {resources.map((r, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all"
            >
              <div className="h-48 w-full">
                <img
                  src={r.gradient}
                  alt={r.imageAlt}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="p-8">
                <h4 className="mb-4 text-xl font-normal text-slate-900 group-hover:text-[#1047A1]">
                  {r.title}
                </h4>
                <p className="mb-8 text-sm leading-relaxed font-light text-slate-500">
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
