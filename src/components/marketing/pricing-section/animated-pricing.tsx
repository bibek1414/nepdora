"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

export function AnimatedPricing() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const plans = [
    {
      name: "Starter",
      price: "NPR 9,999",
      features: ["Basic website", "1 Page", "Email support"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "NPR 29,999",
      features: ["Full website", "SEO optimized", "Priority support"],
      highlight: true,
    },
  ];

  return (
    <div className="space-y-4">
      {plans.map((plan, i) => (
        <div
          key={i}
          className={`rounded-2xl border p-5 shadow-xl transition-all duration-700 ${
            plan.highlight
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-200 bg-white"
          }`}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
            {plan.highlight && (
              <span className="rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white">
                Popular
              </span>
            )}
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">{plan.price}</p>

          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {plan.features.map((f, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
