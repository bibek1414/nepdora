"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronUp } from "lucide-react";
import { FAQ } from "@/types/owner-site/admin/faq";

interface FaqCard8Props {
  faqs: FAQ[];
}

export const FaqCard8: React.FC<FaqCard8Props> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    faqs.length > 0 ? faqs[0].id : null
  );

  const midPoint = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, midPoint);
  const rightFaqs = faqs.slice(midPoint);

  const renderFaqItem = (faq: FAQ) => {
    const isOpen = openIndex === faq.id;

    return (
      <div
        key={faq.id}
        className={`group overflow-hidden rounded-2xl transition-all duration-300 ${
          isOpen ? "bg-[#F3F5F3]" : "bg-white"
        }`}
      >
        <button
          onClick={() => setOpenIndex(isOpen ? null : faq.id)}
          className="flex w-full items-center justify-between p-6 text-left"
        >
          <span
            className={`text-lg font-medium ${
              isOpen ? "text-[#1A4D2E]" : "text-gray-900"
            }`}
          >
            {faq.question}
          </span>
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              isOpen
                ? "bg-[#84CC16] text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
            }`}
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </span>
        </button>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6 leading-relaxed text-gray-600">
              {faq.answer}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="flex flex-col gap-4">{leftFaqs.map(renderFaqItem)}</div>
      <div className="flex flex-col gap-4">{rightFaqs.map(renderFaqItem)}</div>
    </div>
  );
};
