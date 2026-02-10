"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronUp } from "lucide-react";
import { FAQ } from "@/types/owner-site/admin/faq";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface FaqCard8Props {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
  isEditable?: boolean;
  onTitleChange?: (title: string) => void;
  onSubtitleChange?: (subtitle: string) => void;
}

export const FaqCard8: React.FC<FaqCard8Props> = ({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Have questions? We're here to help.",
  isEditable = false,
  onTitleChange,
  onSubtitleChange,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    faqs.length > 0 ? faqs[0].id : null
  );

  const { data: themeData } = useThemeQuery();
  const theme = themeData?.data?.[0]?.data?.theme;
  const primaryColor = theme?.colors?.primary || "#1A4D2E";
  const secondaryColor = theme?.colors?.secondary || "#84CC16";

  const midPoint = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, midPoint);
  const rightFaqs = faqs.slice(midPoint);

  const renderFaqItem = (faq: FAQ) => {
    const isOpen = openIndex === faq.id;

    return (
      <div
        key={faq.id}
        className={`group overflow-hidden rounded-2xl transition-all duration-300 ${
          isOpen ? "bg-gray-50" : "bg-white"
        }`}
      >
        <button
          onClick={() => setOpenIndex(isOpen ? null : faq.id)}
          className="flex w-full items-center justify-between p-6 text-left"
        >
          <span
            className="text-lg font-medium"
            style={{ color: isOpen ? primaryColor : undefined }}
          >
            {faq.question}
          </span>
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              !isOpen
                ? "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                : "text-white"
            }`}
            style={{ backgroundColor: isOpen ? secondaryColor : undefined }}
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
    <div className="w-full">
      <div className="mb-12 text-center">
        {isEditable && onTitleChange ? (
          <EditableText
            value={title}
            onChange={onTitleChange}
            as="h2"
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: primaryColor }}
            isEditable={true}
            placeholder="Enter title..."
          />
        ) : (
          <h2
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: primaryColor }}
          >
            {title}
          </h2>
        )}
        {isEditable && onSubtitleChange ? (
          <EditableText
            value={subtitle}
            onChange={onSubtitleChange}
            as="p"
            className="mx-auto max-w-2xl text-lg text-gray-600"
            isEditable={true}
            placeholder="Enter subtitle..."
          />
        ) : (
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-4">{leftFaqs.map(renderFaqItem)}</div>
        <div className="flex flex-col gap-4">
          {rightFaqs.map(renderFaqItem)}
        </div>
      </div>
    </div>
  );
};
