import React from "react";
import { motion } from "framer-motion";

const TemplateSkeleton = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-50 p-2">
      <div className="grid h-full grid-cols-2 gap-2">
        {[
          "/fallback/image-not-found.png",
          "/fallback/image-not-found.png",
          "/fallback/image-not-found.png",
          "/fallback/image-not-found.png",
        ].map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className="relative aspect-square overflow-hidden rounded-lg border border-white shadow-sm"
          >
            <img
              src={src}
              alt="Template"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      {/* Overlay hint */}
      <div className="absolute inset-x-0 bottom-0 flex h-8 items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent pb-1">
        <span className="text-[9px] font-bold text-slate-400">
          View Gallery
        </span>
      </div>
    </div>
  );
};

export default TemplateSkeleton;
