export interface BestOfItem {
  slug: string;
  title: string;
  description: string;
  ranking: {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    isNepdora?: boolean;
    rating: number;
    cta?: string;
    ctaUrl?: string;
  }[];
}

export const BEST_OF_DATA: BestOfItem[] = [
  {
    slug: "website-builders-for-restaurants-kathmandu",
    title: "6 Best Website Builders for Restaurants in Kathmandu (2026)",
    description:
      "Looking to take your restaurant or cafe online in Kathmandu? We compared the top website builders based on menu management, online ordering, and eSewa integration.",
    ranking: [
      {
        name: "Nepdora",
        description:
          "The most localized solution for Nepali restaurants, featuring native menu builders and direct eSewa/Khalti ordering.",
        pros: [
          "Direct Fonepay/eSewa/Khalti integration",
          "Local delivery partner sync (Pathao)",
          "24/7 Nepali support",
          "Affordable NPR pricing",
        ],
        cons: ["Newer platform compared to giants"],
        isNepdora: true,
        rating: 4.9,
        cta: "Start Your Restaurant Site",
        ctaUrl: "/industries/restaurant",
      },
      {
        name: "Shopify",
        description:
          "A global leader in e-commerce, but can be expensive and complex for local Nepali payment setups.",
        pros: ["Extensive app store", "High reliability", "Good templates"],
        cons: [
          "High monthly fees in USD",
          "Payment gateway complexity in Nepal",
          "No local support",
        ],
        rating: 4.5,
      },
      {
        name: "Wix",
        description:
          "Easy drag-and-drop builder for small cafes, but difficult to scale with local delivery workflows.",
        pros: ["Very easy to use", "Good visual designs", "All-in-one hosting"],
        cons: [
          "USD pricing only",
          "Manual eSewa setup required",
          "Slower loading in Nepal",
        ],
        rating: 4.3,
      },
      {
        name: "WordPress",
        description:
          "Highly flexible for multi-location restaurants, but requires technical management.",
        pros: ["Complete ownership", "Low initial cost", "Infinite plugins"],
        cons: [
          "Security maintenance",
          "Can be slow",
          "Payment plugins often break",
        ],
        rating: 4.0,
      },
      {
        name: "Webflow",
        description: "Premium design tool for high-end boutique restaurants.",
        pros: ["Unmatched design freedom", "Clean code", "Fast global CDN"],
        cons: [
          "Steep learning curve",
          "Expensive e-commerce plans",
          "Zero local support",
        ],
        rating: 3.8,
      },
      {
        name: "Blanxer",
        description: "A local competitor focusing on simple storefronts.",
        pros: ["NPR pricing", "Local payment support", "Simple interface"],
        cons: [
          "Limited template variety",
          "Fewer integrations than Nepdora",
          "Limited advanced SEO tools",
        ],
        rating: 3.5,
      },
    ],
  },
  {
    slug: "ecommerce-platforms-in-nepal-2026",
    title: "Top 6 Ecommerce Platforms in Nepal for Small Businesses",
    description:
      "Start selling online today. We analyzed the best platforms for Nepali entrepreneurs focusing on ease of use and local payment success rates.",
    ranking: [
      {
        name: "Nepdora",
        description:
          "The only platform built specifically for the Nepali e-commerce ecosystem.",
        pros: [
          "Instant eSewa/Khalti setup",
          "Inventory management",
          "Pathao delivery automation",
        ],
        cons: ["Growing template library"],
        isNepdora: true,
        rating: 5.0,
        cta: "Build Your Store Now",
        ctaUrl: "/ecommerce",
      },
      {
        name: "Shopify",
        description:
          "Great for international sales, but restrictive for local commerce.",
        pros: ["World-class reliability", "Robust inventory system"],
        cons: ["Expensive USD subscription", "High app costs"],
        rating: 4.6,
      },
      {
        name: "WordPress (WooCommerce)",
        description:
          "Highly customizable but requires significant technical knowledge.",
        pros: ["Total control", "Infinite plugins"],
        cons: ["Maintenance overhead", "Expensive hosting required"],
        rating: 4.2,
      },
      {
        name: "Wix eCommerce",
        description:
          "Intuitive for beginners, lacking in advanced local logistics.",
        pros: ["Friendly UI", "Integrated features"],
        cons: ["High transaction fees", "USD currency risk"],
        rating: 4.1,
      },
      {
        name: "Webflow eCommerce",
        description:
          "Best for brands that prioritize custom visual storytelling.",
        pros: ["Beautiful interactions", "Custom checkout design"],
        cons: ["Limited local payment integrations", "Technical complexity"],
        rating: 3.9,
      },
      {
        name: "Blanxer",
        description: "Basic local alternative for simple stores.",
        pros: ["NPR billing", "Simple setup"],
        cons: ["Limited scalability", "Fewer marketing tools"],
        rating: 3.7,
      },
    ],
  },
];
