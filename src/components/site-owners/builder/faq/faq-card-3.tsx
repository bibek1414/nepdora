import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/types/owner-site/admin/faq";

interface FAQCard3Props {
  faqs: FAQ[];
}

export const FAQCard3: React.FC<FAQCard3Props> = ({ faqs }) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {faqs.map(faq => (
        <Card
          key={faq.id}
          className="group hover:border-primary/30 border border-gray-200 transition-all duration-300 hover:shadow-lg"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 group-hover:bg-primary/20 flex-shrink-0 rounded-full p-2 transition-colors duration-200">
                <HelpCircle className="text-primary h-5 w-5" />
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
                className="text-primary hover:text-primary hover:bg-primary/10 h-8 text-xs font-medium"
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
