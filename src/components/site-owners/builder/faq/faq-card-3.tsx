import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/types/owner-site/admin/faq";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface FAQCard3Props {
  faqs: FAQ[];
}

export const FAQCard3: React.FC<FAQCard3Props> = ({ faqs }) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
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

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {faqs.map(faq => (
        <Card
          key={faq.id}
          className="group hover:border-primary/30 border border-gray-200 transition-all duration-300"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full transition-colors duration-200">
                <HelpCircle
                  className="text-primary h-5 w-5"
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.heading,
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm leading-tight font-semibold text-gray-900">
                  {faq.question}
                </h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`transition-all duration-300 ${
                expandedCard === faq.id
                  ? "max-h-96 opacity-100"
                  : "max-h-20 opacity-60"
              } overflow-hidden`}
            >
              <p className="text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCard(faq.id)}
                className="h-8 text-xs font-medium"
                style={{
                  color: theme.colors.secondary,
                  fontFamily: theme.fonts.heading,
                }}
              >
                {expandedCard === faq.id ? (
                  <>
                    Show Less
                    <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read More
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
