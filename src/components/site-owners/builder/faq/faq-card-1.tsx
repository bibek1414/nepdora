import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/types/owner-site/admin/faq";

interface FAQCard1Props {
  faqs: FAQ[];
}

export const FAQCard1: React.FC<FAQCard1Props> = ({ faqs }) => {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.id}
          value={`item-${index}`}
          className="rounded-lg border border-gray-200 px-4"
        >
          <AccordionTrigger className="hover:text-primary text-left font-semibold text-gray-900 hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-gray-600">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
