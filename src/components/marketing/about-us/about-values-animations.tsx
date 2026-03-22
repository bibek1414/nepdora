"use client";

import React from "react";
import { motion } from "framer-motion";

export const AboutValuesSectionWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto mb-16 px-4 sm:mb-32 sm:px-6 lg:max-w-7xl lg:px-20"
    >
      {children}
    </motion.section>
  );
};

export const AboutValuesImageGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="order-2 flex-1 md:order-1"
    >
      {children}
    </motion.div>
  );
};

export const AboutValuesImage: React.FC<{
  src: string;
  alt: string;
  delay?: number;
  className?: string;
}> = ({ src, alt, delay = 0, className = "" }) => {
  return (
    <motion.img
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      src={src}
      alt={alt}
      className={className}
    />
  );
};

export const AboutValuesContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="order-1 flex-1 md:order-2"
    >
      {children}
    </motion.div>
  );
};

export const AboutValuesBadge: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
