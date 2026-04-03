import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface AlternativePricingProps {
  platformName: string;
  traditionalCostLabel: string;
  traditionalCostValue: string;
  traditionalPoints: string[];
  nepdoraPoints: string[];
}

export const AlternativePricing: React.FC<AlternativePricingProps> = ({
  platformName,
  traditionalCostLabel,
  traditionalCostValue,
  traditionalPoints,
  nepdoraPoints,
}) => {
  return (
    <section className="bg-slate-100 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
          How Nepdora pricing compares
        </h2>
        <p className="mb-10 text-lg text-slate-600 max-w-2xl">
          Hidden costs add up fast. Here is what you actually pay for a fully
          operational Nepal business website.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-500 mb-2">
              {traditionalCostLabel}
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mb-6">
              {traditionalCostValue}
            </p>
            <ul className="space-y-3 text-slate-600 text-sm">
              {traditionalPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 p-8">
            <p className="text-sm font-semibold text-primary mb-2">
              Nepdora — flat annual plan
            </p>
            <p className="text-2xl font-extrabold mb-6">
              NPR 10,000 / year
            </p>
            <ul className="space-y-3 text-slate-300 text-sm">
              {nepdoraPoints.map((point, i) => (
                <li key={i}>✓ {point}</li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 bg-primary text-white font-semibold rounded-full px-6 py-3 text-sm hover:bg-primary/90 transition"
            >
              See full pricing <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
