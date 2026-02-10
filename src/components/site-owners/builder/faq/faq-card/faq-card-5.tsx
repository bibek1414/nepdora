import React from "react";
import { FAQ } from "@/types/owner-site/admin/faq";

interface FAQCard5Props {
  faqs: FAQ[];
}

export const FAQCard5: React.FC<FAQCard5Props> = ({ faqs }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* FAQ Items */}
        <div className="space-y-12">
          {faqs.map(faq => (
            <div key={faq.id}>
              <h2 className="text-heading-light dark:text-heading-dark text-xl font-bold">
                {faq.question}
              </h2>
              <p className="text-text-light-body dark:text-text-dark-body text-xs leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
