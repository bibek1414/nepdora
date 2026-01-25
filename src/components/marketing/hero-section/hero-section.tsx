"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  TrendingUp,
  MousePointer2,
  CheckCircle,
  ShoppingBag,
  Search,
  User,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const fullText = "Build a luxury pashmina store";

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (step === 0) {
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
      timeout = setTimeout(() => setStep(2), 1000);
      return () => clearTimeout(timeout);
    } else if (step === 2) {
      timeout = setTimeout(() => setStep(3), 800);
      return () => clearTimeout(timeout);
    } else if (step === 3) {
      timeout = setTimeout(() => setStep(4), 2500);
      return () => clearTimeout(timeout);
    } else if (step === 4) {
      timeout = setTimeout(() => {
        setStep(0);
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  return (
    <section className="overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl flex-1 text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <TrendingUp size={12} className="text-slate-600" />
              <span className="text-[11px] font-medium text-slate-600 sm:text-xs">
                For Nepali Business Owners - Build All Kind of Websites Build
              </span>
            </div>

            <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Build your Website in 5 minutes.
            </h1>

            <p className="mb-8 max-w-md text-sm leading-relaxed font-normal text-slate-600 sm:text-base md:text-lg">
              Tell us about your business and your website will be live within 5
              Minutes, totally customized for your business. We handle the
              design, payments, and logistics so you can just sell your products
              and services.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button variant="default" rounded={true}>
                Start Building Free
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* Right Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl flex-1"
          >
            <div className="relative h-80 overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-[380px] md:h-[450px] lg:rounded-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1">
                  <CheckCircle size={12} className="text-slate-400" />
                  <span className="text-[10px] font-medium text-slate-600">
                    nepdora.ai/builder
                  </span>
                </div>
                <div className="w-8"></div>
              </div>

              {/* Main Animation Area */}
              <div className="relative h-full overflow-hidden bg-slate-50/30">
                <AnimatePresence mode="wait">
                  {/* STEP 0: Simple Centered Input */}
                  {step === 0 && (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8"
                    >
                      <div className="w-full max-w-lg text-center">
                        <h3 className="mb-8 text-lg font-semibold text-slate-900">
                          What do you want to build?
                        </h3>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-4 shadow-sm">
                            <p className="text-left text-base text-slate-900">
                              {text}
                              <span className="animate-pulse">|</span>
                            </p>
                          </div>
                          <button className="rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800">
                            Build Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 1 & 2: Selection Screen with Better Transition */}
                  {(step === 1 || step === 2) && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 1.05,
                        transition: { duration: 0.4 },
                      }}
                      className="absolute inset-0 flex flex-col justify-center bg-white p-8"
                    >
                      <h3 className="mb-8 text-center text-xl font-semibold text-slate-900">
                        Choose Your Website Type
                      </h3>
                      <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-5">
                        <motion.div
                          animate={
                            step === 2
                              ? {
                                  scale: 0.95,
                                  borderColor: "#0f172a",
                                }
                              : {}
                          }
                          className="relative flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-6 transition-all hover:border-slate-300"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
                            <ShoppingBag
                              size={28}
                              className="text-slate-900"
                              strokeWidth={2}
                            />
                          </div>
                          <div className="text-center">
                            <div className="mb-1 text-base font-semibold text-slate-900">
                              E-commerce
                            </div>
                            <div className="text-xs text-slate-500">
                              Sell products
                            </div>
                          </div>
                        </motion.div>

                        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-6 opacity-40">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-7 w-7 text-slate-900"
                            >
                              <rect
                                x="2"
                                y="7"
                                width="20"
                                height="14"
                                rx="2"
                                ry="2"
                              />
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <div className="mb-1 text-base font-semibold text-slate-900">
                              Service
                            </div>
                            <div className="text-xs text-slate-500">
                              Showcase work
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Animated Cursor */}
                      <motion.div
                        initial={{ x: "100%", y: "100%", opacity: 0 }}
                        animate={{ x: 120, y: 200, opacity: 1 }}
                        transition={{
                          duration: 0.8,
                          ease: "circOut",
                          delay: 0.1,
                        }}
                        className="pointer-events-none absolute top-0 left-0 z-50"
                      >
                        <MousePointer2
                          className="fill-slate-900 text-white drop-shadow-lg"
                          size={24}
                        />
                        {step === 2 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute -top-2 -left-2 h-10 w-10 rounded-full bg-slate-900 opacity-20"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* STEP 3 & 4: Website Building & Result */}
                  {(step === 3 || step === 4) && (
                    <motion.div
                      key="website"
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {/* Professional Navigation */}
                      <motion.nav
                        initial={{ y: -60 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5"
                      >
                        <div className="flex items-center gap-1">
                          <div className="h-7 w-7 rounded-md bg-slate-900"></div>
                          <span className="ml-1 text-sm font-bold text-slate-900">
                            Pashmina
                          </span>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className="h-2 w-12 rounded-full bg-slate-200"></div>
                          <div className="h-2 w-12 rounded-full bg-slate-200"></div>
                          <div className="h-2 w-14 rounded-full bg-slate-200"></div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Search size={14} className="text-slate-600" />
                          <User size={14} className="text-slate-600" />
                          <div className="relative">
                            <ShoppingBag size={14} className="text-slate-600" />
                            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-slate-900"></div>
                          </div>
                        </div>
                      </motion.nav>

                      {/* Hero Banner */}
                      <div className="p-4">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 140, opacity: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: "circOut",
                          }}
                          className="relative overflow-hidden rounded-lg bg-slate-100"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=1200"
                            className="h-full w-full object-cover"
                            alt="Pashmina"
                          />
                          <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-black/50 via-black/20 to-transparent px-6">
                            <motion.h2
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7, duration: 0.5 }}
                              className="mb-1 text-xl font-bold text-white drop-shadow-lg sm:text-2xl"
                            >
                              Luxury Pashmina
                            </motion.h2>
                            <motion.p
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9, duration: 0.5 }}
                              className="text-xs text-white/90 drop-shadow sm:text-sm"
                            >
                              Handcrafted Excellence
                            </motion.p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Product Grid */}
                      <div className="grid grid-cols-3 gap-3 px-4">
                        {[
                          { name: "Classic Shawl", price: "8,500" },
                          { name: "Premium Wrap", price: "12,000" },
                          { name: "Silk Scarf", price: "6,500" },
                        ].map((product, i) => (
                          <motion.div
                            key={i}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              delay: 1 + i * 0.15,
                              duration: 0.5,
                            }}
                            className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white"
                          >
                            <div className="relative h-16 bg-gradient-to-br from-slate-50 to-slate-100">
                              <div className="absolute top-1 right-1">
                                <Heart size={10} className="text-slate-400" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                              <span className="text-[10px] font-semibold text-slate-900">
                                {product.name}
                              </span>
                              <span className="text-[9px] font-medium text-slate-600">
                                NPR {product.price}
                              </span>
                              <button className="mt-1 rounded bg-slate-900 py-1 text-[9px] font-semibold text-white transition-colors hover:bg-slate-800">
                                Add to Cart
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Success Badge */}
                      <AnimatePresence>
                        {step === 4 && (
                          <motion.div
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="absolute top-16 right-4 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-lg"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-slate-900"
                              />
                              <span className="text-[10px] font-semibold text-slate-900">
                                Website Live!
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
