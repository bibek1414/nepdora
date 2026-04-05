"use client";

import React, { useState } from "react";
import { Calculator, TrendingDown, Zap, ChevronRight } from "lucide-react";

export default function PricingCalculator() {
  const [exchangeRate, setExchangeRate] = useState(134); // Approx NPR per USD
  const [globalPlan, setGlobalPlan] = useState(39); // Average global plan is $39

  const globalMonthlyNPR = globalPlan * exchangeRate;
  const globalYearlyNPR = globalMonthlyNPR * 12;

  // Approximate Nepdora Premium Plan
  const nepdoraMonthlyNPR = 999;
  const nepdoraYearlyNPR = nepdoraMonthlyNPR * 12;

  const annualSavings = globalYearlyNPR - nepdoraYearlyNPR;
  const savingsPercentage = Math.round((annualSavings / globalYearlyNPR) * 100);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl md:p-12">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                See How Much You <span className="text-blue-400">Save</span>
              </h2>
              <p className="mb-8 text-lg text-slate-400">
                Stop paying for currency conversion and high USD subscription
                fees. Calculate your potential savings when you switch from
                global platforms like Shopify, Wix, or Webflow to Nepdora.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Current Global Platform Monthly Cost (USD)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="25"
                      max="299"
                      step="1"
                      value={globalPlan}
                      onChange={e => setGlobalPlan(parseInt(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
                    />
                    <span className="w-16 text-right text-xl font-bold text-blue-400">
                      ${globalPlan}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Estimated Exchange Rate</span>
                    <span>1 USD = {exchangeRate} NPR</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl bg-blue-600 p-8 shadow-inner md:p-10">
              <div className="mb-8 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-100">
                  <TrendingDown className="h-3 w-3" /> Potential Annual Savings
                </div>
                <Zap className="h-6 w-6 animate-pulse text-yellow-300" />
              </div>

              <div className="mb-2 text-5xl font-black md:text-7xl">
                NPR {annualSavings.toLocaleString()}
              </div>
              <div className="mb-8 text-xl font-medium text-blue-100">
                Save {savingsPercentage}% every year
              </div>

              <div className="space-y-4 border-t border-blue-500 pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">
                    Global Builders (Wix/Shopify)
                  </span>
                  <span className="font-bold">
                    NPR {globalYearlyNPR.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Nepdora Yearly</span>
                  <span className="font-bold text-green-300">
                    NPR {nepdoraYearlyNPR.toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="group mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-white p-4 font-bold text-blue-600 transition-all hover:bg-blue-50">
                Start Saving Now{" "}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
