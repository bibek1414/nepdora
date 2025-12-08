"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

export const DesignAnimation: React.FC = () => {
  const [mode, setMode] = useState(0); // 0: Modern/Light, 1: Elegant/Dark

  useEffect(() => {
    const interval = setInterval(() => {
      setMode(prev => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {/* Sidebar */}
      <div className="z-10 flex w-24 flex-col gap-4 border-r border-slate-200 bg-white p-4 md:w-32">
        <div className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Theme
        </div>
        <div
          className={`h-8 w-full rounded-md border-2 transition-all duration-300 ${mode === 0 ? "border-slate-400 bg-slate-50" : "border-slate-200"}`}
        ></div>
        <div
          className={`h-8 w-full rounded-md border-2 transition-all duration-300 ${mode === 1 ? "border-slate-400 bg-slate-800" : "border-slate-200 bg-slate-800"}`}
        ></div>
      </div>

      {/* Canvas */}
      <div
        className={`flex flex-1 flex-col justify-center p-6 transition-colors duration-1000 ease-in-out md:p-10 ${mode === 0 ? "bg-white" : "bg-slate-900"}`}
      >
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3
            className={`mb-4 text-3xl font-bold transition-colors duration-1000 ${mode === 0 ? "font-sans text-slate-900" : "font-serif text-white italic"}`}
          >
            {mode === 0 ? "Minimalist." : "Elegance."}
          </h3>
          <div
            className={`mb-6 h-2 w-32 rounded transition-colors duration-1000 ${mode === 0 ? "bg-slate-200" : "bg-slate-700"}`}
          ></div>
          <button
            className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all duration-1000 sm:rounded-2xl sm:px-6 sm:text-sm ${mode === 0 ? "bg-slate-900 text-white" : "bg-slate-700 text-white"}`}
          >
            Explore Collection
          </button>
        </motion.div>
      </div>

      {/* Cursor Overlay */}
      <motion.div
        animate={{ x: 20, y: mode === 0 ? 60 : 110 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="pointer-events-none absolute top-0 left-0 z-20"
      >
        <MousePointer2
          className="fill-white text-slate-900 drop-shadow-md"
          size={24}
        />
      </motion.div>
    </div>
  );
};
