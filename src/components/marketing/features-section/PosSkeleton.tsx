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
    <div className="flex h-full w-full flex-col p-4 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator size={14} className="text-indigo-600" />
          <span className="text-[10px] font-bold text-slate-700">POS System</span>
        </div>
        <div className="h-4 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-600">Terminal 01</div>
      </div>

      <div className="flex-1 space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center">
                <ShoppingCart size={10} className="text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-600 font-medium">{item.name}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-900">{item.price}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 bg-indigo-600 p-3 rounded-xl text-white">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] opacity-80">Total Amount</span>
          <span className="text-xs font-bold">Rs. 1,050</span>
        </div>
        <button className="w-full bg-white/20 hover:bg-white/30 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-colors">
          <CreditCard size={12} />
          Complete Sale
        </button>
      </div>
    </div>
  );
};

export default PosSkeleton;
