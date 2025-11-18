export interface FAQData {
  component_id?: string;
  component_type: "faq";
  style: "faq-1" | "faq-2" | "faq-3" | "faq-4" | "faq-5";

  title: string;
  subtitle?: string;
  order?: number;
}

export interface FAQComponentData {
  id: string | number;
  component_id: string;
  component_type: "faq";
  data: FAQData;
  order?: number;
  page?: string;
}

export const defaultFAQData: FAQData = {
  component_type: "faq",
  style: "faq-1",
  title: "Frequently Asked Questions",
  subtitle: "Find answers to common questions about our services",
};
