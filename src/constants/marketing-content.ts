export interface IndustryContent {
  title: string;
  description: string;
  benefits: string[];
  features: string[];
  whyUs: string;
  heroImageAlt: string;
}

const ecommerceContent: IndustryContent = {
  title: "Build Free E-Commerce Website in Nepal",
  description:
    "Start your online store today with integrated inventory, order management, and local payments.",
  benefits: [
    "Sell products 24/7 across Nepal",
    "Manage inventory and orders in one place",
    "Integrated eSewa, Khalti, and IME Pay",
    "Mobile-optimized for great shopping experience",
  ],
  features: [
    "Product Catalog with Variants",
    "Shopping Cart & Checkout",
    "Order Tracking System",
    "Customer Dashboard",
  ],
  whyUs:
    "Nepdora provides the most localized e-commerce engine in Nepal, handling everything from local logistics partnerships to payment settlements.",
  heroImageAlt: "Modern e-commerce dashboard for Nepali businesses",
};

const agencyContent: IndustryContent = {
  title: "Professional Agency Website Builder",
  description:
    "Showcase your portfolio and attract high-value clients with a premium agency website.",
  benefits: [
    "Display your work with stunning portfolios",
    "Build trust with professional service pages",
    "Capture leads with integrated CRM",
    "SEO optimized to outrank competitors",
  ],
  features: [
    "Dynamic Case Studies",
    "Service Listings & Pricing",
    "Testimonial Showcase",
    "Advanced Lead Forms",
  ],
  whyUs:
    "Agency life is fast. Nepdora lets you update your portfolio in seconds, ensuring your best work is always front and center.",
  heroImageAlt: "Clean and modern agency portfolio layout",
};

const bookingContent: IndustryContent = {
  title: "Best Online Booking & Appointment System",
  description:
    "Reduce no-shows and automate your scheduling with a powerful booking website.",
  benefits: [
    "24/7 automated appointment booking",
    "Reduce no-shows with SMS/Email reminders",
    "Accept booking deposits via eSewa",
    "Manage your staff's schedule efficiently",
  ],
  features: [
    "Real-time Availability Calendar",
    "Service-specific Booking Flows",
    "Staff Management Tools",
    "Automated Reminders",
  ],
  whyUs:
    "Old-school phone bookings are inefficient. Nepdora's booking engine works while you sleep, filling your calendar with confirmed appointments.",
  heroImageAlt: "Intuitive appointment booking interface",
};

const clinicContent: IndustryContent = {
  title: "Medical & Clinic Website Builder",
  description:
    "A professional digital home for your healthcare practice and patient care.",
  benefits: [
    "Easy patient appointment scheduling",
    "Professional doctor profiles",
    "Share health tips and medical resources",
    "Build patient trust with a clean design",
  ],
  features: [
    "Patient Appointment Portal",
    "Department & Service Listings",
    "Doctor Directory",
    "Health Blog & Resources",
  ],
  whyUs:
    "Healthcare requires trust. Nepdora's clinic templates are designed with a focus on accessibility, reliability, and patient-first experience.",
  heroImageAlt: "Professional healthcare and clinic website design",
};

const dentalContent: IndustryContent = {
  title: "Dental Practice Website Builder",
  description:
    "Grow your dental practice with specialized tools for patient engagement.",
  benefits: [
    "Specific booking for dental procedures",
    "Showcase results with 'Before & After' galleries",
    "Educate patients on dental hygiene",
    "Manage patient reviews and clinic ratings",
  ],
  features: [
    "Dental Procedure Catalog",
    "Smile Gallery (Before/After)",
    "Online Charting & Forms",
    "Patient Testimonials",
  ],
  whyUs:
    "Dentistry is visual. Our templates emphasize your treatment results and clinic hygiene, helping you convert website visitors into regular patients.",
  heroImageAlt: "Modern dental clinic website with smile gallery",
};

const restaurantContent: IndustryContent = {
  title: "Best Restaurant Website & Ordering System",
  description:
    "Grow your restaurant business in Nepal with online ordering, digital menus, and table reservations.",
  benefits: [
    "Accept online food orders directly",
    "Digital menus with QR code support",
    "Manage table reservations easily",
    "Integrated local payments (eSewa/Khalti)",
  ],
  features: [
    "Online Food Ordering Engine",
    "Dynamic Digital Menu",
    "Table Booking System",
    "Kitchen Management Dashboard",
  ],
  whyUs:
    "Dine-in or delivery, Nepdora gives your restaurant a professional edge with tools designed for the Nepalese food industry.",
  heroImageAlt: "Branded restaurant website with online ordering",
};

const clothingStoreContent: IndustryContent = {
  title: "Start Your Online Clothing Store in Nepal",
  description:
    "The ultimate platform for fashion boutiques and clothing brands in Nepal to sell online effortlessly.",
  benefits: [
    "Showcase your latest fashion collections",
    "Manage sizes, colors, and stock easily",
    "Integrated eSewa & Khalti for instant payments",
    "Optimized for Instagram & Facebook sellers",
  ],
  features: [
    "Size & Color Variant Management",
    "High-Resolution Image Galleries",
    "Discount & Coupon System",
    "Instagram Feed Integration",
  ],
  whyUs:
    "Nepdora understands the Nepali fashion market. We help you transition from social media selling to a professional, automated online store.",
  heroImageAlt: "Modern fashion boutique website setup",
};

const educationalConsultancyContent: IndustryContent = {
  title: "Professional Website for Educational Consultancies",
  description:
    "Build trust with students and parents using a high-converting website for your consultancy.",
  benefits: [
    "Display university partnerships and courses",
    "Capture student leads with optimized forms",
    "Manage appointments for counseling",
    "SEO optimized for overseas study keywords",
  ],
  features: [
    "University & Course Directory",
    "Online Application Portal",
    "Testimonial & Success Story Slider",
    "IELTS/PTE Class Booking",
  ],
  whyUs:
    "In the competitive education sector, a professional digital presence is everything. Nepdora helps you stand out and win student trust.",
  heroImageAlt: "Professional education consultancy website layout",
};

const travelAgencyContent: IndustryContent = {
  title: "Tours & Travel Agency Website Builder",
  description:
    "Create stunning travel itineraries and accept bookings from domestic and international tourists.",
  benefits: [
    "Showcase tour packages with rich media",
    "Integrated booking and inquiry system",
    "Mobile-friendly for travelers on the go",
    "Accept payments for trips and activities",
  ],
  features: [
    "Itinerary Builder with Day-to-Day Details",
    "Dynamic Pricing & Seasonal Offers",
    "Online Booking Calendar",
    "TripAdvisor Review Integration",
  ],
  whyUs:
    "Nepal's tourism is booming. Nepdora gives you the tools to compete globally while staying locally relevant with Nepali payment options.",
  heroImageAlt: "Adventure and tour package website preview",
};

const groceryContent: IndustryContent = {
  title: "Online Grocery & Kirana Store Platform",
  description:
    "Bring your local grocery shop online and deliver daily essentials to your neighborhood.",
  benefits: [
    "Fast checkout for recurring orders",
    "Manage thousands of SKUs easily",
    "Local delivery zone management",
    "Increase loyalty with digital points",
  ],
  features: [
    "Quick Category Navigation",
    "Scheduled Delivery Slots",
    "Bulk Order Processing",
    "Customer Loyalty Program",
  ],
  whyUs:
    "Grocery is all about convenience. Nepdora makes it easy for your customers to order their daily needs in just a few clicks.",
  heroImageAlt: "Fresh grocery delivery website interface",
};

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  ecommerce: ecommerceContent,
  "ecommerce-website": ecommerceContent,
  agency: agencyContent,
  "agency-website": agencyContent,
  booking: bookingContent,
  "booking-website": bookingContent,
  clinic: clinicContent,
  "clinic-website": clinicContent,
  dental: dentalContent,
  "dental-website": dentalContent,
  restaurant: restaurantContent,
  "restaurant-website": restaurantContent,
  "clothing-store": clothingStoreContent,
  "educational-consultancy": educationalConsultancyContent,
  "travel-agency": travelAgencyContent,
  grocery: groceryContent,
};
