"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Check,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const QuickBuilder: React.FC = () => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");

  const handleGenerate = () => {
    if (!input) return;
    setStep(1);
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => setStep(4), 4500);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 md:py-32">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white opacity-50"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-3 text-center sm:px-4 lg:px-6">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Build Your Free Website Now
          </h2>
          <p className="text-sm font-normal text-slate-500 sm:text-base md:text-lg">
            Tell us about your business. We'll build the rest.
          </p>
        </div>

        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-sm sm:min-h-[300px] sm:rounded-2xl sm:p-8 md:p-10 md:shadow-xl">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="A handmade jewelry shop in Patan..."
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-3 text-center font-serif text-lg text-slate-900 placeholder-slate-400 transition-all outline-none focus:border-slate-400 sm:py-4 sm:text-xl md:text-2xl"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <div className="mt-6 sm:mt-8">
                <Button
                  onClick={handleGenerate}
                  variant="default"
                  className="rounded-full text-sm shadow-md hover:shadow-lg sm:text-base"
                >
                  Generate Site{" "}
                  <ChevronRight
                    size={14}
                    className="ml-2 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4"
                  />
                </Button>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 sm:mt-6 sm:text-xs">
                Try: &quot;Trekking agency in Thamel&quot; or &quot;Organic Tea
                Shop&quot;
              </p>
            </motion.div>
          )}

          {step >= 1 && step < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="relative mx-auto mb-6 h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <div className="absolute inset-0 rounded-full border-3 border-slate-100 sm:border-4"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-3 border-slate-600 border-t-transparent sm:border-4"></div>
                <Sparkles
                  className="absolute inset-0 m-auto animate-pulse text-slate-600"
                  size={16}
                  style={{ width: "16px", height: "16px" }}
                />
              </div>
              <h3 className="text-base font-medium text-slate-900 sm:text-lg md:text-xl">
                {step === 1 && "Understanding your niche..."}
                {step === 2 && "Sourcing local products & logistics..."}
                {step === 3 && "Polishing design identity..."}
              </h3>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 sm:mb-6 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <Check size={24} className="sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Site Structure Ready
              </h3>
              <p className="mb-6 text-sm text-slate-600 sm:mb-8 sm:text-base">
                We&apos;ve prepared the store &quot;<b>{input}</b>&quot; with
                local payments integrated.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Button variant="default" className="text-sm sm:text-base">
                  View Live Demo
                </Button>
                <Button variant="outline" className="text-sm sm:text-base">
                  Edit Design
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickBuilder;
