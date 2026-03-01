"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ } from "@/types/owner-site/admin/faq";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import Image from "next/image";

interface FAQCard6Props {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
  leftImage?: string;
  isEditable?: boolean;
  onTitleChange?: (title: string) => void;
  onSubtitleChange?: (subtitle: string) => void;
  onLeftImageChange?: (url: string) => void;
}

export const FaqCard6: React.FC<FAQCard6Props> = ({
  faqs,
  title = "Frequently Asked Question",
  subtitle = "You can look here question and answer.",
  leftImage,
  isEditable = false,
  onTitleChange,
  onSubtitleChange,
  onLeftImageChange,
}) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Default image if not provided
  const defaultLeftImage = leftImage || "/fallback/image-not-found.png";

  return (
    <section className="bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div
          className={`grid grid-cols-1 items-center gap-8 transition-all duration-700 ease-out lg:grid-cols-2 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {/* Left side - Image */}
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-xl shadow-2xl">
              {isEditable && onLeftImageChange ? (
                <EditableImage
                  src={defaultLeftImage}
                  alt="Professional coaching"
                  isEditable={true}
                  onImageChange={url => onLeftImageChange(url)}
                  className="h-full w-full object-cover"
                  width={600}
                  height={600}
                  placeholder={{
                    width: 600,
                    height: 600,
                    text: "Add image",
                  }}
                />
              ) : (
                <Image
                  src={defaultLeftImage}
                  alt="Professional coaching"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              {isEditable && onTitleChange ? (
                <EditableText
                  value={title}
                  onChange={onTitleChange}
                  as="p"
                  className="text-sm font-semibold tracking-wider text-blue-400 uppercase"
                  isEditable={true}
                  placeholder="Enter label..."
                />
              ) : (
                <p className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
                  {title}
                </p>
              )}

              {isEditable && onSubtitleChange ? (
                <EditableText
                  value={subtitle}
                  onChange={onSubtitleChange}
                  as="h2"
                  className="text-4xl leading-tight font-bold text-white lg:text-5xl"
                  isEditable={true}
                  placeholder="Enter subtitle..."
                  useHeadingFont={true}
                />
              ) : (
                <h2 className="text-4xl leading-tight font-bold text-white lg:text-5xl">
                  <span className="text-balance">{subtitle}</span>
                </h2>
              )}
            </div>

            {/* Accordion */}
            <div className="space-y-2 pt-4">
              {faqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`overflow-hidden rounded-2xl border-2 border-slate-600 transition-all duration-500 ease-out hover:border-slate-500 ${
                      isLoaded
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }`}
                    style={{
                      transitionDelay: isLoaded ? `${index * 100}ms` : "0ms",
                    }}
                  >
                    <button
                      onClick={() =>
                        setOpenId(openId === faq.id ? null : faq.id)
                      }
                      className="flex w-full items-center justify-between bg-transparent px-6 py-4 transition-all duration-300 hover:bg-slate-800/30"
                    >
                      <h3 className="text-left text-lg font-bold text-white">
                        {faq.question}
                      </h3>
                      <div className="ml-4 flex-shrink-0 transition-transform duration-500 ease-out">
                        {isOpen ? (
                          <Minus
                            className="h-8 w-8 text-white"
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Plus
                            className="h-8 w-8 text-white"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all ${
                        isOpen
                          ? "max-h-96 duration-700 ease-in-out"
                          : "max-h-0 duration-500 ease-out"
                      }`}
                    >
                      <div className="border-t border-slate-700 bg-slate-900/50 px-6 py-4">
                        <p
                          className={`text-base leading-relaxed text-slate-300 transition-all ${
                            isOpen
                              ? "opacity-100 delay-100 duration-700 ease-in-out"
                              : "opacity-0 duration-300 ease-out"
                          }`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
