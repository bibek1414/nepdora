import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, CheckCircle2 } from "lucide-react";

const DomainSkeleton = () => {
  const [isCustom, setIsCustom] = useState(false);

  // Toggle domain state
  useEffect(() => {
    const timer = setInterval(() => setIsCustom(p => !p), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full flex-col bg-slate-50 p-3">
      {/* Browser Bar */}
      <div className="mb-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-500">
        <Globe
          size={12}
          className={isCustom ? "text-green-500" : "text-slate-400"}
        />
        <div className="relative h-4 flex-1 overflow-hidden">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isCustom ? -16 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 flex flex-col gap-1"
          >
            <span className="text-xs font-medium text-slate-400">
              nepdora.site/store
            </span>
            <span className="text-xs font-bold text-green-600">
              mystore.com
            </span>
          </motion.div>
        </div>
        {isCustom && <CheckCircle2 size={12} className="text-green-500" />}
      </div>

      {/* Page Preview (Consistent) */}
      <div className="flex-1 rounded border border-slate-200 bg-white p-2 opacity-80">
        <div className="mb-2 h-2 w-12 rounded bg-slate-200"></div>
        <div className="mb-2 h-10 w-full rounded bg-slate-100"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 rounded bg-slate-100"></div>
          <div className="h-8 rounded bg-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

export default DomainSkeleton;
