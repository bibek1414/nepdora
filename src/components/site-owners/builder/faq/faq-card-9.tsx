"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronUp, Globe } from "lucide-react";
import { FAQ } from "@/types/owner-site/admin/faq";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";

interface FaqCard9Props {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
  leftImage1?: string;
  leftImage2?: string;
  leftImage3?: string;
  contactTitle?: string;
  contactDescription?: string;
  isEditable?: boolean;
  onTitleChange?: (title: string) => void;
  onSubtitleChange?: (subtitle: string) => void;
  onLeftImage1Change?: (url: string) => void;
  onLeftImage2Change?: (url: string) => void;
  onLeftImage3Change?: (url: string) => void;
}

export const FaqCard9: React.FC<FaqCard9Props> = ({
  faqs,
  title = "Wanderlust Chronicles Tales from Around",
  subtitle = "ASK QUESTION",
  leftImage1,
  leftImage2,
  leftImage3,
  isEditable = false,
  onTitleChange,
  onSubtitleChange,
  onLeftImage1Change,
  onLeftImage2Change,
  onLeftImage3Change,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    faqs.length > 0 ? faqs[0].id : null
  );
  const { data: themeData } = useThemeQuery();
  const theme = themeData?.data?.[0]?.data?.theme;
  const primaryColor = theme?.colors?.primary || "#1A4D2E";
  const secondaryColor = theme?.colors?.secondary || "#84CC16";

  // Show only first 4 FAQs
  const displayedFaqs = faqs.slice(0, 4);

  const defaultLeftImage1 =
    leftImage1 ||
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop";
  const defaultLeftImage2 =
    leftImage2 ||
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop";
  const defaultLeftImage3 =
    leftImage3 ||
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column - Images */}
        <div className="relative flex flex-col gap-4">
          {/* Main Large Image - Top */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-200">
            {isEditable && onLeftImage1Change ? (
              <EditableImage
                src={defaultLeftImage1}
                alt="FAQ Image 1"
                isEditable={true}
                onImageChange={onLeftImage1Change}
                className="h-90 w-full object-cover"
                width={800}
                height={450}
              />
            ) : (
              <Image
                src={defaultLeftImage1}
                alt="FAQ Image 1"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Two Images in a Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-200">
              {isEditable && onLeftImage2Change ? (
                <EditableImage
                  src={defaultLeftImage2}
                  alt="FAQ Image 2"
                  isEditable={true}
                  onImageChange={onLeftImage2Change}
                  className="h-70 w-full object-cover"
                  width={400}
                  height={400}
                />
              ) : (
                <Image
                  src={defaultLeftImage2}
                  alt="FAQ Image 2"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-200">
              {isEditable && onLeftImage3Change ? (
                <EditableImage
                  src={defaultLeftImage3}
                  alt="FAQ Image 3"
                  isEditable={true}
                  onImageChange={onLeftImage3Change}
                  className="h-70 w-full object-cover"
                  width={400}
                  height={400}
                />
              ) : (
                <Image
                  src={defaultLeftImage3}
                  alt="FAQ Image 3"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              {isEditable && onSubtitleChange ? (
                <EditableText
                  value={subtitle}
                  onChange={onSubtitleChange}
                  as="span"
                  className="text-sm font-bold tracking-wider uppercase"
                  style={{ color: primaryColor }}
                  isEditable={true}
                  placeholder="SUBTITLE..."
                />
              ) : (
                <span
                  className="text-sm font-bold tracking-wider uppercase"
                  style={{ color: primaryColor }}
                >
                  {subtitle}
                </span>
              )}
              {/* Squiggly Arrow SVG */}
              <svg
                width="40"
                height="10"
                viewBox="0 0 40 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: primaryColor }}
              >
                <path
                  d="M1 5C5 1 10 9 14 5C18 1 23 9 27 5C31 1 36 9 40 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M36 1L40 5L36 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {isEditable && onTitleChange ? (
              <EditableText
                value={title}
                onChange={onTitleChange}
                as="h2"
                className="text-4xl leading-tight font-bold md:text-5xl"
                style={{ color: primaryColor }}
                isEditable={true}
                placeholder="Enter title..."
              />
            ) : (
              <h2
                className="text-4xl leading-tight font-bold md:text-5xl"
                style={{ color: primaryColor }}
              >
                {title}
              </h2>
            )}
          </div>

          <div className="space-y-4">
            {displayedFaqs.map(faq => {
              const isOpen = openIndex === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-gray-200 bg-white shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
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
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        !isOpen
                          ? "bg-transparent text-gray-400 group-hover:text-gray-600"
                          : "text-white"
                      }`}
                      style={{
                        backgroundColor: isOpen ? secondaryColor : undefined,
                      }}
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
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
