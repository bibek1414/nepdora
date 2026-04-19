"use client";

import React from "react";
import { Globe, Check } from "lucide-react";

export default function AboutLocal() {
  const stats = [
    { label: "Payment Ready", value: "eSewa" },
    { label: "Payment Ready", value: "Khalti" },
    { label: "Local Pricing", value: "NPR" },
    { label: "Language Support", value: "नेपाली" },
  ];

  return (
    <section className="border-y border-slate-100 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* text */}
          <div>
            <div className="text-primary mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium">
              🇳🇵 Built for nepal
            </div>
            <h2 className="-tight mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
              Built for where you are
            </h2>
            <p className="mb-4 text-base leading-relaxed text-slate-600">
              Global tools weren't built for Nepal. They focus on international
              markets and credit card economies.
            </p>
            <p className="mb-8 text-base leading-relaxed text-slate-600">
              Nepdora is different. From local payment systems to Nepali-first
              experiences, everything is designed with the realities of Nepali
              businesses in mind—so your website doesn't just exist, it
              performs.
            </p>

            <ul className="space-y-3">
              {[
                "Optimized for local internet speeds",
                "Built-in local logistics support",
                "Native eSewa & Khalti checkouts",
                "Compliance with Nepali business laws",
              ].map(b => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                    <Check className="text-primary h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* visual grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="-sm rounded-2xl border border-slate-200 bg-white p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-1 text-2xl font-bold text-black">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-slate-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
