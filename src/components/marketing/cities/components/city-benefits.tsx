import React from "react";
import { Check } from "lucide-react";

interface CityBenefitsProps {
  cityName: string;
  category: string;
  highlights: { title: string; desc: string; icon: string }[];
}

export const CityBenefits: React.FC<CityBenefitsProps> = ({
  cityName,
  category,
  highlights,
}) => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-normal text-slate-900 md:text-3xl">
              Dominating the <span className="text-[#1047A1]">{category}</span>{" "}
              market in {cityName} with{" "}
              <span className="font-semibold">Nepdora</span>
            </h2>
            <p className="text-slate-500">
              Why settle for less when you can have the best?
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:justify-end">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#1047A1]">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {h.title}
                </span>
              </div>
            ))}
          </div>
          <button className="rounded-full bg-[#1047A1] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};
