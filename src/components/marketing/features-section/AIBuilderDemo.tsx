import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Loader2,
  Layout,
  Zap,
  Palette,
  Shield,
  ArrowRight,
  Bot,
  User,
  Globe,
  Terminal,
  Code2,
} from "lucide-react";

// --- Types ---
type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

const AIBuilderDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Configuration
  const SEQUENCE = [
    {
      prompt:
        "Design a clean, high-conversion hero section for a SaaS platform with a modern white aesthetic.",
      aiResponse:
        "I've created a responsive hero section with a clear value proposition and call-to-action buttons.",
      actionDuration: 3000,
    },
    {
      prompt:
        "Add a 3-column features grid highlighting speed, design, and security with engaging icons.",
      aiResponse:
        "I've added a feature highlights section with hover effects and custom iconography.",
      actionDuration: 3000,
    },
  ];

  // Main Animation Loop
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const runDemo = async () => {
      // Helper for delays
      const wait = (ms: number) =>
        new Promise(resolve => {
          timeout = setTimeout(resolve, ms);
        });

      // LOOP
      while (isMounted) {
        // Reset
        setStep(0);
        setMessages([
          {
            id: "init",
            role: "ai",
            text: "Hi! Describe your dream website and I'll build it for you.",
          },
        ]);
        setInputText("");
        await wait(1000);

        // --- ROUND 1 ---
        // Typing Prompt 1
        setStep(1);
        const prompt1 = SEQUENCE[0].prompt;
        for (let i = 0; i <= prompt1.length; i++) {
          if (!isMounted) return;
          setInputText(prompt1.slice(0, i));
          await wait(30);
        }
        await wait(500);

        // Send Prompt 1
        if (!isMounted) return;
        setMessages(prev => [
          ...prev,
          { id: "u1", role: "user", text: prompt1 },
        ]);
        setInputText("");

        // Processing 1
        setStep(2);
        await wait(SEQUENCE[0].actionDuration);

        // Show Result 1 (Hero)
        if (!isMounted) return;
        setStep(3);
        setMessages(prev => [
          ...prev,
          { id: "a1", role: "ai", text: SEQUENCE[0].aiResponse },
        ]);
        await wait(3000);

        // --- ROUND 2 ---
        // Typing Prompt 2
        setStep(4);
        const prompt2 = SEQUENCE[1].prompt;
        for (let i = 0; i <= prompt2.length; i++) {
          if (!isMounted) return;
          setInputText(prompt2.slice(0, i));
          await wait(30);
        }
        await wait(500);

        // Send Prompt 2
        if (!isMounted) return;
        setMessages(prev => [
          ...prev,
          { id: "u2", role: "user", text: prompt2 },
        ]);
        setInputText("");

        // Processing 2
        setStep(5);
        await wait(SEQUENCE[1].actionDuration);

        // Show Result 2 (Features)
        if (!isMounted) return;
        setStep(6);
        setMessages(prev => [
          ...prev,
          { id: "a2", role: "ai", text: SEQUENCE[1].aiResponse },
        ]);

        // Final Pause before restart
        await wait(6000);
      }
    };

    runDemo();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  // Derived states
  const showHero = step >= 3;
  const showFeatures = step >= 6;
  const isProcessing = step === 2 || step === 5;

  return (
    <div className="flex h-full min-h-[600px] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white font-sans text-slate-900 shadow-2xl lg:flex-row">
      {/* --- LEFT PANEL: Chat / Prompt Interface --- */}
      {/* Responsive: Full width on mobile, fixed width on desktop */}
      <div className="flex h-[45%] w-full shrink-0 flex-col border-b border-slate-100 bg-white lg:h-auto lg:w-[350px] lg:border-r lg:border-b-0">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Image src="/icon.svg" alt="Nepdora" width={20} height={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Nepdora AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/30 p-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                    msg.role === "user"
                      ? "border-slate-200 bg-white"
                      : "border-primary bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={14} className="text-slate-600" />
                  ) : (
                    <Bot size={14} />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === "user"
                      ? "rounded-tr-none border border-slate-100 bg-white text-slate-700"
                      : "border-primary/20 bg-primary/5 text-primary rounded-tl-none border"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator (AI Thinking) */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-slate-100 px-4 py-3">
                <span className="text-xs font-medium text-slate-500">
                  Generating component...
                </span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="focus-within:border-primary focus-within:ring-primary relative flex items-end rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm transition-all focus-within:bg-white focus-within:ring-1">
            <textarea
              readOnly
              value={inputText}
              placeholder="Ask AI..."
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              rows={2}
              style={{ minHeight: "60px" }}
            />
            <button
              className={`ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                inputText
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <Send size={14} />
            </button>
          </div>
          <div className="mt-3 hidden gap-2 overflow-hidden px-1 sm:flex">
            {["Landing Page", "Portfolio", "Dashboard"].map(tag => (
              <span
                key={tag}
                className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] whitespace-nowrap text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: Live Preview --- */}
      <div className="flex h-[55%] flex-1 flex-col bg-slate-50 lg:h-auto">
        {/* Browser Toolbar */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400 sm:h-3 sm:w-3" />
          </div>

          {/* URL Bar */}
          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-md items-center justify-center rounded-md bg-slate-100 py-1 text-[10px] text-slate-500 sm:py-1.5 sm:text-xs">
              <Globe size={12} className="mr-1.5 text-slate-400 sm:mr-2" />
              <span className="text-slate-900">yoursite.nepdora.com</span>
              <span className="hidden text-slate-400 sm:inline">/builder</span>
            </div>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="relative flex-1 overflow-y-auto scroll-smooth bg-white">
          {/* Empty State */}
          {!showHero && !isProcessing && step < 3 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-300">
              <div className="rounded-full bg-slate-50 p-6">
                <Layout className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-sm font-medium">Waiting for prompt...</p>
            </div>
          )}

          {/* Generated Website */}
          <div className="min-h-full">
            {/* HERO SECTION */}
            <AnimatePresence>
              {showHero && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium sm:text-xs"
                  >
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Now Available
                  </motion.div>

                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
                  >
                    Simplify Your{" "}
                    <span className="text-primary">Digital Workflow</span>
                  </motion.h1>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 max-w-2xl text-base text-slate-600 sm:mt-6 sm:text-lg"
                  >
                    Streamline operations with our AI-powered analytics
                    platform. Built for scale, designed for simplicity, and
                    ready for your team.
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
                  >
                    <button className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold shadow-lg sm:w-auto">
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </button>
                    <button className="w-full rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto">
                      View Demo
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FEATURES SECTION */}
            <AnimatePresence>
              {showFeatures && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="border-t border-slate-100 bg-slate-50/50 px-4 py-16 sm:px-6 sm:py-24"
                >
                  <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center sm:mb-16">
                      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Why choose us?
                      </h2>
                      <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
                        Everything you need to succeed in one platform.
                      </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
                      {[
                        {
                          icon: Zap,
                          title: "Lightning Fast",
                          desc: "Optimized for speed with edge computing technology.",
                          color: "text-amber-600",
                          bg: "bg-amber-50",
                        },
                        {
                          icon: Palette,
                          title: "Modern Design",
                          desc: "Beautifully crafted components that look great on any device.",
                          color: "text-purple-600",
                          bg: "bg-purple-50",
                        },
                        {
                          icon: Shield,
                          title: "Secure by Default",
                          desc: "Enterprise-grade security protecting your data 24/7.",
                          color: "text-emerald-600",
                          bg: "bg-emerald-50",
                        },
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="group hover:border-primary/20 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg sm:p-8"
                        >
                          <div
                            className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                          >
                            <feature.icon className="h-6 w-6" />
                          </div>
                          <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
                            {feature.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            {feature.desc}
                          </p>
                          {/* Decorative gradient blob */}
                          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-slate-50 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading Overlay (Right side only) */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
              >
                <div className="relative">
                  <motion.div
                    className="bg-primary/20 absolute inset-0 rounded-full opacity-50"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                  </div>
                </div>
                <p className="text-primary mt-6 text-sm font-medium">
                  {step === 2
                    ? "Generating layout structure..."
                    : "Adding features section..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIBuilderDemo;
