"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layout,
  MousePointer2,
  Code2,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export function AiBuilderVisualMock() {
  const [step, setStep] = React.useState(0);
  const steps = [
    "Analyzing your prompt...",
    "Generating layout structure...",
    "Crafting responsive components...",
    "Optimizing for SEO...",
    "Website Ready!",
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="relative mx-auto aspect-video w-full max-w-2xl md:aspect-[16/10]">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-[40px] bg-blue-500/10 blur-3xl" />

      {/* Main Builder Window */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-1 shadow-2xl"
      >
        {/* Window Header */}
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <div className="rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 font-mono text-[10px] text-slate-400">
            nepdora.com/builder
          </div>
          <div className="w-10" />
        </div>

        {/* Builder Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="flex w-16 flex-col items-center gap-6 border-r border-slate-800 bg-slate-900/50 p-4">
            <Layout className="h-5 w-5 text-slate-500" />
            <Sparkles className="h-5 w-5 text-blue-400" />
            <MousePointer2 className="h-5 w-5 text-slate-500" />
            <Code2 className="h-5 w-5 text-slate-500" />
          </div>

          {/* Canvas Area */}
          <div className="relative flex-1 overflow-hidden bg-slate-950 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex h-full w-full flex-col rounded-xl border border-slate-800 bg-slate-900/30 p-6"
              >
                {/* Simulated Website Content */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="h-4 w-20 rounded bg-slate-800" />
                  <div className="flex gap-3">
                    <div className="h-2 w-8 rounded bg-slate-800" />
                    <div className="h-2 w-8 rounded bg-slate-800" />
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div
                    animate={{ width: step >= 1 ? "100%" : "40%" }}
                    className="h-8 rounded-lg border border-blue-500/30 bg-blue-500/20"
                  />
                  <motion.div
                    animate={{ width: step >= 2 ? "100%" : "60%" }}
                    className="h-24 rounded-lg bg-slate-800/50"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <motion.div
                      animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                      className="h-20 rounded-lg bg-slate-800/50"
                    />
                    <motion.div
                      animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                      className="h-20 rounded-lg bg-slate-800/50"
                    />
                    <motion.div
                      animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                      className="h-20 rounded-lg bg-slate-800/50"
                    />
                  </div>
                </div>

                {/* AI Progress Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 shadow-2xl">
                    <div className="relative">
                      <Cpu className="h-6 w-6 animate-pulse text-blue-400" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-bold text-white">
                        {steps[step]}
                      </div>
                      <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          animate={{
                            width: `${((step + 1) / steps.length) * 100}%`,
                          }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Prompt Bar */}
        <div className="border-t border-slate-800 bg-slate-800/30 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <div className="text-xs font-medium text-slate-400">
              &quot;Create a modern portfolio for a photographer in
              Kathmandu...&quot;
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Badges */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-6 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:flex"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase">
            SEO Score
          </div>
          <div className="text-sm font-black text-slate-900">98/100</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 -left-10 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:flex"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Layout className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase">
            Speed
          </div>
          <div className="text-sm font-black text-slate-900">0.8s Load</div>
        </div>
      </motion.div>
    </div>
  );
}
