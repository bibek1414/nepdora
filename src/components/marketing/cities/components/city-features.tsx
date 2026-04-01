import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CityFeaturesProps {
  cityName: string;
  category: string;
  benefits: string[];
}

export const CityFeatures: React.FC<CityFeaturesProps> = ({
  cityName,
  category,
  benefits,
}) => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto max-w-6xl space-y-32 px-4 sm:px-6">
        {/* Feature 1: Left Text, Right Image */}
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="mb-6 text-3xl leading-tight font-normal text-slate-900 md:text-4xl">
              Competitive landscape of <br />
              <span className="text-[#1047A1]">{category} with Nepdora</span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed font-light text-slate-500">
              Identify key opportunities in the {cityName} market. Understand
              how your competitors are performing and where you can outperform
              them with Nepdora’s faster, AI-driven website architecture.
            </p>
            <ul className="mb-10 space-y-4">
              {benefits.slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[#1047A1]">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-light">{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/admin/signup">
              <Button
                variant="outline"
                className="h-12 rounded-lg border-[#1047A1] text-[#1047A1] hover:bg-blue-50"
              >
                Expore the Nepdora roadmap
              </Button>
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                alt="Nepdora Analytics"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature 2: Right Text, Left Image */}
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="order-1">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=80"
                alt="Nepdora Strategy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-2">
            <h2 className="mb-6 text-3xl leading-tight font-normal text-slate-900 md:text-4xl">
              Unlock local traffic <br />
              <span className="text-[#1047A1]">insights with Nepdora</span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed font-light text-slate-500">
              Get detailed insights into where your customers are coming from in{" "}
              {cityName}. Nepdora’s localized SEO strategy ensures you rank for
              the neighborhood-specific keywords that matter most to your
              business.
            </p>
            <div className="mb-10 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-normal text-[#1047A1]">85%</div>
                <div className="text-sm text-slate-400">Search Visibility</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-normal text-[#1047A1]">12x</div>
                <div className="text-sm text-slate-400">Faster Launch</div>
              </div>
            </div>
            <Link href="/admin/signup">
              <Button
                variant="outline"
                className="h-12 rounded-lg border-[#1047A1] text-[#1047A1] hover:bg-blue-50"
              >
                See how we do it
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
