"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { OrderParticleProps } from "./types";

export const OrderParticle: React.FC<OrderParticleProps> = ({
  route,
  onLog,
  onComplete,
}) => {
  const duration = 5; // seconds
  const [orderId] = useState(Math.floor(Math.random() * 9000) + 1000);

  useEffect(() => {
    const t1 = setTimeout(
      () => {
        onLog(
          `Order #${orderId} picked up by ${
            route === "express" ? "FastShip" : "EcoLogistics"
          }`
        );
      },
      duration * 0.25 * 1000
    );

    const t2 = setTimeout(
      () => {
        onLog(
          `Order #${orderId} arrived at ${
            route === "express" ? "Air Hub" : "Ground Hub"
          }`
        );
      },
      duration * 0.6 * 1000
    );

    const t3 = setTimeout(() => {
      onLog(
        `Order #${orderId} delivered! + NPR ${route === "express" ? "145" : "85"}`,
        "success"
      );
      // This triggers when package reaches customer (position 90%)
      onComplete();
    }, duration * 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [route, onLog, onComplete, orderId]);

  const expressKeyframes = {
    left: ["10%", "35%", "65%", "90%"],
    top: ["50%", "23%", "23%", "50%"],
    scale: [0.5, 1, 1, 0.5],
    opacity: [0, 1, 1, 0],
  };

  const standardKeyframes = {
    left: ["10%", "35%", "65%", "90%"],
    top: ["50%", "77%", "77%", "50%"],
    scale: [0.5, 1, 1, 0.5],
    opacity: [0, 1, 1, 0],
  };

  return (
    <motion.div
      className={`absolute z-20 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm shadow-sm ring-1 ring-white ${
        route === "express" ? "bg-indigo-600" : "bg-orange-500"
      }`}
      initial={{ left: "10%", top: "50%", opacity: 0 }}
      animate={route === "express" ? expressKeyframes : standardKeyframes}
      transition={{
        duration,
        ease: "linear",
        times: [0, 0.25, 0.6, 1],
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      <Package size={10} className="text-white" />
    </motion.div>
  );
};
