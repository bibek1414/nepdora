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
  customH1?: string;
  customIntro?: string;
  subHeadline?: string;
  ctaText?: string;
}

export const CityHero: React.FC<CityHeroProps> = ({
  cityName,
  category,
  title,
  description,
  customH1,
  customIntro,
  subHeadline,
  ctaText,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#1047A1] py-24 text-white md:py-36">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=40"
          alt={`${category} services in ${cityName} - Nepdora`}
          className="h-full w-full object-cover opacity-10"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1047A1]/95 to-[#1047A1]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 text-center sm:px-6">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-7xl">
          {customH1 ? (
            <span className="block">{customH1}</span>
          ) : (
            <>
              <span className="mb-4 block text-3xl font-semibold text-blue-200 md:text-4xl">
                Top Rated {category.replace("-", " ")}
              </span>
              Grow with <span className="font-bold text-white">Nepdora</span> in{" "}
              {cityName}
            </>
          )}
        </h1>

        <div className="mx-auto mb-12 max-w-3xl">
          {subHeadline ? (
            <p className="text-xl font-medium text-blue-50 md:text-2xl">
              {subHeadline}
            </p>
          ) : (
            <p className="text-lg font-light text-blue-50/90 md:text-xl">
              {customIntro || (
                <>
                  Looking for the best{" "}
                  <strong>
                    {category} in {cityName}
                  </strong>
                  ? Join thousands of local businesses that trust Nepdora for
                  digital growth and analytics.
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            size="lg"
            className="h-16 rounded-full bg-white px-10 text-lg font-bold text-blue-900 shadow-2xl transition-all hover:scale-105 hover:bg-blue-50"
            asChild
          >
            <Link href="/admin/signup">
              {ctaText || "Start Building for Free"}
            </Link>
          </Button>
          <p className="text-sm font-medium text-blue-200/80">
            No credit card required. Launch in minutes.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-blue-100/60">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span>100+ Premium Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span>Local Payment Integrated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span>24/7 Local Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
