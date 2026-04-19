"use client";

import {
  ChevronRight,
  Zap,
  Smartphone,
  Layout,
  Globe,
  Users,
  Sparkles,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TemplateCategoryHeroProps {
  categoryName: string;
  categorySlug?: string;
  categoryDescription?: string;
  categoryBadge?: string;
  templateCount?: number;
  features?: string[];
}

export function TemplateCategoryHero({
  categoryName,
  categorySlug,
  categoryDescription,
  categoryBadge,
  templateCount = 24,
}: TemplateCategoryHeroProps) {
  // Get category-specific stats
  const getCategoryStats = () => {
    const stats: Record<string, { templates: number; businesses: string }> = {
      "restaurant-cafe": { templates: 18, businesses: "500+ Restaurants" },
      "ecommerce-store": { templates: 24, businesses: "1,000+ Online Stores" },
      "clothing-brand": { templates: 15, businesses: "350+ Brands" },
      "school-college": { templates: 14, businesses: "250+ Institutions" },
      "medical-clinic": { templates: 10, businesses: "150+ Clinics" },
      "travel-agency": { templates: 12, businesses: "200+ Agencies" },
      "gym-fitness": { templates: 10, businesses: "120+ Gyms" },
      "real-estate": { templates: 16, businesses: "300+ Agents" },
      "beauty-salon": { templates: 12, businesses: "180+ Salons" },
      "grocery-store": { templates: 8, businesses: "100+ Stores" },
      "educational-consultancy": { templates: 14, businesses: "400+ Students" },
      "digital-agency": { templates: 12, businesses: "220+ Agencies" },
      portfolio: { templates: 20, businesses: "600+ Creatives" },
      business: { templates: 25, businesses: "1,200+ Companies" },
    };

    const key =
      categorySlug ||
      categoryName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
    return (
      stats[key] || {
        templates: templateCount,
        businesses: "Growing Businesses",
      }
    );
  };

  const displayName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const stats = getCategoryStats();
  const badgeText = categoryBadge || `${displayName} Templates`;

  // Get category-specific content for the mockup
  const getMockupContent = () => {
    const contents: Record<
      string,
      {
        heroTitle: string;
        heroSubtitle: string;
        badge: string;
        features: { title: string; color: string }[];
        ctaLabel: string;
        brandName: string;
      }
    > = {
      "restaurant-cafe": {
        brandName: "Royal Kitchen",
        heroTitle: "Authentic Nepali Flavors",
        heroSubtitle: "Experience the best local cuisine in the heart of town.",
        badge: "Fresh & Local",
        features: [
          { title: "Online Menu", color: "bg-orange-500" },
          { title: "Table Booking", color: "bg-amber-500" },
          { title: "Home Delivery", color: "bg-red-500" },
          { title: "Special Events", color: "bg-yellow-500" },
        ],
        ctaLabel: "View Menu",
      },
      "ecommerce-store": {
        brandName: "Urban Mart",
        heroTitle: "Your Daily Life, Elevated",
        heroSubtitle: "Shop the latest trends with fast delivery across Nepal.",
        badge: "New Arrivals",
        features: [
          { title: "Mobile Ready", color: "bg-blue-500" },
          { title: "Easy Payments", color: "bg-indigo-500" },
          { title: "Fast Shipping", color: "bg-violet-500" },
          { title: "24/7 Support", color: "bg-purple-500" },
        ],
        ctaLabel: "Shop Now",
      },
      "clothing-brand": {
        brandName: "Modest Wear",
        heroTitle: "Style Meets Comfort",
        heroSubtitle:
          "Discover our latest seasonal collection designed for you.",
        badge: "Limited Edition",
        features: [
          { title: "Size Guide", color: "bg-pink-500" },
          { title: "Easy Returns", color: "bg-rose-500" },
          { title: "Gift Wrapping", color: "bg-fuchsia-500" },
          { title: "New Trends", color: "bg-purple-500" },
        ],
        ctaLabel: "Explore",
      },
      "school-college": {
        brandName: "Bright Academy",
        heroTitle: "Empowering Minds",
        heroSubtitle: "Leading educational environment for modern students.",
        badge: "Enroll Now",
        features: [
          { title: "Admissions", color: "bg-blue-500" },
          { title: "Library", color: "bg-cyan-500" },
          { title: "Sports Club", color: "bg-sky-500" },
          { title: "Events", color: "bg-indigo-500" },
        ],
        ctaLabel: "Apply Now",
      },
      "medical-clinic": {
        brandName: "City Health",
        heroTitle: "Compassionate Care",
        heroSubtitle:
          "Professional healthcare services for you and your family.",
        badge: "Expert Doctors",
        features: [
          { title: "Online Booking", color: "bg-emerald-500" },
          { title: "Health Plans", color: "bg-teal-500" },
          { title: "Specialists", color: "bg-cyan-500" },
          { title: "E-Reports", color: "bg-blue-500" },
        ],
        ctaLabel: "Book Now",
      },
      "travel-agency": {
        brandName: "Peak Tours",
        heroTitle: "Your Next Adventure",
        heroSubtitle: "Curated travel packages to explore the beauty of Nepal.",
        badge: "Special Offers",
        features: [
          { title: "Tour Guide", color: "bg-orange-500" },
          { title: "Insurance", color: "bg-amber-500" },
          { title: "Transport", color: "bg-yellow-500" },
          { title: "Hotels", color: "bg-red-500" },
        ],
        ctaLabel: "Book Tour",
      },
      "gym-fitness": {
        brandName: "Iron Forge",
        heroTitle: "Unleash Your Power",
        heroSubtitle: "Premium gym equipment and professional trainers.",
        badge: "Join Today",
        features: [
          { title: "Personal Trainer", color: "bg-slate-700" },
          { title: "Yoga Classes", color: "bg-indigo-500" },
          { title: "Sauna Access", color: "bg-blue-500" },
          { title: "Diet Plan", color: "bg-emerald-500" },
        ],
        ctaLabel: "Get Started",
      },
      "real-estate": {
        brandName: "Dream Living",
        heroTitle: "Find Your Perfect Home",
        heroSubtitle: "Helping you find the best properties in Nepal.",
        badge: "Verified List",
        features: [
          { title: "Property Hub", color: "bg-blue-500" },
          { title: "Legal Help", color: "bg-indigo-500" },
          { title: "Home Loans", color: "bg-violet-500" },
          { title: "Consulting", color: "bg-purple-500" },
        ],
        ctaLabel: "View Houses",
      },
      "beauty-salon": {
        brandName: "Glam Center",
        heroTitle: "Revitalize Your Beauty",
        heroSubtitle: "Expert beauty and grooming services for all.",
        badge: "Luxury Spa",
        features: [
          { title: "Nail Art", color: "bg-pink-400" },
          { title: "Hair Styling", color: "bg-rose-400" },
          { title: "Skin Care", color: "bg-fuchsia-400" },
          { title: "Bridal", color: "bg-purple-400" },
        ],
        ctaLabel: "Book Session",
      },
      "grocery-store": {
        brandName: "Fresh Mart",
        heroTitle: "Fresh & Healthy",
        heroSubtitle: "High quality groceries delivered right to your door.",
        badge: "Local Farm",
        features: [
          { title: "Fresh Fruits", color: "bg-emerald-500" },
          { title: "Meat & Fish", color: "bg-red-500" },
          { title: "Daily Deals", color: "bg-amber-500" },
          { title: "Organic", color: "bg-green-500" },
        ],
        ctaLabel: "Shop Fresh",
      },
      "educational-consultancy": {
        brandName: "Global Link",
        heroTitle: "Study Abroad Goals",
        heroSubtitle:
          "Full assistance for your international education journey.",
        badge: "99% Success",
        features: [
          { title: "Visa Advice", color: "bg-blue-500" },
          { title: "Test Prep", color: "bg-indigo-500" },
          { title: "University Selection", color: "bg-sky-500" },
          { title: "Pre-Departure", color: "bg-cyan-500" },
        ],
        ctaLabel: "Consult Now",
      },
      "digital-agency": {
        brandName: "Pixel Perfect",
        heroTitle: "Creative Media Solutions",
        heroSubtitle: "Innovative digital strategies for your brand growth.",
        badge: "Awards Winning",
        features: [
          { title: "Web Design", color: "bg-indigo-500" },
          { title: "SEO", color: "bg-blue-500" },
          { title: "Content", color: "bg-violet-500" },
          { title: "Branding", color: "bg-purple-500" },
        ],
        ctaLabel: "View Portfolio",
      },
      portfolio: {
        brandName: "Creative Hub",
        heroTitle: "Showcasing Excellence",
        heroSubtitle: "A collection of my best work and creative journey.",
        badge: "Portfolio 2024",
        features: [
          { title: "Design Work", color: "bg-indigo-500" },
          { title: "Photography", color: "bg-blue-500" },
          { title: "Video Editing", color: "bg-sky-500" },
          { title: "Contact Me", color: "bg-cyan-500" },
        ],
        ctaLabel: "View Work",
      },
      business: {
        brandName: "Prime Corp",
        heroTitle: "Strategic Growth",
        heroSubtitle: "Partner with us to transform your business strategies.",
        badge: "Trusted Partner",
        features: [
          { title: "Management", color: "bg-slate-700" },
          { title: "Finance", color: "bg-blue-700" },
          { title: "Consulting", color: "bg-indigo-700" },
          { title: "Reports", color: "bg-slate-800" },
        ],
        ctaLabel: "Learn More",
      },
    };

    const key =
      categorySlug ||
      categoryName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
    return (
      contents[key] || {
        brandName: displayName,
        heroTitle: `Professional ${displayName} Solutions`,
        heroSubtitle: `Modern templates designed to help your ${displayName.toLowerCase()} business grow.`,
        badge: "Modern Template",
        features: [
          { title: "Fully Responsive", color: "bg-slate-400" },
          { title: "SEO Optimized", color: "bg-slate-500" },
          { title: "Customizable", color: "bg-slate-600" },
          { title: "Support Ready", color: "bg-slate-700" },
        ],
        ctaLabel: "Get Started",
      }
    );
  };

  const mockupContent = getMockupContent();

  return (
    <section className="relative bg-white py-20">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Title */}
              <h1 className="-tight mb-4 text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                {displayName} Templates
                <span className="text-primary"> for Nepal</span>
              </h1>

              {/* Description */}
              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                {categoryDescription ||
                  `Launch your professional ${displayName.toLowerCase()} website with our ready-to-use templates. Built specifically for the Nepali market with local payment integrations and mobile-first design.`}
              </p>

              {/* Stats */}
              <div className="mb-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Layout className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {stats.templates}+
                    </div>
                    <div className="text-xs text-slate-500">
                      Templates available
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {stats.businesses}
                    </div>
                    <div className="text-xs text-slate-500">Trust Nepal</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/admin/signup" className="group">
                  <button className="bg-primary -md inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105">
                    Start Building
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/templates" className="group">
                  <button className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
                    Browse all templates
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="-sm overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="mx-auto flex flex-1 justify-center">
                    <div className="flex w-3/4 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5">
                      <Globe className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] text-slate-400">
                        nepdora.com/templates/
                        {categorySlug || categoryName.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-5">
                  {/* Hero Preview */}
                  <div className="from-primary/5 mb-5 rounded-xl bg-gradient-to-br to-transparent p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="bg-primary h-1.5 w-6 rounded-full" />
                      <span className="text-primary -wider text-xs font-semibold uppercase">
                        {mockupContent.badge}
                      </span>
                    </div>
                    <div className="mb-1 text-sm font-bold text-slate-800">
                      {mockupContent.heroTitle}
                    </div>
                    <div className="text-[10px] leading-tight text-slate-500">
                      {mockupContent.heroSubtitle}
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {mockupContent.features.map((feature, i) => (
                      <div
                        key={i}
                        className="-sm rounded-xl border border-slate-100 bg-white p-3"
                      >
                        <div
                          className={`${feature.color}/10 mb-2 flex h-7 w-7 items-center justify-center rounded-lg`}
                        >
                          <div
                            className={`h-3 w-3 rounded-full ${feature.color}`}
                          />
                        </div>
                        <div className="text-[9px] font-semibold text-slate-700">
                          {feature.title}
                        </div>
                        <div className="mt-1 h-1 w-full rounded-full bg-slate-100" />
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex gap-2">
                      <div className="text-primary -sm flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold">
                        {mockupContent.brandName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-700">
                          {mockupContent.brandName}
                        </div>
                        <div className="text-[8px] text-slate-400">
                          Built with Nepdora
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary rounded-full px-3 py-1 text-[9px] font-bold text-white">
                      {mockupContent.ctaLabel}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge - Responsive */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="-md absolute -top-4 -right-4 z-10 flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 sm:top-0 sm:-right-6"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="pr-2">
                  <p className="text-xs font-semibold text-slate-900">
                    100% Responsive
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge - Speed */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="-md absolute -bottom-4 -left-4 z-10 flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 sm:-bottom-2 sm:-left-6"
              >
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="pr-2">
                  <p className="text-xs font-semibold text-slate-900">
                    Fast Loading
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
