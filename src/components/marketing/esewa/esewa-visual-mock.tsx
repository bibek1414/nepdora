'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ShieldCheck, CheckCircle2, Landmark, QrCode } from 'lucide-react';

export function EsewaVisualMock() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-9/16 md:aspect-square lg:aspect-4/5">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#60BB46]/20 rounded-[40px] blur-3xl rotate-6" />
      
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
          <div className="bg-[#60BB46] p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center font-black text-[#60BB46] text-xl italic leading-none">e</div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-90">Secure Pay</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs opacity-80 font-medium">Order Total</div>
              <div className="text-2xl font-black tracking-tight leading-none">NPR 12,850.00</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex-1 p-6 space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Choose Payment Method</div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl border-2 border-[#60BB46] bg-[#60BB46]/5 flex items-center gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-[#60BB46] flex items-center justify-center text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">eSewa Wallet</div>
                <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Instant payment from wallet</div>
              </div>
              <div className="h-5 w-5 rounded-full bg-[#60BB46] flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </motion.div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-4 opacity-60">
              <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                <QrCode className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 leading-none mb-1">Scan & Pay</div>
                <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap leading-none">Use eSewa QR code</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-4 opacity-60">
              <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 leading-none mb-1">Mobile Banking</div>
                <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap leading-none">Direct bank transfer</div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#60BB46] text-white font-black rounded-2xl shadow-lg shadow-[#60BB46]/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              Confirm Payment
            </motion.button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              <ShieldCheck className="h-3 w-3 text-[#60BB46]" />
              NRB Licensed Payment Provider
            </div>
          </div>
        </div>

        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-xl" />
      </motion.div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 top-1/3 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 hidden md:block"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-[#60BB46]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Verified</div>
            <div className="text-sm font-black text-slate-900 leading-none">9M+ Users</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 3, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-12 bottom-1/3 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 hidden md:block"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security</div>
            <div className="text-sm font-black text-slate-900 leading-none">ISO Certified</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
