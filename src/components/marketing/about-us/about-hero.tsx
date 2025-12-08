"use client";
import React from "react";
import { motion } from "framer-motion";

const AboutHero: React.FC = () => {
  return (
    <section className="mx-auto mb-16 px-4 pt-24 sm:mb-16 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-20">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase sm:px-4 sm:py-1.5">
            <span>Since 2023</span>
          </div>
          <h1 className="mb-6 text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl">
            Made in Nepal.
            <br />
            <span className="text-primary font-serif italic">
              Made for you.
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed font-light text-slate-500 sm:text-lg md:text-xl lg:text-2xl">
            We are on a mission to democratize the digital economy. We believe a{" "}
            {}
            <span className="text-primary font-serif italic">
              shopkeeper in Asan should have the same digital power as a startup
              in Silicon Valley.
            </span>
          </p>
        </motion.div>
      </div>

      {/* Wide Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative h-[40vh] w-full overflow-hidden rounded-2xl sm:h-[50vh] sm:rounded-3xl lg:h-[60vh] lg:rounded-[2.5rem]"
      >
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop"
          alt="Kathmandu Valley"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 max-w-xs text-white sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 lg:bottom-16 lg:left-16 lg:max-w-xl">
          <p className="mb-1 text-sm font-medium opacity-90 sm:text-base md:text-lg lg:text-xl">
            Kathmandu, Nepal
          </p>
          <p className="text-xs opacity-70 sm:text-sm">
            Our home, our headquarters, and our inspiration.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutHero;
