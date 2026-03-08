import React, { useState } from "react";
import { FAQ } from "@/types/owner-site/admin/faq";
import { ChevronDown } from "lucide-react";

interface FAQCard11Props {
  faqs: FAQ[];
  theme?: any;
}

export const FAQCard11: React.FC<FAQCard11Props> = ({ faqs, theme }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultTheme = {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
  };

  const currentTheme = theme || defaultTheme;

  return (
    <div className="mx-auto mb-12 max-w-3xl space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.id || index}
            className="overflow-hidden rounded-2xl border bg-white transition-all duration-300"
            style={{
              boxShadow: isOpen
                ? `0 4px 20px -5px ${currentTheme.colors.primary}20`
                : undefined,
            }}
          >
            <button
              className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="pr-8 text-lg font-semibold transition-colors duration-200">
                {faq.question}
              </span>
              <div className="ml-4 shrink-0 transition-transform duration-300">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  style={{
                    color: isOpen ? currentTheme.colors.primary : "#9CA3AF",
                  }}
                />
              </div>
            </button>

            <div
              className="transition-all duration-300 ease-in-out"
              style={{
                maxHeight: isOpen ? "500px" : "0",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="mt-2 border-t border-gray-100 px-6 pt-4 pb-6 leading-relaxed text-gray-500">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
