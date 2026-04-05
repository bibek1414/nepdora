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
        <p className="mb-10 max-w-2xl text-lg text-slate-600">
          Hidden costs add up fast. Here is what you actually pay for a fully
          operational Nepal business website.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="mb-2 text-sm font-semibold text-slate-500">
              {traditionalCostLabel}
            </p>
            <p className="mb-6 text-2xl font-extrabold text-slate-900">
              {traditionalCostValue}
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              {traditionalPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-white">
            <p className="text-primary mb-2 text-sm font-semibold">
              Nepdora - flat annual plan
            </p>
            <p className="mb-6 text-2xl font-extrabold">NPR 10,000 / year</p>
            <ul className="space-y-3 text-sm text-slate-300">
              {nepdoraPoints.map((point, i) => (
                <li key={i}>✓ {point}</li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="bg-primary hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition"
            >
              See full pricing <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
