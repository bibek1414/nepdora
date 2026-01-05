"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/super-admin/use-faq-category";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

const FAQSection: React.FC = () => {
  const { data: faqs, isLoading, error } = useFAQs();

  if (isLoading) {
    return (
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 space-y-4 text-center">
            <Skeleton className="mx-auto h-12 w-3/4" />
            <Skeleton className="mx-auto h-4 w-96" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-red-500">Failed to load FAQs.</p>
        </div>
      </section>
    );
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <div className="mb-2 text-5xl font-extrabold tracking-tight md:text-4xl">
            Frequently Asked Questions
          </div>
          <p className="text-muted-foreground text-sm">
            Everything you need to know about Nepdora
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={`item-${index}`}
              className="hover: rounded-lg border transition-shadow"
            >
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold hover:no-underline">
                {faq.question}
                <ChevronDown className="text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground px-6 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
