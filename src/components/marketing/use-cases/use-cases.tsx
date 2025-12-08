"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronRight } from "lucide-react";

const UseCases: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-start justify-between sm:mb-10 md:flex-row md:items-end">
          <div>
            <h2 className="mb-4 text-2xl leading-tight font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              Best Designed Websites for Any Business
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {/* PRODUCT SALES CARD */}
          <div className="group rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30 sm:rounded-3xl">
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  If you sell products
                </h3>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Complete online store with inventory management, cart system,
                and local payment gateways (eSewa, Fonepay) built-in.
              </p>

              <Button
                size="default"
                variant="outline"
                className="group mb-6 w-fit text-sm shadow-md hover:shadow-lg sm:mb-8"
              >
                Start Building Ecommerce Website
                <ChevronRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Mockup */}
              <div className="relative mt-auto aspect-4/3 w-full overflow-hidden rounded-t-xl border-x border-t border-slate-200 bg-slate-50 shadow-sm">
                {/* Mockup Header */}
                <div className="flex h-8 items-center gap-2 border-b border-slate-100 bg-white px-3">
                  <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                  <div className="h-1.5 w-12 rounded-full bg-slate-100"></div>
                </div>
                {/* Mockup Body */}
                <div className="grid grid-cols-2 gap-3 p-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="aspect-square w-full rounded-md bg-slate-200"></div>
                      <div className="h-2 w-2/3 rounded bg-slate-100"></div>
                      <div className="h-2 w-1/3 rounded bg-slate-200"></div>
                    </div>
                  ))}
                </div>
                {/* Notification Overlay */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-10 right-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md sm:top-12 sm:right-4 sm:gap-3 sm:p-3"
                >
                  <div>
                    <div className="text-[9px] font-semibold text-slate-900 sm:text-[10px]">
                      New Order
                    </div>
                    <div className="text-[9px] text-slate-500 sm:text-[10px]">
                      NPR 2,500
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* SERVICE SALES CARD */}
          <div className="group rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30 sm:rounded-3xl">
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  If you sell services
                </h3>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Professional portfolio sites with automated booking systems,
                calendar syncing, and client inquiry forms.
              </p>

              <Button
                size="default"
                variant="outline"
                className="group mb-6 w-fit text-sm shadow-md hover:shadow-lg sm:mb-8"
              >
                Start Building Business Website
                <ChevronRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Mockup */}
              <div className="relative mt-auto aspect-4/3 w-full overflow-hidden rounded-t-xl border-x border-t border-slate-200 bg-slate-50 shadow-sm">
                {/* Mockup Header */}
                <div className="flex h-8 items-center justify-between border-b border-slate-100 bg-white px-3">
                  <div className="h-1.5 w-16 rounded-full bg-slate-200"></div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-6 rounded-full bg-slate-100"></div>
                    <div className="h-1.5 w-6 rounded-full bg-slate-100"></div>
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="p-0">
                  <div className="relative mb-4 h-32 w-full bg-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded bg-white px-4 py-1 text-[10px] font-bold">
                        Book Appointment
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 px-4">
                    <div className="h-2 w-3/4 rounded bg-slate-200"></div>
                    <div className="h-2 w-full rounded bg-slate-100"></div>
                    <div className="h-2 w-full rounded bg-slate-100"></div>
                  </div>
                </div>
                {/* Notification Overlay */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute top-10 right-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md sm:top-12 sm:right-4 sm:gap-3 sm:p-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 sm:h-8 sm:w-8">
                    <MessageCircle size={12} className="sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-slate-900 sm:text-[10px]">
                      New Inquiry
                    </div>
                    <div className="text-[9px] text-slate-500 sm:text-[10px]">
                      Consultation Req.
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
