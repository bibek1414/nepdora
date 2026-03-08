import React from "react";
import { FAQData } from "@/types/owner-site/components/faq";
import { EditableText } from "@/components/ui/editable-text";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { FAQCard11 } from "../faq-card/faq-card-11";

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
          <FAQCard11 faqs={faqs} theme={theme} />
        )}
      </div>
    </section>
  );
};
