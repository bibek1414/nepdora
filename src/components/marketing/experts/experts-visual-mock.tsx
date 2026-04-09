"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Star,
  CheckCircle2,
  MapPin,
  Globe,
  Zap,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";

const EXPERTS = [
  {
    name: "Anish Shrestha",
    role: "E-commerce Specialist",
    location: "Kathmandu",
    tags: ["Khalti", "SEO", "Custom Design"],
  },
  {
    name: "Sita Thapa",
    role: "UI/UX Designer",
    location: "Pokhara",
    tags: ["Branding", "Responsive", "Figma"],
  },
  {
    name: "Rohan Gurung",
    role: "Full-stack Developer",
    location: "Lalitpur",
    tags: ["API", "eSewa", "Performance"],
  },
];

export function ExpertsVisualMock() {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-4xl md:aspect-[16/10]">
      {/* Background Glow */}
      <div className="bg-primary/5 absolute inset-0 rounded-[40px] blur-3xl" />

      {/* Main Interface */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="-2xl relative flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200"
      >
        {/* Header / Search Bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-white px-8 py-6 md:flex-row md:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-xs font-medium text-slate-500">
              Search for experts in Kathmandu...
            </div>
          </div>
          <div className="flex gap-3">
            <div className="-widest flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold text-slate-600">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>
            <div className="bg-primary -primary/20 -lg -widest rounded-xl px-4 py-2 text-[10px] font-black text-white">
              Find Experts
            </div>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="flex-1 overflow-hidden p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EXPERTS.map((expert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:border-primary/20 group -sm hover:-xl rounded-2xl border border-slate-100 bg-white p-6 transition-all"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative h-12 w-12">
                    <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                      {expert.name}
                      <CheckCircle2 className="h-3 w-3 fill-blue-50 text-blue-500" />
                    </div>
                    <div className="text-[10px] font-medium text-slate-500">
                      {expert.role}
                    </div>
                  </div>
                </div>

                <div className="mb-6 flex flex-wrap gap-1.5">
                  {expert.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-primary/5 text-primary rounded-md px-2 py-1 text-[9px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Badges */}
    </div>
  );
}
