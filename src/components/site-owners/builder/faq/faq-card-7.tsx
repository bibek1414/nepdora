"use client";

import React, { useState, useMemo } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { FAQ } from "@/types/owner-site/admin/faq";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface FaqCard7Props {
  faqs: FAQ[];
  title?: string;
  titleItalic?: string;
  contactTitle?: string;
  contactDescription?: string;
  buttonText?: string;
  isEditable?: boolean;
  onTitleChange?: (title: string) => void;
  onTitleItalicChange?: (titleItalic: string) => void;
  onContactTitleChange?: (contactTitle: string) => void;
  onContactDescriptionChange?: (contactDescription: string) => void;
  onButtonTextChange?: (buttonText: string) => void;
}

export const FaqCard7: React.FC<FaqCard7Props> = ({
  faqs,
  title = "Friendly Asked",
  titleItalic = "Questions.",
  contactTitle = "Still have a question?",
  contactDescription = "Our team is ready to assist you with anything you need.",
  buttonText = "Make a Call",
  isEditable = false,
  onTitleChange,
  onTitleItalicChange,
  onContactTitleChange,
  onContactDescriptionChange,
  onButtonTextChange,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    faqs.length > 1 ? faqs[1].id : faqs.length > 0 ? faqs[0].id : null
  );
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#3C32E7",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  return (
    <section>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="mb-6 text-4xl font-semibold">
              {isEditable && onTitleChange ? (
                <EditableText
                  value={title}
                  onChange={onTitleChange}
                  as="span"
                  className="text-4xl font-semibold"
                  isEditable={true}
                  placeholder="Enter title..."
                />
              ) : (
                title
              )}{" "}
              <br />{" "}
              <span className="font-serif font-normal italic">
                {isEditable && onTitleItalicChange ? (
                  <EditableText
                    value={titleItalic}
                    onChange={onTitleItalicChange}
                    as="span"
                    className="font-serif font-normal italic"
                    isEditable={true}
                    placeholder="Enter italic title..."
                  />
                ) : (
                  titleItalic
                )}
              </span>
            </h2>

            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6">
              {isEditable && onContactTitleChange ? (
                <EditableText
                  value={contactTitle}
                  onChange={onContactTitleChange}
                  as="h4"
                  className="mb-2 text-lg font-bold"
                  isEditable={true}
                  placeholder="Enter contact title..."
                />
              ) : (
                <h4 className="mb-2 text-lg font-bold">{contactTitle}</h4>
              )}

              {isEditable && onContactDescriptionChange ? (
                <EditableText
                  value={contactDescription}
                  onChange={onContactDescriptionChange}
                  as="p"
                  className="mb-6 text-sm text-gray-500"
                  isEditable={true}
                  placeholder="Enter contact description..."
                  multiline={true}
                />
              ) : (
                <p className="mb-6 text-sm text-gray-500">
                  {contactDescription}
                </p>
              )}

              {isEditable && onButtonTextChange ? (
                <div className="relative inline-flex w-full">
                  <EditableText
                    value={buttonText}
                    onChange={onButtonTextChange}
                    as="span"
                    className="sr-only"
                    isEditable={true}
                    placeholder="Enter button text..."
                  />
                  <button
                    className="group flex w-full items-center justify-between rounded-full py-2 pr-2 pl-6 text-[15px] font-medium text-white shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.colors.primary,
                    }}
                  >
                    <span>{buttonText}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight
                        className="h-5 w-5"
                        style={{ color: theme.colors.primary }}
                      />
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  className="group flex w-full items-center justify-between rounded-full py-2 pr-2 pl-6 text-[15px] font-medium text-white shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.colors.primary,
                  }}
                >
                  <span>{buttonText}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight
                      className="h-5 w-5"
                      style={{ color: theme.colors.primary }}
                    />
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-0 lg:col-span-8">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === faq.id;
              const isLast = idx === faqs.length - 1;
              return (
                <div
                  key={faq.id}
                  className={`overflow-hidden bg-white transition-all duration-300 ${
                    !isLast ? "border-b border-gray-200" : ""
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === faq.id ? null : faq.id)
                    }
                    className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 rounded-full p-2 transition-all duration-300 ease-in-out ${
                        isOpen ? "bg-opacity-10" : "border bg-white"
                      }`}
                      style={{
                        backgroundColor: isOpen
                          ? `${theme.colors.primary}1A`
                          : "transparent",
                        borderColor: isOpen
                          ? "transparent"
                          : theme.colors.primary,
                        color: theme.colors.primary,
                      }}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 pt-0 text-sm leading-relaxed text-gray-500">
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
    </section>
  );
};
