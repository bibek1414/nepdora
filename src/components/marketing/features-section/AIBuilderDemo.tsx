import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Command,
  ArrowUp,
  Image as ImageIcon,
  Type,
  LayoutTemplate,
  Smartphone,
} from "lucide-react";

const AIBuilderDemo: React.FC = () => {
  const [step, setStep] = useState(0);

  // Animation loop configuration
  const TOTAL_STEPS = 6;
  const STEP_DURATION = 1500; // ms per step (adjusted for typing speed etc)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % TOTAL_STEPS);
    }, 2500); // Time between state changes
    return () => clearInterval(interval);
  }, []);

  // Determine current state based on step
  // 0: Idle/Empty
  // 1: Typing Prompt
  // 2: Processing/Thinking
  // 3: Building Header
  // 4: Building Hero
  // 5: Building Grid (Complete)

  const isTyping = step === 1;
  const isProcessing = step === 2;
  const showHeader = step >= 3;
  const showHero = step >= 4;
  const showGrid = step >= 5;

  const promptText =
    "Build a modern portfolio for a digital artist with white theme";

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white" />

      {/* --- Main Preview Area (The Website Being Built) --- */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6">
        {/* Browser Window Frame */}
        <motion.div
          className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Browser Toolbar */}
          <div className="flex items-center space-x-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3 backdrop-blur-md">
            <div className="flex space-x-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="mx-auto flex w-full max-w-[200px] items-center justify-center rounded border border-slate-200 bg-white py-0.5 text-[10px] text-slate-500 shadow-sm">
              <span className="mr-1 opacity-50">🔒</span> nepdora.com/builder
            </div>
          </div>

          {/* Website Content Area */}
          <div className="relative min-h-[320px] w-full p-4">
            {/* Loading/Processing State overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-indigo-600" />
                  </motion.div>
                  <motion.span
                    className="mt-3 text-xs font-medium text-indigo-600"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Generating Layout...
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {step < 3 && !isProcessing && (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <LayoutTemplate className="mb-2 h-12 w-12 opacity-20" />
                <span className="text-xs">Waiting for prompt...</span>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              {/* Generated Header */}
              <AnimatePresence>
                {showHeader && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="flex space-x-2">
                      <div className="h-4 w-12 rounded bg-slate-200" />
                      <div className="h-4 w-12 rounded bg-slate-200" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generated Hero Section */}
              <AnimatePresence>
                {showHero && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col space-y-3 rounded-lg border border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6 text-center"
                  >
                    <div className="mx-auto h-6 w-3/4 rounded-md bg-indigo-100" />
                    <div className="mx-auto h-3 w-1/2 rounded bg-slate-200" />
                    <div className="mt-4 flex justify-center gap-2">
                      <div className="h-8 w-24 rounded-md bg-indigo-600 shadow-lg shadow-indigo-200" />
                      <div className="h-8 w-24 rounded-md border border-slate-200 bg-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generated Grid/Gallery */}
              <AnimatePresence>
                {showGrid && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[1, 2].map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="aspect-square rounded-lg border border-slate-200 bg-slate-50 p-2"
                      >
                        <div className="h-full w-full rounded bg-slate-200/50" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Floating Prompt Input (Bottom) --- */}
      <div className="relative z-20 border-t border-slate-200 bg-white/90 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl ring-1 ring-slate-900/5 transition-all focus-within:ring-indigo-500/50">
            <motion.div
              animate={isProcessing ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles
                className={`mr-3 h-5 w-5 ${
                  isProcessing ? "text-indigo-600" : "text-slate-400"
                }`}
              />
            </motion.div>

            <div className="flex-1 font-mono text-sm text-slate-900">
              {step === 0 && (
                <span className="text-slate-400">
                  Describe your dream website...
                </span>
              )}
              {step >= 1 && <Typewriter text={promptText} start={step === 1} />}
            </div>

            <button
              className={`ml-2 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                step > 1
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {/* Helper tags */}
          <div className="mt-3 flex gap-2 overflow-hidden">
            {["Landing Page", "Portfolio", "SaaS", "E-commerce"].map(
              (tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for typing effect
const Typewriter = ({ text, start }: { text: string; start: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!start) {
      if (displayedText.length === 0) setDisplayedText(text); // If we skipped animation, show full
      return;
    }

    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40); // Typing speed

    return () => clearInterval(timer);
  }, [start, text]);

  return <span>{displayedText}</span>;
};

export default AIBuilderDemo;
