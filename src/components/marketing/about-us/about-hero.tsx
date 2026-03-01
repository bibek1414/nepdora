"use client";
import React from "react";
import { motion } from "framer-motion";

const AboutHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-0">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 bg-neutral-50/50 blur-[120px]"></div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase shadow-xs">
            The Mission
          </div>

          <h1 className="mb-8 text-6xl leading-[1] font-bold tracking-tighter text-neutral-900 sm:text-8xl lg:text-9xl">
            Made in Nepal.
            <br />
            <span className="font-serif font-light text-neutral-400 italic">
              Made for you.
            </span>
          </h1>

          <p className="mx-auto mb-16 max-w-2xl text-xl leading-relaxed font-light text-neutral-500 sm:text-2xl">
            Building the world's most intuitive{" "}
            <span className="font-medium text-neutral-900">
              Website Builder
            </span>
            <br className="hidden sm:block" />
            for the next generation of Nepali entrepreneurs.
          </p>
        </motion.div>

        {/* Clean Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-neutral-100 bg-white p-3 shadow-2xl sm:p-5"
        >
          <div className="overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem]">
            <img
              src="/fallback/image-not-found.png"
              alt="Himalayan Presence"
              className="aspect-video w-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
