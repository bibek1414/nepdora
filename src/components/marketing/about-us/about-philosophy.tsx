"use client";

import React from "react";
import { Zap, Clock } from "lucide-react";

function PhilosophyVisual() {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="from-primary/5 absolute -inset-4 bg-gradient-to-tr via-transparent to-transparent blur-2xl lg:-inset-8" />

      <div className="-xl relative overflow-hidden rounded-2xl border border-slate-200 bg-white lg:rounded-3xl">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mx-3 flex-1 rounded border border-slate-200 bg-white px-3 py-1 text-[10px] text-slate-400">
            nepdora.com/about
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Speed Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-slate-50 to-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Launch Speed</p>
                <p className="text-xs text-slate-500">
                  From idea to live website
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Traditional</span>
                <span className="text-slate-500">Weeks → Months</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/4 rounded-full bg-slate-300" />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-primary font-medium">Nepdora</span>
                <span className="text-primary font-bold">Minutes → Hours</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-primary h-full w-[95%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Simplicity Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-slate-50 to-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Learning Curve</p>
                <p className="text-xs text-slate-500">
                  No technical skills required
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-100 bg-white p-3 text-center">
                <p className="text-primary text-lg font-bold">0</p>
                <p className="text-[10px] text-slate-500">Lines of Code</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-3 text-center">
                <p className="text-primary text-lg font-bold">5</p>
                <p className="text-[10px] text-slate-500">Minutes Setup</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-3 text-center">
                <p className="text-primary text-lg font-bold">Drag</p>
                <p className="text-[10px] text-slate-500">& Drop</p>
              </div>
            </div>
          </div>

          {/* Scale Section */}
        </div>
      </div>
    </div>
  );
}

export default function AboutPhilosophy() {
  const stats = [
    { label: "Launch", value: "Instantly" },
    { label: "Learning curve", value: "Zero" },
    { label: "Platform switch", value: "Never" },
  ];

  return (
    <section className="bg-white py-20 sm:py-28 lg:overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-xl">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              Speed. Simplicity. Scale.
            </div>

            <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Great tools should feel{" "}
              <span className="text-primary">invisible</span>
            </h2>

            <p className="mb-10 text-lg leading-relaxed text-slate-600">
              That's why Nepdora focuses on speed—launch instantly,
              simplicity—no learning curve, and scalability—grow without
              switching platforms. Whether you're just starting or expanding,
              Nepdora grows with you.
            </p>

            <div className="flex flex-wrap gap-8 sm:gap-12">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-slate-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:scale-105">
            <PhilosophyVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
