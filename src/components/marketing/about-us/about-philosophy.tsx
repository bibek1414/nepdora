"use client";

import React from "react";
import { Zap } from "lucide-react";

export default function AboutPhilosophy() {
  const values = [
    { label: "launch", value: "instantly" },
    { label: "learning curve", value: "zero" },
    { label: "platform switch", value: "never" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center shadow-2xl sm:px-12">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
            <Zap className="mb-0.5 h-4 w-4 text-indigo-400" />
            speed. simplicity. scale.
          </div>
          
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Great tools should feel <span className="text-indigo-400">invisible</span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-300">
            That's why Nepdora focuses on speed—launch instantly, simplicity—no 
            learning curve, and scalability—grow without switching platforms. 
            Whether you're just starting or expanding, Nepdora grows with you.
          </p>
          
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20">
            {values.map((v, i) => (
              <div key={i} className="text-center">
                <div className="mb-1 text-3xl font-bold text-indigo-400 sm:text-4xl">
                  {v.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  {v.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
