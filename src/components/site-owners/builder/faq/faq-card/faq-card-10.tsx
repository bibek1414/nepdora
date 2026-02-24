import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/types/owner-site/admin/faq";
import { ChevronDown } from "lucide-react";

interface FAQCard10Props {
  faqs: FAQ[];
}

export const FAQCard10: React.FC<FAQCard10Props> = ({ faqs }) => {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.id || index}
          value={`item-${index}`}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white px-6 shadow-sm"
        >
          <AccordionTrigger className="py-5 text-left text-base font-medium text-gray-900 hover:no-underline sm:text-lg">
            {faq.question}
            <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200" />
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-base leading-relaxed text-gray-600">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
