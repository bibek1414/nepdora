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
  isPopular?: boolean;
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
    logo: "/images/integrations/esewa.png",
    website: "https://esewa.com.np",
    isPopular: true,
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
      "Wallet and Banking options",
      "SCT Card support",
      "Easy refund management",
      "Developer-friendly API",
    ],
    benefits: [
      "Access to Khalti's growing ecosystem",
      "Multiple payment modes in one integration",
      "High success rates for transactions",
      "Excellent local support",
    ],
    logo: "/images/integrations/khalti.png",
    website: "https://khalti.com",
    isPopular: true,
  },
  {
    slug: "pathao-logistics",
    name: "Pathao Logistics",
    category: "Logistics",
    description:
      "Automate your local deliveries with Pathao's extensive courier network.",
    longDescription:
      "Pathao is the most reliable delivery partner in Nepal. Our integration allows you to automatically book deliveries as soon as an order is placed on your Nepdora site, saving you hours of manual work.",
    features: [
      "Automatic parcel booking",
      "Real-time tracking for customers",
      "COD (Cash on Delivery) management",
      "Area-wise delivery rate calculation",
    ],
    benefits: [
      "Fastest delivery in Kathmandu and major cities",
      "Automated logistics workflow",
      "Improved customer trust with tracking",
      "Seamless COD settlements",
    ],
    logo: "/images/integrations/pathao.png",
    website: "https://pathao.com",
    isPopular: true,
  },
  {
    slug: "whatsapp-ordering",
    name: "WhatsApp Ordering",
    category: "Communication",
    description:
      "Let your customers order directly via WhatsApp for a personalized experience.",
    longDescription:
      "In Nepal, WhatsApp is a primary communication tool. This integration allows customers to send their cart details directly to your WhatsApp, enabling you to close sales through personal conversation.",
    features: [
      "One-click WhatsApp checkout",
      "Pre-filled order messages",
      "Floating WhatsApp contact button",
      "Mobile-optimized flow",
    ],
    benefits: [
      "Higher conversion through personal touch",
      "No complex payment setup needed",
      "Instant communication with buyers",
      "Low barrier to entry for customers",
    ],
    logo: "/images/integrations/whatsapp.png",
    website: "https://whatsapp.com",
    isPopular: true,
  },
  {
    slug: "facebook-pixel",
    name: "Facebook Pixel",
    category: "Marketing",
    description:
      "Track conversions and optimize your ads with deep Facebook integration.",
    longDescription:
      "Scale your business with data-driven advertising. Our Facebook Pixel integration tracks every step of the customer journey, from page view to purchase, allowing you to run highly effective retargeting campaigns.",
    features: [
      "Automated event tracking",
      "Catalog sync support",
      "Conversion API integration",
      "Easy setup without coding",
    ],
    benefits: [
      "Measure ad performance accurately",
      "Reach people more likely to buy",
      "Optimize for ROI",
      "Understand your customer behavior",
    ],
    logo: "/images/integrations/facebook.png",
    website: "https://facebook.com",
    isPopular: false,
  },
];
