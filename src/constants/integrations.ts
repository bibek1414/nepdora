export interface Integration {
  slug: string;
  name: string;
  category: "Payment" | "Logistics" | "Marketing" | "Communication" | "Social";
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  logo: string;
  website: string;
  color: string;
  badge: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    slug: "esewa-payment",
    name: "eSewa",
    category: "Payment",
    description:
      "Nepal's first and leading digital wallet for seamless online payments.",
    longDescription:
      "Integrate eSewa with your Nepdora website to accept payments from millions of users in Nepal. With a simple setup, you can start receiving payments directly into your account with real-time notifications.",
    features: [
      "Flash Payment Integration",
      "Real-time payment confirmation",
      "Secure transaction processing",
      "Detailed transaction history in Nepdora dashboard",
    ],
    benefits: [
      "Reach 5M+ eSewa users in Nepal",
      "Reduce checkout friction",
      "Build trust with a familiar payment method",
      "Low transaction fees",
    ],
    logo: "/images/payment-gateway/esewa.png",
    website: "https://esewa.com.np",
    color: "#60BB46",
    badge: "Native integration",
  },
  {
    slug: "khalti-payment",
    name: "Khalti",
    category: "Payment",
    description:
      "Accept payments via Khalti wallet, E-banking, Mobile banking, and SCT cards.",
    longDescription:
      "Khalti provides a robust payment gateway for Nepali businesses. By integrating Khalti with Nepdora, you offer your customers multiple ways to pay, increasing your conversion rates and customer satisfaction.",
    features: [
      "Wallet and banking options",
      "SCT card support",
      "Easy refund management",
      "Developer-friendly API",
    ],
    benefits: [
      "Access to Khalti's growing ecosystem",
      "Multiple payment modes in one integration",
      "High success rates for transactions",
      "Excellent local support",
    ],
    logo: "/images/payment-gateway/khalti.png",
    website: "https://khalti.com",
    color: "#5C2D91",
    badge: "Verified partner",
  },
  {
    slug: "connectips-payment",
    name: "ConnectIPS",
    category: "Payment",
    description:
      "Direct bank-to-bank transfers for secure, high-value transactions.",
    longDescription:
      "ConnectIPS is the electronic payment system for direct bank-to-bank transfers in Nepal. It's the most trusted way for customers to pay directly from their bank accounts with the lowest fees.",
    features: [
      "Direct bank account search",
      "Real-time interbank transfers",
      "Highest security standards",
      "Lowest transaction costs",
    ],
    benefits: [
      "Trust of Nepal Clearing House (NCHL)",
      "Preferred for high-value purchases",
      "No wallet loading required",
      "Direct settlement in your bank account",
    ],
    logo: "/images/payment-gateway/connectips.png",
    website: "https://connectips.com",
    color: "#004B91",
    badge: "Bank integration",
  },
  {
    slug: "dash-logistics",
    name: "Dash Logistics",
    category: "Logistics",
    description:
      "Automate your local deliveries with Dash's extensive courier network.",
    longDescription:
      "Dash Logistics is a premier delivery partner in Nepal. Our integration allows you to automatically book deliveries as soon as an order is placed on your Nepdora site, streamlining your fulfillment process.",
    features: [
      "Automatic parcel booking",
      "Real-time tracking for customers",
      "COD management",
      "Area-wise delivery rates",
    ],
    benefits: [
      "Fastest delivery in major cities",
      "Automated logistics workflow",
      "Improved transparency for buyers",
      "Seamless settlements",
    ],
    logo: "/images/icons/dash-logistics.png",
    website: "https://dashlogistics.com.np",
    color: "#EE1C25",
    badge: "Official integration",
  },
  {
    slug: "whatsapp-ordering",
    name: "WhatsApp Ordering",
    category: "Communication",
    description:
      "Let your customers order directly via WhatsApp for a personal experience.",
    longDescription:
      "Leverage the popularity of WhatsApp in Nepal. This integration allows customers to send their cart details directly to your WhatsApp, enabling you to close sales through one-on-one conversation.",
    features: [
      "One-click WhatsApp checkout",
      "Pre-filled order messages",
      "Floating contact button",
      "Mobile-optimized flow",
    ],
    benefits: [
      "Higher conversion rates",
      "No complex payment setup",
      "Instant communication",
      "Low barrier for customers",
    ],
    logo: "/images/icons/whatsapp-icon.png",
    website: "https://whatsapp.com",
    color: "#25D366",
    badge: "Instant setup",
  },
  {
    slug: "google-analytics",
    name: "Google Analytics",
    category: "Marketing",
    description:
      "Track your website traffic and understand customer behavior with ease.",
    longDescription:
      "Gain deep insights into how users interact with your website. Our Google Analytics integration allows you to track views, sources, and conversions without any technical setup.",
    features: [
      "Real-time traffic tracking",
      "Conversion goals setup",
      "Audience insights",
      "E-commerce tracking",
    ],
    benefits: [
      "Data-driven decision making",
      "Understand your ROI",
      "Track marketing performance",
      "Identify growth opportunities",
    ],
    logo: "/images/icons/google-analytic.png",
    website: "https://analytics.google.com",
    color: "#F9AB00",
    badge: "One-click setup",
  },
];
