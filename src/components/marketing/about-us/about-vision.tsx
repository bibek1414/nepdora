"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export default function AboutVision() {
  return (
    <section className="border-t border-slate-100 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-600">
          <TrendingUp className="h-4 w-4" />
          our vision
        </div>
        
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Building the digital foundation for the <br />
          <span className="text-indigo-600">next generation</span> of Nepali businesses
        </h2>
        
        <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
          A future where anyone—from a local shop owner to a growing brand—can 
          create, compete, and succeed online with the same level of tools 
          as global companies.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">Create</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Boundless Ideas</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">Compete</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Global Standard</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">Succeed</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Local Growth</p>
          </div>
        </div>
      </div>
    </section>
  );
}
