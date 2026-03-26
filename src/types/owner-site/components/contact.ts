export interface ContactLocationCard {
  id: string;
  title: string;
  description: string;
}

export interface ContactLocationGalleryItem {
  id: string;
  label: string;
  image_url: string;
  image_alt?: string;
}

export interface ContactData {
  component_id?: string;
  component_type: "contact";
  style: "contact-1" | "contact-2" | "contact-3" | "contact-4";
  title: string;
  subtitle?: string;
  description?: string;
  contact_tag?: string;
  checklist?: string[];
  required_fields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    message: boolean;
  };
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  map_embed_url?: string;
  order?: number;
  image_url?: string;
  image_alt?: string;
  cta_title?: string;
  cta_subtitle?: string;
  button_label?: string;
  location_cards?: ContactLocationCard[];
  location_gallery?: ContactLocationGalleryItem[];
}

export interface ContactComponentData {
  id: string | number;
  component_id: string;
  component_type: "contact";
  data: ContactData;
  order?: number;
  page?: string;
}

// Contact form submission data
export interface ContactFormSubmission {
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
}

export const defaultContactData1: ContactData = {
  component_type: "contact",
  style: "contact-1",
  title: "Let Your Wanderlust Guide You",
  subtitle: "CONTACT INFORMATION",
  description: "",
  required_fields: {
    name: true,
    email: true,
    phone: true,
    message: true,
  },
  contact_info: {
    email: "",
    phone: "",
    address: "",
  },
  image_url:
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2940&auto=format&fit=crop",
  image_alt: "Traveler smiling",
  button_label: "Send Message",
};

export const defaultContactData2: ContactData = {
  component_type: "contact",
  style: "contact-2",
  title: "Remote Destinations Seeking Solitude",
  subtitle: "SUCCESS STORY",
  description:
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy text ever",
  checklist: [
    "Mistakes To Avoid",
    "Your Startup",
    "Knew About Fonts",
    "Knew About Fonts",
  ],
  required_fields: {
    name: true,
    email: true,
    phone: true,
    message: true,
  },
  contact_info: {
    email: "",
    phone: "",
    address: "",
  },
};

export const defaultContactData3: ContactData = {
  component_type: "contact",
  style: "contact-3",
  title: "Get In Touch",
  subtitle: "We'd love to hear from you. Please fill out this form.",
  description: "",
  cta_title: "Drop Us A Line",
  cta_subtitle: "Use the form below to get in touch with the sales team.",
  button_label: "Send Message",
  required_fields: {
    name: true,
    email: false,
    phone: true,
    message: true,
  },
  contact_info: {
    email: "",
    phone: "",
    address: "",
  },
};

export const defaultContactData4: ContactData = {
  component_type: "contact",
  style: "contact-4",
  title: "Get in touch",
  description:
    "Have a question about our collections or need help finding the perfect fit? We're here to help.",
  contact_info: {
    email: "hello@nepglass.com",
    phone: "+977 1-4000000",
    address: "Kathmandu, Nepal",
  },
  required_fields: {
    name: true,
    email: true,
    phone: true,
    message: true,
  },
  button_label: "Send Message",
};

export const DEFAULT_CONTACT_MAP: Record<ContactData["style"], ContactData> = {
  "contact-1": defaultContactData1,
  "contact-2": defaultContactData2,
  "contact-3": defaultContactData3,
  "contact-4": defaultContactData4,
};
