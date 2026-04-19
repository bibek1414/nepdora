import {
  Repeat,
  Calendar,
  ShoppingBag,
  Globe,
  Zap,
  Megaphone,
  Store,
  Briefcase,
  Rocket,
  LucideIcon,
} from "lucide-react";

export interface UseCase {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  slug: string;
}

export const USE_CASES: UseCase[] = [
  {
    title: "Switching from Social Media",
    description:
      "Move your business beyond 'DM for Price'. Build a professional storefront and automate your inventory.",
    icon: Repeat,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    slug: "social-media-to-storefront",
  },
  {
    title: "Appointment Booking",
    description:
      "Perfect for clinics, consultancies, and salons. Let clients book their own slots 24/7.",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    slug: "online-appointments",
  },
  {
    title: "High-Volume E-commerce",
    description:
      "Scale your inventory and handle thousands of orders with automated courier and payment sync.",
    icon: ShoppingBag,
    color: "from-primary to-primary/80",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    slug: "high-volume-sales",
  },
  {
    title: "Global Export",
    description:
      "Built for Nepali brands selling $USD abroad while managing everything from Kathmandu.",
    icon: Globe,
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
    slug: "global-export",
  },
  {
    title: "Digital Portfolios",
    description:
      "Showcase your work and land higher-paying clients with a premium personal brand site.",
    icon: Zap,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    slug: "creative-portfolios",
  },
  {
    title: "Launch Campaigns",
    description:
      "Create high-converting landing pages for your new products or seasonal offers in minutes.",
    icon: Megaphone,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    slug: "launch-campaigns",
  },
  {
    title: "Small Business Website",
    description:
      "Establish your brand online with a professional website that builds trust and attracts customers.",
    icon: Store,
    color: "from-indigo-500 to-primary",
    bgColor: "bg-indigo-50",
    textColor: "text-primary",
    slug: "website-for-small-business",
  },
  {
    title: "Freelancer Portfolio",
    description:
      "Showcase your skills, attract high-paying clients, and build your personal brand.",
    icon: Briefcase,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    slug: "website-for-freelancers",
  },
  {
    title: "Sell Products Online",
    description:
      "Launch your e-commerce store with local payments and automated shipping.",
    icon: ShoppingBag,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    slug: "sell-products-online-nepal",
  },
  {
    title: "Start Online Business",
    description:
      "Everything you need to launch and grow your online business in Nepal.",
    icon: Rocket,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    slug: "start-online-business-nepal",
  },
];
