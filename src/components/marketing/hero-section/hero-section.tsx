"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Command,
  TrendingUp,
  Sparkles,
  MousePointer2,
  Bell,
  Store,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const [step, setStep] = useState(0);
  // 0: Input Typing "Build a website..."
  // 1: Selection Screen (Ecommerce vs Service)
  // 2: Selection Click Interaction
  // 3: Website Assembly/Loading
  // 4: Sales Dashboard

  const [text, setText] = useState("");
  const fullText = "Build a website for me";
  const [salesCount, setSalesCount] = useState(14500);

  // Cycle through animation steps
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
      }, 50);
      return () => {
        clearInterval(typeInterval);
        clearTimeout(timeout);
      };
    } else if (step === 1) {
      // Step 1: Show Selection Screen, wait briefly before cursor moves
      timeout = setTimeout(() => setStep(2), 1500);
      return () => clearTimeout(timeout);
    } else if (step === 2) {
      // Step 2: Cursor clicks "Ecommerce"
      timeout = setTimeout(() => setStep(3), 800);
      return () => clearTimeout(timeout);
    } else if (step === 3) {
      // Step 3: Website Build Animation
      timeout = setTimeout(() => setStep(4), 2000);
      return () => clearTimeout(timeout);
    } else if (step === 4) {
      // Step 4: Sales Dashboard
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
    <section className="bg-background my-36 overflow-hidden pt-12 pb-20 md:pt-12 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-left"
          >
            <div className="bg-accent mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1">
              <TrendingUp size={14} className="text-black" />
              <span className="text-xs font-normal text-black">
                For Nepali Business Owners
              </span>
            </div>

            <h1 className="text-foreground mb-6 text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl">
              Build your Website in <br /> 5 minutes.
            </h1>

            <p className="text-muted-foreground mb-10 max-w-md text-lg leading-relaxed font-light">
              From prompt to profits. We handle the design, payments, and
              logistics so you can just sell.
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="shadow-primary/20 group hover:shadow-primary/40 shadow-lg"
              >
                Start Building Free
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <div className="text-muted-foreground flex items-center gap-3 pl-2 text-sm">
                <span>No technical skills needed.</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl flex-1"
          >
            <div className="bg-background shadow-muted/50 border-border relative flex h-[500px] flex-col overflow-hidden rounded-2xl border shadow-2xl md:h-[600px]">
              {/* Browser Header */}
              <div className="bg-background border-border relative z-20 flex flex-none items-center justify-between border-b px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="bg-muted h-2.5 w-2.5 rounded-full"></div>
                  <div className="bg-muted h-2.5 w-2.5 rounded-full"></div>
                </div>
                <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  Nepdora AI
                </div>
              </div>

              <div className="bg-muted/20 relative flex-1 overflow-hidden p-6">
                <AnimatePresence mode="wait">
                  {/* STEP 0: INPUT */}
                  {step === 0 && (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute inset-0 flex flex-col justify-center px-8"
                    >
                      <div className="bg-background shadow-muted/50 border-border rounded-2xl border p-8 shadow-xl">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                            <Command size={20} />
                          </div>
                          <span className="text-foreground text-xs font-bold tracking-wide uppercase">
                            AI Prompt
                          </span>
                        </div>
                        <div className="text-foreground font-serif text-2xl leading-snug">
                          &quot;{text}
                          <span className="text-primary animate-pulse">|</span>
                          &quot;
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 1 & 2: SELECTION SCREEN */}
                  {(step === 1 || step === 2) && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="bg-muted/10 absolute inset-0 flex flex-col justify-center px-8"
                    >
                      <h3 className="text-foreground mb-8 text-center text-xl font-bold">
                        What are you building?
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* ECOMMERCE CARD */}
                        <motion.div
                          animate={
                            step === 2
                              ? {
                                  scale: 0.95,
                                  borderColor: "var(--primary)",
                                  backgroundColor: "var(--primary-foreground)",
                                }
                              : {}
                          }
                          className="bg-background border-border relative z-10 flex flex-col items-center gap-4 rounded-xl border p-6 text-center shadow-sm"
                        >
                          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                            <Store size={24} />
                          </div>
                          <div className="text-foreground text-sm font-bold">
                            Ecommerce
                          </div>
                        </motion.div>

                        {/* SERVICE CARD */}
                        <div className="bg-background border-border flex flex-col items-center gap-4 rounded-xl border p-6 text-center opacity-60 shadow-sm">
                          <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full">
                            <Briefcase size={24} />
                          </div>
                          <div className="text-foreground text-sm font-bold">
                            Service
                          </div>
                        </div>
                      </div>

                      {/* Cursor Animation */}
                      <motion.div
                        initial={{ x: "100%", y: "100%", opacity: 0 }}
                        animate={{ x: 120, y: 280, opacity: 1 }} // Coordinates tuned to hit the left card center
                        transition={{
                          duration: 0.8,
                          ease: "circOut",
                          delay: 0.2,
                        }}
                        className="pointer-events-none absolute top-0 left-0 z-50"
                      >
                        <MousePointer2
                          className="fill-foreground text-background drop-shadow-xl"
                          size={32}
                        />
                        {step === 2 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-primary absolute -top-3 -left-3 h-14 w-14 rounded-full opacity-30"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* STEP 3: WEBSITE BUILD */}
                  {step === 3 && (
                    <motion.div
                      key="website"
                      className="bg-background absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      {/* Website Skeleton */}
                      <div className="flex h-full flex-col overflow-hidden">
                        {/* Nav */}
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="border-border flex h-16 flex-none items-center justify-between border-b px-8"
                        >
                          <div className="bg-muted h-4 w-24 rounded-full"></div>
                          <div className="flex gap-3">
                            <div className="bg-muted/50 h-3 w-12 rounded-full"></div>
                            <div className="bg-muted/50 h-3 w-12 rounded-full"></div>
                          </div>
                        </motion.div>

                        {/* Hero Banner */}
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-primary/5 relative m-6 flex h-48 flex-none flex-col justify-center overflow-hidden rounded-2xl px-8"
                        >
                          <div className="bg-muted z-10 mb-3 h-6 w-48 rounded"></div>
                          <div className="bg-muted/50 z-10 h-4 w-64 rounded"></div>
                        </motion.div>

                        {/* Products */}
                        <div className="grid flex-1 grid-cols-2 gap-6 overflow-hidden px-6">
                          {[1, 2].map(i => (
                            <motion.div
                              key={i}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className="border-border h-full rounded-xl border p-4"
                            >
                              <div className="bg-muted/20 mb-3 h-32 w-full rounded-lg"></div>
                              <div className="bg-muted mb-2 h-3 w-24 rounded"></div>
                              <div className="bg-primary text-primary-foreground mt-2 inline-block rounded px-3 py-1.5 text-[10px] font-bold tracking-wide">
                                ADD TO CART
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: SALES DASHBOARD */}
                  {step === 4 && (
                    <motion.div
                      key="sales"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-muted/10 absolute inset-0 flex flex-col justify-center p-8"
                    >
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-background border-border mb-6 rounded-3xl border p-8 shadow-xl"
                      >
                        <div className="mb-6 flex items-start justify-between">
                          <div>
                            <div className="text-muted-foreground mb-2 text-xs font-bold tracking-widest uppercase">
                              Total Revenue
                            </div>
                            <div className="text-foreground font-mono text-5xl font-bold tracking-tight">
                              NPR {salesCount.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-primary/10 text-primary rounded-full p-3">
                            <TrendingUp size={24} />
                          </div>
                        </div>
                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                          <motion.div
                            initial={{ width: "30%" }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1.5 }}
                            className="bg-primary h-full"
                          />
                        </div>
                        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
                          <span className="text-primary bg-primary/10 rounded px-2 py-0.5 font-bold">
                            +12%
                          </span>
                          from last week
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-background border-border flex items-center gap-5 rounded-2xl border p-5 shadow-md"
                      >
                        <div className="bg-primary/10 text-primary relative flex h-12 w-12 items-center justify-center rounded-full">
                          <Bell size={20} />
                          <span className="bg-destructive border-background absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2"></span>
                        </div>
                        <div className="flex-1">
                          <div className="text-foreground font-bold">
                            New Order Received
                          </div>
                          <div className="text-muted-foreground text-sm">
                            Just now via Online Store
                          </div>
                        </div>
                        <div className="text-primary text-lg font-bold">
                          +1,500
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Background Decoration */}
                <div className="from-primary/0 via-primary/5 to-background/0 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr blur-3xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
