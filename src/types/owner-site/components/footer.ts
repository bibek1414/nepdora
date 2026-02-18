import { LucideIcon } from "lucide-react";

// Data structure for an individual link in a footer section
export interface FooterLink {
  id: string;
  text: string;
  href?: string;
}

// Data structure for a section of links (e.g., "Company", "Services")
export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

// Data structure for a social media link
export interface SocialLink {
  id: string;
  platform: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }> | LucideIcon;
}

// The complete data structure for the footer component's content
export interface FooterData {
  companyName: string;
  description: string;
  logoText: string;
  logoImage?: string;
  logoType: "text" | "image" | "both";
  sections: FooterSection[];
  socialLinks: SocialLink[];
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
  };
  copyright: string;
  policyLinks?: FooterLink[];
  style: string;
}

// The full footer object as stored in the database
export interface Footer {
  id: string;
  type: "footer";
  content: string;
  data: FooterData;
}

// API Response/Request Types
export interface GetFooterResponse {
  data: Footer | null;
  message: string;
}

export interface CreateFooterRequest {
  content: string;
  data: FooterData;
  component_id: string;
}

export interface CreateFooterResponse {
  data: Footer;
  message: string;
}

export interface UpdateFooterRequest {
  id: string;
  content?: string;
  data?: Partial<FooterData>;
}

export interface UpdateFooterResponse {
  data: Footer;
  message: string;
}

export interface DeleteFooterResponse {
  message: string;
}
