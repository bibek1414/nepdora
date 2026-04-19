export interface IntegrationStep {
  title: string;
  description: string;
}

export interface Integration {
  slug: string;
  name: string;
  category:
    | "Payment"
    | "Logistics"
    | "Marketing"
    | "Communication"
    | "Social"
    | "Operations";
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
  stats?: { value: string; label: string }[];
  faqs?: { q: string; a: string }[];
  testimonial?: { quote: string; author: string; business: string };
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
    heroSubtitle:
      "Connect Nepal's favorite digital wallet to your online store in seconds. Grow your revenue with a seamless checkout experience.",
    features: [
      "Flash Payment Integration",
      "Real-time payment confirmation",
      "Secure transaction processing",
      "Detailed transaction history in Nepdora dashboard",
    ],
    benefits: [
      "Accept payments from millions of eSewa users",
      "Increase conversion rates with familiar payment methods",
      "No transaction fees for the first 3 months",
      "24/7 payment processing with automatic settlement",
      "Automatic refund handling",
      "Real-time transaction reporting",
    ],
    showcaseSections: [
      {
        title: "Real-time Payment Confirmation",
        description:
          "No more waiting for manual back-and-forth. Nepdora confirms eSewa payments instantly, so you can fulfill orders faster.",
        bullets: [
          "Instant status updates",
          "Automated receipt generation",
          "Fraud detection built-in",
        ],
      },
      {
        title: "One-Click Activation",
        description:
          "Skip the technical headache. Enter your merchant ID, and you're ready to go live. No developers required.",
        bullets: [
          "Zero code integration",
          "Pre-built checkout UI",
          "Auto-sync with order status",
        ],
      },
    ],
    hardWay: [
      {
        title: "Merchant Registration",
        description:
          "Apply for a merchant account and wait for manual verification.",
      },
      {
        title: "API Documentation",
        description:
          "Study complex technical documentation for UAT and Production environments.",
      },
      {
        title: "Secure Backend Implementation",
        description:
          "Write custom backend code to handle hash generation and payment verification.",
      },
      {
        title: "Testing & Certification",
        description:
          "Complete rigorous testing in eSewa's sandbox before getting production keys.",
      },
    ],
    stats: [
      { value: "5M+", label: "Active eSewa Users" },
      { value: "30s", label: "Setup Time" },
      { value: "0", label: "Lines of Code" },
      { value: "100%", label: "Uptime Guarantee" },
    ],
    faqs: [
      {
        q: "Do I need a merchant account?",
        a: "Yes, you need an eSewa merchant account. Nepdora helps you with the application process.",
      },
      {
        q: "How long does settlement take?",
        a: "Settlements are processed daily. Funds are transferred to your bank account within 24-48 hours.",
      },
      {
        q: "Is there a monthly fee?",
        a: "No monthly fees. You only pay the standard transaction fee set by eSewa.",
      },
      {
        q: "Does it support refunds?",
        a: "Yes, full refund management is built into the integration.",
      },
    ],
    testimonial: {
      quote:
        "Setting up eSewa with Nepdora took less than 5 minutes. Our online sales increased by 40% within the first month.",
      author: "Rajesh Shrestha",
      business: "Urban Style",
    },
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
    heroSubtitle:
      "A modern, secure, and reliable payment solution for your growing business. Accept wallet, card, and bank transfers with one integration.",
    features: [
      "Wallet and banking options",
      "SCT card support",
      "Easy refund management",
      "Developer-friendly API",
    ],
    benefits: [
      "Reach millions of Khalti wallet users across Nepal",
      "Seamless checkout experience with one-click payments",
      "Real-time transaction tracking and reporting",
      "Automatic refund processing capabilities",
      "Mobile-optimized payment flow",
      "No additional gateway fees",
    ],
    showcaseSections: [
      {
        title: "Diverse Payment Options",
        description:
          "Let your customers pay via Khalti wallet, mobile banking, or SCT cards. More options mean more sales.",
        bullets: [
          "Seamless wallet payments",
          "Bank transfer support",
          "Card-less transactions",
        ],
      },
    ],
    hardWay: [
      {
        title: "Account Setup",
        description: "Register as a merchant and get your public/secret keys.",
      },
      {
        title: "SDK Configuration",
        description:
          "Import and configure Khalti's SDK into your application's frontend.",
      },
      {
        title: "Transaction Validation",
        description:
          "Implement server-side calls to Khalti APIs to verify successful transactions.",
      },
    ],
    stats: [
      { value: "3M+", label: "Khalti Users" },
      { value: "2min", label: "Setup Time" },
      { value: "0", label: "Lines of Code" },
      { value: "99.9%", label: "Success Rate" },
    ],
    faqs: [
      {
        q: "Does it support both UAT and Production?",
        a: "Yes, Nepdora supports both test and live environments. Switch between them easily.",
      },
      {
        q: "Can I accept international payments?",
        a: "Khalti focuses on Nepali transactions. For international, consider other gateways.",
      },
      {
        q: "How are failed transactions handled?",
        a: "Failed transactions are automatically retried and logged for review.",
      },
      {
        q: "Is PCI compliance required?",
        a: "No, Nepdora handles all PCI compliance for you.",
      },
    ],
    testimonial: {
      quote:
        "Khalti integration was seamless. Our customers love the one-click payment option, and we've seen a 35% increase in completed orders.",
      author: "Sita Gurung",
      business: "Namaste Travels",
    },
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
        description:
          "Extensive paperwork and manual approval from financial institutions.",
      },
      {
        title: "SOAP/XML Integration",
        description:
          "Handling legacy banking protocols and rigid data formats.",
      },
      {
        title: "Rigid Testing",
        description:
          "Extended testing periods in restricted environment before live access.",
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
    heroSubtitle:
      "The smartest delivery integration for Nepali e-commerce. Sync orders, print labels, and track parcels without leaving your dashboard.",
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
        description:
          "Process dozens of orders in minutes. Automatically push shipment data to Dash Logistics and print labels instantly.",
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
        description:
          "Manually exported order data and imported into logistics portals.",
      },
      {
        title: "Tracking Gaps",
        description:
          "Building custom trackers to bridge logistic updates to your site.",
      },
      {
        title: "Label Issues",
        description:
          "Using inconsistent labelling formats between your app and courier.",
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
        description:
          "Writing custom scripts to format and send WhatsApp messages.",
      },
      {
        title: "Product Sync",
        description:
          "Manually adding product details to WhatsApp catalog links.",
      },
      {
        title: "No Order History",
        description:
          "Difficultly tracking conversation-based orders in central DB.",
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
    heroSubtitle:
      "Get deep insights into your visitors and marketing performance with our built-in Google Analytics integration.",
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
        description:
          "Injecting scripts into head tags and managing code versions.",
      },
      {
        title: "Event Tracking",
        description:
          "Setting up Custom Events for clicks, scrolls, and conversions.",
      },
      {
        title: "E-comm Schema",
        description:
          "Mapping site variables to GA4 enhanced e-commerce schemas.",
      },
    ],
    logo: "/images/icons/google-analytic.png",
    website: "https://analytics.google.com",
    color: "#F9AB00",
    badge: "Built-in tool",
  },
  {
    slug: "facebook-pixel",
    name: "Facebook Pixel",
    category: "Marketing",
    description:
      "Track conversions and optimize your ad spend with Facebook Pixel.",
    longDescription:
      "Connect your Facebook Pixel to Nepdora to track every action customers take on your site. From page views to purchases, get the data you need to optimize your advertising and grow your ROAS.",
    heroTitle: "Optimize Your Ads with Facebook Pixel",
    heroSubtitle:
      "Track conversions and build powerful retargeting audiences with our native, one-click Facebook integration.",
    features: [
      "Zero-code implementation",
      "Automatic event tracking",
      "Dynamic product ads support",
      "Conversions API (CAPI) compatible",
    ],
    benefits: [
      "Track every customer action from view to purchase",
      "Build retargeting audiences for better ROAS",
      "Optimize ad delivery for conversions",
      "Measure cross-device customer journeys",
      "Automatic event parameter mapping",
      "Real-time conversion reporting",
    ],
    hardWay: [
      {
        title: "Code Injection",
        description:
          "Manually add the Pixel base code to your website's header.",
      },
      {
        title: "Event Tracking",
        description:
          "Write custom JavaScript to track Add to Cart, Initiate Checkout, and Purchase events.",
      },
      {
        title: "Data Consistency",
        description:
          "Ensure the data passed to Facebook matches your catalog exactly.",
      },
    ],
    stats: [
      { value: "15+", label: "Auto-tracked Events" },
      { value: "100%", label: "Data Accuracy" },
      { value: "Real-time", label: "Reporting" },
      { value: "30%", label: "Avg ROAS Increase" },
    ],
    faqs: [
      {
        q: "Does it work with Facebook CAPI?",
        a: "Yes, we support both standard Pixel and Conversions API for better data reliability.",
      },
      {
        q: "Will it slow down my site?",
        a: "No, the pixel loads asynchronously and doesn't affect site performance.",
      },
      {
        q: "Can I track custom events?",
        a: "Yes, you can add custom event tracking without any coding.",
      },
      {
        q: "Is GDPR compliant?",
        a: "Yes, our implementation follows all privacy regulations.",
      },
    ],
    testimonial: {
      quote:
        "Facebook Pixel setup was effortless. We now track every conversion and our ad ROAS has doubled.",
      author: "Anjali Sharma",
      business: "Elite Fitness",
    },
    logo: "/images/icons/facebook-pixel.png",
    website: "https://business.facebook.com",
    color: "#0668E1",
    badge: "Official partner",
  },
  {
    slug: "sms-notifications",
    name: "SMS Integration",
    category: "Communication",
    description: "Automated SMS notifications for orders and account alerts.",
    longDescription:
      "Keep your customers informed at every step. Automatically send SMS notifications for order confirmations, shipping updates, and OTP signals through Nepal's most reliable SMS gateways.",
    features: [
      "Order status alerts",
      "OTP verification",
      "Custom sender ID support",
      "Delivery notifications",
    ],
    benefits: [
      "Increase customer engagement with timely updates",
      "Reduce missed orders with delivery notifications",
      "Build trust with OTP verification",
      "Cost-effective communication channel",
      "Automated marketing campaigns",
      "Two-way messaging support",
    ],
    hardWay: [
      {
        title: "Provider Research",
        description: "Find and compare various SMS gateway providers in Nepal.",
      },
      {
        title: "Credit Management",
        description:
          "Manually purchase and manage SMS credits for each provider.",
      },
      {
        title: "Custom Logic",
        description:
          "Write logic to trigger SMS on specific events like order updates or OTPs.",
      },
    ],
    stats: [
      { value: "98%", label: "Open Rate" },
      { value: "3s", label: "Delivery Time" },
      { value: "24/7", label: "Availability" },
      { value: "100k+", label: "Monthly Messages" },
    ],
    faqs: [
      {
        q: "What SMS providers do you support?",
        a: "We support all major Nepali SMS providers including Spiro, Janani, and others.",
      },
      {
        q: "Can I customize message templates?",
        a: "Yes, you can fully customize all SMS templates from your dashboard.",
      },
      {
        q: "How are SMS credits managed?",
        a: "You can add credits directly from your Nepdora dashboard. No separate login needed.",
      },
      {
        q: "Can I schedule SMS campaigns?",
        a: "Yes, you can schedule messages for future dates and times.",
      },
    ],
    testimonial: {
      quote:
        "Automated SMS notifications reduced our customer service calls by 60%. Customers love getting real-time order updates.",
      author: "Bikash Thapa",
      business: "Green Grocery",
    },
    logo: "/images/icons/sms-icon.png",
    website: "#",
    color: "#007AFF",
    badge: "Built-in tool",
  },
  {
    slug: "pathao-parcel",
    name: "Pathao Parcel",
    category: "Logistics",
    description:
      "Deliver your products quickly using Pathao's extensive network.",
    longDescription:
      "Integrate Pathao Parcel with your Nepdora store to offer lightning-fast delivery within Kathmandu Valley and beyond. Automate pickup requests and give your customers live tracking for their orders.",
    features: [
      "Instant rider assignment",
      "Live order tracking",
      "Area-based pricing",
      "Proof of delivery photos",
    ],
    benefits: [
      "Fast delivery within Kathmandu Valley",
      "Live tracking for customer satisfaction",
      "Automatic delivery status updates",
      "Competitive shipping rates",
      "Instant rider assignment",
      "Proof of delivery photos",
    ],
    hardWay: [
      {
        title: "Merchant Portal",
        description: "Setup a separate merchant account with Pathao.",
      },
      {
        title: "Delivery Requests",
        description:
          "Manually enter customer addresses and request pickups via their API or app.",
      },
      {
        title: "Status Tracking",
        description:
          "Build a custom tracker to show delivery status to your customers.",
      },
    ],
    stats: [
      { value: "2hr", label: "Avg Delivery" },
      { value: "500+", label: "Daily Rides" },
      { value: "100%", label: "Insurance Coverage" },
      { value: "24/7", label: "Service Hours" },
    ],
    faqs: [
      {
        q: "Is Pathao available outside Kathmandu?",
        a: "Pathao Parcel primarily serves Kathmandu Valley with expanding coverage to other cities.",
      },
      {
        q: "How are payments handled?",
        a: "You can pay per delivery or use prepaid credits. Nepdora integrates both options.",
      },
      {
        q: "What if a delivery fails?",
        a: "Pathao makes multiple delivery attempts. Failed deliveries are returned to you.",
      },
      {
        q: "Can I schedule pickups?",
        a: "Yes, you can schedule pickups for specific times.",
      },
    ],
    testimonial: {
      quote:
        "Pathao integration made same-day delivery possible. Our customers are thrilled with the speed.",
      author: "Manish Pradhan",
      business: "Urban Style",
    },
    logo: "/images/icons/pathao.png",
    website: "https://pathao.com",
    color: "#E51B24",
    badge: "Quick delivery",
  },
  {
    slug: "pos-system",
    name: "POS System",
    category: "Operations",
    description: "Manage your offline and online sales with a single system.",
    longDescription:
      "The Nepdora POS system bridges the gap between your physical store and online shop. Keep your inventory in sync, manage staff, and access detailed sales reports from any device, anywhere.",
    features: [
      "Unified inventory management",
      "Barcode scanning support",
      "Receipt printing",
      "Offline mode support",
    ],
    benefits: [
      "Real-time inventory sync across all channels",
      "Unified customer database and loyalty program",
      "Comprehensive sales analytics and reports",
      "Staff management with role-based access",
      "Offline mode support",
      "Multi-branch management",
    ],
    hardWay: [
      {
        title: "Separate Inventory",
        description:
          "Manually sync stock between your physical store and online website.",
      },
      {
        title: "Multiple Logins",
        description: "Switch between different apps for sales and accounting.",
      },
      {
        title: "Complex Hardware",
        description:
          "Purchase expensive specialized POS hardware and software.",
      },
    ],
    stats: [
      { value: "1000+", label: "Active POS Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "24/7", label: "Support" },
      { value: "50%", label: "Time Saved" },
    ],
    faqs: [
      {
        q: "Do I need special hardware?",
        a: "No, you can use any tablet or smartphone. We also support barcode scanners and receipt printers.",
      },
      {
        q: "Can I use offline mode?",
        a: "Yes, our POS works offline and syncs when connection is restored.",
      },
      {
        q: "How many users can I add?",
        a: "Unlimited staff accounts with role-based permissions.",
      },
      {
        q: "Does it integrate with accounting software?",
        a: "Yes, we integrate with popular accounting platforms.",
      },
    ],
    testimonial: {
      quote:
        "Managing our physical store and online shop from one dashboard is a game-changer. Inventory never goes out of sync.",
      author: "Rita Tamang",
      business: "Fashion Hub",
    },
    logo: "/images/icons/pos-icon.png",
    website: "#",
    color: "#4F46E5",
    badge: "Cloud POS",
  },
];
