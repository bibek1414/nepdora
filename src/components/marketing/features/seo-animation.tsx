"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Star, MoreVertical, Mic } from "lucide-react";
import { SearchScenario } from "./types";

const scenarios: SearchScenario[] = [
  {
    query: "accounting, auditing, consultant",
    result: {
      site: "nepdora Consultants",
      url: "nepdora.nepdoraconsultants.com",
      title: "nepdora - Strategic Financial Consulting",
      desc: "Leading provider of Process Automation, Financial Advisory, Accounting & Bookkeeping, Virtual CFO, and expert tax planning services.",
    },
  },
  {
    query: "education consultancy study abroad",
    result: {
      site: "Brainstorm Education",
      url: "nepdora.brainstormeducation.com.au",
      title: "Brainstorm Education and Migration Consultants",
      desc: "Leading education and migration consultants for overseas education and immigration services. Offices in Nepal and Australia.",
    },
  },
  {
    query: "trekking hiking nepal adventure",
    result: {
      site: "Hiking Bees",
      url: "nepdora.hikingbees.com",
      title: "Hiking Bees - Best Adventure Trekking Company in Nepal",
      desc: "Registered local trekking company organizing Everest Base Camp, Annapurna Circuit, and Manaslu Trek expeditions. 3+ years experience.",
    },
  },
];

export const SeoAnimation: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const currentScenario = scenarios[scenarioIndex];
    const fullText = currentScenario.query;

    const animateCycle = async () => {
      setDisplayedText("");
      setShowResults(false);

      // Type text
      for (let i = 0; i <= fullText.length; i++) {
        await new Promise(r => setTimeout(r, 60 + Math.random() * 40));
        setDisplayedText(fullText.slice(0, i));
      }

      // Loading delay
      await new Promise(r => setTimeout(r, 600));

      // Show results
      setShowResults(true);

      // Wait and cycle
      await new Promise(r => setTimeout(r, 4000));
      setScenarioIndex(prev => (prev + 1) % scenarios.length);
    };

    animateCycle();
  }, [scenarioIndex]);

  const activeResult = scenarios[scenarioIndex].result;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="w-full max-w-sm">
        {/* Search Bar Area */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex justify-center text-2xl font-bold tracking-tighter text-slate-700">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>

          <div className="relative flex items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-shadow hover:shadow-md">
            <Search size={16} className="mr-3 text-slate-400" />
            <span className="flex-1 text-sm font-medium text-slate-800">
              {displayedText}
              {!showResults &&
                displayedText.length <
                  scenarios[scenarioIndex].query.length && (
                  <span className="animate-pulse text-blue-500">|</span>
                )}
            </span>
            <Mic size={16} className="ml-2 text-[#4285F4]" />
          </div>

          <div className="flex gap-4 border-b border-slate-100 px-1 pb-2 text-[10px] font-medium text-slate-500 sm:text-xs">
            <span className="-mb-2.5 border-b-2 border-[#4285F4] pb-2 text-[#4285F4]">
              All
            </span>
            <span>Images</span>
            <span>Shopping</span>
            <span>News</span>
          </div>
        </div>

        {/* Results Area */}
        <div className="min-h-[220px] space-y-4">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Top Result */}
                <div className="rounded-lg bg-white">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-600">
                      {activeResult.site[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-slate-800 sm:text-xs">
                        {activeResult.site}
                      </span>
                      <span className="max-w-[200px] truncate text-[9px] text-slate-500">
                        {activeResult.url}
                      </span>
                    </div>
                    <MoreVertical
                      size={12}
                      className="ml-auto text-slate-400"
                    />
                  </div>
                  <div className="mb-1 cursor-pointer text-sm leading-tight font-medium text-[#1a0dab] hover:underline sm:text-base">
                    {activeResult.title}
                  </div>
                  <div className="text-xs leading-relaxed text-[#4d5156]">
                    {activeResult.desc}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-[#4d5156]">
                      <div className="flex text-[#F4B400]">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                      </div>
                      <span className="ml-1">4.9 (500+)</span>
                    </span>
                    <span className="text-[10px] text-slate-300">|</span>
                    <span className="cursor-pointer text-[10px] text-[#1a0dab] hover:underline">
                      Shop Now
                    </span>
                    <span className="cursor-pointer text-[10px] text-[#1a0dab] hover:underline">
                      Reviews
                    </span>
                  </div>
                </div>

                {/* Competitor */}
                <div className="border-t border-slate-100 pt-2 opacity-60">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-slate-100"></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-700">
                        Competitor Store
                      </span>
                    </div>
                  </div>
                  <div className="mb-0.5 text-xs font-medium text-[#1a0dab]">
                    Best Deals on {scenarios[scenarioIndex].query}
                  </div>
                  <div className="text-[10px] text-[#4d5156]">
                    Find great prices and selection. Fast delivery available...
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100"></div>
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100"></div>
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100"></div>
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
