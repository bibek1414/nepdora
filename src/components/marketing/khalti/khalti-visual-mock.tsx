"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Landmark,
} from "lucide-react";

export function KhaltiVisualMock() {
  return (
    <div className="relative mx-auto aspect-9/16 w-full max-w-md md:aspect-square lg:aspect-4/5">
      {/* Background Glow */}
      <div className="absolute inset-0 -rotate-6 rounded-[40px] bg-[#5C2D91]/20 blur-3xl" />

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
          <div className="bg-[#5C2D91] p-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-xl font-bold">
                k
              </div>
              <div className="text-xs font-medium opacity-80">Checkout</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm opacity-70">Payable Amount</div>
              <div className="text-2xl font-bold">NPR 4,500.00</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex-1 space-y-4 p-6">
            <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Select Payment Method
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 rounded-2xl border-2 border-[#5C2D91] bg-[#5C2D91]/5 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5C2D91] text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">
                  Khalti Wallet
                </div>
                <div className="text-[10px] text-slate-500">
                  Pay with your Khalti account
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#5C2D91]" />
            </motion.div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 opacity-60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">
                  E-Banking
                </div>
                <div className="text-[10px] text-slate-500">
                  Connect your bank account
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 opacity-60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">
                  Card Payment
                </div>
                <div className="text-[10px] text-slate-500">
                  Visa, Mastercard, SCT
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="border-t border-slate-100 p-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5C2D91] py-4 font-bold text-white shadow-lg shadow-[#5C2D91]/30"
            >
              Pay NPR 4,500.00
            </motion.button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
              <ShieldCheck className="h-3 w-3" />
              Secured by Khalti Payment Gateway
            </div>
          </div>
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-8 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:block"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">
              Status
            </div>
            <div className="text-sm font-bold text-slate-900">
              Payment Success
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 -left-12 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl md:block"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">
              Security
            </div>
            <div className="text-sm font-bold text-slate-900">
              PCI-DSS Compliant
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
