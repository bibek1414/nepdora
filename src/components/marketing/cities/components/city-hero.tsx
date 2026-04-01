"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link"; // Assuming Next.js, or use 'a' for React

interface CityHeroProps {
  cityName: string;
  category: string;
  title: string;
  description: string;
}

export const CityHero: React.FC<CityHeroProps> = ({
  cityName,
  category,
  title,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#1047A1] py-20 text-white md:py-32">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=40"
          // IMPROVEMENT: Dynamic Alt Text for Image SEO
          alt={`${category} services in ${cityName} - Nepdora`}
          className="h-full w-full object-cover opacity-10"
          loading="eager" // Hero images should load immediately
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1047A1]/95 to-[#1047A1]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 text-center sm:px-6">
        {/* IMPROVEMENT: Optimized H1 for Local SEO Keywords */}
        <h1 className="mb-6 text-4xl font-normal md:text-6xl">
          <span className="mb-2 block text-4xl font-semibold text-blue-200">
            Top Rated {category}
          </span>
          Grow with <span className="font-semibold">Nepdora</span> in {cityName}
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-lg font-light text-blue-50/90 md:text-xl">
          {/* IMPROVEMENT: Ensuring the description contains core keywords */}
          Looking for the best{" "}
          <strong>
            {category} in {cityName}
          </strong>
          ? Join thousands of local businesses that trust Nepdora for digital
          growth and analytics.
        </p>

        <form
          className="mx-auto flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-2xl"
          onSubmit={e => e.preventDefault()}
        >
          <div className="flex flex-1 items-center px-4 py-2 text-slate-400">
            <Search className="mr-3 h-5 w-5 shrink-0" />
            <label htmlFor="business-search" className="sr-only">
              Business Name
            </label>
            <Input
              id="business-search"
              type="text"
              placeholder="Enter your business name"
              className="z-10 border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/80 h-12 rounded-lg px-8 font-semibold text-white"
          >
            Analyze now
          </Button>
        </form>

        {/* IMPROVEMENT: Strategic Internal Linking */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-100/70">
          <span className="font-medium text-white">Popular Cities:</span>
          <Link
            href="/kathmandu"
            className="underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Kathmandu
          </Link>
          <Link
            href="/pokhara"
            className="underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Pokhara
          </Link>
          <Link
            href="/lalitpur"
            className="underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Lalitpur
          </Link>
        </div>
      </div>
    </section>
  );
};
