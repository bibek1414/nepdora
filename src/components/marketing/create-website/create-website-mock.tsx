"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  MousePointer2,
  Type,
  Image as ImageIcon,
  Plus,
  CheckCircle2,
  Smartphone,
  Monitor,
  Palette,
} from "lucide-react";

export function CreateWebsiteMock() {
  const [activeTab, setActiveTab] = React.useState<"desktop" | "mobile">(
    "desktop"
  );

  return (
    <div className="relative mx-auto aspect-video w-full max-w-3xl md:aspect-[16/10]">
      {/* Background Glow */}
      <div className="bg-primary/10 absolute inset-0 rounded-[40px] blur-3xl" />

      {/* Main Builder Interface */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-1 shadow-2xl"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/50 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="mx-2 h-4 w-px bg-slate-700" />
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("desktop")}
                className={`rounded-md p-1.5 transition-colors ${activeTab === "desktop" ? "bg-primary text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`rounded-md p-1.5 transition-colors ${activeTab === "mobile" ? "bg-primary text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Draft Saved
            </div>
            <button className="bg-primary shadow-primary/20 rounded-lg px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-lg">
              Publish
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Elements */}
          <div className="flex w-16 flex-col items-center gap-6 border-r border-slate-800 bg-slate-900/50 p-4">
            <div className="bg-primary/10 text-primary rounded-xl p-2">
              <Plus className="h-5 w-5" />
            </div>
            <Layout className="h-5 w-5 text-slate-500" />
            <Type className="h-5 w-5 text-slate-500" />
            <ImageIcon className="h-5 w-5 text-slate-500" />
            <Palette className="h-5 w-5 text-slate-500" />
          </div>

          {/* Canvas */}
          <div className="flex flex-1 items-start justify-center overflow-hidden bg-slate-950 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className={`overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-500 ${activeTab === "desktop" ? "h-full w-full" : "h-full w-48"}`}
              >
                {/* Simulated Website Content */}
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-12 rounded bg-slate-200" />
                    <div className="flex gap-2">
                      <div className="h-1.5 w-4 rounded bg-slate-100" />
                      <div className="h-1.5 w-4 rounded bg-slate-100" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      className="h-6 rounded-lg bg-slate-900"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="h-2 rounded bg-slate-100"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      className="h-2 rounded bg-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex aspect-video items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                      <ImageIcon className="h-4 w-4 text-slate-200" />
                    </div>
                    <div className="flex aspect-video items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                      <ImageIcon className="h-4 w-4 text-slate-200" />
                    </div>
                  </div>

                  <div className="bg-primary/10 border-primary/20 flex h-10 w-full items-center justify-center rounded-xl border">
                    <div className="bg-primary/40 h-2 w-16 rounded" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="hidden w-48 border-l border-slate-800 bg-slate-900/50 p-6 lg:block">
            <div className="mb-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Properties
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase">
                  Typography
                </div>
                <div className="h-8 w-full rounded-lg border border-slate-700 bg-slate-800" />
              </div>
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase">
                  Colors
                </div>
                <div className="flex gap-2">
                  <div className="bg-primary h-6 w-6 rounded-full" />
                  <div className="h-6 w-6 rounded-full bg-slate-700" />
                  <div className="h-6 w-6 rounded-full bg-slate-800" />
                </div>
              </div>
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <div className="text-[9px] font-bold text-slate-400 uppercase">
                  Spacing
                </div>
                <div className="flex h-20 w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50">
                  <div className="h-10 w-10 rounded border border-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Interaction */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-20"
      >
        <MousePointer2 className="fill-primary h-6 w-6 text-white drop-shadow-lg" />
      </motion.div>

      {/* Floating Badges */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 bottom-1/4 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:flex"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase">
            Status
          </div>
          <div className="text-sm font-black text-slate-900">Live & Fast</div>
        </div>
      </motion.div>
    </div>
  );
}
