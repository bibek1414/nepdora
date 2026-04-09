"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MousePointer2,
  Layout,
  Type,
  Image as ImageIcon,
  Plus,
  Settings,
  Eye,
  Rocket,
  Smartphone,
  Laptop,
  Monitor,
} from "lucide-react";

export function BuilderVisualMock() {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-5xl md:aspect-[16/9]">
      {/* Background Glow */}
      <div className="bg-primary/5 absolute inset-0 rounded-[48px] blur-3xl" />

      {/* Main Builder Interface */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex h-120 w-150 flex-col overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl"
      >
        {/* Toolbar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="mr-4 flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-slate-200" />
              <div className="h-3 w-3 rounded-full bg-slate-200" />
              <div className="h-3 w-3 rounded-full bg-slate-200" />
            </div>
            <div className="mx-2 h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
              <Monitor className="text-primary h-4 w-4" />
              <span className="text-xs font-bold text-slate-900">Desktop</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-50">
              <Smartphone className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-50">
              <Eye className="h-4 w-4" />
              Preview
            </div>
            <button className="bg-primary shadow-primary/20 flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:scale-105 active:scale-95">
              <Rocket className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Elements */}
          <div className="hidden w-20 flex-col gap-8 border-r border-slate-100 bg-slate-50/50 p-6 md:flex md:w-64">
            <div>
              <div className="mb-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Pages
              </div>
              <div className="space-y-2">
                {["Home", "About", "Services", "Contact"].map((page, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold ${i === 0 ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100"}`}
                  >
                    {page}
                    {i === 0 && (
                      <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative flex-1 overflow-hidden bg-slate-100/50 p-8">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Canvas Header */}
              <div className="flex h-12 items-center justify-between border-b border-slate-50 px-6">
                <div className="h-4 w-24 rounded bg-slate-100" />
                <div className="flex gap-4">
                  <div className="h-2 w-8 rounded bg-slate-50" />
                  <div className="h-2 w-8 rounded bg-slate-50" />
                </div>
              </div>

              {/* Canvas Content */}
              <div className="flex flex-1 flex-col items-center p-12 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-md space-y-6"
                >
                  <div className="mx-auto h-12 w-3/4 rounded-xl bg-slate-900" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="mx-auto h-3 w-5/6 rounded bg-slate-100" />
                  </div>
                  <div className="bg-primary shadow-primary/20 mx-auto h-10 w-32 rounded-xl shadow-lg" />
                </motion.div>

                {/* Drag Indicator */}
                <motion.div
                  animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/4 z-30"
                >
                  <div className="relative">
                    <MousePointer2 className="h-6 w-6 fill-white text-slate-900 drop-shadow-xl" />
                    <div className="bg-primary absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full" />
                  </div>
                </motion.div>

                {/* Floating Properties Panel */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="bg-primary/10 absolute -top-12 -left-12 -z-10 h-64 w-64 rounded-full blur-[100px]" />
      <div className="bg-primary/10 absolute -right-12 -bottom-12 -z-10 h-64 w-64 rounded-full blur-[100px]" />
    </div>
  );
}
