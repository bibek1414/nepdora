"use client";

import React from "react";
import { motion } from "framer-motion";

export const AISectionFadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  x?: number;
  y?: number;
}> = ({ children, delay = 0, x = 0, y = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
};

export const AISectionImageWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative order-2 lg:order-1"
    >
      {children}
    </motion.div>
  );
};
