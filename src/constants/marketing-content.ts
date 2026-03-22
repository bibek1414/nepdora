export interface IndustryContent {
  title: string;
  description: string;
  benefits: string[];
  features: string[];
  whyUs: string;
  heroImageAlt: string;
}

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  "ecommerce-website": {
    title: "Build Free E-Commerce Website in Nepal",
    description: "Start your online store today with integrated inventory, order management, and local payments.",
    benefits: [
      "Sell products 24/7 across Nepal",
      "Manage inventory and orders in one place",
      "Integrated eSewa, Khalti, and IME Pay",
      "Mobile-optimized for great shopping experience"
    ],
    features: [
      "Product Catalog with Variants",
      "Shopping Cart & Checkout",
      "Order Tracking System",
      "Customer Dashboard"
    ],
    whyUs: "Nepdora provides the most localized e-commerce engine in Nepal, handling everything from local logistics partnerships to payment settlements.",
    heroImageAlt: "Modern e-commerce dashboard for Nepali businesses"
  },
  "agency-website": {
    title: "Professional Agency Website Builder",
    description: "Showcase your portfolio and attract high-value clients with a premium agency website.",
    benefits: [
      "Display your work with stunning portfolios",
      "Build trust with professional service pages",
      "Capture leads with integrated CRM",
      "SEO optimized to outrank competitors"
    ],
    features: [
      "Dynamic Case Studies",
      "Service Listings & Pricing",
      "Testimonial Showcase",
      "Advanced Lead Forms"
    ],
    whyUs: "Agency life is fast. Nepdora lets you update your portfolio in seconds, ensuring your best work is always front and center.",
    heroImageAlt: "Clean and modern agency portfolio layout"
  },
  "booking-website": {
    title: "Best Online Booking & Appointment System",
    description: "Reduce no-shows and automate your scheduling with a powerful booking website.",
    benefits: [
      "24/7 automated appointment booking",
      "Reduce no-shows with SMS/Email reminders",
      "Accept booking deposits via eSewa",
      "Manage your staff's schedule efficiently"
    ],
    features: [
      "Real-time Availability Calendar",
      "Service-specific Booking Flows",
      "Staff Management Tools",
      "Automated Reminders"
    ],
    whyUs: "Old-school phone bookings are inefficient. Nepdora's booking engine works while you sleep, filling your calendar with confirmed appointments.",
    heroImageAlt: "Intuitive appointment booking interface"
  },
  "clinic-website": {
    title: "Medical & Clinic Website Builder",
    description: "A professional digital home for your healthcare practice and patient care.",
    benefits: [
      "Easy patient appointment scheduling",
      "Professional doctor profiles",
      "Share health tips and medical resources",
      "Build patient trust with a clean design"
    ],
    features: [
      "Patient Appointment Portal",
      "Department & Service Listings",
      "Doctor Directory",
      "Health Blog & Resources"
    ],
    whyUs: "Healthcare requires trust. Nepdora's clinic templates are designed with a focus on accessibility, reliability, and patient-first experience.",
    heroImageAlt: "Professional healthcare and clinic website design"
  },
  "dental-website": {
    title: "Dental Practice Website Builder",
    description: "Grow your dental practice with specialized tools for patient engagement.",
    benefits: [
      "Specific booking for dental procedures",
      "Showcase results with 'Before & After' galleries",
      "Educate patients on dental hygiene",
      "Manage patient reviews and clinic ratings"
    ],
    features: [
      "Dental Procedure Catalog",
      "Smile Gallery (Before/After)",
      "Online Charting & Forms",
      "Patient Testimonials"
    ],
    whyUs: "Dentistry is visual. Our templates emphasize your treatment results and clinic hygiene, helping you convert website visitors into regular patients.",
    heroImageAlt: "Modern dental clinic website with smile gallery"
  },
  "restaurant-website": {
    title: "Best Restaurant Website & Ordering System",
    description: "Grow your restaurant business in Nepal with online ordering, digital menus, and table reservations.",
    benefits: [
      "Accept online food orders directly",
      "Digital menus with QR code support",
      "Manage table reservations easily",
      "Integrated local payments (eSewa/Khalti)"
    ],
    features: [
      "Online Food Ordering Engine",
      "Dynamic Digital Menu",
      "Table Booking System",
      "Kitchen Management Dashboard"
    ],
    whyUs: "Dine-in or delivery, Nepdora gives your restaurant a professional edge with tools designed for the Nepalese food industry.",
    heroImageAlt: "Branded restaurant website with online ordering"
  }
};
