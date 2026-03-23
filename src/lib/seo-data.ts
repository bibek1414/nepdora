import { NEPAL_CITIES } from "@/constants/nepal-cities";

export const industries = [
  "restaurant",
  "clothing-store",
  "gym",
  "school",
  "clinic",
  "travel-agency",
  "real-estate",
  "salon",
  "educational-consultancy",
  "grocery",
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
].map(c => c.toLowerCase());

export const cities = NEPAL_CITIES.map(city => city.toLowerCase());

export const INDUSTRY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  "clothing-store": "Clothing Store",
  gym: "Gym & Fitness",
  school: "School & Education",
  clinic: "Medical Clinic",
  "travel-agency": "Travel Agency",
  "real-estate": "Real Estate",
  salon: "Beauty Salon",
  "educational-consultancy": "Educational Consultancy",
  grocery: "Grocery Store",
};
