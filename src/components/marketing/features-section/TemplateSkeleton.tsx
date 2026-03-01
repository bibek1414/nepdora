import React from "react";
import { motion } from "framer-motion";

const TemplateSkeleton = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-50 p-2">
      <div className="grid h-full grid-cols-2 gap-2">
        {[
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=80",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&q=80",
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
