"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, ShoppingCart, CreditCard } from "lucide-react";

const PosSkeleton = () => {
  const items = [
    { name: "Coffee", price: "Rs. 250" },
    { name: "Sandwich", price: "Rs. 450" },
    { name: "Mocha", price: "Rs. 350" },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={14} className="text-indigo-600" />
          <span className="text-[10px] font-bold text-slate-700">
            POS System
          </span>
        </div>
        <div className="flex h-4 w-12 items-center justify-center rounded-full bg-indigo-100 text-[8px] font-bold text-indigo-600">
          Terminal 01
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100">
                <ShoppingCart size={10} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-medium text-slate-600">
                {item.name}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-900">
              {item.price}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-indigo-600 p-3 text-white">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] opacity-80">Total Amount</span>
          <span className="text-xs font-bold">Rs. 1,050</span>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/20 py-1.5 text-[10px] font-bold transition-colors hover:bg-white/30">
          <CreditCard size={12} />
          Complete Sale
        </button>
      </div>
    </div>
  );
};

export default PosSkeleton;
