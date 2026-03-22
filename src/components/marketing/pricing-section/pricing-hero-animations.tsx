"use client";

import React from "react";
import { motion } from "framer-motion";

export const PricingHeaderAnimation: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export const PricingToggleAnimation: React.FC<{
  isYearly: boolean;
  children: React.ReactNode;
}> = ({ isYearly, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-12 flex items-center justify-center gap-4"
    >
      {children}
    </motion.div>
  );
};

export const SavingsBadgeAnimation: React.FC<{
  isYearly: boolean;
  children: React.ReactNode;
}> = ({ isYearly, children }) => {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isYearly ? 1 : 0,
        opacity: isYearly ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
      className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
    >
      {children}
    </motion.span>
  );
};

export const PricingCardAnimation: React.FC<{
  index: number;
  isCenter: boolean;
  children: React.ReactNode;
}> = ({ index, isCenter, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl ${
        isCenter ? "scale-105" : "mt-15 scale-100"
      } duration-300`}
    >
      {children}
    </motion.div>
  );
};
