export interface BestOfItem {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  toolsTested: string;
  hoursResearched: string;
  businessesConsulted: string;
  scoring: {
    label: string;
    weight: string;
  }[];
  ranking: {
    name: string;
    description: string;
    bestFor: string;
    pricing: string;
    localPayments: string;
    easeOfUse: string;
    support: string;
    idealFor: string;
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
    lastUpdated: "April 15, 2026",
    toolsTested: "18",
    hoursResearched: "42",
    businessesConsulted: "11",
    scoring: [
      { label: "Local payment support", weight: "25%" },
      { label: "Ordering and menu workflow", weight: "20%" },
      { label: "Ease of setup", weight: "15%" },
      { label: "Design flexibility", weight: "15%" },
      { label: "Support quality", weight: "15%" },
      { label: "Total operating cost", weight: "10%" },
    ],
    ranking: [
      {
        name: "Nepdora",
        description:
          "The most localized solution for Nepali restaurants, featuring native menu builders and direct eSewa/Khalti ordering.",
        bestFor: "Restaurants that need local payments and delivery fast",
        pricing: "NPR pricing",
        localPayments: "Native eSewa, Khalti, Fonepay",
        easeOfUse: "Easy",
        support: "Local team",
        idealFor: "Cafes, cloud kitchens, and restaurants serving Nepal",
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
        ctaUrl: "/restaurant-website",
      },
      {
        name: "Shopify",
        description:
          "A global leader in e-commerce, but can be expensive and complex for local Nepali payment setups.",
        bestFor: "Restaurants selling products or gift cards internationally",
        pricing: "Higher USD plans",
        localPayments: "Manual or custom setup",
        easeOfUse: "Moderate",
        support: "Global support",
        idealFor: "Operators prioritizing global apps over Nepal-first flows",
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
        bestFor:
          "Small cafes that care more about design speed than integrations",
        pricing: "USD subscription",
        localPayments: "Manual setup required",
        easeOfUse: "Easy",
        support: "Global support",
        idealFor: "Simple brochure-style cafe sites",
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
        bestFor: "Teams that want full control and can manage plugins",
        pricing: "Low start, variable upkeep",
        localPayments: "Plugin based",
        easeOfUse: "Advanced",
        support: "Community and agency support",
        idealFor: "Custom restaurant sites with a technical owner",
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
        bestFor: "Brand-heavy restaurant sites with premium design needs",
        pricing: "Premium USD plans",
        localPayments: "Limited local support",
        easeOfUse: "Moderate to advanced",
        support: "Global support",
        idealFor: "Boutique restaurants focused on visual branding",
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
        bestFor: "Smaller restaurants that want a simpler local option",
        pricing: "NPR pricing",
        localPayments: "Local support available",
        easeOfUse: "Easy",
        support: "Local support",
        idealFor: "Basic restaurant storefronts with fewer advanced needs",
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
    lastUpdated: "April 15, 2026",
    toolsTested: "22",
    hoursResearched: "55",
    businessesConsulted: "14",
    scoring: [
      { label: "Payment success in Nepal", weight: "25%" },
      { label: "Inventory and fulfillment", weight: "20%" },
      { label: "Ease of setup", weight: "15%" },
      { label: "Marketing and SEO", weight: "15%" },
      { label: "Support quality", weight: "15%" },
      { label: "Total operating cost", weight: "10%" },
    ],
    ranking: [
      {
        name: "Nepdora",
        description:
          "The only platform built specifically for the Nepali e-commerce ecosystem.",
        bestFor: "Local-first stores that need payments and delivery ready",
        pricing: "NPR pricing",
        localPayments: "Native eSewa, Khalti, Fonepay",
        easeOfUse: "Easy",
        support: "Local team",
        idealFor: "Small and mid-sized Nepali ecommerce brands",
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
        bestFor: "Cross-border sellers and larger catalog brands",
        pricing: "Higher USD plans",
        localPayments: "Manual or app-based",
        easeOfUse: "Moderate",
        support: "Global support",
        idealFor: "Brands selling beyond Nepal with app-heavy workflows",
        pros: ["World-class reliability", "Robust inventory system"],
        cons: ["Expensive USD subscription", "High app costs"],
        rating: 4.6,
      },
      {
        name: "WordPress (WooCommerce)",
        description:
          "Highly customizable but requires significant technical knowledge.",
        bestFor: "Custom stores with in-house technical help",
        pricing: "Variable",
        localPayments: "Plugin based",
        easeOfUse: "Advanced",
        support: "Community and agency support",
        idealFor: "Businesses wanting ownership over every workflow",
        pros: ["Total control", "Infinite plugins"],
        cons: ["Maintenance overhead", "Expensive hosting required"],
        rating: 4.2,
      },
      {
        name: "Wix eCommerce",
        description:
          "Intuitive for beginners, lacking in advanced local logistics.",
        bestFor: "Smaller stores that want simplicity over depth",
        pricing: "USD subscription",
        localPayments: "Limited or manual",
        easeOfUse: "Easy",
        support: "Global support",
        idealFor: "Small catalogs and founder-led brands",
        pros: ["Friendly UI", "Integrated features"],
        cons: ["High transaction fees", "USD currency risk"],
        rating: 4.1,
      },
      {
        name: "Webflow eCommerce",
        description:
          "Best for brands that prioritize custom visual storytelling.",
        bestFor: "Design-led ecommerce brands",
        pricing: "Premium USD plans",
        localPayments: "Limited local support",
        easeOfUse: "Moderate to advanced",
        support: "Global support",
        idealFor: "Story-driven brands with custom merchandising needs",
        pros: ["Beautiful interactions", "Custom checkout design"],
        cons: ["Limited local payment integrations", "Technical complexity"],
        rating: 3.9,
      },
      {
        name: "Blanxer",
        description: "Basic local alternative for simple stores.",
        bestFor: "Simple local stores with fewer feature demands",
        pricing: "NPR pricing",
        localPayments: "Local support available",
        easeOfUse: "Easy",
        support: "Local support",
        idealFor: "Founders who want basic local commerce features",
        pros: ["NPR billing", "Simple setup"],
        cons: ["Limited scalability", "Fewer marketing tools"],
        rating: 3.7,
      },
    ],
  },
  {
    slug: "website-builders-for-clothing-store-nepal",
    title: "5 Best Website Builders for Clothing Stores in Nepal",
    description:
      "Planning to launch your fashion brand? We ranked the top platforms for clothing boutiques in Nepal based on image galleries, inventory, and local shipping sync.",
    lastUpdated: "April 15, 2026",
    toolsTested: "16",
    hoursResearched: "39",
    businessesConsulted: "9",
    scoring: [
      { label: "Catalog and variant handling", weight: "25%" },
      { label: "Local delivery and payments", weight: "20%" },
      { label: "Visual merchandising", weight: "20%" },
      { label: "Ease of setup", weight: "15%" },
      { label: "Support quality", weight: "10%" },
      { label: "Total operating cost", weight: "10%" },
    ],
    ranking: [
      {
        name: "Nepdora",
        description:
          "Perfect for fashion brands with built-in size/color variant support and seamless Pathao integration for deliveries.",
        bestFor: "Fashion brands selling mainly inside Nepal",
        pricing: "NPR pricing",
        localPayments: "Native eSewa, Khalti, Fonepay",
        easeOfUse: "Easy",
        support: "Local team",
        idealFor: "Boutiques that need local checkout and delivery workflows",
        pros: [
          "Local logistics automation",
          "Mobile-first fashion templates",
          "Local payment gateways",
        ],
        cons: ["Third-party app ecosystem is still growing"],
        isNepdora: true,
        rating: 4.9,
        cta: "Launch Your Boutique",
        ctaUrl: "/clothing-store",
      },
      {
        name: "Shopify",
        description: "The global standard for fashion, but with higher costs.",
        bestFor: "Ambitious apparel brands scaling globally",
        pricing: "Higher USD plans",
        localPayments: "Manual or app-based",
        easeOfUse: "Moderate",
        support: "Global support",
        idealFor: "Growth-stage fashion brands with app budget",
        pros: ["Infinite themes", "Great marketing tools"],
        cons: ["Transaction fees", "No local delivery support"],
        rating: 4.7,
      },
      {
        name: "Wix",
        description: "Great for visual storytelling and lookbooks.",
        bestFor: "Smaller fashion labels prioritizing aesthetics",
        pricing: "USD subscription",
        localPayments: "Manual setup required",
        easeOfUse: "Easy",
        support: "Global support",
        idealFor: "Lookbook-heavy brands with simpler operations",
        pros: ["Drag-and-drop ease", "Beautiful galleries"],
        cons: ["Slower checkout", "USD pricing"],
        rating: 4.2,
      },
      {
        name: "WordPress",
        description: "Infinite customization for unique fashion brands.",
        bestFor: "Custom fashion stores with technical support",
        pricing: "Variable",
        localPayments: "Plugin based",
        easeOfUse: "Advanced",
        support: "Community and agency support",
        idealFor: "Brands needing custom content or unique store logic",
        pros: ["Plugin variety", "SEO power"],
        cons: ["Maintenance heavy", "Complex setup"],
        rating: 4.0,
      },
      {
        name: "Blanxer",
        description: "Simple storefront for small Instagram shops.",
        bestFor: "Smaller social-first clothing sellers",
        pricing: "NPR pricing",
        localPayments: "Local support available",
        easeOfUse: "Easy",
        support: "Local support",
        idealFor: "Instagram shops launching their first web storefront",
        pros: ["Easy setup", "Local payments"],
        cons: ["Limited themes", "Basic features"],
        rating: 3.6,
      },
    ],
  },
  {
    slug: "website-builders-for-educational-consultancy-nepal",
    title:
      "6 Best Website Builders for Educational Consultancies in Nepal (2026)",
    description:
      "Planning to start an education consultancy? We ranked the best website builders for visa service providers and study abroad consultants in Nepal based on forms and CRM.",
    lastUpdated: "April 15, 2026",
    toolsTested: "14",
    hoursResearched: "36",
    businessesConsulted: "8",
    scoring: [
      { label: "Lead capture and forms", weight: "25%" },
      { label: "Appointment and workflow support", weight: "20%" },
      { label: "Ease of setup", weight: "15%" },
      { label: "Content and SEO flexibility", weight: "15%" },
      { label: "Support quality", weight: "15%" },
      { label: "Total operating cost", weight: "10%" },
    ],
    ranking: [
      {
        name: "Nepdora",
        description:
          "The ideal choice for Nepali consultancies, offering built-in appointment booking and student lead management systems.",
        bestFor: "Consultancies that want leads, bookings, and local setup",
        pricing: "NPR pricing",
        localPayments: "Native local payment support",
        easeOfUse: "Easy",
        support: "Local team",
        idealFor: "Education consultancies collecting leads and fees online",
        pros: [
          "Integrated lead management",
          "Appointment booking system",
          "Local payment for application fees",
        ],
        cons: ["Marketplace is expanding"],
        isNepdora: true,
        rating: 4.9,
        cta: "Build Your Consultancy Site",
        ctaUrl: "/educational-consultancy",
      },
      {
        name: "Wix",
        description:
          "Great for beginners with many templates, but manual local payment integration is needed.",
        bestFor: "Smaller consultancies wanting a quick brochure site",
        pricing: "USD subscription",
        localPayments: "Manual setup required",
        easeOfUse: "Easy",
        support: "Global support",
        idealFor: "Founders building a simple informational site first",
        pros: ["Very easy to customize", "Good form builder"],
        cons: ["High recurring costs", "No local support"],
        rating: 4.5,
      },
      {
        name: "WordPress",
        description:
          "High flexibility for complex documentation and student portals.",
        bestFor: "Consultancies wanting custom portals or workflows",
        pricing: "Variable",
        localPayments: "Plugin based",
        easeOfUse: "Advanced",
        support: "Community and agency support",
        idealFor: "Larger consultancies with technical help",
        pros: ["Total ownership", "Infinite customization"],
        cons: ["Maintenance overhead", "Security risks"],
        rating: 4.2,
      },
      {
        name: "Shopify",
        description:
          "Better suited for products, but usable for fee-based services.",
        bestFor: "Service businesses monetizing digital products or payments",
        pricing: "Higher USD plans",
        localPayments: "Manual or custom setup",
        easeOfUse: "Moderate",
        support: "Global support",
        idealFor: "Hybrid consultancy plus product or course sales",
        pros: ["Robust checkout", "Reliable hosting"],
        cons: ["Transaction fees", "Not built for services"],
        rating: 3.8,
      },
      {
        name: "Webflow",
        description: "Best for high-end consultancies prioritizing branding.",
        bestFor: "Premium consultancies with strong branding requirements",
        pricing: "Premium USD plans",
        localPayments: "Limited local support",
        easeOfUse: "Moderate to advanced",
        support: "Global support",
        idealFor: "High-end brands focused on polished presentation",
        pros: ["Premium design", "Clean code"],
        cons: ["Steep learning curve", "Expensive"],
        rating: 3.7,
      },
      {
        name: "Blanxer",
        description: "Simple storefront for those starting with basic needs.",
        bestFor: "Basic consultancy sites on a lighter budget",
        pricing: "NPR pricing",
        localPayments: "Local support available",
        easeOfUse: "Easy",
        support: "Local support",
        idealFor: "New consultancies that need a simple web presence",
        pros: ["Local billing", "Easy setup"],
        cons: ["Limited features", "Fixed templates"],
        rating: 3.5,
      },
    ],
  },
];
