"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Search,
  X,
  Crown,
  Info,
  Menu,
  Package,
  Mail,
  Quote,
  FileText,
  ImageIcon,
  FolderOpen,
  Tag,
  ChevronRight,
  Star,
  Shield,
  Type,
  Navigation,
  Square,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavbarData } from "@/types/owner-site/components/navbar";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComponentClick: (componentId: string, template?: string) => void;
  onNavbarSelect?: (navbarData: NavbarData) => void;
  onFooterSelect?: (
    footerStyle:
      | "style-1"
      | "style-2"
      | "style-3"
      | "style-4"
      | "style-5"
      | "style-6"
  ) => void;
  websiteType?: string;
}

type ComponentItem = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  keywords?: string[];
  description?: string;
  hasTemplates?: boolean;
  templates?: TemplateItem[];
  popular?: boolean;
  type?: "section" | "navbar" | "footer";
  hideForService?: boolean;
  showForWebsiteTypes?: string[];
};

type TemplateItem = {
  id: string;
  name: string;
  image: string;
  description?: string;
  showForWebsiteTypes?: string[];
};

export const AddSectionDialog: React.FC<AddSectionDialogProps> = ({
  open,
  onOpenChange,
  onComponentClick,
  onNavbarSelect,
  onFooterSelect,
  websiteType = "ecommerce", // Default to ecommerce for backward compatibility
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const templates = {
    hero: [
      {
        id: "hero-1",
        name: "Hero Style 1",
        image: "/images/site-owners/hero/hero1.png",
      },
      {
        id: "hero-2",
        name: "Hero Style 2",
        image: "/images/site-owners/hero/hero2.png",
      },
      {
        id: "hero-3",
        name: "Hero Style 3",
        image: "/images/site-owners/hero/hero3.png",
      },
      {
        id: "hero-4",
        name: "Hero Style 4",
        image: "/images/site-owners/hero/hero4.png",
      },
      {
        id: "hero-5",
        name: "Hero Style 5",
        image: "/images/site-owners/hero/hero5.png",
      },
      {
        id: "hero-6",
        name: "Hero Style 6",
        image: "/images/site-owners/hero/hero6.png",
      },
      {
        id: "hero-7",
        name: "Hero Style 7",
        image: "/images/site-owners/hero/hero7.png",
      },
      {
        id: "hero-8",
        name: "Hero Style 8",
        image: "/images/site-owners/hero/hero8.png",
      },
      {
        id: "hero-9",
        name: "Hero Style 9",
        image: "/images/site-owners/hero/hero9.png",
      },
      {
        id: "hero-10",
        name: "Hero Style 10",
        image: "/images/site-owners/hero/hero10.png",
      },
      {
        id: "hero-11",
        name: "Hero Style 11",
        image: "/images/site-owners/hero/hero11.png",
      },
      {
        id: "hero-12",
        name: "Hero Style 12",
        image: "/images/site-owners/hero/hero12.png",
      },
      {
        id: "hero-13",
        name: "Hero Style 13",
        image: "/images/site-owners/hero/hero13.png",
      },
      {
        id: "hero-14",
        name: "Hero Style 14",
        image: "/images/site-owners/hero/hero14.png",
      },
    ],
    cta: [
      {
        id: "cta-1",
        name: "CTA Style 1",
        image: "/images/site-owners/cta/cta1.png",
        description: "Clean and modern CTA with centered layout",
      },
      {
        id: "cta-2",
        name: "CTA Style 2",
        image: "/images/site-owners/cta/cta2.png",
        description: "Gradient background with badge",
      },
      {
        id: "cta-3",
        name: "CTA Style 3",
        image: "/images/site-owners/cta/cta3.png",
        description: "Card-style CTA with feature icons",
      },
      {
        id: "cta-4",
        name: "CTA Style 4",
        image: "/images/site-owners/cta/cta4.png",
        description: "Image-based CTA with feature icons",
      },
    ],
    appointment: [
      {
        id: "appointment-1",
        name: "Appointment Style 1",
        image: "/images/site-owners/appointment/appointment1.png",
      },
      {
        id: "appointment-2",
        name: "Appointment Style 2",
        image: "/images/site-owners/appointment/appointment2.png",
      },
      {
        id: "appointment-3",
        name: "Appointment Style 3",
        image: "/images/site-owners/appointment/appointment3.png",
      },
    ],
    about: [
      {
        id: "about-1",
        name: "About Style 1",
        image: "/images/site-owners/about/about1.png",
      },
      {
        id: "about-2",
        name: "About Style 2",
        image: "/images/site-owners/about/about2.png",
      },
      {
        id: "about-3",
        name: "About Style 3",
        image: "/images/site-owners/about/about3.png",
      },
      {
        id: "about-4",
        name: "About Style 4",
        image: "/images/site-owners/about/about4.png",
      },
      {
        id: "about-5",
        name: "About Style 5",
        image: "/images/site-owners/about/about5.png",
      },
      {
        id: "about-6",
        name: "About Style 6",
        image: "/images/site-owners/about/about6.png",
      },
      {
        id: "about-7",
        name: "About Style 7",
        image: "/images/site-owners/about/about7.png",
      },
      {
        id: "about-8",
        name: "About Style 8",
        image: "/images/site-owners/about/about8.png",
      },
      {
        id: "about-9",
        name: "About Style 9",
        image: "/images/site-owners/about/about9.png",
      },
      {
        id: "about-10",
        name: "About Style 10",
        image: "/images/site-owners/about/about10.png",
      },
      {
        id: "about-11",
        name: "About Style 11",
        image: "/images/site-owners/about/about11.png",
      },
      {
        id: "about-12",
        name: "About Style 12",
        image: "/images/site-owners/about/about12.png",
      },
      {
        id: "about-13",
        name: "About Style 13",
        image: "/images/site-owners/about/about13.png",
      },
      {
        id: "about-14",
        name: "About Style 14",
        image: "/images/site-owners/about/about14.png",
      },
    ],
    products: [
      {
        id: "product-1",
        name: "Product Grid 1",
        image: "/images/site-owners/products/product1.png",
      },
      {
        id: "product-2",
        name: "Product Grid 2",
        image: "/images/site-owners/products/product2.png",
      },
      {
        id: "product-3",
        name: "Product List",
        image: "/images/site-owners/products/product3.png",
      },
      {
        id: "product-4",
        name: "Product Style 4",
        image: "/images/site-owners/products/product4.png",
      },
      {
        id: "product-5",
        name: "Product Style 5",
        image: "/images/site-owners/products/product5.png",
      },
      {
        id: "product-6",
        name: "Product Style 6",
        image: "/images/site-owners/products/product6.png",
      },
      {
        id: "product-7",
        name: "Product Grid 7",
        image: "/images/site-owners/products/product2.png",
      },
    ],
    category: [
      {
        id: "category-1",
        name: "Category Grid 1",
        image: "/images/site-owners/categories/category1.png",
      },
      {
        id: "category-2",
        name: "Category Grid 2",
        image: "/images/site-owners/categories/category2.png",
      },
      {
        id: "category-3",
        name: "Category List",
        image: "/images/site-owners/categories/category3.png",
      },
      {
        id: "category-4",
        name: "Category Style 4",
        image: "/images/site-owners/categories/category4.png",
      },
      {
        id: "category-5",
        name: "Category Style 5",
        image: "/images/site-owners/categories/category5.png",
      },
    ],
    subcategory: [
      {
        id: "subcategory-1",
        name: "SubCategory Grid 1",
        image: "/images/site-owners/subcategories/subcategory1.png",
      },
      {
        id: "subcategory-2",
        name: "SubCategory Grid 2",
        image: "/images/site-owners/subcategories/subcategory2.png",
      },
      {
        id: "subcategory-3",
        name: "SubCategory List",
        image: "/images/site-owners/subcategories/subcategory3.png",
      },
    ],
    services: [
      {
        id: "services-1",
        name: "Services Grid 1",
        image: "/images/site-owners/services/services-1.png",
      },
      {
        id: "services-2",
        name: "Services Grid 2",
        image: "/images/site-owners/services/services-2.png",
      },
      {
        id: "services-3",
        name: "Services List",
        image: "/images/site-owners/services/services-3.png",
      },
      {
        id: "services-4",
        name: "Services Style 4",
        image: "/images/site-owners/services/services-4.png",
      },
      {
        id: "services-5",
        name: "Services Style 5",
        image: "/images/site-owners/services/services-5.png",
      },
    ],
    contact: [
      {
        id: "contact-1",
        name: "Contact Form 1",
        image: "/images/site-owners/contact/contact1.png",
      },
      {
        id: "contact-2",
        name: "Contact Form 2",
        image: "/images/site-owners/contact/contact2.png",
      },
      {
        id: "contact-3",
        name: "Contact Form 3",
        image: "/images/site-owners/contact/contact3.png",
      },
      {
        id: "contact-4",
        name: "Contact Form 4",
        image: "/images/site-owners/contact/contact4.png",
      },
      {
        id: "contact-5",
        name: "Contact Form 5",
        image: "/images/site-owners/contact/contact5.png",
      },
      {
        id: "contact-6",
        name: "Contact Form 6",
        image: "/images/site-owners/contact/contact6.png",
      },
    ],
    testimonials: [
      {
        id: "testimonial-1",
        name: "Testimonials Grid",
        image: "/images/site-owners/testimonials/testimonial1.png",
      },
      {
        id: "testimonial-2",
        name: "Testimonials Carousel",
        image: "/images/site-owners/testimonials/testimonial2.png",
      },
      {
        id: "testimonial-3",
        name: "Testimonials Cards",
        image: "/images/site-owners/testimonials/testimonial3.png",
      },
      {
        id: "testimonial-4",
        name: "Testimonials Style 4",
        image: "/images/site-owners/testimonials/testimonial4.png",
      },
      {
        id: "testimonial-5",
        name: "Testimonials Style 5",
        image: "/images/site-owners/testimonials/testimonial5.png",
      },
      {
        id: "testimonial-6",
        name: "Testimonials Style 6",
        image: "/images/site-owners/testimonials/testimonial6.png",
      },
      {
        id: "testimonial-7",
        name: "Testimonials Style 7",
        image: "/images/site-owners/testimonials/testimonial7.png",
      },
      {
        id: "testimonial-8",
        name: "Testimonials Style 8",
        image: "/images/site-owners/testimonials/testimonial8.png",
      },
      {
        id: "testimonial-9",
        name: "Testimonials Style 9",
        image: "/images/site-owners/testimonials/testimonial9.png",
      },
    ],
    team: [
      {
        id: "team-1",
        name: "Team Grid",
        image: "/images/site-owners/team/team1.png",
      },
      {
        id: "team-2",
        name: "Team Cards",
        image: "/images/site-owners/team/team2.png",
      },
      {
        id: "team-3",
        name: "Team List",
        image: "/images/site-owners/team/team3.png",
      },
      {
        id: "team-4",
        name: "Team Style 4",
        image: "/images/site-owners/team/team4.png",
      },
      {
        id: "team-5",
        name: "Team Style 5",
        image: "/images/site-owners/team/team5.png",
      },
    ],
    gallery: [
      {
        id: "gallery-1",
        name: "Gallery Grid",
        image: "/images/site-owners/gallery/gallery1.png",
      },
      {
        id: "gallery-2",
        name: "Gallery Masonry",
        image: "/images/site-owners/gallery/gallery2.png",
      },
      {
        id: "gallery-3",
        name: "Gallery Carousel",
        image: "/images/site-owners/gallery/gallery3.png",
      },
      {
        id: "gallery-4",
        name: "Gallery Style 4",
        image: "/images/site-owners/gallery/gallery4.png",
      },
      {
        id: "gallery-5",
        name: "Gallery Style 5",
        image: "/images/site-owners/gallery/gallery5.png",
      },
      {
        id: "gallery-6",
        name: "Gallery Style 6",
        image: "/images/site-owners/gallery/gallery6.png",
      },
    ],
    banner: [
      {
        id: "banner-1",
        name: "Banner Style 1",
        image: "/images/site-owners/banner/banner1.png",
      },
      {
        id: "banner-2",
        name: "Banner Style 2",
        image: "/images/site-owners/banner/banner2.png",
      },
      {
        id: "banner-3",
        name: "Banner Style 3",
        image: "/images/site-owners/banner/banner3.png",
      },
      {
        id: "banner-4",
        name: "Banner Style 4",
        image: "/images/site-owners/banner/banner4.png",
      },
    ],
    blog: [
      {
        id: "blog-1",
        name: "Blog Style 1",
        image: "/images/site-owners/blogs/blog1.png",
      },
      {
        id: "blog-2",
        name: "Blog Style 2",
        image: "/images/site-owners/blogs/blog2.png",
      },
      {
        id: "blog-3",
        name: "Blog Style 3",
        image: "/images/site-owners/blogs/blog3.png",
      },
      {
        id: "blog-4",
        name: "Blog Style 4",
        image: "/images/site-owners/blogs/blog4.png",
      },
      {
        id: "blog-5",
        name: "Blog Style 5",
        image: "/images/site-owners/blogs/blog5.png",
      },
    ],
    faq: [
      {
        id: "faq-1",
        name: "FAQ Style 1",
        image: "/images/site-owners/faq/faq-1.png",
      },
      {
        id: "faq-2",
        name: "FAQ Style 2",
        image: "/images/site-owners/faq/faq-2.png",
      },
      {
        id: "faq-3",
        name: "FAQ Style 3",
        image: "/images/site-owners/faq/faq-3.png",
      },
      {
        id: "faq-4",
        name: "FAQ Style 4",
        image: "/images/site-owners/faq/faq-4.png",
      },
      {
        id: "faq-5",
        name: "FAQ Style 5",
        image: "/images/site-owners/faq/faq-5.png",
      },
      {
        id: "faq-6",
        name: "FAQ Style 6",
        image: "/images/site-owners/faq/faq-6.png",
      },
      {
        id: "faq-7",
        name: "FAQ Style 7",
        image: "/images/site-owners/faq/faq-7.png",
      },
    ],
    portfolio: [
      {
        id: "portfolio-1",
        name: "Portfolio Style 1",
        image: "/images/site-owners/portfolio/portfolio1.png",
      },
      {
        id: "portfolio-2",
        name: "Portfolio Style 2",
        image: "/images/site-owners/portfolio/portfolio2.png",
      },
      {
        id: "portfolio-3",
        name: "Portfolio Style 3",
        image: "/images/site-owners/portfolio/portfolio3.png",
      },
      {
        id: "portfolio-4",
        name: "Portfolio Style 4",
        image: "/images/site-owners/portfolio/portfolio4.png",
      },
    ],
    newsletter: [
      {
        id: "newsletter-1",
        name: "Newsletter Style 1",
        image: "/images/site-owners/newsletter/newsletter1.png",
      },
      {
        id: "newsletter-2",
        name: "Newsletter Style 2",
        image: "/images/site-owners/newsletter/newsletter2.png",
      },
      {
        id: "newsletter-3",
        name: "Newsletter Style 3",
        image: "/images/site-owners/newsletter/newsletter3.png",
      },
    ],
    youtube: [
      {
        id: "youtube-1",
        name: "YouTube Style 1",
        image: "/images/site-owners/youtube/youtube-1.png",
      },
      {
        id: "youtube-2",
        name: "YouTube Style 2",
        image: "/images/site-owners/youtube/youtube-2.png",
      },
      {
        id: "youtube-3",
        name: "YouTube Style 3",
        image: "/images/site-owners/youtube/youtube-3.png",
      },
    ],
    policies: [
      {
        id: "policies-1",
        name: "Policy Layout 1",
        image: "/images/site-owners/policies/policy1.png",
        description: "Clean policy layout with sidebar navigation",
      },
    ],
    pricing: [
      {
        id: "pricing-1",
        name: "Pricing Style 1",
        image: "/images/site-owners/pricing/pricing1.png",
      },
      {
        id: "pricing-2",
        name: "Pricing Style 2",
        image: "/images/site-owners/pricing/pricing2.png",
      },
      {
        id: "pricing-3",
        name: "Pricing Style 3",
        image: "/images/site-owners/pricing/pricing3.png",
      },
    ],
    text_editor: [
      {
        id: "text-editor-1",
        name: "Text Editor Layout 1",
        image: "/images/site-owners/text-editor/text1.png",
        description: "Clean text layout with proper typography",
      },
    ],
    // NAVBAR TEMPLATES
    navbar: [
      {
        id: "navbar-1",
        name: "Navbar Style 1",
        image: "/images/site-owners/navbars/navbar1.png",
        description: "Simple navbar with logo and navigation links",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-2",
        name: "Navbar Centered Logo",
        image: "/images/site-owners/navbars/navbar2.png",
        description: "Centered logo with navigation on sides",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-3",
        name: "Navbar with Search",
        image: "/images/site-owners/navbars/navbar3.png",
        description: "Includes search functionality",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-4",
        name: "Navbar with Categories",
        image: "/images/site-owners/navbars/navbar4.png",
        description: "Dropdown categories for e-commerce",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-5",
        name: "E-commerce Navbar",
        image: "/images/site-owners/navbars/navbar5.png",
        description: "Full e-commerce navigation with cart",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-6",
        name: "E-commerce with Top Bar",
        image: "/images/site-owners/navbars/navbar6.png",
        description: "Includes top bar for announcements",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-7",
        name: "E-commerce with Social Links",
        image: "/images/site-owners/navbars/navbar7.png",
        description: "Includes Social media links in top bar",
        showForWebsiteTypes: ["ecommerce"],
      },
      {
        id: "navbar-8",
        name: "Navbar with social links",
        image: "/images/site-owners/navbars/navbar8.png",
        description: "Includes search functionality",
      },
      {
        id: "navbar-9",
        name: "Minimal Navbar",
        image: "/images/site-owners/navbars/navbar9.png",
        description: "Clean and minimal navbar design",
      },
    ],
    // FOOTER TEMPLATES
    footer: [
      {
        id: "footer-1",
        name: "Footer Style 1",
        image: "/images/site-owners/footers/footer1.png",
        description: "Simple footer with links and copyright",
      },
      {
        id: "footer-2",
        name: "Footer Style 2",
        image: "/images/site-owners/footers/footer2.png",
        description: "Multi-column footer with social links",
      },
      {
        id: "footer-3",
        name: "Footer Style 3",
        image: "/images/site-owners/footers/footer3.png",
        description: "Modern footer with newsletter signup",
      },
      {
        id: "footer-4",
        name: "Footer Style 4",
        image: "/images/site-owners/footers/footer4.png",
        description: "E-commerce footer with categories",
      },
      {
        id: "footer-5",
        name: "Footer Style 5",
        image: "/images/site-owners/footers/footer5.png",
        description: "Minimal footer with centered content",
      },
      {
        id: "footer-6",
        name: "Footer Style 6",
        image: "/images/site-owners/footers/footer6.png",
        description: "Complex footer with multiple sections",
      },
      {
        id: "footer-7",
        name: "Footer Style 7",
        image: "/images/site-owners/footers/footer7.png",
        description: "Footer with social media links",
      },
    ],
  };

  // Define which templates to show in the "All Templates" view based on website type
  const getDefaultTemplates = () => {
    const baseTemplates = [
      "newsletter-3",
      "youtube-1",
      "hero-1",
      "about-1",
      "contact-1",
      "policies-1",
      "text-editor-1",
      "navbar-1",
      "navbar-1",
      "footer-1",
      "pricing-1",
    ];

    // Add website-type specific templates
    switch (websiteType) {
      case "ecommerce":
        return [...baseTemplates, "products-1", "category-1", "testimonials-1"];
      case "service":
        return [...baseTemplates, "services-1", "team-1", "testimonials-1"];

      default:
        return baseTemplates;
    }
  };

  const default_templates = getDefaultTemplates();

  const navbarComponent: ComponentItem = {
    id: "navbar-sections",
    label: "Navbar",
    icon: Navigation,
    keywords: ["header", "navigation", "menu", "nav"],
    hasTemplates: true,
    templates: templates.navbar,
    popular: true,
    type: "navbar",
  };

  const footerComponent: ComponentItem = {
    id: "footer-sections",
    label: "Footer",
    icon: Square,
    keywords: ["bottom", "links", "copyright", "social"],
    description: "Site footer with multiple layout options",
    hasTemplates: true,
    templates: templates.footer,
    popular: true,
    type: "footer",
  };

  const baseComponents: ComponentItem[] = [
    {
      id: "about-sections",
      label: "About Us",
      icon: Info,
      keywords: ["company", "who we are", "story", "mission"],
      hasTemplates: true,
      templates: templates.about,
      popular: true,
      type: "section",
    },
    {
      id: "appointment-sections",
      label: "Appointment",
      icon: Calendar,
      keywords: ["form", "email", "reach", "message"],
      hasTemplates: true,
      templates: templates.appointment,
      type: "section",
    },
    {
      id: "banner-sections",
      label: "Banner",
      icon: ImageIcon,
      keywords: ["banner", "slider", "promotion", "ad"],
      hasTemplates: true,
      templates: templates.banner,
      type: "section",
    },
    {
      id: "blog-sections",
      label: "Blog",
      icon: FileText,
      keywords: ["articles", "posts", "news", "updates"],
      hasTemplates: true,
      templates: templates.blog,
      type: "section",
    },
    {
      id: "cta-sections",
      label: "Call to Action",
      icon: Type,
      keywords: ["cta", "call to action", "button", "action", "conversion"],
      hasTemplates: true,
      templates: templates.cta,
      popular: true,
      type: "section",
    },
    {
      id: "categories-sections",
      label: "Categories",
      icon: FolderOpen,
      keywords: ["category", "taxonomy", "organization", "groups"],
      hasTemplates: true,
      templates: templates.category,
      type: "section",
      showForWebsiteTypes: ["ecommerce"],
    },
    {
      id: "contact-sections",
      label: "Contact",
      icon: Mail,
      keywords: ["form", "email", "reach", "message"],
      hasTemplates: true,
      templates: templates.contact,
      type: "section",
    },
    {
      id: "faq-sections",
      label: "FAQ",
      icon: Info,
      keywords: ["questions", "help", "support", "answers"],
      hasTemplates: true,
      templates: templates.faq,
      type: "section",
    },
    {
      id: "gallery-sections",
      label: "Gallery",
      icon: ImageIcon,
      keywords: ["images", "photos", "media", "pictures"],
      hasTemplates: true,
      templates: templates.gallery,
      type: "section",
    },
    {
      id: "hero-sections",
      label: "Hero Section",
      icon: Crown,
      keywords: ["banner", "top section", "intro", "welcome"],
      hasTemplates: true,
      templates: templates.hero,
      popular: true,
      type: "section",
    },
    {
      id: "newsletter-sections",
      label: "Newsletter",
      icon: Mail,
      keywords: ["subscribe", "email", "updates", "mailing"],
      hasTemplates: true,
      templates: templates.newsletter,
      type: "section",
    },
    {
      id: "policies-sections",
      label: "Policies",
      icon: Shield,
      keywords: ["return", "shipping", "privacy", "terms", "policy"],
      hasTemplates: true,
      templates: templates.policies,
      popular: true,
      type: "section",
    },
    {
      id: "portfolio-sections",
      label: "Portfolio",
      icon: FolderOpen,
      keywords: ["projects", "work", "showcase", "gallery"],
      hasTemplates: true,
      templates: templates.portfolio,
      type: "section",
    },
    {
      id: "pricing-sections",
      label: "Pricing",
      icon: DollarSign,
      keywords: ["pricing", "plans", "cost", "subscription"],
      hasTemplates: true,
      templates: templates.pricing,
      popular: true,
      type: "section",
    },
    {
      id: "products-sections",
      label: "Products",
      icon: Package,
      keywords: ["catalog", "shop", "items", "store"],
      hasTemplates: true,
      templates: templates.products,
      popular: true,
      type: "section",
      hideForService: true,
    },
    {
      id: "services-sections",
      label: "Services",
      icon: Menu,
      keywords: ["what we do", "features", "offerings", "service"],
      hasTemplates: true,
      templates: templates.services,
      popular: true,
      type: "section",
    },
    {
      id: "subcategories-sections",
      label: "SubCategories",
      icon: Tag,
      keywords: ["subcategory", "nested", "subgroups"],
      hasTemplates: true,
      templates: templates.subcategory,
      type: "section",
      showForWebsiteTypes: ["ecommerce"],
    },
    {
      id: "team-members-sections",
      label: "Team Members",
      icon: Crown,
      keywords: ["employees", "staff", "team", "people"],
      hasTemplates: true,
      templates: templates.team,
      type: "section",
    },
    {
      id: "testimonials-sections",
      label: "Testimonials",
      icon: Quote,
      keywords: ["reviews", "clients", "feedback", "ratings"],
      hasTemplates: true,
      templates: templates.testimonials,
      type: "section",
    },
    {
      id: "text-editor-sections",
      label: "Text Editor",
      icon: Type,
      keywords: ["editor", "content", "text", "rich text", "custom"],
      hasTemplates: true,
      templates: templates.text_editor,
      popular: true,
      type: "section",
    },
    {
      id: "youtube-sections",
      label: "YouTube",
      icon: ImageIcon,
      keywords: ["video", "embed", "media", "youtube"],
      hasTemplates: true,
      templates: templates.youtube,
      type: "section",
    },
  ];

  const components: ComponentItem[] = [
    navbarComponent,
    ...[...baseComponents].sort((a, b) => a.label.localeCompare(b.label)),
    footerComponent,
  ];

  // Filter components based on website type
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      // If showForWebsiteTypes is defined, only show for those specific types
      if (component.showForWebsiteTypes) {
        return component.showForWebsiteTypes.includes(websiteType);
      }

      // If hideForService is true and websiteType is "service", hide it
      if (component.hideForService && websiteType === "service") {
        return false;
      }

      // Otherwise, show the component
      return true;
    });
  }, [websiteType]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredComponents;
    return filteredComponents.filter(({ label, id, keywords }) => {
      const haystack = [label, id, ...(keywords ?? [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query, filteredComponents]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTemplateSelect = (componentId: string, templateId: string) => {
    const component = components.find(comp => comp.id === componentId);

    if (component?.type === "navbar" && onNavbarSelect) {
      const navbarData = getNavbarData(templateId);
      onNavbarSelect(navbarData);
    } else if (component?.type === "footer" && onFooterSelect) {
      const footerStyle = getFooterStyle(templateId);
      onFooterSelect(footerStyle);
    } else {
      onComponentClick(componentId, templateId);
    }

    handleClose();
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setQuery("");
    onOpenChange(false);
  };

  const getCurrentTemplates = () => {
    if (!selectedCategory) {
      // Show only default templates in the main view
      const allTemplates = filteredComponents.flatMap(
        component =>
          component.templates
            ?.filter(
              template =>
                !template.showForWebsiteTypes ||
                template.showForWebsiteTypes.includes(websiteType)
            )
            .map(template => ({
              component,
              template: { ...template, componentId: component.id },
            })) || []
      );

      // Filter to only show templates that are in default_templates array
      return allTemplates.filter(({ template }) =>
        default_templates.includes(template.id)
      );
    }

    // Show all templates for selected category (when a category is selected)
    const component = filteredComponents.find(
      comp => comp.id === selectedCategory
    );
    if (component?.templates) {
      return component.templates
        .filter(
          template =>
            !template.showForWebsiteTypes ||
            template.showForWebsiteTypes.includes(websiteType)
        )
        .map(template => ({
          component,
          template: { ...template, componentId: component.id },
        }));
    }

    return [];
  };

  // Helper function to get navbar data based on template ID
  const getNavbarData = (templateId: string): NavbarData => {
    const styleNumber = templateId.split("-")[1];

    const baseData: NavbarData = {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: `style-${styleNumber}` as any,
      logoText: "Brand",
      logoType: "text",
      showCart: true,
      links: [
        { id: "1", text: "Home", href: "#" },
        { id: "2", text: "About", href: "#" },
        { id: "3", text: "Contact", href: "#" },
      ],
      buttons: [],
    };

    switch (styleNumber) {
      case "1":
        return {
          ...baseData,
          buttons: [
            { id: "1", text: "Get Started", variant: "primary", href: "#" },
          ],
        };
      case "2":
        return {
          ...baseData,
          logoText: "Centered",
          links: [
            { id: "1", text: "Home", href: "#" },
            { id: "2", text: "About", href: "#" },
            { id: "3", text: "Services", href: "#" },
            { id: "4", text: "Contact", href: "#" },
          ],
          buttons: [
            { id: "1", text: "Book Now", variant: "primary", href: "#" },
          ],
        };
      case "3":
        return {
          ...baseData,
          logoText: "SearchNav",
          links: [
            { id: "1", text: "Home", href: "#" },
            { id: "2", text: "Products", href: "#" },
            { id: "3", text: "About", href: "#" },
          ],
          buttons: [{ id: "1", text: "Search", variant: "outline", href: "#" }],
        };
      case "4":
        return {
          ...baseData,
          logoText: "Store",
          links: [
            { id: "1", text: "Home", href: "#" },
            { id: "2", text: "Categories", href: "#" },
            { id: "3", text: "Deals", href: "#" },
          ],
          buttons: [
            { id: "1", text: "Shop Now", variant: "primary", href: "#" },
          ],
        };
      case "5":
        return {
          ...baseData,
          bannerText: "Get free delivery on orders over $100",
          links: [
            { id: "1", text: "Women", href: "#" },
            { id: "2", text: "Men", href: "#" },
            { id: "3", text: "New Arrivals", href: "#" },
            { id: "4", text: "Sale", href: "#" },
          ],
          buttons: [
            { id: "1", text: "Sign in", variant: "outline", href: "#" },
            { id: "2", text: "Create account", variant: "primary", href: "#" },
          ],
        };
      case "6":
        return {
          ...baseData,
          links: [
            { id: "1", text: "About Us", href: "#" },
            { id: "2", text: "FAQ", href: "#" },
            { id: "3", text: "Privacy Policy", href: "#" },
          ],
          buttons: [],
          topBarItems: [
            {
              id: "1",
              text: "Customer Service: +977-9860425440",
              href: "tel:+9779860425440",
            },
          ],
        };
      default:
        return baseData;
    }
  };

  // Helper function to get footer style based on template ID
  const getFooterStyle = (
    templateId: string
  ): "style-1" | "style-2" | "style-3" | "style-4" | "style-5" | "style-6" => {
    const styleNumber = templateId.split("-")[1];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `style-${styleNumber}` as any;
  };

  const currentTemplates = getCurrentTemplates();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0h-[80vh] h-[80vh] !max-w-6xl scale-80 overflow-hidden p-0">
        <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 z-50 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="flex h-full overflow-hidden">
          {/* Left Sidebar - Components List */}
          <div className="flex h-full w-64 flex-col border-r">
            <DialogHeader className="border-b px-4 py-4">
              <DialogTitle className="text-lg font-semibold">
                Components
              </DialogTitle>
            </DialogHeader>

            <div className="border-b px-4 py-3">
              <label htmlFor="component-search" className="sr-only">
                Search components
              </label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  id="component-search"
                  type="text"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search components..."
                  className="border-muted focus-visible:ring-ring focus-visible:ring-offset-background w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Components List */}
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-2">
                {filtered.map(component => (
                  <button
                    key={component.id}
                    onClick={() => handleCategorySelect(component.id)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      selectedCategory === component.id
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <component.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm font-medium">
                      {component.label}
                    </span>

                    {component.hasTemplates && (
                      <ChevronRight className="ml-auto h-3 w-3 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Content Area - Templates Grid */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-10 border-b bg-white px-6 pt-6 pb-4">
              {!selectedCategory ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Featured Templates
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Website Type:{" "}
                    <span className="font-medium capitalize">
                      {websiteType}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </button>
                  {currentTemplates[0] && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentTemplates[0].component.label}
                      </h2>
                      <p className="text-gray-600">
                        {currentTemplates[0].component.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable Templates Area */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {!selectedCategory ? (
                  /* Featured Templates Grid */
                  <div className="grid grid-cols-3 gap-6">
                    {currentTemplates.map(({ component, template }) => (
                      <div
                        key={`${component.id}-${template.id}`}
                        className="group cursor-pointer"
                        onClick={() =>
                          handleTemplateSelect(component.id, template.id)
                        }
                      >
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-blue-400">
                          {/* Template Preview Image */}
                          <div className="relative flex aspect-video items-center justify-center bg-gray-50">
                            <img
                              src={template.image}
                              alt={template.name}
                              width={800}
                              height={200}
                              className="h-auto w-full rounded"
                            />
                          </div>

                          {/* Template Info */}
                          <div className="bg-white p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {template.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-1">
                                  <component.icon className="h-3 w-3 text-blue-600" />
                                  <span className="text-xs text-gray-500">
                                    {component.label}
                                  </span>
                                </div>
                                {template.description && (
                                  <p className="mt-2 text-xs text-gray-500">
                                    {template.description}
                                  </p>
                                )}
                              </div>
                              {component.popular && (
                                <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Selected Category Templates Grid */
                  <div className="grid grid-cols-3 gap-4">
                    {currentTemplates.map(({ component, template }) => (
                      <div
                        key={template.id}
                        className="group cursor-pointer"
                        onClick={() =>
                          handleTemplateSelect(component.id, template.id)
                        }
                      >
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-blue-400">
                          <div className="relative flex aspect-video items-center justify-center bg-transparent">
                            <img
                              src={template.image}
                              alt={template.name}
                              width={800}
                              height={200}
                              className="h-auto w-full rounded"
                            />
                          </div>
                          <div className="bg-white p-3">
                            <h3 className="text-sm font-medium text-gray-900">
                              {template.name}
                            </h3>
                            {template.description && (
                              <p className="mt-1 text-xs text-gray-500">
                                {template.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
