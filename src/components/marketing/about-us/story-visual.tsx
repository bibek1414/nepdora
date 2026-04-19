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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mx-3 flex-1 rounded border border-slate-200 bg-white px-3 py-0.5 text-[10px] text-slate-400">
            The Digital Transition
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-between gap-6">
            {/* Traditional Side */}
            <div className="flex-1 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="mt-2 h-2 w-3/4 rounded bg-slate-100" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Traditional</p>
            </div>

            <div className={`transition-all duration-1000 ${mounted ? 'scale-110 opacity-100' : 'scale-90 opacity-0'}`}>
              <ArrowRight className="h-6 w-6 text-indigo-400" />
            </div>

            {/* Nepdora Side */}
            <div className="flex-1 space-y-4 text-right">
              <div className="ml-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <Laptop className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <div className="ml-auto h-2 w-full rounded bg-indigo-100" />
                <div className="ml-auto h-2 w-3/4 rounded bg-indigo-200" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Digital</p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-indigo-50 bg-indigo-50/30 p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-xs font-semibold text-slate-900">Empowering 15,000+ Businesses</p>
            <p className="mt-1 text-[10px] text-slate-500">From local stalls to global storefronts.</p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -z-10 -bottom-6 -right-6 h-full w-full rounded-2xl bg-indigo-50 transition-all duration-1000" 
           style={{ transform: mounted ? "translate(0, 0)" : "translate(12px, 12px)" }}
      />
    </div>
  );
}
