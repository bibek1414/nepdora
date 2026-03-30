"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ } from "@/types/owner-site/admin/faq";

interface FAQCard6Props {
  faqs: FAQ[];
  accentColor?: string;
}

export const FaqCard6: React.FC<FAQCard6Props> = ({
  faqs,
  accentColor = "#C97B63",
}) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  // Set initial active ID when faqs are loaded
  React.useEffect(() => {
    if (faqs.length > 0 && activeId === null) {
      setActiveId(faqs[0].id);
    }
  }, [faqs, activeId]);

  const activeFaq = faqs.find((f: FAQ) => f.id === activeId) || faqs[0];

  return (
    <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
      {/* Questions List */}
      <div className="flex h-full cursor-pointer flex-col justify-between lg:col-span-5">
        <div className="cursor-pointer divide-y divide-[#1A1A1A]/10">
          {faqs.map((faq: FAQ) => (
            <button
              key={faq.id}
              onClick={() => setActiveId(faq.id)}
              className={`group flex w-full items-center justify-between py-5 text-left transition-all duration-500 ${
                activeId === faq.id
                  ? "text-[#1A1A1A]"
                  : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
              }`}
            >
              <span className="cursor-pointer pr-6 font-serif text-sm leading-snug transition-colors duration-500 md:text-base lg:text-[1.05rem]">
                {faq.question}
              </span>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1A1A1A]/10 transition-all duration-700 ${
                  activeId === faq.id
                    ? "border-accent text-accent"
                    : "group-hover:border-accent/50 group-hover:text-accent text-[#1A1A1A]/30"
                }`}
                style={{
                  borderColor: activeId === faq.id ? accentColor : undefined,
                  color: activeId === faq.id ? accentColor : undefined,
                }}
              >
                <motion.div
                  animate={{
                    rotate: activeId === faq.id ? 0 : -45,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ArrowRight size={16} strokeWidth={1.2} />
                </motion.div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Answer Box */}
      <div className="h-full lg:col-span-7">
        <div className="flex h-full flex-col justify-center overflow-hidden rounded-lg bg-[#F5F0EB] p-8 md:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="mb-8 max-w-lg font-serif text-2xl leading-[1.15] text-[#1A1A1A] md:text-3xl lg:text-[2.25rem]">
                {activeFaq?.question}
              </h3>
              <div className="space-y-6">
                {activeFaq?.answer
                  .split("\n\n")
                  .map((para: string, i: number) => (
                    <p
                      key={i}
                      className="font-sans text-xs leading-[1.8] text-[#1A1A1A]/60 md:text-sm lg:text-[0.95rem]"
                    >
                      {para}
                    </p>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
