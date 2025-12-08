import React from "react";
import { motion } from "framer-motion";

const CrmSmallSkeleton = () => (
  <div className="flex h-full flex-col justify-center gap-2 p-3">
    {[1, 2, 3].map(i => (
      <motion.div
        key={i}
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: i * 0.2 }}
        className="flex items-center gap-2 rounded border border-slate-100 bg-white p-2 shadow-sm"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-500">
          {String.fromCharCode(64 + i)}
        </div>
        <div className="flex-1">
          <div className="mb-1 h-1.5 w-12 rounded bg-slate-200"></div>
          <div className="h-1 w-8 rounded bg-slate-100"></div>
        </div>
        {i === 1 && (
          <div className="ml-auto rounded bg-green-100 px-1 py-0.5 text-[8px] font-bold text-green-700">
            Lead
          </div>
        )}
      </motion.div>
    ))}
  </div>
);

export default CrmSmallSkeleton;
