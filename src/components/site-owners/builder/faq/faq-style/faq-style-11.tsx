import React, { useState } from "react";
import { FAQData } from "@/types/owner-site/components/faq";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ChevronDown } from "lucide-react";

interface FAQStyle11Props {
  data: FAQData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQData>) => void;
}

export const FAQStyle11: React.FC<FAQStyle11Props> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
  };

  const { data: faqsResponse, isLoading } = useFAQs();

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs =
    (Array.isArray(faqsResponse)
      ? faqsResponse
      : (faqsResponse as any)?.results || []
    )?.slice(0, 5) || [];

  const handleUpdate = (field: keyof FAQData) => (value: string | any) => {
    onUpdate?.({ [field]: value });
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-16 text-center">
          <EditableText
            value={data.title}
            as="h1"
            style={{ color: theme.colors.primary }}
            onChange={handleUpdate("title")}
            isEditable={isEditable}
          />
          <EditableText
            value={
              data.subtitle || "Everything you need to know about Nepglass."
            }
            onChange={handleUpdate("subtitle")}
            isEditable={isEditable}
            as="p"
            multiline
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mb-12 max-w-3xl space-y-4">
            {faqs.map((faq: any, index: number) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border bg-white transition-all duration-300"
                  style={{
                    borderColor: isOpen ? theme.colors.primary : "#E5E7EB",
                    boxShadow: isOpen
                      ? `0 4px 20px -5px ${theme.colors.primary}20`
                      : undefined,
                  }}
                >
                  <button
                    className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className="pr-8 text-lg font-semibold transition-colors duration-200"
                      style={{
                        color: isOpen ? theme.colors.primary : undefined,
                      }}
                    >
                      {faq.question}
                    </span>
                    <div className="ml-4 shrink-0 transition-transform duration-300">
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                        style={{
                          color: isOpen ? theme.colors.primary : "#9CA3AF",
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
        )}

        <div className="mt-12 text-center">
          <EditableLink
            text={data.buttonText || "View All FAQs"}
            href="/faq"
            onChange={(text, href) => {
              if (text !== undefined) handleUpdate("buttonText")(text);
            }}
            className="group inline-flex items-center justify-center text-lg font-semibold transition-all"
            style={{ color: theme.colors.primary }}
            isEditable={isEditable}
          >
            {data.buttonText || "View All FAQs"}
            <span className="ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </EditableLink>
        </div>
      </div>
    </section>
  );
};
