import React from "react";
import { ChevronRight } from "lucide-react";

interface CityIndustryListsProps {
  cityName: string;
  industries: string[];
  neighborhoods: string[];
}

export const CityIndustryLists: React.FC<CityIndustryListsProps> = ({
  cityName,
  industries,
  neighborhoods,
}) => {
  return (
    <section className="bg-slate-50 py-20 text-[#1047A1]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-4 text-center text-sm font-semibold  text-slate-400">
           Localized Content
        </h2>
        <h3 className="mb-16 text-center text-3xl font-normal text-slate-900 md:text-3xl">
           Popular industries and neighborhoods in {cityName}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* By Neighborhood */}
           <div className="rounded-3xl border border-slate-100 bg-white p-12 shadow-sm">
                <h4 className="mb-8 text-xl font-normal text-slate-900">Neighborhoods in {cityName}</h4>
                <div className="grid grid-cols-2 gap-4">
                    {neighborhoods.map((n, i) => (
                        <a key={i} href="#" className="flex items-center justify-between text-sm font-light text-slate-600 hover:text-[#1047A1]">
                            <span>{n}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>
           </div>

           {/* By Industry */}
           <div className="rounded-3xl border border-slate-100 bg-white p-12 shadow-sm">
                <h4 className="mb-8 text-xl font-normal text-slate-900">Industries in {cityName}</h4>
                <div className="grid grid-cols-2 gap-4">
                    {industries.map((n, i) => (
                        <a key={i} href="#" className="flex items-center justify-between text-sm font-light text-slate-600 hover:text-[#1047A1]">
                            <span>{n}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>
           </div>
        </div>
      </div>
    </section>
  );
};
