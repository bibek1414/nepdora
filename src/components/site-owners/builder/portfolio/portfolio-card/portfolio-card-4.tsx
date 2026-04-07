import React from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Portfolio } from "@/types/owner-site/admin/portfolio";

export interface PortfolioCard4Props {
  portfolio: Portfolio;
  isActive: boolean;
  theme?: any;
  onMouseEnter: () => void;
  onClick: () => void;
}

export const PortfolioCard4: React.FC<PortfolioCard4Props> = ({
  portfolio,
  isActive,
  theme,
  onMouseEnter,
  onClick,
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-6 transition-opacity duration-300 md:p-8 ${
        isActive
          ? "border-gray-200 bg-white"
          : "border-transparent bg-transparent opacity-50 hover:bg-gray-50 hover:opacity-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <h3
          className="max-w-[85%] text-2xl leading-tight font-medium text-gray-950 transition-colors md:text-3xl"
          style={{ fontFamily: theme?.fonts?.heading }}
        >
          {portfolio.title}
        </h3>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors`}
          style={
            isActive
              ? {
                  backgroundColor: theme?.colors?.primary,
                  color: theme?.colors?.primaryForeground,
                }
              : {
                  backgroundColor: "transparent",
                  color: "black",
                  border: "1px solid #e5e7eb",
                }
          }
        >
          <Plus
            className={`h-5 w-5 transition-transform duration-300 ${isActive ? "rotate-45" : "rotate-0"}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isActive && portfolio.meta_description && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              marginTop: "1rem",
            }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <p
              className="line-clamp-3 text-lg leading-relaxed text-gray-600"
              style={{ fontFamily: theme?.fonts?.body }}
            >
              {portfolio.meta_description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
