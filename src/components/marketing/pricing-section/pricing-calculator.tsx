"use client";

import React, { useState } from "react";
import { Calculator, TrendingDown, Zap, ArrowRight } from "lucide-react";

export default function PricingCalculator() {
  const [exchangeRate, setExchangeRate] = useState(134); // Approx NPR per USD
  const [shopifyPlan, setShopifyPlan] = useState(39); // Basic Shopify is $39

  const shopifyMonthlyNPR = shopifyPlan * exchangeRate;
  const shopifyYearlyNPR = shopifyMonthlyNPR * 12;
  
  // Approximate Nepdora Premium Plan
  const nepdoraMonthlyNPR = 999; 
  const nepdoraYearlyNPR = nepdoraMonthlyNPR * 12;
  
  const annualSavings = shopifyYearlyNPR - nepdoraYearlyNPR;
  const savingsPercentage = Math.round((annualSavings / shopifyYearlyNPR) * 100);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="grid gap-12 lg:grid-cols-2 relative z-10">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                See How Much You <span className="text-blue-400">Save</span>
              </h2>
              <p className="mb-8 text-lg text-slate-400">
                Stop paying for currency conversion and high USD subscription fees. Calculate your potential savings when you switch from global platforms to Nepdora.
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
                      value={shopifyPlan}
                      onChange={(e) => setShopifyPlan(parseInt(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
                    />
                    <span className="w-16 text-right font-bold text-xl text-blue-400">${shopifyPlan}</span>
                  </div>
                </div>
                
                <div className="rounded-xl bg-slate-800/50 p-6 border border-slate-700">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Estimated Exchange Rate</span>
                    <span>1 USD = {exchangeRate} NPR</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl bg-blue-600 p-8 md:p-10 shadow-inner">
              <div className="mb-8 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-100">
                  <TrendingDown className="h-3 w-3" /> Potential Annual Savings
                </div>
                <Zap className="h-6 w-6 text-yellow-300 animate-pulse" />
              </div>
              
              <div className="mb-2 text-5xl font-black md:text-7xl">
                NPR {annualSavings.toLocaleString()}
              </div>
              <div className="mb-8 text-xl font-medium text-blue-100">
                Save {savingsPercentage}% every year
              </div>
              
              <div className="space-y-4 border-t border-blue-500 pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Shopify/Wix Yearly</span>
                  <span className="font-bold">NPR {shopifyYearlyNPR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Nepdora Yearly</span>
                  <span className="font-bold text-green-300">NPR {nepdoraYearlyNPR.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="mt-10 group flex w-full items-center justify-center gap-2 rounded-xl bg-white p-4 font-bold text-blue-600 transition-all hover:bg-blue-50">
                Start Saving Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
