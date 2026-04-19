"use client";

import React from "react";
import {
  Layout,
  TrendingUp,
  CreditCard,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "Design-first experience",
    desc: "Clean, professional websites out of the box with zero design knowledge needed.",
  },
  {
    icon: TrendingUp,
    title: "Built-in growth tools",
    desc: "SEO, analytics, and performance optimization built into the core of every site.",
  },
  {
    icon: CreditCard,
    title: "Local payment integration",
    desc: "Seamlessly accept payments with eSewa & Khalti without writing a single line of code.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first by default",
    desc: "Designed for how Nepal actually uses the internet—fast, responsive, and data-efficient.",
  },
  {
    icon: ShieldCheck,
    title: "All-in-one platform",
    desc: "No plugins, no patchwork tools, no security certificates to manage. We handle it all.",
  },
];

export default function AboutDifference() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What makes <span className="text-primary">Nepdora different</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            We're not just a website builder. We're infrastructure for modern
            Nepali businesses.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="group :border-indigo-100 :-xl :-indigo-50/50 rounded-2xl border border-slate-100 bg-white p-8 transition-all"
            >
              <div className="text-primary group-:bg-primary group-:text-white mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <p className="text-sm text-slate-500 italic">
              "Every feature is crafted to remove friction and help you move
              faster."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
