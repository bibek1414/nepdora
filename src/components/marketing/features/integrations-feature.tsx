"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Zap, Check } from "lucide-react";
import { INTEGRATIONS } from "@/constants/integrations";

export default function IntegrationsFeature() {
  // Get a few interesting integration logos
  const featuredIntegrations = INTEGRATIONS.slice(0, 5);

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* text */}
          <div>
            <h2 className="mb-5 text-3xl leading-snug font-bold tracking-tight text-slate-900 sm:text-4xl">
              Connect with the tools you already use
            </h2>
            <p className="mb-7 text-base leading-relaxed text-slate-500">
              Nepdora plays well with others. From local payment gateways like
              eSewa and Khalti to global analytics and marketing tools, we've
              got you covered with native, zero-code integrations.
            </p>
            <ul className="mb-8 space-y-3">
              {[
                "Native eSewa & Khalti payment integration",
                "Automated logistics with local courier partners",
                "WhatsApp ordering & customer communication",
                "Google Analytics & Facebook Pixel marketing",
              ].map(b => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50">
                    <Check className="h-3 w-3 text-sky-600" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/integrations"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:-xl hover:-slate-200"
            >
              View All Integrations
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* visual mockup */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white -2xl">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="mx-3 flex-1 rounded border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-400">
                  nepdora.com/integrations
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4">
                  {featuredIntegrations.map((app, idx) => (
                    <div
                      key={app.slug}
                      className={`flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-sky-200 hover:bg-sky-50/30 ${
                        idx === 0
                          ? "scale-105 -md -slate-100"
                          : "opacity-80"
                      }`}
                    >
                      <div className="mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-2 -sm">
                        <Image
                          src={app.logo}
                          alt={app.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-900">
                        {app.name}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-[8px] font-medium text-emerald-600">
                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                        Connected
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 -sm">
                      <Zap className="h-4 w-4" fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Plus 20+ more
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-sky-100/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-amber-100/50 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
