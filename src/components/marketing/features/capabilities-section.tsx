"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Truck,
  Search,
  MousePointer2,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DesignAnimation = () => {
  const [mode, setMode] = useState(0); // 0: Modern/Light, 1: Elegant/Dark

  useEffect(() => {
    const interval = setInterval(() => {
      setMode(prev => (prev === 0 ? 1 : 0));
    }, 4000); // Slower animation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {/* Sidebar */}
      <div className="z-10 flex w-24 flex-col gap-4 border-r border-slate-200 bg-white p-4 md:w-32">
        <div className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Theme
        </div>
        <div
          className={`h-8 w-full rounded-md border-2 transition-all duration-300 ${mode === 0 ? "border-slate-400 bg-slate-50" : "border-slate-200"}`}
        ></div>
        <div
          className={`h-8 w-full rounded-md border-2 transition-all duration-300 ${mode === 1 ? "border-slate-400 bg-slate-800" : "border-slate-200 bg-slate-800"}`}
        ></div>
      </div>

      {/* Canvas */}
      <div
        className={`flex flex-1 flex-col justify-center p-6 transition-colors duration-1000 ease-in-out md:p-10 ${mode === 0 ? "bg-white" : "bg-slate-900"}`}
      >
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3
            className={`mb-4 text-3xl font-bold transition-colors duration-1000 ${mode === 0 ? "font-sans text-slate-900" : "font-serif text-white italic"}`}
          >
            {mode === 0 ? "Minimalist." : "Elegance."}
          </h3>
          <div
            className={`mb-6 h-2 w-32 rounded transition-colors duration-1000 ${mode === 0 ? "bg-slate-200" : "bg-slate-700"}`}
          ></div>
          <button
            className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all duration-1000 sm:rounded-2xl sm:px-6 sm:text-sm ${mode === 0 ? "bg-slate-900 text-white" : "bg-slate-700 text-white"}`}
          >
            Explore Collection
          </button>
        </motion.div>
      </div>

      {/* Cursor Overlay */}
      <motion.div
        animate={{ x: 20, y: mode === 0 ? 60 : 110 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="pointer-events-none absolute top-0 left-0 z-20"
      >
        <MousePointer2
          className="fill-white text-slate-900 drop-shadow-md"
          size={24}
        />
      </motion.div>
    </div>
  );
};

const LogisticsAnimation = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="w-full max-w-md px-8">
        {/* Map Line */}
        <div className="relative mb-8 h-1 w-full rounded-2xl bg-slate-200">
          <div className="absolute top-1/2 left-0 h-3 w-3 -translate-y-1/2 rounded-2xl bg-slate-300"></div>
          <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-2xl bg-emerald-200"></div>

          {/* Truck */}
          <motion.div
            animate={{ left: ["0%", "85%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
            className="absolute top-1/2 -mt-4 -ml-4 -translate-y-1/2"
          >
            <div className="relative z-10 rounded-xl border border-slate-200 bg-white p-2 shadow-md sm:rounded-2xl">
              <Truck size={18} className="text-slate-700 sm:h-5 sm:w-5" />
            </div>
            <div className="absolute top-1/2 left-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-300/20 blur-xl"></div>
          </motion.div>
        </div>

        {/* Info Card */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <MapPin
                size={16}
                className="text-slate-700 sm:h-[18px] sm:w-[18px]"
              />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">
                Destination
              </div>
              <div className="text-xs font-bold text-slate-900 sm:text-sm">
                Pokhara, Lakeside
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">
              Status
            </div>
            <div className="text-xs font-bold text-slate-700 sm:text-sm">
              In Transit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeoAnimation = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
          <Search size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            buy organic tea nepal
          </span>
        </div>

        <div className="space-y-3">
          {/* Top Result (Nepdora) */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50/80 p-3 shadow-sm sm:p-4"
          >
            <div className="mb-1 flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
              nepdora.site/tea-shop{" "}
              <CheckCircle
                size={9}
                className="text-slate-600 sm:h-2.5 sm:w-2.5"
              />
            </div>
            <div className="cursor-pointer text-sm font-bold text-slate-900 hover:underline sm:text-base">
              Himalayan Organic Tea - Premium Quality
            </div>
            <div className="mt-1 line-clamp-1 text-[10px] text-slate-500 sm:text-xs">
              Shop authentic tea from Ilam directly. Free shipping within
              Kathmandu valley.
            </div>
          </motion.div>

          {/* Other Results */}
          {[1, 2].map(i => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 bg-white px-4 py-3 opacity-60 grayscale transition-all hover:grayscale-0"
            >
              <div className="mb-1 text-xs text-slate-400">
                competitor-site.com
              </div>
              <div className="text-xs font-medium text-slate-700 sm:text-sm">
                Generic Tea Store Listing
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureBlock: React.FC<{
  title: string;
  description: string;
  Visual: React.FC;
  reversed?: boolean;
}> = ({ title, description, Visual, reversed = false }) => {
  return (
    <div
      className={`flex flex-col items-center gap-8 py-8 sm:gap-10 sm:py-10 md:flex-row md:gap-12 md:py-12 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 text-left">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
          {description}
        </p>
        <Button
          size="default"
          variant="outline"
          className="group mt-2 w-fit cursor-pointer items-center gap-2 text-sm font-normal"
        >
          <span>Explore More</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="w-full flex-1">
        <div className="relative aspect-4/3 overflow-hidden rounded-lg sm:rounded-xl">
          <Visual />
        </div>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl bg-white px-2 py-12 sm:px-0 sm:py-16">
      <FeatureBlock
        title="Design that adapts to you."
        description="Our AI doesn't just swap templates. It understands your brand's voice, generates custom typography pairings, and builds a unique visual identity that feels expensive and bespoke."
        Visual={DesignAnimation}
      />

      <FeatureBlock
        title="Logistics that handle themselves."
        description="We automatically route orders to the best carriers based on location (Kathmandu valley or outside). From printing labels to tracking returns, your operations are on autopilot."
        Visual={LogisticsAnimation}
        reversed
      />

      <FeatureBlock
        title="SEO that wins rankings."
        description="Technical SEO is hard. We make it invisible. Nepdora generates JSON-LD schema, optimizes core web vitals, and structures your content to rank #1 automatically on Google."
        Visual={SeoAnimation}
      />
    </section>
  );
};

export default Features;
