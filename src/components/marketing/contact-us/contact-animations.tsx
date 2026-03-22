"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const ContactAnimations: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.section
      className="bg-background relative space-y-8 overflow-hidden px-4 py-8 md:space-y-12 md:px-4 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
    >
      {children}
    </motion.section>
  );
};
