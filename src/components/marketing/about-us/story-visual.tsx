"use client";

import { useState, useEffect } from "react";
import { Store, ArrowRight, Laptop, Sparkles } from "lucide-react";

export function StoryVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative select-none">
      <div className="-sm overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {/* Top Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mx-3 flex-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-400">
            The Digital Transition
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          <div className="flex items-center justify-between gap-8">
            {/* Traditional */}
            <div className="flex-1 space-y-5 text-center">
              <div className="-inner mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Store className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-slate-200" />
                <div className="mx-auto h-2 w-2/3 rounded bg-slate-200" />
              </div>

              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Traditional
              </p>
            </div>

            {/* Arrow */}
            <div
              className={`transition-all duration-700 ${
                mounted ? "scale-110 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              <div className="-sm flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                <ArrowRight className="h-5 w-5 text-indigo-500" />
              </div>
            </div>

            {/* Digital */}
            <div className="flex-1 space-y-5 text-center">
              <div className="bg-primary -lg mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white">
                <Laptop className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-indigo-200" />
                <div className="mx-auto h-2 w-2/3 rounded bg-indigo-300" />
              </div>

              <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
                Digital
              </p>
            </div>
          </div>

          {/* Bottom Highlight */}
          <div className="mt-12 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 text-center">
            <p className="text-sm font-semibold text-slate-900">
              Empowering 15,000+ Businesses
            </p>
            <p className="mt-1 text-xs text-slate-500">
              From local stalls to global storefronts.
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div
        className="absolute -right-6 -bottom-6 -z-10 h-full w-full rounded-2xl bg-indigo-50 transition-all duration-1000"
        style={{
          transform: mounted ? "translate(0, 0)" : "translate(12px, 12px)",
        }}
      />
    </div>
  );
}
