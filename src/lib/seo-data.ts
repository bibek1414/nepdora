import { NEPAL_CITIES } from "@/constants/nepal-cities";

export const industries = [
  "restaurant-website",
  "clothing-store",
  "gym",
  "school",
  "clinic",
  "travel-agency",
  "grocery-website",
  "real-estate",
  "travel-tours",
  "salon",
  "educational-consultancy",
  "grocery",
  "ecommerce-website",
  "clinic-website",
  "agency-website",
  "booking-website",
  "medical-clinic",
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
  "Nepalgunj",
  "Dhangadhi",
  "Bhairahawa",
  "Siddharthanagar",
  "Nepal",
].map(c => c.toLowerCase());

export const cities = NEPAL_CITIES.map(city => city.toLowerCase());

export const INDUSTRY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  "clothing-store": "Clothing Store",
  gym: "Gym & Fitness",
  school: "School & Education",
  clinic: "Medical Clinic",
  "travel-tours": "Travel & Tours",
  "real-estate": "Real Estate",
  salon: "Beauty Salon",
  "travel-agency": "Travel Agency",

  "educational-consultancy": "Educational Consultancy",
  grocery: "Grocery Store",
  ecommerce: "E-commerce Store",
  "agency-website": "Digital Agency",
  "grocery-website": "Grocery Store",
  "booking-website": "Booking & Appointments",
  "medical-clinic": "Medical Clinic",
};
