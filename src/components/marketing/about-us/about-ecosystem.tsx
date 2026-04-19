"use client";

import React from "react";
import { Users, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutEcosystem() {
  const benefits = [
    {
      icon: ShieldCheck,
      text: "Vetted Professionals",
      desc: "Every expert is vetted by Nepdora for design and technical excellence.",
    },
    {
      icon: Zap,
      text: "Faster Delivery",
      desc: "Go from brief to live in days with professionals who know the platform.",
    },
  ];
  const images = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",

  ];
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* text */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              <Users className="h-4 w-4" />
              the ecosystem
            </div>

            <h2 className="mb-5 text-3xl leading-snug font-bold tracking-tight text-slate-900 sm:text-4xl">
              More than a tool. <br />
              <span className="text-indigo-600">A human network.</span>
            </h2>

            <p className="mb-8 text-base leading-relaxed text-slate-500">
              Nepdora isn't just a platform; it's a thriving hub of 100+ vetted
              Nepali designers and developers. We connect businesses with the
              expertise they need to build fast, modern, and high-converting
              digital experiences.
            </p>

            <div className="space-y-6">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {b.text}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/experts"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Explore Expert Hub
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Join Partner Program
              </Link>
            </div>
          </div>

          {/* visual mockup */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm"
                  >
                    <div className="mb-3 h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                      <img
                        src={`${images[i - 1]}?auto=format&fit=crop&w=100&q=80`}
                        alt="Profile"
                        className="h-full w-full object-cover opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
                      />
                    </div>
                    <div className="mb-1 h-2 w-12 rounded-full bg-slate-100" />
                    <div className="h-2 w-8 rounded-full bg-indigo-100" />
                  </div>
                ))}
              </div>

              {/* Overlay connection badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-indigo-600 p-4 text-white shadow-xl">
                <div className="text-xl font-bold">100+</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                  Verified Experts
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
