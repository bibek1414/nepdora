'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ShieldCheck, CheckCircle2, CreditCard, Landmark } from 'lucide-react';

export function KhaltiVisualMock() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-9/16 md:aspect-square lg:aspect-4/5">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#5C2D91]/20 rounded-[40px] blur-3xl -rotate-6" />
      
      {/* Main Phone Frame */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-full w-full bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 overflow-hidden"
      >
        {/* Inner Screen */}
        <div className="h-full w-full bg-white rounded-[40px] overflow-hidden flex flex-col">
          {/* App Header */}
          <div className="bg-[#5C2D91] p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xl">k</div>
              <div className="text-xs font-medium opacity-80">Checkout</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm opacity-70">Payable Amount</div>
              <div className="text-2xl font-bold">NPR 4,500.00</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex-1 p-6 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Payment Method</div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl border-2 border-[#5C2D91] bg-[#5C2D91]/5 flex items-center gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-[#5C2D91] flex items-center justify-center text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Khalti Wallet</div>
                <div className="text-[10px] text-slate-500">Pay with your Khalti account</div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#5C2D91]" />
            </motion.div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-4 opacity-60">
              <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">E-Banking</div>
                <div className="text-[10px] text-slate-500">Connect your bank account</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-4 opacity-60">
              <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Card Payment</div>
                <div className="text-[10px] text-slate-500">Visa, Mastercard, SCT</div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-slate-100">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#5C2D91] text-white font-bold rounded-2xl shadow-lg shadow-[#5C2D91]/30 flex items-center justify-center gap-2"
            >
              Pay NPR 4,500.00
            </motion.button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
              <ShieldCheck className="h-3 w-3" />
              Secured by Khalti Payment Gateway
            </div>
          </div>
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl" />
      </motion.div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 top-1/4 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 hidden md:block"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
            <div className="text-sm font-bold text-slate-900">Payment Success</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -2, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-12 bottom-1/4 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 hidden md:block"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Security</div>
            <div className="text-sm font-bold text-slate-900">PCI-DSS Compliant</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
