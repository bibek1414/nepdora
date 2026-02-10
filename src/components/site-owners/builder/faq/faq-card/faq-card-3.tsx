import React, { useState } from "react";
import { FAQ } from "@/types/owner-site/admin/faq";

interface FAQCard3Props {
  faqs: FAQ[];
}

export const FAQCard3: React.FC<FAQCard3Props> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center text-center text-slate-800">
      <div className="mt-6 flex w-full max-w-2xl flex-col items-start gap-5 text-left">
        {faqs.map((faq, index) => (
          <div
            key={faq.id ?? index}
            className="flex w-full flex-col items-start"
          >
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded border border-indigo-100 p-5"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h2 className="text-base">{faq.question}</h2>
              <svg
                width="20"
                height="20"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}
              >
                <path
                  d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                  stroke="#1D293D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              className={`px-4 text-base text-slate-500 transition-all duration-500 ease-in-out ${
                openIndex === index
                  ? "max-h-[300px] translate-y-0 pt-4 opacity-100"
                  : "max-h-0 -translate-y-2 opacity-0"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
