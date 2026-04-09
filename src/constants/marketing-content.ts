export interface IndustryContent {
  title: string;
  description: string;
  benefits: string[];
  features: string[];
  whyUs: string;
  heroImageAlt: string;
  customH1?: string;
  customIntro?: string;
  customH2?: string;
  subHeadline?: string;
  ctaText?: string;
  howToSteps?: { title: string; desc: string }[];
  detailedFeatures?: { title: string; desc: string; icon: string }[];
  templates?: { name: string; image: string; type: string; demoUrl?: string }[];
  pricing?: {
    plan: string;
    price: string;
    features: string[];
    isPopular?: boolean;
  }[];
  leadCaptureCRM?: { title: string; features: string[]; image: string };
  comparison?: { nepdora: string[]; traditional: string[] };
}

const ecommerceContent: IndustryContent = {
  title: "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
  description:
    "Build your E-Commerce website in Nepal for free with Nepdora. Choose from 100+ templates, customize your brand, and manage orders, payments, and logistics.",
  customH1: "Create Your E-Commerce Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your E-commerce online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Inventory Management",
      desc: "Real-time stock tracking and low-stock alerts.",
      icon: "📦",
    },
    {
      title: "Shopping Carts",
      desc: "Seamless checkout experience for your customers.",
      icon: "🛒",
    },
    {
      title: "Local Delivery Zones",
      desc: "Define shipping costs by city and neighborhood.",
      icon: "🚚",
    },
    {
      title: "Nepalese Payments",
      desc: "Direct integration with eSewa, Khalti, and IME Pay.",
      icon: "💳",
    },
  ],
  howToSteps: [
    { title: "Choose a Template", desc: "Pick from 100+ design presets." },
    {
      title: "Add Your Products",
      desc: "Upload images, descriptions, and prices.",
    },
    {
      title: "Start Selling",
      desc: "Connect local payments and launch instantly.",
    },
  ],
  whyUs:
    "Nepdora provides the most localized e-commerce engine in Nepal, handling everything from local logistics partnerships to payment settlements.",
  heroImageAlt: "Modern e-commerce dashboard for Nepali businesses",
  templates: [
    {
      name: "Modern Retail",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      type: "retail",
    },
    {
      name: "Fashion Boutique",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
      type: "fashion",
    },
    {
      name: "Gadgets Store",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
      type: "tech",
    },
  ],
  comparison: {
    nepdora: [
      "Instant Launch",
      "Zero Upfront Cost",
      "Integrated Local Payments",
      "24/7 Support",
    ],
    traditional: [
      "3-6 Weeks Waiting",
      "High Development Fees",
      "Manual Payment Setup",
      "Hourly Maintenance Costs",
    ],
  },
};

const agencyContent: IndustryContent = {
  title:
    "Build a Professional Agency Website in Nepal (Fast & Cheap) | Nepdora",
  description:
    "Launch your digital agency, consultancy, or creative portfolio in Nepal in under 10 minutes. Build a fast, professional agency website with built-in lead generation and CRM.",
  customH1: "Build Your Agency Website in Nepal Fast",
  subHeadline:
    "Start fast and cheap. Launch your Agency online in under 10 minutes.",
  ctaText: "Start Building for Free",
  customH2: "Why Nepdora is the Best Builder for Nepali Agencies",
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
  detailedFeatures: [
    {
      title: "Everything You Need to Showcase Your Agency Portfolio",
      desc: "Highlight your client wins with dynamic case studies.",
      icon: "💼",
    },
    {
      title: "Built-in Lead Generation",
      desc: "Capture project inquiries directly from your site.",
      icon: "🎯",
    },
    {
      title: "Integrated CRM",
      desc: "Manage client leads and project statuses in one dashboard.",
      icon: "📊",
    },
    {
      title: "Premium SEO",
      desc: "Rank for agency keywords in Kathmandu and beyond.",
      icon: "🚀",
    },
  ],
  leadCaptureCRM: {
    title: "Lead Capture & CRM Built for Growth",
    features: [
      "Built-in inquiry forms",
      "Lead tracking dashboard",
      "Automated email notifications",
      "Localized client management",
    ],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  howToSteps: [
    {
      title: "Choose Agency Template",
      desc: "Pick a design that fits your brand.",
    },
    {
      title: "Showcase Portfolio",
      desc: "Upload your best agency work and services.",
    },
    {
      title: "Get Project Leads",
      desc: "Launch and start receiving client inquiries.",
    },
  ],
  whyUs:
    "Agency life is fast. Nepdora lets you update your portfolio in seconds, ensuring your best work is always front and center.",
  heroImageAlt: "Clean and modern agency portfolio layout",
};

const bookingContent: IndustryContent = {
  title: "Best Online Booking & Appointment System | Nepdora",
  description:
    "Reduce no-shows and automate your scheduling with a powerful booking website.",
  customH1: "Create Your Booking Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Booking online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Appointment Scheduling",
      desc: "Automated booking engine that works 24/7.",
      icon: "📅",
    },
    {
      title: "Calendar Syncing",
      desc: "Sync with your Google or Outlook calendar instantly.",
      icon: "🔄",
    },
    {
      title: "Deposit Collection",
      desc: "Accept upfront deposits via eSewa and Khalti.",
      icon: "💰",
    },
    {
      title: "Client Notifications",
      desc: "Automatic SMS and email appointment reminders.",
      icon: "📱",
    },
  ],
  howToSteps: [
    {
      title: "Select Booking Design",
      desc: "Choose a layout optimized for conversions.",
    },
    {
      title: "Setup Services",
      desc: "Define your availability and booking rules.",
    },
    {
      title: "Accept Bookings",
      desc: "Publish and let clients book appointments online.",
    },
  ],
  whyUs:
    "Old-school phone bookings are inefficient. Nepdora's booking engine works while you sleep, filling your calendar with confirmed appointments.",
  heroImageAlt: "Intuitive appointment booking interface",
};

const clinicContent: IndustryContent = {
  title: "Build a Clinic Website in Nepal (Fast Setup) | Nepdora",
  description:
    "A professional digital home for your healthcare practice and patient care.",
  customH1: "Create Your Clinic Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Medical Clinic online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Patient Appointments",
      desc: "Simple booking flow for medical consultations.",
      icon: "🏥",
    },
    {
      title: "Doctor Directory",
      desc: "Showcase your medical team and their specialties.",
      icon: "👨‍⚕️",
    },
    {
      title: "Health Resources",
      desc: "Share vital health information and clinic updates.",
      icon: "🗞️",
    },
    {
      title: "Local Map Integration",
      desc: "Make it easy for patients to find your clinic.",
      icon: "📍",
    },
  ],
  howToSteps: [
    {
      title: "Pick Clinic Template",
      desc: "Designed for trust and accessibility.",
    },
    {
      title: "Add Doctor Info",
      desc: "Setup profiles and clinic departments.",
    },
    {
      title: "Accept Patients",
      desc: "Launch and start managing appointments online.",
    },
  ],
  whyUs:
    "Healthcare requires trust. Nepdora's clinic templates are designed with a focus on accessibility, reliability, and patient-first experience.",
  heroImageAlt: "Professional healthcare and clinic website design",
};

const dentalContent: IndustryContent = {
  title: "Build a Dental Practice Website in Nepal (Fast Setup) | Nepdora",
  description:
    "Grow your dental practice with specialized tools for patient engagement.",
  customH1: "Create Your Dental Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Dental Clinic online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Dental Scheduling",
      desc: "Optimize your chair time with smart booking.",
      icon: "🦷",
    },
    {
      title: "Smile Gallery",
      desc: "Showcase your treatment results to new patients.",
      icon: "✨",
    },
    {
      title: "Patient Reviews",
      desc: "Build trust with localized testimonials.",
      icon: "⭐",
    },
    {
      title: "Online Registration",
      desc: "Patients can fill forms before their visit.",
      icon: "📄",
    },
  ],
  howToSteps: [
    {
      title: "Choose Dental Theme",
      desc: "Visual-heavy designs for smile results.",
    },
    {
      title: "Setup Dental Services",
      desc: "List procedures and bookable time slots.",
    },
    { title: "Go Live", desc: "Start attracting new patients across Nepal." },
  ],
  whyUs:
    "Dentistry is visual. Our templates emphasize your treatment results and clinic hygiene, helping you convert website visitors into regular patients.",
  heroImageAlt: "Modern dental clinic website with smile gallery",
};

const restaurantContent: IndustryContent = {
  title: "Build a Restaurant Website in Nepal (Fast & Affordable) | Nepdora",
  description:
    "Get your cafe, bakery, or restaurant online in minutes. Nepdora is the easiest and most affordable way to build a professional restaurant website in Nepal, complete with digital menus and table reservations.",
  customH1: "Build Your Restaurant Website in Nepal Today",
  customIntro:
    "Get your cafe, bakery, or restaurant online in minutes. Nepdora is the easiest and most affordable way to build a professional restaurant website in Nepal, complete with digital menus and table reservations.",
  subHeadline:
    "Start fast and cheap. Launch your Restaurant online in under 10 minutes.",
  ctaText: "Start Building for Free",
  customH2: "Why Nepdora is the Best Website Builder for Nepali Restaurants",
  howToSteps: [
    {
      title: "Pick a Template",
      desc: "Choose from our curated list of restaurant-specific designs.",
    },
    {
      title: "Add Your Menu",
      desc: "Upload your dishes, prices, and high-quality photos.",
    },
    {
      title: "Launch & Accept Orders",
      desc: "Connect your custom domain and start taking orders instantly.",
    },
  ],
  detailedFeatures: [
    {
      title: "Dynamic Digital Menus",
      desc: "Easy to update prices and items in real-time.",
      icon: "🍽️",
    },
    {
      title: "QR Code Generation",
      desc: "Print instantly for table service and menus.",
      icon: "📱",
    },
    {
      title: "Order & Delivery Management",
      desc: "Built-in tools for taking local orders.",
      icon: "🛵",
    },
    {
      title: "Mobile-First Design",
      desc: "Optimized for the way customers search in Nepal.",
      icon: "🚀",
    },
  ],
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
  templates: [
    {
      name: "Fine Dining",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      type: "luxury",
    },
    {
      name: "Fast Food",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
      type: "express",
    },
    {
      name: "Cozy Cafe",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      type: "cafe",
    },
  ],
  pricing: [
    {
      plan: "Starter",
      price: "Rs. 0",
      features: ["1 Location", "Basic Digital Menu", "Manual Orders"],
    },
    {
      plan: "Pro",
      price: "Rs. 999/mo",
      features: [
        "Priority Support",
        "QR Codes",
        "Online Payments",
        "Multi-user",
      ],
      isPopular: true,
    },
    {
      plan: "Enterprise",
      price: "Contact Us",
      features: ["White Label", "Custom Domain", "Advanced Analytics"],
    },
  ],
  comparison: {
    nepdora: [
      "Instant QR Menu",
      "Integrated Reservations",
      "Online Payments",
      "Mobile Dashboard",
    ],
    traditional: [
      "Paper Menu Printing",
      "Manual Bookings",
      "Cash Only Payments",
      "Desktop-only site",
    ],
  },
};

const clothingStoreContent: IndustryContent = {
  title: "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
  description:
    "The ultimate platform for fashion boutiques and clothing brands in Nepal to sell online effortlessly.",
  customH1: "Create Your Clothing Store Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Fashion online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Size & Color Inventory",
      desc: "Manage thousands of variants seamlessly.",
      icon: "👗",
    },
    {
      title: "Social Selling Tools",
      desc: "Convert your Facebook and Instagram fans into buyers.",
      icon: "📸",
    },
    {
      title: "Flash Sale Coupons",
      desc: "Run limited-time offers to clear seasonal stock.",
      icon: "⚡",
    },
    {
      title: "Delivery Tracking",
      desc: "Keep your stylish customers updated via SMS.",
      icon: "📍",
    },
  ],
  howToSteps: [
    {
      title: "Pick Fashion Template",
      desc: "Visual designs that highlight your items.",
    },
    { title: "Upload Collections", desc: "Setup variants by size and color." },
    {
      title: "Start Shipping",
      desc: "Receive local payments and ship across Nepal.",
    },
  ],
  whyUs:
    "Nepdora understands the Nepali fashion market. We help you transition from social media selling to a professional, automated online store.",
  heroImageAlt: "Modern fashion boutique website setup",
};

const educationalConsultancyContent: IndustryContent = {
  title: "Build an Educational Consultancy Website in Nepal | Nepdora Builder",
  description:
    "Build trust with students and parents using a high-converting website for your consultancy.",
  customH1: "Create Your Education Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Consultancy online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Course Directories",
      desc: "List universities and programs with easy search.",
      icon: "🎓",
    },
    {
      title: "Student Portals",
      desc: "Enable students to track their application status.",
      icon: "💼",
    },
    {
      title: "Counseling Bookings",
      desc: "Automatic scheduling for study abroad sessions.",
      icon: "📝",
    },
    {
      title: "Lead Generation",
      desc: "Built-in CRM for managing student inquiries.",
      icon: "🎯",
    },
  ],
  howToSteps: [
    {
      title: "Select Consultant Preset",
      desc: "Professional layouts for high trust.",
    },
    {
      title: "Import Courses",
      desc: "Setup your study abroad programs and partners.",
    },
    {
      title: "Recruit Students",
      desc: "Launch and start capturing student leads.",
    },
  ],
  whyUs:
    "In the competitive education sector, a professional digital presence is everything. Nepdora helps you stand out and win student trust.",
  heroImageAlt: "Professional education consultancy website layout",
};

const travelAgencyContent: IndustryContent = {
  title: "Create a Travel & Tour Website in Nepal | Nepdora Builder",
  description:
    "Create stunning travel itineraries and accept bookings from domestic and international tourists.",
  customH1: "Create Your Travel Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Tour Agency online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Itinerary Builder",
      desc: "Showcase day-by-day details with beautiful images.",
      icon: "🏔️",
    },
    {
      title: "Dynamic Pricing",
      desc: "Adjust costs by season, group size, or pax.",
      icon: "💵",
    },
    {
      title: "Online Reservations",
      desc: "Confirm trip bookings with eSewa/Khalti deposits.",
      icon: "📱",
    },
    {
      title: "Travel Reviews",
      desc: "Display TripAdvisor ratings directly on your site.",
      icon: "🎒",
    },
  ],
  howToSteps: [
    {
      title: "Pick Adventure Theme",
      desc: "High-impact images and itinerary layouts.",
    },
    {
      title: "Add Your Trips",
      desc: "Setup tour details, dates, and pricing.",
    },
    {
      title: "Accept Tourists",
      desc: "Launch and start selling Nepal tours globally.",
    },
  ],
  whyUs:
    "Nepal's tourism is booming. Nepdora gives you the tools to compete globally while staying locally relevant with Nepali payment options.",
  heroImageAlt: "Adventure and tour package website preview",
};

const groceryContent: IndustryContent = {
  title: "Build an E-commerce Website in Nepal (Start Selling Today) | Nepdora",
  description:
    "Bring your local grocery shop online and deliver daily essentials to your neighborhood.",
  customH1: "Create Your Grocery Website in Nepal Today.",
  subHeadline:
    "Start fast and cheap. Launch your Store online in under 10 minutes.",
  ctaText: "Start Building for Free",
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
  detailedFeatures: [
    {
      title: "Fast Checkout",
      desc: "Optimized for customers ordering weekly essentials.",
      icon: "🛒",
    },
    {
      title: "Bulk SKU Management",
      desc: "Upload and update thousands of items via Excel.",
      icon: "🚜",
    },
    {
      title: "Delivery Scheduling",
      desc: "Customers pick their preferred delivery time.",
      icon: "⏰",
    },
    {
      title: "Neighborhood Zones",
      desc: "Define free delivery for local clients.",
      icon: "🏘️",
    },
  ],
  howToSteps: [
    {
      title: "Choose Retail Layout",
      desc: "Designed for high-volume grocery sales.",
    },
    {
      title: "Import Inventory",
      desc: "Sync your Kirana stock with your online store.",
    },
    { title: "Start Delivering", desc: "Accept payments and deliver locally." },
  ],
  whyUs:
    "Grocery is all about convenience. Nepdora makes it easy for your customers to order their daily needs in just a few clicks.",
  heroImageAlt: "Fresh grocery delivery website interface",
};

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  ecommerce: ecommerceContent,
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
