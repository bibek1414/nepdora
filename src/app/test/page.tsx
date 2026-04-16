"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">
      {/* Dotted Background Pattern - Lightory Style */}
      <div className="absolute inset-0 z-0">
        {/* Main dotted grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, currentColor 50px, currentColor 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, currentColor 50px, currentColor 51px)`,
          }}
        />

        {/* Larger dots for depth */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #9ca3af 2px, transparent 2px)`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/80" />
      </div>

      {/* Content Container with max-w-7xl */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Icon */}
        <div className="flex justify-center pt-8 sm:pt-12">
          <motion.div
            className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-50" />
            <Image
              src="https://cdn.prod.website-files.com/697188003e8e3143dfd8ea51/697188003e8e3143dfd8ef2f_material-symbols--camera-outline%20(1).png"
              alt="Camera Icon"
              width={32}
              height={32}
              className="relative z-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Hero Content */}
        <section className="flex flex-col items-center pt-6 text-center sm:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center rounded-full border border-gray-100 bg-gray-50/80 px-3 py-1 text-xs font-medium text-gray-600 backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            Creative Photography
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl"
          >
            Captivating Visual Stories
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-base text-gray-500 sm:mt-6 sm:text-lg md:text-xl"
          >
            Meticulously composed visuals, enhanced by strategic
            <br className="hidden sm:inline" />
            lighting and refined artistic guidance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4"
          >
            <button className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition-all hover:scale-105 hover:bg-gray-800 active:scale-95 sm:px-8 sm:py-4 sm:text-sm">
              Get In Touch
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-6 py-3 text-xs font-medium text-gray-900 backdrop-blur-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95 sm:px-8 sm:py-4 sm:text-sm">
              View Portfolio
            </button>
          </motion.div>
        </section>

        {/* Visual Section */}
        <div className="relative z-10 w-full">
          {/* Main Center Image */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[700px]"
            >
              <Image
                src="https://cdn.prod.website-files.com/697188003e8e3143dfd8ea51/69718ad08fb0fbc691ee5572_Image%20Container-p-500.png"
                alt="Main Visual"
                fill
                className="object-contain"
                priority
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Portraits Container - Positioned relative to viewport */}
    </main>
  );
}


