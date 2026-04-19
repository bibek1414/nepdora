"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active stores", value: "2k+", suffix: "Businesses" },
  { label: "Uptime guarantee", value: "99.9%", suffix: "Reliability" },
  { label: "Nepali support", value: "100%", suffix: "Local help" },
  { label: "Ready to launch", value: "5min", suffix: "Setup time" },
];

export default function AboutStats() {
  return (
    <section className="border-t border-slate-100 bg-white py-12 sm:py-20">
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
              <div className="text-primary text-2xl font-semibold sm:text-4xl md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-bold text-slate-900">
                {stat.label}
              </div>
              <div className="mt-1 text-xs font-medium whitespace-nowrap text-slate-600">
                {stat.suffix}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
