export interface FAQData {
  component_id?: string;
  component_type: "faq";
  style:
    | "faq-1"
    | "faq-2"
    | "faq-3"
    | "faq-4"
    | "faq-5"
    | "faq-6"
    | "faq-7"
    | "faq-8"
    | "faq-9"
    | "faq-10";

  title: string;
  subtitle?: string;
  order?: number;

  // Additional props for FAQ Card 6 & 9
  leftImage?: string;

  // Additional props for FAQ Card 10 (3 images)
  leftImage1?: string;
  leftImage2?: string;
  leftImage3?: string;

  // Additional props for FAQ Card 7 & 9 & 10
  titleItalic?: string;
  contactTitle?: string;
  contactDescription?: string;
  buttonText?: string;
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

export const DEFAULT_FAQ_MAP: Record<FAQData["style"], FAQData> = {
  "faq-1": { ...defaultFAQData, style: "faq-1" },
  "faq-2": { ...defaultFAQData, style: "faq-2" },
  "faq-3": { ...defaultFAQData, style: "faq-3" },
  "faq-4": { ...defaultFAQData, style: "faq-4" },
  "faq-5": { ...defaultFAQData, style: "faq-5" },
  "faq-6": { ...defaultFAQData, style: "faq-6" },
  "faq-7": { ...defaultFAQData, style: "faq-7" },
  "faq-8": { ...defaultFAQData, style: "faq-8" },
  "faq-9": { ...defaultFAQData, style: "faq-9" },
  "faq-10": { ...defaultFAQData, style: "faq-10" },
};
