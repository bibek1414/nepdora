export interface FAQData {
  component_id?: string;
  component_type: "faq";
  style: "accordion" | "plus-minus" | "card-grid" | "card-grid-4";
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
  style: "accordion",
  title: "Frequently Asked Questions",
  subtitle: "Find answers to common questions about our services",
};
