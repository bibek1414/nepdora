import React from "react";
import { Check, X } from "lucide-react";

interface ComparisonProps {
  data: { nepdora: string[]; traditional: string[] };
}

export const ComparisonSection: React.FC<ComparisonProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="bg-slate-900 py-32 text-white overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Why Choose Nepdora?
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            A simple, clear comparison of how Nepdora stacks up against hiring a traditional web development agency.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8 rounded-3xl bg-blue-600/10 p-10 ring-1 ring-blue-500/50">
            <h3 className="text-3xl font-bold text-blue-400">Nepdora Builder</h3>
            <ul className="space-y-6">
              {data.nepdora.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50">
                    <Check className="h-5 w-5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 rounded-3xl bg-slate-800/20 p-10 ring-1 ring-slate-700">
            <h3 className="text-3xl font-bold text-slate-400">Traditional Agency</h3>
            <ul className="space-y-6">
              {data.traditional.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-xl text-slate-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-500">
                    <X className="h-5 w-5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-6 rounded-3xl bg-blue-600/5 p-12 text-center ring-1 ring-blue-500/20">
          <h4 className="text-2xl font-bold">The Verdict: Nepdora is 10x Faster & More Affordable</h4>
          <p className="text-lg text-slate-400">Join thousands of local businesses that trust Nepdora for their digital presence.</p>
        </div>
      </div>
    </section>
  );
};
