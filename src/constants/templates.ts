export interface TemplateCategory {
  slug: string;
  name: string;
  description: string;
}

export const TEMPLATE_CATEGORY_DATA: Record<string, TemplateCategory> = {
  "restaurant-cafe": {
    slug: "restaurant-cafe",
    name: "Restaurant & Cafe",
    description: "Showcase your menu, accept online orders, and manage reservations with our beautiful restaurant templates.",
  },
  "ecommerce-store": {
    slug: "ecommerce-store",
    name: "Ecommerce Store",
    description: "Launch your online store with built-in eSewa and Khalti payments, inventory management, and more.",
  },
  "clothing-brand": {
    slug: "clothing-brand",
    name: "Clothing Brand",
    description: "Showcase your latest collections and manage size/color variants with fashion-forward templates.",
  },
  "school-college": {
    slug: "school-college",
    name: "School & College",
    description: "Connect with students and parents through professional educational institution websites.",
  },
  "medical-clinic": {
    slug: "medical-clinic",
    name: "Medical Clinic",
    description: "Provide a professional online presence for your medical practice or clinic.",
  },
  "travel-agency": {
    slug: "travel-agency",
    name: "Travel Agency",
    description: "Inspire travelers and book tours with stunning travel agency templates.",
  },
  "gym-fitness": {
    slug: "gym-fitness",
    name: "Gym & Fitness",
    description: "Attract new members and showcase your fitness programs with gym website templates.",
  },
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    description: "Showcase properties and attract buyers with real estate website templates.",
  },
  "beauty-salon": {
    slug: "beauty-salon",
    name: "Beauty Salon",
    description: "Book appointments and showcase your beauty services with salon templates.",
  },
  "grocery-store": {
    slug: "grocery-store",
    name: "Grocery Store",
    description: "Optimized retail layouts for neighborhood grocery stores and marts.",
  },
  "educational-consultancy": {
    slug: "educational-consultancy",
    name: "Educational Consultancy",
    description: "High-trust layouts for study abroad and educational consultancies.",
  },
  "digital-agency": {
    slug: "digital-agency",
    name: "Digital Agency",
    description: "Build trust and showcase your services with agency templates that convert visitors into clients.",
  },
  portfolio: {
    slug: "portfolio",
    name: "Portfolio",
    description: "Showcase your work beautifully with our portfolio templates designed for creatives and professionals.",
  },
  business: {
    slug: "business",
    name: "Business",
    description: "Professional business websites that establish credibility and drive growth.",
  },
};

export const TEMPLATE_CATEGORIES = Object.keys(TEMPLATE_CATEGORY_DATA);
