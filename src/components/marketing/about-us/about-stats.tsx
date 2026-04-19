"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active stores", value: "2k+", suffix: "businesses" },
  { label: "Uptime guarantee", value: "99.9%", suffix: "reliability" },
  { label: "Nepali support", value: "100%", suffix: "local help" },
  { label: "Ready to launch", value: "5min", suffix: "setup time" },
];

export default function AboutStats() {
  return (
    <section className="bg-white py-12 sm:py-20 border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                {stat.label}
              </div>
              <div className="mt-1 text-[10px] font-medium text-slate-300 uppercase italic whitespace-nowrap">
                {stat.suffix}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
