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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Website for any kind of business in Nepdora
          </h2>
          <p className="text-base">
            Nepdora has templates and built in system fro any kind of website as
            per you need. Try today !
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {otherIndustries.map(industry => (
            <Link
              key={industry}
              href={`/industries/${industry}`}
              className="group :border-slate-300 :shadow-sm flex w-fit flex-col items-center justify-start rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <h3 className="flex gap-3 text-sm font-semibold text-black">
                {INDUSTRY_LABELS[industry] || industry}

                <ChevronRight className="mt-1 h-3 w-3" />
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
