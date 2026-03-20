"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  idx: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ children, className, idx }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.05, duration: 0.5 }}
      className={`group relative flex flex-col overflow-hidden rounded-4xl border ${className}`}
    >
      {children}
    </motion.div>
  );
};
