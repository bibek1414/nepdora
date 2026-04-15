import { NEPAL_CITIES } from "@/constants/nepal-cities";

export const industries = [
  "restaurant-website",
  "ecommerce-store",
  "clothing-brand",
  "school-college",
  "medical-clinic",
  "travel-agency",
  "gym-fitness",
  "real-estate",
  "beauty-salon",
  "grocery-store",
  "educational-consultancy",
  "digital-agency",
  "ecommerce"
];

// Top 15 major cities for pre-rendering to optimize build size
export const MAJOR_CITIES = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bharatpur",
  "Biratnagar",
  "Birgunj",
  "Dharan",
  "Itahari",
  "Butwal",
  "Hetauda",
  "Janakpur",
  "Jhapa",
  "Nepalgunj",
  "Dhangadhi",
  "Bhairahawa",
  "Siddharthanagar",
  "Nepal",
].map(c => c.toLowerCase());

export const cities = NEPAL_CITIES.map(city => city.toLowerCase());

export const INDUSTRY_LABELS: Record<string, string> = {
  "restaurant-website": "Restaurant & Cafe",
  "ecommerce-store": "Ecommerce Store",
  "clothing-brand": "Clothing Brand",
  "school-college": "School & College",
  "medical-clinic": "Medical Clinic",
  "travel-agency": "Travel Agency",
  "gym-fitness": "Gym & Fitness",
  "real-estate": "Real Estate",
  "beauty-salon": "Beauty Salon",
  "grocery-store": "Grocery Store",
  "educational-consultancy": "Educational Consultancy",
  "digital-agency": "Digital Agency",
};

export const SEO_LOCATION_CONFIG = [
  { city: "Kathmandu", industry: "restaurant-website" },
  { city: "Pokhara", industry: "ecommerce-store" },
  { city: "Lalitpur", industry: "medical-clinic" },
  { city: "Bharatpur", industry: "educational-consultancy" },
  { city: "Biratnagar", industry: "clothing-brand" },
  { city: "Birgunj", industry: "grocery-store" },
  { city: "Dharan", industry: "digital-agency" },
  { city: "Itahari", industry: "gym-fitness" },
  { city: "Butwal", industry: "medical-clinic" },
  { city: "Hetauda", industry: "travel-agency" },
  { city: "Janakpur", industry: "restaurant-website" },
  { city: "Jhapa", industry: "ecommerce-store" },
  { city: "Nepalgunj", industry: "medical-clinic" },
  { city: "Dhangadhi", industry: "educational-consultancy" },
  { city: "Bhairahawa", industry: "clothing-brand" },
  { city: "Siddharthanagar", industry: "grocery-store" },
];
