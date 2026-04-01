import React from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Nepdora Website Intelligence?",
    answer: "It's the suite of data and insights provided by Nepdora about your online visibility, customer behavior, and competitor performance in your specific city.",
  },
  {
    question: "How does Nepdora optimize for Nepal's local market?",
    answer: "We integrate with local payment gateways like eSewa and Khalti, optimize for Nepali search queries, and provide local support to ensure your success.",
  },
  {
    question: "How can I launch my website in 10 minutes with Nepdora?",
    answer: "Our AI site wizard guides you through the process, setting up templates, content, and metadata optimized for your specific location and industry.",
  },
];

export const CityFAQ: React.FC = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h3 className="mb-16 text-center text-3xl font-normal text-slate-900">
           FAQ
        </h3>

        <div className="mx-auto max-w-4xl space-y-4">
            {faqItems.map((item, i) => (
                <div key={i} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-normal text-slate-900">{item.question}</h4>
                            <p className="mt-4 text-sm font-light leading-relaxed text-slate-500">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
