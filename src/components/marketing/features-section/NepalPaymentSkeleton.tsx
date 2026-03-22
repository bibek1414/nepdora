"use client";

import React from "react";
import { motion } from "framer-motion";

const NepalPaymentSkeleton = () => {
  const transactions = [
    { id: "TXN123", amount: "Rs. 1,500", method: "eSewa", status: "Success", color: "#60BB46" },
    { id: "TXN124", amount: "Rs. 2,500", method: "Khalti", status: "Success", color: "#5C2D91" },
    { id: "TXN125", amount: "Rs. 890", method: "eSewa", status: "Success", color: "#60BB46" },
  ];

  return (
    <div className="flex h-full w-full flex-col p-4 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-[#60BB46]/20 rounded flex items-center justify-center text-[10px] font-bold text-[#60BB46]">eSewa</div>
          <div className="h-6 w-16 bg-[#5C2D91]/20 rounded flex items-center justify-center text-[10px] font-bold text-[#5C2D91]">Khalti</div>
        </div>
        <div className="h-4 w-4 rounded-full bg-slate-200 animate-pulse" />
      </div>
      
      <div className="space-y-2">
        {transactions.map((txn, i) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md" style={{ backgroundColor: txn.color + "20" }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-700">{txn.id}</span>
                <span className="text-[8px] text-slate-400">{txn.method}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-900">{txn.amount}</span>
              <span className="text-[8px] text-emerald-500 font-medium">{txn.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-auto pt-2 border-t border-slate-200">
        <div className="flex justify-between items-center px-1">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-10 bg-emerald-100 rounded" />
        </div>
      </div>
    </div>
  );
};

export default NepalPaymentSkeleton;
