export interface IntegrationStep {
  title: string;
  description: string;
}

export interface Integration {
  slug: string;
  name: string;
  category: "Payment" | "Logistics" | "Marketing" | "Communication" | "Social";
  description: string;
  longDescription: string;
  heroTitle?: string;
  heroSubtitle?: string;
  features: string[];
  benefits: string[];
  hardWay: IntegrationStep[];
  showcaseSections?: {
    title: string;
    description: string;
    bullets: string[];
    image?: string;
  }[];
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
    heroTitle: "The Fastest Way to Accept eSewa Payments",
    heroSubtitle: "Connect Nepal's favorite digital wallet to your online store in seconds. Grow your revenue with a seamless checkout experience.",
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
    showcaseSections: [
      {
        title: "Real-time Payment Confirmation",
        description: "No more waiting for manual back-and-forth. Nepdora confirms eSewa payments instantly, so you can fulfill orders faster.",
        bullets: [
          "Instant status updates",
          "Automated receipt generation",
          "Fraud detection built-in",
        ],
      },
      {
        title: "One-Click Activation",
        description: "Skip the technical headache. Enter your merchant ID, and you're ready to go live. No developers required.",
        bullets: [
          "Zero code integration",
          "Pre-built checkout UI",
          "Auto-sync with order status",
        ],
      },
    ],
    hardWay: [
      {
        title: "Manual Registration",
        description: "Apply for a merchant account and wait for manual KYC verification.",
      },
      {
        title: "Technical Implementation",
        description: "Develop custom backend logic for hash generation and verification.",
      },
      {
        title: "Update API Keys",
        description: "Manually handle UAT and Production keys transition and testing.",
      },
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
    heroTitle: "Accept Khalti Payments Anywhere in Nepal",
    heroSubtitle: "A modern, secure, and reliable payment solution for your growing business. Accept wallet, card, and bank transfers with one integration.",
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
    showcaseSections: [
      {
        title: "Diverse Payment Options",
        description: "Let your customers pay via Khalti wallet, mobile banking, or SCT cards. More options mean more sales.",
        bullets: [
          "Seamless wallet payments",
          "Bank transfer support",
          "Card-less transactions",
        ],
      },
    ],
    hardWay: [
      {
        title: "API Setup",
        description: "Configure complex SDKs and handle various payment states.",
      },
      {
        title: "Webhook Handling",
        description: "Set up and secure custom webhooks for payment status updates.",
      },
      {
        title: "Security Compliance",
        description: "Ensure transaction data is handled securely on your servers.",
      },
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
    hardWay: [
      {
        title: "Complex Onboarding",
        description: "Extensive paperwork and manual approval from financial institutions.",
      },
      {
        title: "SOAP/XML Integration",
        description: "Handling legacy banking protocols and rigid data formats.",
      },
      {
        title: "Rigid Testing",
        description: "Extended testing periods in restricted environment before live access.",
      },
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
    heroTitle: "Automate Your Logistics with Dash",
    heroSubtitle: "The smartest delivery integration for Nepali e-commerce. Sync orders, print labels, and track parcels without leaving your dashboard.",
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
    showcaseSections: [
      {
        title: "Bulk Order Fulfillment",
        description: "Process dozens of orders in minutes. Automatically push shipment data to Dash Logistics and print labels instantly.",
        bullets: [
          "One-click booking",
          "Auto-print shipping labels",
          "Manifest generation",
        ],
      },
    ],
    hardWay: [
      {
        title: "Manual Syncing",
        description: "Manually exported order data and imported into logistics portals.",
      },
      {
        title: "Tracking Gaps",
        description: "Building custom trackers to bridge logistic updates to your site.",
      },
      {
        title: "Label Issues",
        description: "Using inconsistent labelling formats between your app and courier.",
      },
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
    hardWay: [
      {
        title: "Manual Button Coding",
        description: "Writing custom scripts to format and send WhatsApp messages.",
      },
      {
        title: "Product Sync",
        description: "Manually adding product details to WhatsApp catalog links.",
      },
      {
        title: "No Order History",
        description: "Difficultly tracking conversation-based orders in central DB.",
      },
    ],
    logo: "/images/icons/whatsapp-icon.png",
    website: "https://whatsapp.com",
    color: "#25D366",
    badge: "Official channel",
  },
  {
    slug: "google-analytics",
    name: "Google Analytics",
    category: "Marketing",
    description:
      "Track your website traffic and understand customer behavior with ease.",
    longDescription:
      "Gain deep insights into how users interact with your website. Our Google Analytics integration allows you to track views, sources, and conversions without any technical setup.",
    heroTitle: "Track Traffic with Google Analytics",
    heroSubtitle: "Get deep insights into your visitors and marketing performance with our built-in Google Analytics integration.",
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
    hardWay: [
      {
        title: "Tag Script Setup",
        description: "Injecting scripts into head tags and managing code versions.",
      },
      {
        title: "Event Tracking",
        description: "Setting up Custom Events for clicks, scrolls, and conversions.",
      },
      {
        title: "E-comm Schema",
        description: "Mapping site variables to GA4 enhanced e-commerce schemas.",
      },
    ],
    logo: "/images/icons/google-analytic.png",
    website: "https://analytics.google.com",
    color: "#F9AB00",
    badge: "Built-in tool",
  },
];
