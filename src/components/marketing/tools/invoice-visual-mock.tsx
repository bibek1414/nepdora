"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
} from "lucide-react";

export function InvoiceVisualMock() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
      {/* Background Decorative Elements */}
      <div className="bg-primary/5 absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

      {/* Main Invoice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="-2xl relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8"
      >
        {/* Invoice Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="mb-2 h-8 w-32 rounded-lg bg-slate-100" />
            <div className="h-4 w-48 rounded-md bg-slate-50" />
          </div>
          <div className="text-right">
            <h4 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
              Invoice
            </h4>
            <div className="mt-1 font-mono text-lg font-bold text-slate-900">
              #INV-2024-001
            </div>
          </div>
        </div>

        {/* Bill To / From */}
        <div className="mb-10 grid grid-cols-2 gap-8">
          <div>
            <div className="mb-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Bill From
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-3 w-40 rounded bg-slate-50" />
              <div className="h-3 w-24 rounded bg-slate-50" />
            </div>
          </div>
          <div>
            <div className="mb-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Bill To
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-3 w-40 rounded bg-slate-50" />
              <div className="h-3 w-24 rounded bg-slate-50" />
            </div>
          </div>
        </div>

        {/* Table Mockup */}
        <div className="mb-10 space-y-4">
          <div className="flex border-b border-slate-100 pb-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <div className="flex-1">Description</div>
            <div className="w-16 text-right">Qty</div>
            <div className="w-24 text-right">Price</div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-slate-100" />
              </div>
              <div className="w-16 text-right">
                <div className="ml-auto h-4 w-8 rounded bg-slate-50" />
              </div>
              <div className="w-24 text-right font-bold text-slate-900">
                Rs. 15,000
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-4 w-32 rounded bg-slate-100" />
              </div>
              <div className="w-16 text-right">
                <div className="ml-auto h-4 w-8 rounded bg-slate-50" />
              </div>
              <div className="w-24 text-right font-bold text-slate-900">
                Rs. 8,500
              </div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="flex flex-col items-end border-t border-slate-100 pt-6">
          <div className="flex w-full max-w-[180px] justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>Rs. 23,500</span>
          </div>
          <div className="mt-2 flex w-full max-w-[220px] justify-between text-xl font-bold text-slate-900">
            <span>Total Amount</span>
            <span className="text-primary">Rs. 23,500</span>
          </div>
        </div>

        {/* Modern Accent Bar */}
        <div className="from-primary to-primary absolute top-0 left-0 h-1 w-full bg-linear-to-r via-blue-500" />
      </motion.div>

      {/* Floating Interactive Badges */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="-xl absolute -top-6 -right-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Exported
          </div>
          <div className="text-sm font-bold text-slate-900">PDF Ready</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="-xl absolute -bottom-6 -left-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Security
          </div>
          <div className="text-sm font-bold text-slate-900">
            Secure & Private
          </div>
        </div>
      </motion.div>

      {/* Background Icon Decoration */}
    </div>
  );
}
