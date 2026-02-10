import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQ } from "@/types/owner-site/admin/faq";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface FAQCard2Props {
  faqs: FAQ[];
}

export const FAQCard2: React.FC<FAQCard2Props> = ({ faqs }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {faqs.map(faq => (
        <Card
          key={faq.id}
          className="rounded-lg border border-gray-200 duration-200"
        >
          <CardContent className="p-0">
            <button
              onClick={() => toggleItem(faq.id)}
              className="flex w-full items-center justify-between p-2 text-left transition-colors duration-200 hover:bg-gray-50 sm:p-3 md:p-4"
            >
              <h3 className="pr-2 text-sm font-semibold text-gray-900 sm:pr-4 sm:text-base">
                {faq.question}
              </h3>
              <div className="text-primary flex-shrink-0">
                {openItems.has(faq.id) ? (
                  <Minus
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    style={{
                      color: theme.colors.primary,
                    }}
                  />
                ) : (
                  <Plus
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    style={{
                      color: theme.colors.primary,
                    }}
                  />
                )}
              </div>
            </button>
            {openItems.has(faq.id) && (
              <div className="px-2 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4">
                <div className="border-t border-gray-100 pt-2 sm:pt-3">
                  <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
