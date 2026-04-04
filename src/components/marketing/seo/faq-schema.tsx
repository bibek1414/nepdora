import { JsonLd } from "@/components/shared/json-ld";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  id: string;
  faqs: FAQItem[];
}

export function FAQSchema({ id, faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd id={id} data={schema} />;
}
