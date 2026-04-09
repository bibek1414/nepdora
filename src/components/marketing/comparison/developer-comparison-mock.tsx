"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Layout,
} from "lucide-react";

export function DeveloperComparisonMock() {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-2xl md:aspect-[16/10]">
      {/* Background Glow */}
      <div className="bg-primary/10 absolute inset-0 rounded-[40px] blur-3xl" />

      <div className="relative z-10 grid h-full grid-cols-2 gap-4">
        {/* Traditional Developer Side */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              Traditional Dev
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <Clock className="h-4 w-4 text-rose-500" />
              Delivery: 4-8 Weeks
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <DollarSign className="h-4 w-4 text-rose-500" />
              Cost: NPR 50,000+
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <XCircle className="h-4 w-4 text-rose-500" />
              Manual Updates Only
            </div>

            <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 h-2 w-20 rounded bg-slate-200" />
              <div className="mb-1 h-2 w-full rounded bg-slate-200" />
              <div className="h-2 w-2/3 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <span className="text-[10px] font-black tracking-widest text-slate-400 Nepdora Learn">
              Status: Waiting...
            </span>
          </div>
        </motion.div>

        {/* Nepdora Side */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="fill-primary h-24 w-24" />
          </div>

          <div className="relative z-10 mb-6 flex items-center gap-3">
            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold text-white">Nepdora</div>
          </div>

          <div className="relative z-10 flex-1 space-y-4">
            <div className="flex items-center gap-3 text-xs font-medium text-white/60">
              <Clock className="text-primary h-4 w-4" />
              Delivery: 10 Minutes
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-white/60">
              <DollarSign className="text-primary h-4 w-4" />
              Cost: Free to Start
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-white/60">
              <CheckCircle2 className="text-primary h-4 w-4" />
              Instant Self-Edits
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="bg-primary/40 h-2 w-12 rounded" />
                <div className="bg-primary/20 flex h-4 w-4 items-center justify-center rounded-full">
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <motion.div
                  animate={{ width: ["40%", "100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-primary h-2 rounded"
                />
                <div className="h-2 w-2/3 rounded bg-white/10" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 border-t border-white/10 pt-6 text-center">
            <span className="text-primary text-[10px] font-black tracking-widest Nepdora Learn">
              Status: Live 🚀
            </span>
          </div>
        </motion.div>
      </div>

      {/* Floating Badge */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl"
      >
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
          <Layout className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-black text-slate-400 Nepdora Learn">
            Efficiency
          </div>
          <div className="text-sm font-black text-slate-900">
            10x Faster Launch
          </div>
        </div>
      </motion.div>
    </div>
  );
}
