"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export const TemplatesHero = () => {
  return (
    <div className="bg-white pt-16 pb-8 md:pt-24 md:pb-12">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl"
        >
          Launch Your Dream Website in <br className="hidden md:block" />
          Minutes with Nepdora AI Templates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 text-lg text-slate-600 md:text-xl"
        >
          Build a professional website tailored for the Nepalese market with our 
          AI-powered templates — fully customizable, responsive, and 
          ready for your business with zero coding required.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="relative">
            <Search className="absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search all templates (e.g. Business, Portfolio)"
              className="h-14 w-full rounded-lg border-slate-200 bg-white pr-4 pl-12 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
