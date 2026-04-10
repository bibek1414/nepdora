"use client";

import { motion } from "framer-motion";
import React from "react";

export const FooterSection = ({
  children,
  className,
  delay = 0,
  direction = "y",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "x" | "y" | "-x" | "-y";
}) => {
  const initial = {
    opacity: 0,
    x: direction === "x" ? 24 : direction === "-x" ? -24 : 0,
    y: direction === "y" ? 24 : direction === "-y" ? -24 : 0,
  };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};
