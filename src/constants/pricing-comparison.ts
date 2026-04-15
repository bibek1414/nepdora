export interface PricingComparisonData {
  platformName: string;
  slug: string;
  monthlyCostUSD: string;
  monthlyCostNPR: string;
  paymentMethod: string;
  transactionFees: string;
  currencyRisk: string;
  localSupport: string;
  cardLimitImpact: string;
  faqs: { question: string; answer: string }[];
}

export const PRICING_COMPARISON_DATA: Record<string, PricingComparisonData> = {
  shopify: {
    platformName: "Shopify",
    slug: "shopify",
    monthlyCostUSD: "$39",
    monthlyCostNPR: "~NPR 5,200",
    paymentMethod: "International Credit Card Only",
    transactionFees: "2% (if not using Shopify Payments)",
    currencyRisk: "High (USD Fluctuations)",
    localSupport: "Email/Chat Only (English)",
    cardLimitImpact: "Consumes Your Entire $500 Annual Limit",
    faqs: [
      {
        question: "Can I keep my Shopify domain?",
        answer:
          "Yes, you can easily point your existing .com or .com.np domain to Nepdora servers.",
      },
      {
        question: "Is migration from Shopify free?",
        answer:
          "We offer free migration support for businesses switching from Shopify. We'll help move your products and layout.",
      },
    ],
  },
  wix: {
    platformName: "Wix",
    slug: "wix",
    monthlyCostUSD: "$27",
    monthlyCostNPR: "~NPR 3,600",
    paymentMethod: "International Credit Card Only",
    transactionFees: "2% transaction processing fees",
    currencyRisk: "High (USD Fluctuations)",
    localSupport: "Chat Only (English)",
    cardLimitImpact: "Highly impacts your $500 annual card limit",
    faqs: [
      {
        question: "Can I migrate my Wix site to Nepdora?",
        answer:
          "Yes, we provide full assistance in migrating your content and design from Wix to our localized platform.",
      },
    ],
  },
  webflow: {
    platformName: "Webflow",
    slug: "webflow",
    monthlyCostUSD: "$23",
    monthlyCostNPR: "~NPR 3,100",
    paymentMethod: "International Credit Card Only",
    transactionFees: "Standard processing fees apply",
    currencyRisk: "High (USD Fluctuations)",
    localSupport: "Email/Forum Only",
    cardLimitImpact: "Consumes significant portion of your $500 limit",
    faqs: [
      {
        question: "Is Nepdora as flexible as Webflow?",
        answer:
          "Nepdora offers a balance of ease-of-use and flexibility, specifically optimized for the Nepali market with built-in localized features.",
      },
    ],
  },
  squarespace: {
    platformName: "Squarespace",
    slug: "squarespace",
    monthlyCostUSD: "$23",
    monthlyCostNPR: "~NPR 3,100",
    paymentMethod: "International Credit Card Only",
    transactionFees: "3% transaction fees on Business plan",
    currencyRisk: "High (USD Fluctuations)",
    localSupport: "Chat/Email Only",
    cardLimitImpact: "Consumes your annual dollar card limit",
    faqs: [
      {
        question: "Does Nepdora have templates like Squarespace?",
        answer:
          "Yes, we offer beautiful, modern templates that are specifically designed for Nepali businesses and load faster locally.",
      },
    ],
  },
  blanxer: {
    platformName: "Blanxer",
    slug: "blanxer",
    monthlyCostUSD: "N/A",
    monthlyCostNPR: "~NPR 2,000",
    paymentMethod: "eSewa, Khalti, Bank Transfer",
    transactionFees: "3% - 4% per transaction",
    currencyRisk: "Low (NPR)",
    localSupport: "Local Phone/Chat",
    cardLimitImpact: "Not Applicable",
    faqs: [
      {
        question: "Why choose Nepdora over Blanxer?",
        answer:
          "Nepdora offers 0% transaction fees and more design flexibility for different business types beyond just e-commerce stores.",
      },
      {
        question: "Can I migrate from Blanxer to Nepdora?",
        answer:
          "Yes, we help you import your products and content from Blanxer to our more flexible builder.",
      },
    ],
  },
};
