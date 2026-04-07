"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ChevronRight } from "lucide-react";
import { FAQ } from "@/types/owner-site/admin/faq";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface FAQCard12Props {
  faqs: FAQ[];
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  isEditable?: boolean;
  onTitleChange?: (title: string) => void;
  onSubtitleChange?: (subtitle: string) => void;
  onButtonUpdate?: (text: string, href: string) => void;
}

export const FAQCard12: React.FC<FAQCard12Props> = ({
  faqs,
  title,
  subtitle,
  buttonText = "Get in touch",
  buttonLink = "#",
  isEditable = false,
  onTitleChange,
  onSubtitleChange,
  onButtonUpdate,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    faqs.length > 0 ? faqs[0].id : null
  );
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#ff6b4a",
      primaryForeground: "#ffffff",
      text: "#1a1a1a",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  };

  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-32 max-w-md"
            >
              <EditableText
                as="h2"
                value={title}
                onChange={onTitleChange || (() => {})}
                isEditable={isEditable}
                className="mb-8 text-5xl leading-tight font-medium tracking-tight md:text-7xl"
                style={{ fontFamily: theme.fonts.heading }}
                placeholder="You ask, \n we answer"
              />
              <EditableText
                as="p"
                value={subtitle || ""}
                onChange={onSubtitleChange || (() => {})}
                isEditable={isEditable}
                className="mb-10 text-lg leading-relaxed text-gray-600"
                placeholder="Enter description..."
                multiline={true}
              />

              <div className="relative z-30 inline-block">
                <EditableLink
                  text={buttonText}
                  href={buttonLink}
                  isEditable={isEditable}
                  onChange={onButtonUpdate || (() => {})}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-lg font-medium transition-all"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                >
                  {buttonText}
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </EditableLink>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Accordion) */}
          <div className="space-y-4 lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`overflow-hidden rounded-4xl border border-black/5 transition-all ${
                    isOpen ? "-md bg-white" : "bg-black/5 hover:bg-black/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                    className="flex w-full cursor-pointer items-center justify-between p-8 text-left"
                  >
                    <span className="pr-8 text-xl font-medium text-gray-950">
                      {faq.question}
                    </span>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? "text-white" : "bg-white text-black"
                      }`}
                      style={{
                        backgroundColor: isOpen
                          ? theme.colors.primary
                          : undefined,
                      }}
                    >
                      {isOpen ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="max-w-2xl px-8 pb-8 leading-relaxed text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
