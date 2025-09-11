import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQ } from "@/types/owner-site/faq";

interface FAQCard2Props {
  faqs: FAQ[];
}

export const FAQCard2: React.FC<FAQCard2Props> = ({ faqs }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

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
    <div className="space-y-4">
      {faqs.map(faq => (
        <Card
          key={faq.id}
          className="border border-gray-200 duration-200 hover:shadow-md"
        >
          <CardContent className="p-0">
            <button
              onClick={() => toggleItem(faq.id)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-gray-50"
            >
              <h3 className="pr-4 font-semibold text-gray-900">
                {faq.question}
              </h3>
              <div className="text-primary flex-shrink-0">
                {openItems.has(faq.id) ? (
                  <Minus className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </div>
            </button>
            {openItems.has(faq.id) && (
              <div className="px-6 pb-6">
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
