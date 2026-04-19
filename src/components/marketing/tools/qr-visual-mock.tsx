"use client";

import React from "react";
import { motion } from "framer-motion";
import { QrCode, Wifi, Globe, Mail, Zap, CheckCircle2 } from "lucide-react";

export function QrVisualMock() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
      {/* Background Decorative Elements */}

      {/* Main QR Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-10"
      >
        {/* Top Header Mockup */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="font- -widest text-[10px] text-slate-400">
            nepdora.com/tools/qr-code-generator
          </div>
        </div>

        {/* QR Code Mockup Area */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
          <QrCode className="h-full w-full text-gray-400 opacity-80" />

          {/* Logo Center Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/80 -lg h-12 w-12 rounded-xl border-4 border-white p-2">
              <Zap className="h-full w-full fill-white text-white" />
            </div>
          </div>
        </div>

        {/* Customize Options Mockup */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded bg-slate-100" />
            <div className="flex gap-2">
              <div className="bg-primary -sm h-6 w-6 rounded-full border-2 border-white" />
              <div className="-sm h-6 w-6 rounded-full border-2 border-white bg-gray-900" />
              <div className="-sm bg-primary h-6 w-6 rounded-full border-2 border-white" />
            </div>
          </div>
          <div className="h-2 w-full rounded bg-slate-50" />
          <div className="h-2 w-2/3 rounded bg-slate-50" />
        </div>

        {/* Bottom Accent */}
        <div className="from-primary to-primary absolute top-0 left-0 h-1.5 w-full bg-linear-to-r via-blue-500" />
      </motion.div>

      {/* Floating Badges */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="-xl -2xl absolute -top-12 -right-12 flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font- -widest text-[10px] text-slate-400">
              Format
            </div>
            <div className="text-sm font-bold text-slate-900">SVG & PNG</div>
          </div>
        </div>
      </motion.div>

      {/* Mode Icons Decoration */}
      <div className="absolute top-1/2 -right-20 hidden -translate-y-1/2 space-y-4 xl:block">
        <div className="-xl flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-100">
          <Globe className="h-5 w-5 text-slate-400" />
        </div>
        <div className="-xl flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-100">
          <Mail className="h-5 w-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
