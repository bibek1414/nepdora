import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Slack,
  Database,
  Mail,
  ShoppingCart,
  MessageSquare,
  Cloud,
} from "lucide-react";

const IntegrationsSkeleton = () => {
  const tools = [
    {
      icon: Slack,
      color: "text-[#E01E5A]",
      bg: "bg-[#E01E5A]/10",
      x: 0,
      y: -90,
    }, // Top
    {
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      x: 80,
      y: -45,
    }, // Top Right
    {
      icon: ShoppingCart,
      color: "text-green-500",
      bg: "bg-green-500/10",
      x: 80,
      y: 45,
    }, // Bottom Right
    {
      icon: Mail,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      x: 0,
      y: 90,
    }, // Bottom
    {
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      x: -80,
      y: 45,
    }, // Bottom Left
    {
      icon: Cloud,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      x: -80,
      y: -45,
    }, // Top Left
  ];

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white p-4">
      {/* Background Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.5,
        }}
      ></div>

      {/* Central Hub */}
      <motion.div
        className="relative z-20 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Layers className="h-10 w-10 text-white" />
        <div className="absolute -bottom-8 flex flex-col items-center">
          <span className="text-xs font-bold text-slate-900">Nepdora</span>
          <span className="rounded-full bg-slate-100 px-1.5 text-[8px] font-medium text-slate-500">
            Core
          </span>
        </div>
      </motion.div>

      {/* Connecting Lines & Tools */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg className="absolute h-full w-full overflow-visible">
          {tools.map((tool, i) => (
            <g key={i}>
              {/* Line */}
              <motion.line
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${tool.x}px)`}
                y2={`calc(50% + ${tool.y}px)`}
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              {/* Data Packet Outward */}
              <motion.circle
                r="3"
                fill="#6366f1"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [
                    `calc(50% + ${tool.x * 0.2}px)`,
                    `calc(50% + ${tool.x}px)`,
                  ],
                  cy: [
                    `calc(50% + ${tool.y * 0.2}px)`,
                    `calc(50% + ${tool.y}px)`,
                  ],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Data Packet Inward */}
              <motion.circle
                r="3"
                fill="#94a3b8"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [
                    `calc(50% + ${tool.x}px)`,
                    `calc(50% + ${tool.x * 0.2}px)`,
                  ],
                  cy: [
                    `calc(50% + ${tool.y}px)`,
                    `calc(50% + ${tool.y * 0.2}px)`,
                  ],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5 + 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}
        </svg>

        {/* Tool Nodes */}
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            className={`absolute z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-lg ${tool.color}`}
            style={{ transform: `translate(${tool.x}px, ${tool.y}px)` }}
            whileHover={{ scale: 1.1, zIndex: 30 }}
          >
            <tool.icon size={20} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSkeleton;
