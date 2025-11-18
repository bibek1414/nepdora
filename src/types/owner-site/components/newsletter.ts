export interface NewsletterData {
  component_id?: string;
  component_type: "newsletter";
  style: "newsletter-1" | "newsletter-2" | "newsletter-3";
  title: string;
  subtitle?: string;
  description?: string;
  placeholder_text?: string;
  button_text: string;
  show_privacy_note?: boolean;
  privacy_note?: string;
  background_color?: string;
  text_color?: string;
  order?: number;
}

export interface NewsletterComponentData {
  id: string | number;
  component_id: string;
  component_type: "newsletter";
  data: NewsletterData;
  order?: number;
  page?: string;
}

// Newsletter subscription data
export interface NewsletterFormSubmission {
  email: string;
  is_subscribed?: boolean;
}

export const defaultNewsletterData: NewsletterData = {
  component_type: "newsletter",
  style: "newsletter-1",
  title: "Stay Updated",
  subtitle: "Subscribe to our newsletter",
  description:
    "Get the latest updates, news, and exclusive content delivered straight to your inbox.",
  placeholder_text: "Enter your email address",
  button_text: "Subscribe",
  show_privacy_note: true,
  privacy_note: "We respect your privacy. Unsubscribe at any time.",
  background_color: "#f8fafc",
  text_color: "#1e293b",
};

// Default data variations for different styles
export const defaultNewsletter1Data: NewsletterData = {
  ...defaultNewsletterData,
  style: "newsletter-1",
  title: "Newsletter Signup",
  subtitle: "Stay in the loop",
  description:
    "Subscribe to our newsletter for updates, tips, and exclusive content.",
};

export const defaultNewsletter2Data: NewsletterData = {
  ...defaultNewsletterData,
  style: "newsletter-2",
  title: "Join Our Community",
  subtitle: "Never miss an update",
  description:
    "Be the first to know about our latest news, product updates, and special offers.",
  background_color: "#1e293b",
  text_color: "#f8fafc",
};

export const defaultNewsletter3Data: NewsletterData = {
  ...defaultNewsletterData,
  style: "newsletter-3",
  title: "Get Weekly Insights",
  subtitle: "Expert tips delivered to your inbox",
  description:
    "Join thousands of professionals who trust us for industry insights and best practices.",
  show_privacy_note: false,
};
