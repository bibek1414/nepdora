export interface ContactData {
  component_id?: string;
  component_type: "contact";
  style:
    | "contact-1"
    | "contact-2"
    | "contact-3"
    | "contact-4"
    | "contact-5"
    | "contact-6";
  title: string;
  subtitle?: string;
  description?: string;
  showPhone?: boolean;
  showEmail?: boolean;
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
  title: "Get in Touch",
  subtitle: "We'd love to hear from you",
  description: "Send us a message and we'll respond as soon as possible.",
  showPhone: true,
  showEmail: true,
  required_fields: {
    name: true,
    email: true,
    phone: false,
    message: true,
  },
  contact_info: {
    email: "hello@yourcompany.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
};

// Default data variations for different styles
export const defaultContact1Data: ContactData = {
  ...defaultContactData,
  style: "contact-1",
  title: "Contact Us",
  subtitle: "Get in touch with our team",
  description: "We're here to help and answer any questions you might have.",
};

export const defaultContact2Data: ContactData = {
  ...defaultContactData,
  style: "contact-2",
  title: "Let's Talk",
  subtitle: "Start a conversation",
  description:
    "Whether you have a question, feedback, or just want to say hello, we'd love to hear from you.",
};

export const defaultContact3Data: ContactData = {
  ...defaultContactData,
  style: "contact-3",
  title: "Send us a Message",
  subtitle: "We're always ready to help",
  description:
    "Fill out the form below and our team will get back to you within 24 hours.",
};

export const defaultContact4Data: ContactData = {
  ...defaultContactData,
  style: "contact-4",
  title: "Visit Our Location",
  subtitle: "Find us or get in touch",
  description: "Visit us in person or send us a message using the form below.",
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1523989318835!2d85.32596447536811!3d27.681684276197256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb192d0f057801%3A0x59809dfba777fb99!2sBaliyo%20Ventures!5e0!3m2!1sen!2snp!4v1757234557232!5m2!1sen!2snp",
};

export const defaultContact5Data: ContactData = {
  ...defaultContactData,
  style: "contact-5",
  title: "Start a new<br />project?",
  subtitle: undefined,
  description: undefined,
  contact_info: {
    email: "yourmail@mail.com\ndemomail@mail.com",
    phone: "+00 123 321 456\n+00 123 456 678",
    address: "Write Your Address here",
  },
};

export const defaultContact6Data: ContactData = {
  component_type: "contact",
  style: "contact-6",
  title: "Let Your Wanderlust Guide You",
  subtitle: "Contact Information",
  description:
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy text for decades. Reach out and let's make your next move seamless.",
  showPhone: true,
  showEmail: true,
  required_fields: {
    name: true,
    email: true,
    phone: false,
    message: true,
  },
  contact_info: {
    email: "hello@yourcompany.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
  image_url:
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2940&auto=format&fit=crop",
  image_alt: "Traveler smiling",
  cta_title: "Let's Do Great!",
  cta_subtitle:
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy.",
};
