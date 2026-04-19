"use client";

import { useState, useEffect } from "react";
import { Globe, Heart, Users, ShieldCheck, Zap } from "lucide-react";

export function MissionVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative select-none">
      {/* Main card - The Hub */}
      <div className="-2xl -slate-200/80 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex shrink-0 gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mr-4 flex-1 text-center">
            <input
              type="text"
              className="w-full text-xs font-bold text-slate-400"
              value="nepdora.com/about"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-indigo-50 bg-indigo-50/30 p-4">
              <Globe className="text-primary mb-2 h-5 w-5" />
              <p className="text-sm font-bold text-slate-900">Local first</p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Optimized for Nepal's unique market needs.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-50 bg-emerald-50/30 p-4">
              <Zap className="mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-sm font-bold text-slate-900">High speed</p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Fast loading sites across all 7 provinces.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Digital Empowerment
              </span>
              <span className="text-primary text-xs font-bold">84%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: mounted ? "84%" : "0%" }}
              />
            </div>

            <div className="pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"
                    style={{
                      backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                      backgroundSize: "cover",
                    }}
                  />
                ))}
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white">
                  +15k
                </div>
              </div>
              <p className="mt-2 text-[11px] font-medium text-slate-500">
                Join 15,000+ businesses scaling on Nepdora
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className="-xl absolute -top-6 -right-6 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-all delay-300 duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Support local</p>
          <p className="text-xs text-slate-400">Nepali owned & operated</p>
        </div>
      </div>

      <div
        className="-xl absolute -bottom-8 -left-8 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-all delay-500 duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Secure & Trusted</p>
          <p className="text-xs text-slate-400">Bank-grade infrastructure</p>
        </div>
      </div>
    </div>
  );
}
