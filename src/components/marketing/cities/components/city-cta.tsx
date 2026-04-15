"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CityCTAProps {
  cityName: string;
  category: string;
}

export const CityCTA: React.FC<CityCTAProps> = ({ cityName, category }) => {
  const industryLabel = category.replace(/-/g, " ");

  return (
    <section className="relative mb-20 overflow-hidden px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="group bg-primary relative overflow-hidden rounded-[2rem] px-8 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          {/* Decorative Shapes/Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            {/* Main Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />

            {/* Secondary Color Circle Cutout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="bg-secondary absolute -top-20 -right-20 h-64 w-64 rounded-full blur-2xl"
            />

            {/* "Cut Pot" / Semi-circle decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -25 }}
              whileInView={{ opacity: 0.1, scale: 1, rotate: -15 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full border-[30px] border-white ring-[15px] ring-white/10"
            />

            {/* Floating Orbs */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 right-[5%] h-32 w-32 rounded-full bg-white/5 blur-3xl"
            />

            <motion.div
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/4 left-1/3 h-20 w-20 rounded-full bg-white/5 blur-2xl"
            />

            {/* Filled Circle bottom right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-white/10 blur-xl"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-5 text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Ready to launch your{" "}
              <span className="relative inline-block text-white">
                {industryLabel}
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -bottom-0.5 left-0 h-1 rounded-full bg-white/40"
                />
              </span>{" "}
              business in {cityName}?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-indigo-50/80 md:text-lg"
            >
              Join hundreds of {cityName} businesses who trust Nepdora to build
              and grow their presence online. Start your journey today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex justify-center"
            >
              <Link href="/admin/signup">
                <Button
                  size="lg"
                  className="group text-primary relative h-auto rounded-full bg-white px-10 py-4 text-lg font-medium transition-all hover:bg-neutral-50 hover:shadow-lg active:scale-95"
                >
                  Start Building Free
                  <ChevronRight className="ml-2.5 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
