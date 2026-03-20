"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const CountUpAnimation = ({ end, duration }: { end: number; duration: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count.toLocaleString("en-IN")}</>;
};

export const FadeInAnimation = ({ children, delay = 0, direction = "y" }: { children: React.ReactNode, delay?: number, direction?: "x" | "y" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "x" ? -20 : 0, y: direction === "y" ? 20 : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};
