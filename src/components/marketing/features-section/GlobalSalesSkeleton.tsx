import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  CreditCard,
  Smartphone,
  Globe,
  Lock,
} from "lucide-react";

const providers = [
  {
    name: "eSewa",
    color: "bg-[#4FB431]",
    text: "text-white",
    icon: Smartphone,
  },
  {
    name: "Khalti",
    color: "bg-[#5C2D91]",
    text: "text-white",
    icon: Smartphone,
  },
  {
    name: "Fonepay",
    color: "bg-[#C41E3A]",
    text: "text-white",
    icon: Smartphone,
  },
  {
    name: "Stripe",
    color: "bg-[#635BFF]",
    text: "text-white",
    icon: CreditCard,
  },
  { name: "PayPal", color: "bg-[#003087]", text: "text-white", icon: Globe },
  { name: "Razorpay", color: "bg-[#0A2540]", text: "text-white", icon: Lock },
];

const GlobalSalesSkeleton = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success">(
    "idle"
  );

  useEffect(() => {
    const cycle = async () => {
      // Reset
      setSelected(null);
      setStatus("idle");

      await new Promise(r => setTimeout(r, 1000));

      // Select random provider (e.g., Khalti or Stripe)
      const idx = Math.floor(Math.random() * providers.length);
      setSelected(idx);

      await new Promise(r => setTimeout(r, 500));
      setStatus("processing");

      await new Promise(r => setTimeout(r, 1500));
      setStatus("success");

      await new Promise(r => setTimeout(r, 2000));
    };

    cycle();
    const interval = setInterval(cycle, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white md:flex-row">
      {/* Left: Payment Gateway Selector */}
      <div className="relative flex flex-1 flex-col justify-center border-r border-slate-100 p-6">
        <div className="mb-4">
          <h3 className="mb-1 text-xs font-bold tracking-wide text-slate-800 uppercase">
            Select Payment Method
          </h3>
          <p className="text-[10px] text-slate-500">
            Secure encrypted transaction
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {providers.map((p, i) => {
            const isSelected = selected === i;
            const isOtherSelected = selected !== null && selected !== i;

            return (
              <motion.button
                key={p.name}
                layout
                className={`relative flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all ${
                  isSelected
                    ? `border-transparent ${p.color} ${p.text} shadow-md`
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                } ${isOtherSelected ? "opacity-40 grayscale" : "opacity-100"}`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${isSelected ? "bg-white/20" : "bg-slate-100"}`}
                >
                  <p.icon size={10} />
                </div>
                <span className="text-[10px] font-bold">{p.name}</span>

                {/* Status Icons */}
                {isSelected && (
                  <div className="absolute top-1/2 right-2 -translate-y-1/2">
                    {status === "processing" && (
                      <Loader2 size={12} className="animate-spin opacity-80" />
                    )}
                    {status === "success" && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check size={12} />
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Success Overlay Effect */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-6 bottom-4 left-6 flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                <Check size={10} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-green-700">
                Payment Verified
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Logistics Map */}
      <div className="relative hidden w-1/3 overflow-hidden bg-slate-50 md:block">
        {/* Map Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            opacity: 0.5,
          }}
        ></div>

        {/* Connection Line */}
        <svg className="absolute inset-0 h-full w-full">
          <motion.path
            d="M 40 160 Q 90 160 90 100 T 140 40"
            fill="none"
            stroke={status === "success" ? "#10b981" : "#cbd5e1"}
            strokeWidth="2"
            strokeDasharray="4 4"
            animate={
              status === "success"
                ? { strokeDasharray: "0 0" }
                : { strokeDasharray: "4 4" }
            }
          />
          {status === "success" && (
            <motion.circle
              r="3"
              fill="#10b981"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              style={{
                offsetPath: "path('M 40 160 Q 90 160 90 100 T 140 40')",
              }}
            />
          )}
        </svg>

        {/* Map Pins */}
        <div className="absolute bottom-8 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md">
          <CreditCard size={14} className="text-slate-400" />
        </div>

        <motion.div
          animate={
            status === "success"
              ? { scale: [1, 1.1, 1], borderColor: "#10b981" }
              : {}
          }
          className={`absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-lg ${status === "success" ? "border-green-500 text-green-600" : "border-slate-200 text-slate-300"}`}
        >
          <Globe size={18} />
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalSalesSkeleton;
