"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  QrCode,
} from "lucide-react";

export function EsewaVisualMock() {
  return (
    <div className="relative mx-auto aspect-9/16 w-full max-w-md md:aspect-square lg:aspect-4/5">
      {/* Background Glow */}
      <div className="absolute inset-0 rotate-6 rounded-[40px] bg-[#60BB46]/20 blur-3xl" />

      {/* Main Phone Frame */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-full w-full overflow-hidden rounded-[48px] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl"
      >
        {/* Inner Screen */}
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[40px] bg-white">
          {/* App Header */}
          <div className="bg-[#60BB46] p-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xl leading-none font-black text-[#60BB46] italic">
                e
              </div>
              <div className="text-[10px] font-bold tracking-widest uppercase opacity-90">
                Secure Pay
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium opacity-80">Order Total</div>
              <div className="text-2xl leading-none font-black tracking-tight">
                NPR 12,850.00
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex-1 space-y-4 p-6">
            <div className="mb-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Choose Payment Method
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 rounded-2xl border-2 border-[#60BB46] bg-[#60BB46]/5 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#60BB46] text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">
                  eSewa Wallet
                </div>
                <div className="text-[10px] font-medium whitespace-nowrap text-slate-500">
                  Instant payment from wallet
                </div>
              </div>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#60BB46]">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </motion.div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 opacity-60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                <QrCode className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm leading-none font-bold text-slate-900">
                  Scan & Pay
                </div>
                <div className="text-[10px] leading-none font-medium whitespace-nowrap text-slate-500">
                  Use eSewa QR code
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 opacity-60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm leading-none font-bold text-slate-900">
                  Mobile Banking
                </div>
                <div className="text-[10px] leading-none font-medium whitespace-nowrap text-slate-500">
                  Direct bank transfer
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="border-t border-slate-100 bg-slate-50/50 p-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#60BB46] py-4 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-[#60BB46]/30"
            >
              Confirm Payment
            </motion.button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
              <ShieldCheck className="h-3 w-3 text-[#60BB46]" />
              NRB Licensed Payment Provider
            </div>
          </div>
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-slate-900" />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -3, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-8 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:block"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-[#60BB46]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="mb-1 text-[10px] leading-none font-black tracking-widest text-slate-400 uppercase">
              Verified
            </div>
            <div className="text-sm leading-none font-black text-slate-900">
              9M+ Users
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-1/3 -left-12 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:block"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="mb-1 text-[10px] leading-none font-black tracking-widest text-slate-400 uppercase">
              Security
            </div>
            <div className="text-sm leading-none font-black text-slate-900">
              ISO Certified
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
