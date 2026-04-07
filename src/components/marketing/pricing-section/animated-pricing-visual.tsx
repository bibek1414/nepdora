"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "0",
    color: "bg-slate-500",
    features: ["Subdomain", "10 Products", "SSL"],
    icon: <ShieldCheck className="h-4 w-4 text-slate-500" />,
  },
  {
    name: "Business",
    price: "10,000",
    color: "bg-indigo-600",
    features: ["Custom Domain", "eSewa/Khalti", "SEO"],
    icon: <CreditCard className="h-4 w-4 text-indigo-600" />,
  },
  {
    name: "Pro",
    price: "20,000",
    color: "bg-violet-600",
    features: ["AI Content", "Advanced Analytics", "Team"],
    icon: <Zap className="h-4 w-4 text-violet-600" />,
  },
];

export function AnimatedPricingDashboard() {
  const [activePlanIdx, setActivePlanIdx] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const interval = setInterval(() => {
      setActivePlanIdx(prev => (prev + 1) % plans.length);
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) return null;

  const activePlan = plans[activePlanIdx];

  return (
    <div className="relative select-none">
      {/* Main Browser Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80"
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex shrink-0 gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1">
            <div className="rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-400">
              nepdora.com/pricing
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Plan Comparison
              </p>
              <p className="text-[11px] text-slate-400">
                Real-time feature unlocking
              </p>
            </div>
            <div className="flex gap-1">
              {plans.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${i === activePlanIdx ? activePlan.color : "bg-slate-200"}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlan.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm`}
                    >
                      {activePlan.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {activePlan.name} Plan
                      </p>
                      <p className="text-[10px] text-slate-500">
                        NPR {activePlan.price} / year
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold text-white ${activePlan.color}`}
                  >
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activePlan.features.map((feat, i) => (
                    <motion.div
                      key={feat}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${activePlanIdx === 0 ? "text-slate-400" : "text-emerald-500"}`}
                      />
                      <span className="text-[11px] font-medium text-slate-600">
                        {feat}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="rounded-xl border border-dashed border-slate-200 p-4">
              <div className="flex items-center justify-between opacity-40">
                <div className="h-2 w-24 rounded bg-slate-200" />
                <div className="h-4 w-4 rounded-full bg-slate-200" />
              </div>
              <div className="mt-3 space-y-2 opacity-20">
                <div className="h-1.5 w-full rounded bg-slate-100" />
                <div className="h-1.5 w-3/4 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-xl"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-900">ROI Optimized</p>
          <p className="text-[9px] text-slate-400">Scale faster</p>
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
        className="absolute -bottom-6 -left-6 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-xl"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50">
          <CreditCard className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-900">Local Payments</p>
          <p className="text-[9px] text-slate-400">eSewa & Khalti</p>
        </div>
      </motion.div>
    </div>
  );
}
