"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

const DesignAnimation = () => {
  // 0: Font Selection, 1: Theme Selection
  const [phase, setPhase] = useState(0);
  const [font, setFont] = useState("font-sans"); // 'font-sans' | 'font-serif'
  const [theme, setTheme] = useState("light"); // 'light' | 'dark'

  useEffect(() => {
    const sequence = async () => {
      // Loop forever
      while (true) {
        setPhase(0); // Mouse moving to fonts
        await new Promise(r => setTimeout(r, 1000));
        setFont(prev => (prev === "font-sans" ? "font-serif" : "font-sans")); // Click

        await new Promise(r => setTimeout(r, 1500));

        setPhase(1); // Mouse moving to theme
        await new Promise(r => setTimeout(r, 1000));
        setTheme(prev => (prev === "light" ? "dark" : "light")); // Click

        await new Promise(r => setTimeout(r, 2000));
      }
    };
    sequence();
  }, []);

  return (
    <div className="bg-muted/30 border-border flex h-full w-full overflow-hidden rounded-xl border">
      {/* Sidebar Controls */}
      <div className="bg-background border-border relative flex w-1/3 flex-col gap-4 border-r p-4">
        <div className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
          Editor
        </div>

        <div className="space-y-2">
          <div className="text-foreground text-xs font-semibold">
            Typography
          </div>
          <div
            className={`cursor-pointer rounded border p-2 text-xs transition-colors ${font === "font-sans" && phase === 0 ? "bg-muted border-primary/50" : "border-border"}`}
          >
            Sans Serif
          </div>
          <div
            className={`cursor-pointer rounded border p-2 text-xs transition-colors ${font === "font-serif" && phase === 0 ? "bg-muted border-primary/50" : "border-border"}`}
          >
            Serif Display
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <div className="text-foreground text-xs font-semibold">Theme</div>
          <div
            className={`cursor-pointer rounded border p-2 text-xs transition-colors ${theme === "light" && phase === 1 ? "bg-muted border-primary/50" : "border-border"}`}
          >
            Light Mode
          </div>
          <div
            className={`cursor-pointer rounded border p-2 text-xs transition-colors ${theme === "dark" && phase === 1 ? "bg-muted border-primary/50" : "border-border"}`}
          >
            Dark Mode
          </div>
        </div>

        {/* Fake Cursor */}
        <motion.div
          animate={{
            y: phase === 0 ? 85 : 205,
            x: 80,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="pointer-events-none absolute top-0 left-0 z-10"
        >
          <MousePointer2
            className="fill-foreground text-background drop-shadow-lg"
            size={24}
          />
        </motion.div>
      </div>

      {/* Preview Area */}
      <div
        className={`flex-1 p-6 transition-colors duration-500 ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div
          className={`flex h-full w-full flex-col overflow-hidden rounded-lg border shadow-lg transition-colors duration-500 ${theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
        >
          {/* Header */}
          <div
            className={`flex h-12 items-center justify-between border-b px-4 ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}
          >
            <div
              className={`h-3 w-16 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"}`}
            ></div>
            <div className="flex gap-2">
              <div
                className={`h-2 w-8 rounded-full ${theme === "dark" ? "bg-slate-600" : "bg-slate-100"}`}
              ></div>
              <div
                className={`h-2 w-8 rounded-full ${theme === "dark" ? "bg-slate-600" : "bg-slate-100"}`}
              ></div>
            </div>
          </div>

          {/* Body */}
          <div className="flex h-full flex-col justify-center p-6">
            <motion.div
              key={font} // Trigger animation on font change
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-3 text-2xl font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"} ${font === "font-serif" ? "font-serif" : "font-sans"}`}
            >
              {font === "font-serif" ? "Elegant Styles." : "Modern Design."}
            </motion.div>
            <div
              className={`mb-2 h-2 w-3/4 rounded transition-colors duration-300 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"}`}
            ></div>
            <div
              className={`mb-6 h-2 w-1/2 rounded transition-colors duration-300 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"}`}
            ></div>

            <div
              className={`flex h-8 w-24 items-center justify-center rounded text-xs font-bold transition-colors duration-300 ${theme === "dark" ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"}`}
            >
              Shop Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignAnimation;
