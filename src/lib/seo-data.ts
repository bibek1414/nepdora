import { NEPAL_CITIES } from "@/constants/nepal-cities";

export const industries = [
  "restaurant-website",
  "ecommerce-website",
  "clothing-website",
  "school-website",
  "medical-clinic-website",
  "travel-website",
  "gym-website",
  "real-estate-website",
  "salon-website",
  "grocery-website",
  "educational-consultancy-website",
  "agency-website",
  "dentist-website",
  "booking-website",
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
  "clothing-website": "Clothing Brand",
  "school-website": "School & College",
  "medical-clinic-website": "Medical Clinic",
  "travel-website": "Travel & Tours",
  "gym-website": "Gym & Fitness",
  "real-estate-website": "Real Estate",
  "salon-website": "Beauty Salon",
  "grocery-website": "Grocery Store",
  "educational-consultancy-website": "Educational Consultancy",
  "agency-website": "Digital Agency",
  "dentist-website": "Dental Clinic",
  "booking-website": "Booking & Service",
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
