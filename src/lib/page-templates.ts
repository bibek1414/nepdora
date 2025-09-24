import {
  Home,
  User,
  Mail,
  Briefcase,
  ShoppingBag,
  FileText,
  Users,
  Camera,
} from "lucide-react";
import { defaultHeroData } from "@/types/owner-site/components/hero";
import { defaultContactData } from "@/types/owner-site/components/contact";
import { defaultAboutUs1Data } from "@/types/owner-site/components/about";
import { defaultProductsData } from "@/types/owner-site/components/products";
import { defaultTeamData } from "@/types/owner-site/components/team";
import { defaultBlogDisplayData } from "@/types/owner-site/components/blog";
import { defaultPortfolioData } from "@/types/owner-site/components/portfolio";
import { PageTemplate } from "@/types/owner-site/components/page-template";
export const pageTemplates: PageTemplate[] = [
  {
    id: "home",
    name: "Home Page",
    description:
      "Complete homepage with hero, about, products, and contact sections",
    icon: Home,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "Welcome to Our Company",
          subtitle: "Your Success is Our Mission",
          description:
            "We provide innovative solutions to help your business grow and succeed in today's competitive market.",
          template: "hero-1",
        },
      },
      {
        type: "about",
        order: 1,
        defaultData: {
          ...defaultAboutUs1Data,
          title: "About Our Company",
          subtitle: "Learn more about who we are",
        },
      },
      {
        type: "products",
        order: 2,
        defaultData: {
          ...defaultProductsData,
          title: "Our Products",
          subtitle: "Discover what we have to offer",
          style: "grid-1",
        },
      },
      {
        type: "testimonials",
        order: 3,
        defaultData: {
          title: "What Our Clients Say",
          subtitle: "Don't just take our word for it",
          style: "grid-1",
          component_type: "testimonials",
        },
      },
      {
        type: "contact",
        order: 4,
        defaultData: {
          ...defaultContactData,
          title: "Get in Touch",
          subtitle: "We'd love to hear from you",
          style: "form-1",
        },
      },
    ],
  },
  {
    id: "about",
    name: "About Page",
    description: "Professional about page with team and company information",
    icon: User,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "About Our Company",
          subtitle: "Our Story, Mission & Values",
          description:
            "Learn about our journey, what drives us, and the team behind our success.",
          template: "hero-2",
        },
      },
      {
        type: "about",
        order: 1,
        defaultData: {
          ...defaultAboutUs1Data,
          title: "Our Story",
          subtitle: "How it all began",
        },
      },
      {
        type: "team",
        order: 2,
        defaultData: {
          ...defaultTeamData,
          title: "Meet Our Team",
          subtitle: "The people behind our success",
          style: "grid-1",
        },
      },
      {
        type: "testimonials",
        order: 3,
        defaultData: {
          title: "What People Say About Us",
          subtitle: "Feedback from our valued clients",
          style: "carousel-1",
          component_type: "testimonials",
        },
      },
    ],
  },
  {
    id: "contact",
    name: "Contact Page",
    description: "Complete contact page with form and information",
    icon: Mail,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "Contact Us",
          subtitle: "Get in Touch Today",
          description:
            "We're here to help and answer any questions you might have.",
          template: "hero-3",
        },
      },
      {
        type: "contact",
        order: 1,
        defaultData: {
          ...defaultContactData,
          title: "Send Us a Message",
          subtitle: "We'll get back to you as soon as possible",
          style: "form-2",
        },
      },
      {
        type: "faq",
        order: 2,
        defaultData: {
          title: "Frequently Asked Questions",
          subtitle: "Quick answers to common questions",
          style: "accordion",
          component_type: "faq",
        },
      },
    ],
  },
  {
    id: "services",
    name: "Services Page",
    description: "Showcase your services and expertise",
    icon: Briefcase,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "Our Services",
          subtitle: "Professional Solutions for Your Business",
          description:
            "Comprehensive services designed to meet your specific needs.",
          template: "hero-1",
        },
      },
      {
        type: "about",
        order: 1,
        defaultData: {
          ...defaultAboutUs1Data,
          title: "What We Offer",
          subtitle: "Comprehensive business solutions",
        },
      },
      {
        type: "testimonials",
        order: 2,
        defaultData: {
          title: "Client Success Stories",
          subtitle: "See how we've helped businesses like yours",
          style: "grid-2",
          component_type: "testimonials",
        },
      },
      {
        type: "contact",
        order: 3,
        defaultData: {
          ...defaultContactData,
          title: "Ready to Get Started?",
          subtitle: "Contact us for a consultation",
          style: "form-3",
        },
      },
    ],
  },
  {
    id: "shop",
    name: "Shop Page",
    description: "E-commerce page with products and categories",
    icon: ShoppingBag,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "Shop Our Products",
          subtitle: "Quality Products at Great Prices",
          description:
            "Discover our carefully curated collection of premium products.",
          template: "hero-4",
        },
      },
      {
        type: "category",
        order: 1,
        defaultData: {
          title: "Shop by Category",
          subtitle: "Find exactly what you're looking for",
          style: "grid-1",
          component_type: "category",
          page_size: 8,
          itemsPerRow: 4,
          showDescription: true,
          showProductCount: true,
        },
      },
      {
        type: "products",
        order: 2,
        defaultData: {
          ...defaultProductsData,
          title: "Featured Products",
          subtitle: "Our most popular items",
          style: "grid-2",
        },
      },
      {
        type: "newsletter",
        order: 3,
        defaultData: {
          title: "Stay Updated",
          subtitle: "Get notified about new products and special offers",
          style: "style-2",
          component_type: "newsletter",
        },
      },
    ],
  },
  {
    id: "blog",
    name: "Blog Page",
    description: "Blog listing page with articles",
    icon: FileText,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "Our Blog",
          subtitle: "Insights, Tips & Industry News",
          description:
            "Stay informed with our latest articles and expert insights.",
          template: "hero-2",
        },
      },
      {
        type: "blog",
        order: 1,
        defaultData: {
          ...defaultBlogDisplayData,
          title: "Latest Articles",
          subtitle: "Stay up to date with our latest posts",
          style: "grid-1",
        },
      },
      {
        type: "newsletter",
        order: 2,
        defaultData: {
          title: "Subscribe to Our Blog",
          subtitle: "Never miss a new article",
          style: "style-1",
          component_type: "newsletter",
        },
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio Page",
    description: "Showcase your work and projects",
    icon: Camera,
    components: [
      {
        type: "hero",
        order: 0,
        defaultData: {
          ...defaultHeroData,
          title: "Our Portfolio",
          subtitle: "Showcasing Our Best Work",
          description:
            "Explore our collection of successful projects and creative solutions.",
          template: "hero-3",
        },
      },
      {
        type: "portfolio",
        order: 1,
        defaultData: {
          ...defaultPortfolioData,
          title: "Featured Projects",
          subtitle: "A selection of our finest work",
          style: "portfolio-1",
        },
      },
      {
        type: "testimonials",
        order: 2,
        defaultData: {
          title: "What Our Clients Say",
          subtitle: "Feedback from our project collaborations",
          style: "grid-3",
          component_type: "testimonials",
        },
      },
      {
        type: "contact",
        order: 3,
        defaultData: {
          ...defaultContactData,
          title: "Start Your Project",
          subtitle: "Let's discuss your next creative venture",
          style: "form-4",
        },
      },
    ],
  },
];
