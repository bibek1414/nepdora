"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Globe, TrendingUp } from "lucide-react";

const SeoSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold">
          98
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-800">SEO Score</div>
          <div className="flex items-center gap-1 text-[8px] text-emerald-500">
            <TrendingUp size={8} /> +12% this week
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
          <div className="mb-1 flex items-center gap-2">
            <Search size={10} className="text-slate-400" />
            <div className="h-1.5 w-32 rounded bg-slate-200" />
          </div>
          <div className="mb-1 h-2 w-48 rounded bg-indigo-100" />
          <div className="h-1.5 w-full rounded bg-slate-200 opacity-50" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center rounded-lg border border-slate-100 p-2">
            <Globe size={12} className="mb-1 text-slate-400" />
            <div className="text-[8px] font-bold text-slate-700">
              Sitemap.xml
            </div>
            <div className="mt-1 h-1 w-8 rounded bg-emerald-400" />
          </div>
          <div className="flex flex-col items-center rounded-lg border border-slate-100 p-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <TrendingUp size={12} className="mb-1 text-slate-400" />
            </motion.div>
            <div className="text-[8px] font-bold text-slate-700">Analytics</div>
            <div className="mt-1 h-1 w-8 rounded bg-indigo-400" />
          </div>
        </div>
      </div>

      <div className="mt-auto h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "98%" }}
          transition={{ duration: 2 }}
          className="bg-primary h-full"
        />
      </div>
    </div>
  );
};

export default SeoSkeleton;
