"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Smartphone,
  ExternalLink,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ShowcaseVisualMockProps {
  title: string;
  category: string;
  metric?: string;
}

export function ShowcaseVisualMock({
  title,
  category,
  metric,
}: ShowcaseVisualMockProps) {
  return (
    <div className="group-hover:border-primary/20 relative h-full w-full overflow-hidden rounded-[32px] border border-slate-100 bg-slate-50 transition-colors">
      {/* Browser Chrome */}
      <div className="flex h-8 items-center gap-1.5 border-b border-slate-200/50 bg-slate-100/50 px-4">
        <div className="h-2 w-2 rounded-full bg-slate-300" />
        <div className="h-2 w-2 rounded-full bg-slate-300" />
        <div className="h-2 w-2 rounded-full bg-slate-300" />
        <div className="ml-4 flex h-4 w-32 items-center rounded-md bg-slate-200/50 px-2">
          <div className="h-1 w-full rounded-full bg-slate-300/50" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex h-full flex-col p-6">
        {/* Header Mock */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="flex gap-3">
            <div className="h-2 w-8 rounded bg-slate-100" />
            <div className="h-2 w-8 rounded bg-slate-100" />
          </div>
        </div>

        {/* Hero Mock */}
        <div className="mb-8 space-y-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            className="h-8 rounded-lg bg-slate-900"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="h-3 rounded bg-slate-100"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            className="h-3 rounded bg-slate-100"
          />
        </div>

        {/* Feature Grid Mock */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="flex aspect-square items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
            <Zap className="h-4 w-4 text-slate-200" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
            <Globe className="h-4 w-4 text-slate-200" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
            <ShieldCheck className="h-4 w-4 text-slate-200" />
          </div>
        </div>

        {/* Metric Badge (Floating) */}
        {metric && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary shadow-primary/30 absolute right-10 bottom-10 z-10 rounded-2xl p-4 text-white shadow-2xl"
          >
            <div className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-60">
              Impact
            </div>
            <div className="text-lg font-black tracking-tight">{metric}</div>
          </motion.div>
        )}
      </div>

      {/* Device Overlay (Hover) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/60 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl">
            <Laptop className="h-6 w-6" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl">
            <Smartphone className="h-6 w-6" />
          </div>
        </div>
        <div className="flex translate-y-4 transform items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-xl transition-transform group-hover:translate-y-0">
          Visit live site
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
