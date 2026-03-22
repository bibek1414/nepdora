"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Globe, TrendingUp } from "lucide-react";

const SeoSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col p-4 bg-white overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
          98
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-800">SEO Score</div>
          <div className="text-[8px] text-emerald-500 flex items-center gap-1">
            <TrendingUp size={8} /> +12% this week
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 mb-1">
            <Search size={10} className="text-slate-400" />
            <div className="h-1.5 w-32 bg-slate-200 rounded" />
          </div>
          <div className="h-2 w-48 bg-indigo-100 rounded mb-1" />
          <div className="h-1.5 w-full bg-slate-200 rounded opacity-50" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border border-slate-100 flex flex-col items-center">
            <Globe size={12} className="text-slate-400 mb-1" />
            <div className="text-[8px] font-bold text-slate-700">Sitemap.xml</div>
            <div className="h-1 w-8 bg-emerald-400 rounded mt-1" />
          </div>
          <div className="p-2 rounded-lg border border-slate-100 flex flex-col items-center">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <TrendingUp size={12} className="text-slate-400 mb-1" />
            </motion.div>
            <div className="text-[8px] font-bold text-slate-700">Analytics</div>
            <div className="h-1 w-8 bg-indigo-400 rounded mt-1" />
          </div>
        </div>
      </div>
      
      <div className="mt-auto h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "98%" }}
          transition={{ duration: 2 }}
          className="h-full bg-indigo-600"
        />
      </div>
    </div>
  );
};

export default SeoSkeleton;
