import React from "react";
import { motion } from "framer-motion";

const SetupSkeleton = () => (
  <div className="flex h-full items-center justify-center bg-white">
    <div className="relative flex h-20 w-20 items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-indigo-600">5</div>
        <div className="text-[8px] font-bold text-slate-400 uppercase">
          Minutes
        </div>
      </div>
      <svg className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="4"
        />
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="4"
          strokeDasharray="226"
          initial={{ strokeDashoffset: 226 }}
          whileInView={{ strokeDashoffset: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  </div>
);

export default SetupSkeleton;
