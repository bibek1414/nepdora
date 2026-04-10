import {
  ShoppingBag,
  CreditCard,
  Truck,
  BarChart3,
  Smartphone,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export interface Solution {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

export const SOLUTIONS_LIST: Solution[] = [
  {
    slug: "ecommerce",
    title: "E-commerce Solutions",
    description:
      "Full-stack digital commerce with local payments, shipping automation, and inventory management.",
    icon: ShoppingBag,
    color: "from-primary to-primary/80",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    slug: "accept-esewa-payments-online",
    title: "Payment Gateway Integration",
    description:
      "Accept eSewa, Khalti, IME Pay, and ConnectIPS on your website instantly. No coding required.",
    icon: CreditCard,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    slug: "local-delivery-integration-pathao",
    title: "Delivery & Logistics",
    description:
      "Automate your shipping with Pathao and other local delivery partners in Nepal.",
    icon: Truck,
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    slug: "marketing",
    title: "Business Marketing",
    description:
      "High-performance websites designed to capture leads, build brand authority, and grow your local presence.",
    icon: BarChart3,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    slug: "portfolio",
    title: "Portfolio & Personal Branding",
    description:
      "Stunning, fast-loading sites for creatives and professionals to stand out in the digital crowd.",
    icon: Smartphone,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    slug: "enterprise",
    title: "Enterprise & Custom Build",
    description:
      "Advanced infrastructure for high-scale needs with dedicated support and custom integrations.",
    icon: ShieldCheck,
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
  },
];
