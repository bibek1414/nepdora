"use client";

import React from "react";
import { motion } from "framer-motion";

export const AboutStoryFadeInLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="md:w-1/3"
    >
      {children}
    </motion.div>
  );
};

export const AboutStoryFadeInUp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="space-y-8 text-neutral-600 md:w-2/3"
    >
      {children}
    </motion.div>
  );
};
