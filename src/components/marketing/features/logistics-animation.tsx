"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

const LogisticsAnimation = () => {
  const steps = [
    { location: "Kathmandu Warehouse", status: "Picked Up", time: "10:00 AM" },
    { location: "Sorting Center", status: "Processed", time: "02:30 PM" },
    { location: "In Transit", status: "On The Way", time: "06:00 PM" },
    { location: "Pokhara Distribution", status: "Arrived", time: "08:00 AM" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % (steps.length + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-background border-border relative flex h-full w-full flex-col justify-center overflow-hidden border-l p-8">
      <div className="text-foreground absolute top-0 right-0 p-6 opacity-5">
        <Truck size={120} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <Truck size={18} />
          </div>
          <div>
            <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Tracking ID
            </div>
            <div className="text-foreground font-mono font-bold">
              NPD-88219X
            </div>
          </div>
        </div>

        <div className="border-border relative space-y-6 border-l-2 pl-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: idx <= activeStep ? 1 : 0.3 }}
              className="relative pl-6"
            >
              <motion.div
                animate={{
                  scale: idx === activeStep ? 1.2 : 1,
                  // Using a hardcoded color for the active dot to ensure it stands out, or could use a CSS variable if available
                  backgroundColor:
                    idx <= activeStep
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                }}
                // Inline style to use the CSS variable for background color
                style={{
                  backgroundColor:
                    idx <= activeStep ? "var(--primary)" : "var(--muted)",
                }}
                className={`border-background absolute top-1 -left-[21px] h-3 w-3 rounded-full border-2 shadow-sm ${idx <= activeStep ? "bg-primary" : "bg-muted"}`}
              />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-foreground text-sm font-bold">
                    {step.status}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {step.location}
                  </div>
                </div>
                <div className="text-muted-foreground bg-muted/50 rounded px-2 py-1 font-mono text-[10px]">
                  {step.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogisticsAnimation;
