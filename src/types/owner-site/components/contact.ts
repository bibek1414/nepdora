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
  style:
    | "contact-1"
    | "contact-2"
    | "contact-3"
    | "contact-4"
    | "contact-5"
    | "contact-6"
    | "contact-7"
    | "contact-8"
    | "contact-9";
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

export const defaultContactData: ContactData = {
  component_type: "contact",
  style: "contact-1",
  title: "Contact Us",
  subtitle: "We'd love to hear from you",
  description: "Send us a message and we'll respond as soon as possible.",
  required_fields: {
    name: true,
    email: true,
    phone: false,
    message: true,
  },
  contact_info: {
    email: "contact@yourcompany.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
};

export const defaultContactData2: ContactData = {
  component_type: "contact",
  style: "contact-2",
  title: "Get in Touch",
  subtitle: "Our team is here to help",
  description: "Reach out to us for any inquiries or support.",
  required_fields: {
    name: true,
    email: true,
    phone: true,
    message: true,
  },
  contact_info: {
    email: "support@yourcompany.com",
    phone: "+1 (555) 987-6543",
    address: "456 Innovation Ave, Tech City, TC 67890",
  },
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767208",
};

export const defaultContactData3: ContactData = {
  component_type: "contact",
  style: "contact-3",
  title: "Let's Start a Conversation",
  subtitle: "We're ready to listen",
  description: "Fill out the form below and we'll get back to you shortly.",
  required_fields: {
    name: true,
    email: true,
    phone: false,
    message: true,
  },
  contact_info: {
    email: "hello@yourcompany.com",
    phone: "+1 (555) 555-5555",
    address: "789 Creative Blvd, Design District, DD 13579",
  },
};

export const defaultContactData4: ContactData = {
  component_type: "contact",
  style: "contact-4",
  title: "Visit Our Office",
  subtitle: "We look forward to seeing you",
  description: "Find us at our headquarters or send us a message online.",
  required_fields: {
    name: true,
    email: true,
    phone: true,
    message: true,
  },
  contact_info: {
    email: "info@yourcompany.com",
    phone: "+1 (555) 246-8101",
    address: "101 Corporate Dr, Business Park, BP 24680",
  },
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767208",
};

export const defaultContactData5: ContactData = {
  component_type: "contact",
  style: "contact-5",
  title: "Contact Support",
  subtitle: "24/7 Assistance",
  description: "Our support team is available around the clock to assist you.",
  required_fields: {
    name: true,
    email: true,
    phone: false,
    message: true,
  },
  contact_info: {
    email: "support@yourcompany.com",
    phone: "+1 (800) 123-4567",
  },
};

export const defaultContactData6: ContactData = {
  component_type: "contact",
  style: "contact-6",
  title: "Partner With Us",
  subtitle: "Let's build something great together",
  description: "Reach out to discuss partnership opportunities.",
  required_fields: {
    name: true,
    email: true,
    phone: true,
    message: true,
  },
  contact_info: {
    email: "partners@yourcompany.com",
    phone: "+1 (555) 999-8888",
    address: "555 Partnership Way, Collaboration City, CC 99999",
  },
  image_url:
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2940&auto=format&fit=crop",
  image_alt: "Traveler smiling",
  cta_title: "Let's Do Great!",
  cta_subtitle:
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy.",
};

export const defaultContactData7: ContactData = {
  component_type: "contact",
  style: "contact-7",
  title: "Office <em>Location</em>",
  subtitle: "[Visit Us]",
  description:
    "Our office is conveniently located in the heart of these cities, providing easy access for clients and partners.",
  contact_tag: "[Contact]",
  cta_title: "Drop Us a Message",
  cta_subtitle:
    "We're always happy to hear from you and will get back to you as soon as possible.",
  button_label: "Send Message",
  required_fields: {
    name: true,
    email: true,
    phone: false,
    message: true,
  },
  contact_info: {
    email: "contactinfo@gmail.com",
    phone: "+99 1234 5478",
    address: "See on Google Map",
  },
  location_cards: [
    {
      id: "usa-hq",
      title: "USA Headquarter",
      description: "Los Angeles, CA 90017<br/>United States",
    },
    {
      id: "eu-hq",
      title: "Europe Headquarter",
      description: "Ireland, County Dublin D02<br/>ABC1",
    },
  ],
  location_gallery: [
    {
      id: "dublin",
      label: "Dublin",
      image_url:
        "https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "los-angeles",
      label: "Los Angeles",
      image_url:
        "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "remote",
      label: "Remote",
      image_url:
        "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=1600&q=80",
    },
  ],
};

export const defaultContactData9: ContactData = {
  component_type: "contact",
  style: "contact-9",
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

export const defaultContactData8: ContactData = {
  component_type: "contact",
  style: "contact-8",
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

export const DEFAULT_CONTACT_MAP: Record<ContactData["style"], ContactData> = {
  "contact-1": defaultContactData,
  "contact-2": defaultContactData2,
  "contact-3": defaultContactData3,
  "contact-4": defaultContactData4,
  "contact-5": defaultContactData5,
  "contact-6": defaultContactData6,
  "contact-7": defaultContactData7,
  "contact-8": defaultContactData8,
  "contact-9": defaultContactData9,
};
