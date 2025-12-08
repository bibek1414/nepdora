import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnalyticsSkeleton = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="flex h-full w-full flex-col bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <div className="mb-1 font-serif text-lg font-medium text-slate-900">
            December 2024
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="h-2 w-2 rounded-sm bg-indigo-500"></span>
              Tickets resolved
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              Average CSAT
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex flex-1 items-end justify-between gap-2 pl-2">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-10">
          <div className="h-px w-full bg-slate-400"></div>
          <div className="h-px w-full bg-slate-400"></div>
          <div className="h-px w-full bg-slate-400"></div>
          <div className="h-px w-full bg-slate-400"></div>
        </div>

        {/* Bars & Line Points */}
        {[35, 45, 30, 60, 40, 75, 50, 85].map((h, i) => {
          const isHighlight = i === 5;
          const isHovered = hoveredBar === i;
          return (
            <div
              key={i}
              className="group relative flex h-full flex-1 cursor-crosshair flex-col justify-end"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {(isHovered || isHighlight) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-[100%] left-1/2 z-20 mb-2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] whitespace-nowrap text-white shadow-lg"
                  >
                    {h * 12} Tickets
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`w-full rounded-t-sm transition-colors duration-200 ${isHighlight || isHovered ? "bg-indigo-500 shadow-lg shadow-indigo-200" : "bg-slate-200"}`}
              />

              {/* Line Point (Simulated) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2"
                style={{ bottom: `${h + 10}%` }}
              >
                <div
                  className={`h-2 w-2 rounded-full border-2 border-white transition-transform ${isHighlight || isHovered ? "scale-150 bg-orange-500" : "bg-orange-500"}`}
                ></div>
              </motion.div>
            </div>
          );
        })}

        {/* Connection Line (SVG Overlay) */}
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
          <motion.path
            d="M 15 65 L 50 55 L 85 70 L 120 40 L 155 60 L 190 25 L 225 50 L 260 15" // Approximate path
            fill="none"
            stroke="#f97316" // Orange-500
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
