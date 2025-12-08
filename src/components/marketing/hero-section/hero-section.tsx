"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Command,
  TrendingUp,
  Store,
  Briefcase,
  MousePointer2,
  Bell,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const [step, setStep] = useState(0);
  // 0: Input Typing
  // 1: Selection Screen
  // 2: Selection Click
  // 3: Website Building (Header -> Hero -> Grid)
  // 4: Final Polish/Dashboard

  const [text, setText] = useState("");
  const fullText = "Build a luxury pashmina store";
  const [salesCount, setSalesCount] = useState(14500);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (step === 0) {
      // Step 0: Typing Effect
      let index = 0;
      setText("");
      const typeInterval = setInterval(() => {
        setText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(typeInterval);
          timeout = setTimeout(() => setStep(1), 600);
        }
      }, 40);
      return () => {
        clearInterval(typeInterval);
        clearTimeout(timeout);
      };
    } else if (step === 1) {
      // Step 1: Wait on selection screen
      timeout = setTimeout(() => setStep(2), 1000);
      return () => clearTimeout(timeout);
    } else if (step === 2) {
      // Step 2: Click Animation
      timeout = setTimeout(() => setStep(3), 800);
      return () => clearTimeout(timeout);
    } else if (step === 3) {
      // Step 3: Building Animation duration
      timeout = setTimeout(() => setStep(4), 2500);
      return () => clearTimeout(timeout);
    } else if (step === 4) {
      // Step 4: Show result loop
      const countInterval = setInterval(() => {
        setSalesCount(prev => (prev < 45000 ? prev + 1500 : prev));
      }, 150);

      timeout = setTimeout(() => {
        setStep(0);
        setSalesCount(14500);
      }, 6000);

      return () => {
        clearInterval(countInterval);
        clearTimeout(timeout);
      };
    }
  }, [step]);

  return (
    <section className="overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl flex-1 text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <TrendingUp size={12} className="text-slate-600" />
              <span className="text-[11px] font-medium text-slate-600 sm:text-xs">
                For Nepali Business Owners
              </span>
            </div>

            <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Build your Website in 5 minutes.
            </h1>

            <p className="mb-8 max-w-md text-sm leading-relaxed font-normal text-slate-600 sm:text-base md:text-lg">
              From prompt to profits. We handle the design, payments, and
              logistics so you can just sell.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="group shadow-md shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-200/80"
              >
                Start Building Free
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <div className="flex items-center gap-3 pl-2 text-xs text-slate-500 sm:text-sm">
                <span>No credit card needed.</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Animation - Widescreen Look */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl flex-1"
          >
            <div className="relative flex h-[320px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/30 sm:h-[380px] md:h-[450px] lg:rounded-2xl lg:shadow-xl">
              {/* Browser Header */}
              <div className="relative z-20 flex flex-none items-center justify-between border-b border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-slate-300 sm:h-2.5 sm:w-2.5"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-300 sm:h-2.5 sm:w-2.5"></div>
                </div>
                <div className="flex min-w-[160px] items-center justify-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 sm:min-w-[200px] sm:px-3">
                  <div className="h-2.5 w-2.5 text-slate-600 sm:h-3 sm:w-3">
                    <CheckCircle size={10} className="sm:h-3 sm:w-3" />
                  </div>
                  <div className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase sm:text-[10px] sm:tracking-widest">
                    nepdora.ai/builder
                  </div>
                </div>
                <div className="w-6 sm:w-8"></div> {/* Spacer for balance */}
              </div>

              <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-50/50">
                <AnimatePresence mode="wait">
                  {/* STEP 0: INPUT */}
                  {step === 0 && (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-0 flex flex-col items-center justify-center px-8"
                    >
                      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            <Command size={16} />
                          </div>
                          <span className="text-xs font-bold tracking-wide text-slate-900 uppercase">
                            AI Prompt
                          </span>
                        </div>
                        <div className="font-serif text-2xl leading-snug text-slate-800">
                          "{text}
                          <span className="animate-pulse text-emerald-500">
                            |
                          </span>
                          "
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 1 & 2: SELECTION */}
                  {(step === 1 || step === 2) && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="absolute inset-0 flex flex-col justify-center bg-slate-50 px-12"
                    >
                      <h3 className="mb-8 text-center text-xl font-bold text-slate-900">
                        Select Type
                      </h3>
                      <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-6">
                        {/* ECOMMERCE CARD */}
                        <motion.div
                          animate={
                            step === 2
                              ? {
                                  scale: 0.98,
                                  borderColor: "#10b981",
                                  backgroundColor: "#ecfdf5",
                                  boxShadow:
                                    "0 4px 12px rgba(16, 185, 129, 0.1)",
                                }
                              : {}
                          }
                          className="relative z-10 flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-colors"
                        >
                          <div className="bg-accent flex h-14 w-14 items-center justify-center rounded-xl text-slate-500">
                            <Store size={28} />
                          </div>
                          <div className="text-base font-bold text-slate-900">
                            Ecommerce
                          </div>
                        </motion.div>

                        {/* SERVICE CARD */}
                        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 text-center opacity-60 shadow-sm">
                          <div className="bg-accent flex h-14 w-14 items-center justify-center rounded-xl text-slate-500">
                            <Briefcase size={28} />
                          </div>
                          <div className="text-base font-bold text-slate-900">
                            Service
                          </div>
                        </div>
                      </div>

                      {/* Cursor */}
                      <motion.div
                        initial={{ x: "100%", y: "100%", opacity: 0 }}
                        animate={{ x: 180, y: 220, opacity: 1 }}
                        transition={{
                          duration: 0.8,
                          ease: "circOut",
                          delay: 0.1,
                        }}
                        className="pointer-events-none absolute top-0 left-0 z-50"
                      >
                        <MousePointer2
                          className="fill-slate-900 text-white drop-shadow-xl"
                          size={32}
                        />
                        {step === 2 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute -top-3 -left-3 h-14 w-14 rounded-full bg-emerald-500 opacity-30"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* STEP 3 & 4: BUILD & RESULT */}
                  {(step === 3 || step === 4) && (
                    <motion.div
                      key="website"
                      className="absolute inset-0 flex flex-col bg-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Website Skeleton / Build Process */}
                      <div className="relative flex h-full flex-col overflow-hidden">
                        {/* Navigation Bar */}
                        <motion.div
                          initial={{ y: -50 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="z-20 flex h-16 flex-none items-center justify-between border-b border-slate-100 bg-white px-8"
                        >
                          <div className="h-5 w-32 rounded-full bg-slate-900"></div>
                          <div className="flex gap-6">
                            <div className="h-2 w-20 rounded-full bg-slate-200"></div>
                            <div className="h-2 w-20 rounded-full bg-slate-200"></div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                              <ShoppingBag size={14} />
                            </div>
                          </div>
                        </motion.div>

                        {/* Hero Banner Area */}
                        <div className="relative flex-none p-6">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 200, opacity: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.2,
                              ease: "circOut",
                            }}
                            className="relative w-full overflow-hidden rounded-2xl bg-slate-100"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=1200"
                              className="h-full w-full object-cover opacity-90"
                              alt="Banner"
                            />
                            <div className="absolute inset-0 flex flex-col justify-center bg-black/10 px-10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 300 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="mb-4 h-10 overflow-hidden rounded-md bg-white"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 180 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="h-4 overflow-hidden rounded-md bg-white/80"
                              />
                            </div>
                          </motion.div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid flex-1 grid-cols-3 gap-6 overflow-hidden px-6 pb-4">
                          {[1, 2, 3].map(i => (
                            <motion.div
                              key={i}
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                delay: 0.8 + i * 0.2,
                                duration: 0.5,
                              }}
                              className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-4"
                            >
                              <div className="group relative mb-3 h-24 w-full overflow-hidden rounded-lg bg-slate-100"></div>
                              <div className="mb-2 h-3 w-3/4 rounded bg-slate-200"></div>
                              <div className="mb-auto h-3 w-1/2 rounded bg-slate-100"></div>
                              <div className="mt-2 w-full rounded bg-slate-900 py-2 text-center text-[10px] font-bold text-white">
                                Add
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Notification Overlay (Step 4) */}
                        <AnimatePresence>
                          {step === 4 && (
                            <motion.div
                              initial={{ x: 100, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute top-24 right-8 z-30 flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-xl"
                            >
                              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <Bell size={18} />
                                <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-red-500"></span>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900">
                                  New Order #2891
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Total: NPR 4,500
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
