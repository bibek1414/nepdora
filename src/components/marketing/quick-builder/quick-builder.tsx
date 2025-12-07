"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden border-t border-slate-100 bg-white py-32">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white opacity-60"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="mb-12">
          <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900 italic md:text-5xl">
            Ready to begin?
          </h2>
          <p className="text-lg font-light text-slate-500">
            Type your idea. We&apos;ll build the rest.
          </p>
        </div>

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-10 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
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
                  className="w-full border-b-2 border-slate-200 bg-transparent px-0 py-4 text-center font-serif text-2xl text-slate-900 placeholder-slate-300 transition-all outline-none focus:border-emerald-500"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  autoFocus
                />
              </div>
              <div className="mt-8">
                <Button
                  onClick={handleGenerate}
                  variant="primary"
                  className="shadow-lg hover:shadow-xl"
                >
                  Generate Site <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
              <p className="mt-6 text-xs text-slate-400">
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
              <div className="relative mx-auto mb-6 h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                <Sparkles
                  className="absolute inset-0 m-auto animate-pulse text-emerald-500"
                  size={20}
                />
              </div>
              <h3 className="text-xl font-medium text-slate-900">
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
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={32} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">
                Site Structure Ready
              </h3>
              <p className="mb-8 text-slate-500">
                We&apos;ve prepared the store &quot;<b>{input}</b>&quot; with
                local payments integrated.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="primary">View Live Demo</Button>
                <Button variant="outline">Edit Design</Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickBuilder;
