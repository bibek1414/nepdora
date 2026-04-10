import React from "react";
import Link from "next/link";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { ChevronRight } from "lucide-react";

interface IndustryDiscoveryProps {
  currentCategory: string;
}

export const IndustryDiscovery: React.FC<IndustryDiscoveryProps> = ({
  currentCategory,
}) => {
  const otherIndustries = industries.filter(id => id !== currentCategory);

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore other industry solutions
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Nepdora provides specialized tools for every business type across
            Nepal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {otherIndustries.map(industry => (
            <Link
              key={industry}
              href={`/${industry}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition :border-slate-300 :shadow-sm"
            >
              <h3 className="mb-2 text-sm font-semibold text-slate-900 group-:text-blue-600">
                {INDUSTRY_LABELS[industry] || industry}
              </h3>
              <div className="flex items-center text-xs font-medium text-slate-400 group-:text-blue-500">
                View Solution
                <ChevronRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
