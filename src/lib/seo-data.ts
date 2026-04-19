import { NEPAL_CITIES } from "@/constants/nepal-cities";

export const industries = [
  "restaurant-website",
  "ecommerce-website",
  "clothing-website",
  "school-college-website",
  "medical-clinic-website",
  "travel-tours-website",
  "gym-fitness-website",
  "real-estate-website",
  "beauty-salon-website",
  "grocery-website",
  "educational-consultancy-website",
  "digital-agency-website",
  "dental-clinic-website",
  "booking-service-website",
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
  "restaurant-website": "Restaurant",
  "ecommerce-website": "E-commerce",
  "clothing-website": "Clothing",
  "school-college-website": "School & College",
  "medical-clinic-website": "Medical Clinic",
  "travel-tours-website": "Travel & Tours",
  "gym-fitness-website": "Gym & Fitness",
  "real-estate-website": "Real Estate",
  "beauty-salon-website": "Beauty Salon",
  "grocery-website": "Grocery Store",
  "educational-consultancy-website": "Educational Consultancy",
  "digital-agency-website": "Digital Agency",
  "dental-clinic-website": "Dental Clinic",
  "booking-service-website": "Booking & Services",
};

export const SEO_LOCATION_CONFIG = [
  { city: "Kathmandu", industry: "restaurant-website" },
  { city: "Pokhara", industry: "ecommerce-website" },
  { city: "Lalitpur", industry: "medical-clinic-website" },
  { city: "Bharatpur", industry: "educational-consultancy-website" },
  { city: "Biratnagar", industry: "clothing-website" },
  { city: "Birgunj", industry: "grocery-website" },
  { city: "Dharan", industry: "agency-website" },
  { city: "Itahari", industry: "gym-website" },
  { city: "Butwal", industry: "medical-clinic-website" },
  { city: "Hetauda", industry: "travel-website" },
  { city: "Janakpur", industry: "restaurant-website" },
  { city: "Jhapa", industry: "ecommerce-website" },
  { city: "Nepalgunj", industry: "medical-clinic-website" },
  { city: "Dhangadhi", industry: "educational-consultancy-website" },
  { city: "Bhairahawa", industry: "clothing-website" },
  { city: "Siddharthanagar", industry: "grocery-website" },
];
