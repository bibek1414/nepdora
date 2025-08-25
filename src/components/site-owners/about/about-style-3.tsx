"use client";

import React from "react";
import { motion } from "framer-motion";
import { AboutUs3Data } from "@/types/owner-site/components/about";

interface AboutUsTemplate3Props {
  aboutUsData: AboutUs3Data;
}

export const AboutUsTemplate3: React.FC<AboutUsTemplate3Props> = ({
  aboutUsData,
}) => {
  return (
    <section id="about" className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid items-center gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="h-px w-20 bg-gradient-to-r from-green-400 to-emerald-600 sm:w-32"></div>
              <h2 className="text-3xl leading-tight font-light text-black sm:text-4xl lg:text-5xl xl:text-6xl">
                {aboutUsData.title}
                <br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text font-normal text-transparent">
                  {aboutUsData.subtitle}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-black sm:text-3xl">
                  {aboutUsData.stats.startYear}
                </div>
                <div className="text-xs tracking-wider text-gray-500 sm:text-sm">
                  START
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-black sm:text-3xl">
                  {aboutUsData.stats.completeYear}
                </div>
                <div className="text-xs tracking-wider text-gray-500 sm:text-sm">
                  COMPLETE
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                {aboutUsData.description}
              </p>

              <div className="space-y-3 sm:space-y-4">
                {aboutUsData.features.map(feature => (
                  <div
                    key={feature.id}
                    className="flex items-center space-x-3 sm:space-x-4"
                  >
                    <div className="h-2 w-2 bg-black"></div>
                    <span className="text-sm text-gray-700 sm:text-base">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <div className="inline-flex items-center space-x-2 text-xs tracking-wider text-gray-500 sm:text-sm">
                <span>{aboutUsData.stats.unitsAvailable}</span>
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                <span>AVAILABLE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
