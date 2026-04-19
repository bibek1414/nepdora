"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Truck, CheckCircle2 } from "lucide-react";

const SmsLogisticsSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-50 p-4">
      {/* SMS Section */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare size={14} className="text-blue-500" />
          <span className="text-[10px] font-bold text-slate-700">Auto SMS</span>
        </div>
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-500 p-2 text-[9px] text-white"
          >
            Your order #8823 is out for delivery! 🚚
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-2 text-[9px] text-slate-600 shadow-sm"
          >
            Thank you! Can't wait.
          </motion.div>
        </div>
      </div>

      {/* Logistics Section */}
      <div className="mt-auto border-t border-slate-200 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-blue-600" />
            <span className="text-[10px] font-bold text-slate-700">
              Multi-Carrier Logistics
            </span>
          </div>
          <div className="flex h-4 w-12 items-center justify-center rounded-full bg-blue-50 text-[8px] font-bold text-blue-600">
            Active
          </div>
        </div>

        <div className="space-y-1.5">
          {/* Pathao */}
          <div className="flex items-center gap-2 rounded border border-slate-100 bg-white px-2 py-1.5 shadow-sm">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-[8px] font-bold text-orange-600">
              P
            </div>
            <div className="flex-1">
              <div className="mb-0.5 h-1.5 w-12 rounded bg-slate-200" />
              <div className="h-1 w-16 rounded bg-slate-100" />
            </div>
            <div className="flex h-2 w-8 items-center justify-center rounded bg-orange-50 text-[6px] font-bold text-orange-600">
              Pathao
            </div>
          </div>

          {/* YDM */}
          <div className="flex items-center gap-2 rounded border border-slate-100 bg-white px-2 py-1.5 shadow-sm">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[8px] font-bold text-red-600">
              Y
            </div>
            <div className="flex-1">
              <div className="mb-0.5 h-1.5 w-12 rounded bg-slate-200" />
              <div className="h-1 w-16 rounded bg-slate-100" />
            </div>
            <div className="flex h-2 w-8 items-center justify-center rounded bg-red-50 text-[6px] font-bold text-red-600">
              YDM
            </div>
          </div>

          {/* Dash */}
          <div className="flex items-center gap-2 rounded border border-slate-100 bg-white px-2 py-1.5 shadow-sm">
            <div className="text-primary flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 text-[8px] font-bold">
              D
            </div>
            <div className="flex-1">
              <div className="mb-0.5 h-1.5 w-12 rounded bg-slate-200" />
              <div className="h-1 w-16 rounded bg-slate-100" />
            </div>
            <div className="text-primary flex h-2 w-8 items-center justify-center rounded bg-indigo-50 text-[6px] font-bold">
              Dash
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsLogisticsSkeleton;
