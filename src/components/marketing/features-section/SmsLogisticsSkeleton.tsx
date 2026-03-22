"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Truck, CheckCircle2 } from "lucide-react";

const SmsLogisticsSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col p-4 bg-slate-50 overflow-hidden">
      {/* SMS Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={14} className="text-blue-500" />
          <span className="text-[10px] font-bold text-slate-700">Auto SMS</span>
        </div>
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto max-w-[80%] p-2 bg-blue-500 text-white rounded-2xl rounded-tr-sm text-[9px]"
          >
            Your order #8823 is out for delivery! 🚚
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-[80%] p-2 bg-white border border-slate-200 text-slate-600 rounded-2xl rounded-tl-sm text-[9px] shadow-sm"
          >
            Thank you! Can't wait.
          </motion.div>
        </div>
      </div>

      {/* Logistics Section */}
      <div className="mt-auto border-t border-slate-200 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold text-slate-700">Pathao Logistics</span>
          </div>
          <div className="h-4 w-12 bg-orange-100 rounded-full flex items-center justify-center text-[8px] font-bold text-orange-600">Active</div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
          <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="flex-1">
            <div className="h-2 w-16 bg-slate-200 rounded mb-1" />
            <div className="h-1.5 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsLogisticsSkeleton;
