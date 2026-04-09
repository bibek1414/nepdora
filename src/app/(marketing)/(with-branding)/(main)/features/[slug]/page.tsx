import React from "react";
import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Settings,
  ShieldCheck,
  Rocket,
  Clock,
  DollarSign,
  Users,
  Globe,
  Smartphone,
  CreditCard,
  Award,
  TrendingUp,
  Heart,
  Layout,
  BarChart3,
  Target,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

interface IntegrationStep {
  title: string;
  description: string;
}

interface FeatureDetail {
  title: string;
  description: string;
  hardWay: IntegrationStep[];
  easyWay: IntegrationStep[];
  benefits?: string[];
  stats?: { value: string; label: string }[];
  faqs?: { q: string; a: string }[];
  testimonial?: { quote: string; author: string; business: string };
}

const FEATURE_DATA: Record<string, FeatureDetail> = {
  "esewa-integration": {
    title: "eSewa Integration",
    description: "Accept payments via Nepal's most popular digital wallet.",
    hardWay: [
      {
        title: "Merchant Registration",
        description:
          "Apply for a merchant account and wait for manual verification.",
      },
      {
        title: "API Documentation",
        description:
          "Study complex technical documentation for UAT and Production environments.",
      },
      {
        title: "Secure Backend Implementation",
        description:
          "Write custom backend code to handle hash generation and payment verification.",
      },
      {
        title: "Testing & Certification",
        description:
          "Complete rigorous testing in eSewa's sandbox before getting production keys.",
      },
    ],
    easyWay: [
      {
        title: "Toggle On",
        description:
          "Enable eSewa with a single click in your Nepdora dashboard.",
      },
      {
        title: "Enter Merchant ID",
        description:
          "Input your eSewa credentials securely into our pre-built setup.",
      },
      {
        title: "Go Live",
        description:
          "Start accepting payments instantly. No coding or testing required.",
      },
    ],
    benefits: [
      "Accept payments from millions of eSewa users",
      "Increase conversion rates with familiar payment methods",
      "No transaction fees for the first 3 months",
      "24/7 payment processing with automatic settlement",
      "Automatic refund handling",
      "Real-time transaction reporting",
    ],
    stats: [
      { value: "5M+", label: "Active eSewa Users" },
      { value: "30s", label: "Setup Time" },
      { value: "0", label: "Lines of Code" },
      { value: "100%", label: "Uptime Guarantee" },
    ],
    faqs: [
      {
        q: "Do I need a merchant account?",
        a: "Yes, you need an eSewa merchant account. Nepdora helps you with the application process.",
      },
      {
        q: "How long does settlement take?",
        a: "Settlements are processed daily. Funds are transferred to your bank account within 24-48 hours.",
      },
      {
        q: "Is there a monthly fee?",
        a: "No monthly fees. You only pay the standard transaction fee set by eSewa.",
      },
      {
        q: "Does it support refunds?",
        a: "Yes, full refund management is built into the integration.",
      },
    ],
    testimonial: {
      quote:
        "Setting up eSewa with Nepdora took less than 5 minutes. Our online sales increased by 40% within the first month.",
      author: "Rajesh Shrestha",
      business: "Urban Style",
    },
  },
  khalti: {
    title: "Khalti Integration",
    description:
      "Connect Khalti payment gateway for seamless digital transactions.",
    hardWay: [
      {
        title: "Account Setup",
        description: "Register as a merchant and get your public/secret keys.",
      },
      {
        title: "SDK Configuration",
        description:
          "Import and configure Khalti's SDK into your application's frontend.",
      },
      {
        title: "Transaction Validation",
        description:
          "Implement server-side calls to Khalti APIs to verify successful transactions.",
      },
    ],
    easyWay: [
      {
        title: "Quick Setup",
        description: "Paste your Khalti keys in the payment settings.",
      },
      {
        title: "Automatic Webhooks",
        description:
          "Nepdora handles all status updates and verification automatically.",
      },
    ],
    benefits: [
      "Reach millions of Khalti wallet users across Nepal",
      "Seamless checkout experience with one-click payments",
      "Real-time transaction tracking and reporting",
      "Automatic refund processing capabilities",
      "Mobile-optimized payment flow",
      "No additional gateway fees",
    ],
    stats: [
      { value: "3M+", label: "Khalti Users" },
      { value: "2min", label: "Setup Time" },
      { value: "0", label: "Lines of Code" },
      { value: "99.9%", label: "Success Rate" },
    ],
    faqs: [
      {
        q: "Does it support both UAT and Production?",
        a: "Yes, Nepdora supports both test and live environments. Switch between them easily.",
      },
      {
        q: "Can I accept international payments?",
        a: "Khalti focuses on Nepali transactions. For international, consider other gateways.",
      },
      {
        q: "How are failed transactions handled?",
        a: "Failed transactions are automatically retried and logged for review.",
      },
      {
        q: "Is PCI compliance required?",
        a: "No, Nepdora handles all PCI compliance for you.",
      },
    ],
    testimonial: {
      quote:
        "Khalti integration was seamless. Our customers love the one-click payment option, and we've seen a 35% increase in completed orders.",
      author: "Sita Gurung",
      business: "Namaste Travels",
    },
  },
  sms: {
    title: "SMS Integration",
    description: "Automated SMS notifications for orders and account alerts.",
    hardWay: [
      {
        title: "Provider Research",
        description: "Find and compare various SMS gateway providers in Nepal.",
      },
      {
        title: "Credit Management",
        description:
          "Manually purchase and manage SMS credits for each provider.",
      },
      {
        title: "Custom Logic",
        description:
          "Write logic to trigger SMS on specific events like order updates or OTPs.",
      },
    ],
    easyWay: [
      {
        title: "Ready to Use",
        description:
          "Nepdora comes with built-in SMS capabilities out of the box.",
      },
      {
        title: "Auto Notifications",
        description:
          "Set your preferences and let Nepdora handle all customer alerts.",
      },
    ],
    benefits: [
      "Increase customer engagement with timely updates",
      "Reduce missed orders with delivery notifications",
      "Build trust with OTP verification",
      "Cost-effective communication channel",
      "Automated marketing campaigns",
      "Two-way messaging support",
    ],
    stats: [
      { value: "98%", label: "Open Rate" },
      { value: "3s", label: "Delivery Time" },
      { value: "24/7", label: "Availability" },
      { value: "100k+", label: "Monthly Messages" },
    ],
    faqs: [
      {
        q: "What SMS providers do you support?",
        a: "We support all major Nepali SMS providers including Spiro, Janani, and others.",
      },
      {
        q: "Can I customize message templates?",
        a: "Yes, you can fully customize all SMS templates from your dashboard.",
      },
      {
        q: "How are SMS credits managed?",
        a: "You can add credits directly from your Nepdora dashboard. No separate login needed.",
      },
      {
        q: "Can I schedule SMS campaigns?",
        a: "Yes, you can schedule messages for future dates and times.",
      },
    ],
    testimonial: {
      quote:
        "Automated SMS notifications reduced our customer service calls by 60%. Customers love getting real-time order updates.",
      author: "Bikash Thapa",
      business: "Green Grocery",
    },
  },
  "facebook-pixel": {
    title: "Facebook Pixel",
    description:
      "Track conversions and optimize your ad spend with Facebook Pixel.",
    hardWay: [
      {
        title: "Code Injection",
        description:
          "Manually add the Pixel base code to your website's header.",
      },
      {
        title: "Event Tracking",
        description:
          "Write custom JavaScript to track Add to Cart, Initiate Checkout, and Purchase events.",
      },
      {
        title: "Data Consistency",
        description:
          "Ensure the data passed to Facebook matches your catalog exactly.",
      },
    ],
    easyWay: [
      {
        title: "Zero Coding",
        description: "Just paste your Facebook Pixel ID in the analytics tab.",
      },
      {
        title: "E-commerce Tracking",
        description:
          "All e-commerce events are tracked automatically with high precision.",
      },
    ],
    benefits: [
      "Track every customer action from view to purchase",
      "Build retargeting audiences for better ROAS",
      "Optimize ad delivery for conversions",
      "Measure cross-device customer journeys",
      "Automatic event parameter mapping",
      "Real-time conversion reporting",
    ],
    stats: [
      { value: "15+", label: "Auto-tracked Events" },
      { value: "100%", label: "Data Accuracy" },
      { value: "Real-time", label: "Reporting" },
      { value: "30%", label: "Avg ROAS Increase" },
    ],
    faqs: [
      {
        q: "Does it work with Facebook CAPI?",
        a: "Yes, we support both standard Pixel and Conversions API for better data reliability.",
      },
      {
        q: "Will it slow down my site?",
        a: "No, the pixel loads asynchronously and doesn't affect site performance.",
      },
      {
        q: "Can I track custom events?",
        a: "Yes, you can add custom event tracking without any coding.",
      },
      {
        q: "Is GDPR compliant?",
        a: "Yes, our implementation follows all privacy regulations.",
      },
    ],
    testimonial: {
      quote:
        "Facebook Pixel setup was effortless. We now track every conversion and our ad ROAS has doubled.",
      author: "Anjali Sharma",
      business: "Elite Fitness",
    },
  },
  dash: {
    title: "Dash Logistics",
    description: "Automate your shipping and logistics with Dash integration.",
    hardWay: [
      {
        title: "API Integration",
        description: "Build a custom integration with Dash's logistics API.",
      },
      {
        title: "Manual Order Sync",
        description:
          "Manually send order details to the logistics portal for every delivery.",
      },
      {
        title: "Label Printing",
        description: "Design and generate shipping labels for your packages.",
      },
    ],
    easyWay: [
      {
        title: "Dashboard Sync",
        description:
          "Sync orders to Dash directly from your order management screen.",
      },
      {
        title: "Auto-Labels",
        description:
          "Print shipping labels and track deliveries without leaving Nepdora.",
      },
    ],
    benefits: [
      "Automated order fulfillment workflow",
      "Real-time delivery tracking for customers",
      "Bulk label printing for multiple orders",
      "Reduced manual data entry errors",
      "Automatic COD settlement",
      "Delivery proof capture",
    ],
    stats: [
      { value: "50+", label: "Cities Covered" },
      { value: "24h", label: "Delivery Time" },
      { value: "100%", label: "COD Support" },
      { value: "10k+", label: "Daily Deliveries" },
    ],
    faqs: [
      {
        q: "What areas does Dash cover?",
        a: "Dash delivers to all major cities and many rural areas across Nepal.",
      },
      {
        q: "How are COD payments handled?",
        a: "Dash collects COD payments and settles them to your account weekly.",
      },
      {
        q: "Can I track shipments in real-time?",
        a: "Yes, both you and your customers can track shipments live.",
      },
      {
        q: "What about lost packages?",
        a: "All shipments are insured. Dash covers up to the full value.",
      },
    ],
    testimonial: {
      quote:
        "Dash integration saved us 20+ hours per week on shipping logistics. Our customers love the tracking updates.",
      author: "Nabin Karki",
      business: "Tech Solutions",
    },
  },
  "pathao-parcel": {
    title: "Pathao Parcel",
    description:
      "Deliver your products quickly using Pathao's extensive network.",
    hardWay: [
      {
        title: "Merchant Portal",
        description: "Setup a separate merchant account with Pathao.",
      },
      {
        title: "Delivery Requests",
        description:
          "Manually enter customer addresses and request pickups via their API or app.",
      },
      {
        title: "Status Tracking",
        description:
          "Build a custom tracker to show delivery status to your customers.",
      },
    ],
    easyWay: [
      {
        title: "Integrated Logistics",
        description: "Request Pathao pickups directly from your order details.",
      },
      {
        title: "Real-time Tracking",
        description:
          "Your customers see live tracking updates on their order status page.",
      },
    ],
    benefits: [
      "Fast delivery within Kathmandu Valley",
      "Live tracking for customer satisfaction",
      "Automatic delivery status updates",
      "Competitive shipping rates",
      "Instant rider assignment",
      "Proof of delivery photos",
    ],
    stats: [
      { value: "2hr", label: "Avg Delivery" },
      { value: "500+", label: "Daily Rides" },
      { value: "100%", label: "Insurance Coverage" },
      { value: "24/7", label: "Service Hours" },
    ],
    faqs: [
      {
        q: "Is Pathao available outside Kathmandu?",
        a: "Pathao Parcel primarily serves Kathmandu Valley with expanding coverage to other cities.",
      },
      {
        q: "How are payments handled?",
        a: "You can pay per delivery or use prepaid credits. Nepdora integrates both options.",
      },
      {
        q: "What if a delivery fails?",
        a: "Pathao makes multiple delivery attempts. Failed deliveries are returned to you.",
      },
      {
        q: "Can I schedule pickups?",
        a: "Yes, you can schedule pickups for specific times.",
      },
    ],
    testimonial: {
      quote:
        "Pathao integration made same-day delivery possible. Our customers are thrilled with the speed.",
      author: "Manish Pradhan",
      business: "Urban Style",
    },
  },
  "pos-system": {
    title: "POS System",
    description: "Manage your offline and online sales with a single system.",
    hardWay: [
      {
        title: "Separate Inventory",
        description:
          "Manually sync stock between your physical store and online website.",
      },
      {
        title: "Multiple Logins",
        description: "Switch between different apps for sales and accounting.",
      },
      {
        title: "Complex Hardware",
        description:
          "Purchase expensive specialized POS hardware and software.",
      },
    ],
    easyWay: [
      {
        title: "Unified Inventory",
        description: "One stock for both physical and digital storefronts.",
      },
      {
        title: "Cloud Access",
        description: "Access your POS from any device, anytime, anywhere.",
      },
      {
        title: "Instant Setup",
        description: "Turn your tablet or phone into a powerful POS instantly.",
      },
    ],
    benefits: [
      "Real-time inventory sync across all channels",
      "Unified customer database and loyalty program",
      "Comprehensive sales analytics and reports",
      "Staff management with role-based access",
      "Offline mode support",
      "Multi-branch management",
    ],
    stats: [
      { value: "1000+", label: "Active POS Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "24/7", label: "Support" },
      { value: "50%", label: "Time Saved" },
    ],
    faqs: [
      {
        q: "Do I need special hardware?",
        a: "No, you can use any tablet or smartphone. We also support barcode scanners and receipt printers.",
      },
      {
        q: "Can I use offline mode?",
        a: "Yes, our POS works offline and syncs when connection is restored.",
      },
      {
        q: "How many users can I add?",
        a: "Unlimited staff accounts with role-based permissions.",
      },
      {
        q: "Does it integrate with accounting software?",
        a: "Yes, we integrate with popular accounting platforms.",
      },
    ],
    testimonial: {
      quote:
        "Managing our physical store and online shop from one dashboard is a game-changer. Inventory never goes out of sync.",
      author: "Rita Tamang",
      business: "Fashion Hub",
    },
  },
};

// Add common aliases/typos
FEATURE_DATA["esewa-integartion"] = FEATURE_DATA["esewa-integration"];
FEATURE_DATA["pathao"] = FEATURE_DATA["pathao-parcel"];

// SEO Rich Aliases
FEATURE_DATA["esewa-integration-nepal"] = FEATURE_DATA["esewa-integration"];
FEATURE_DATA["khalti-integration-nepal"] = FEATURE_DATA["khalti"];
FEATURE_DATA["sms-notifications-nepal"] = FEATURE_DATA["sms"];
FEATURE_DATA["facebook-pixel-integration-nepal"] =
  FEATURE_DATA["facebook-pixel"];
FEATURE_DATA["logistics-pathao-dash-nepal"] = FEATURE_DATA["dash"];
FEATURE_DATA["pos-system-nepal"] = FEATURE_DATA["pos-system"];

// In Nepdora Aliases
FEATURE_DATA["esewa-integration-in-nepdora"] =
  FEATURE_DATA["esewa-integration"];
FEATURE_DATA["khalti-integration-in-nepdora"] = FEATURE_DATA["khalti"];
FEATURE_DATA["sms-notifications-in-nepdora"] = FEATURE_DATA["sms"];
FEATURE_DATA["facebook-pixel-integration-in-nepdora"] =
  FEATURE_DATA["facebook-pixel"];
FEATURE_DATA["logistics-pathao-dash-in-nepdora"] = FEATURE_DATA["dash"];
FEATURE_DATA["pos-system-in-nepdora"] = FEATURE_DATA["pos-system"];

import { absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = FEATURE_DATA[slug];
  const featureName = data
    ? data.title
    : capitalizeWords(slug.replace("-", " "));

  const title = `How to Integrate ${featureName} with Nepdora | Step-by-Step Guide`;
  const description =
    data?.description ||
    `Learn how to easily integrate ${featureName} into your Nepdora website. Boost your business with automated processes and seamless connections.`;

  return buildMarketingMetadata({
    title,
    description,
    path: `/features/${slug}`,
  });
}

export default async function FeatureProcessPage({ params }: Props) {
  const { slug } = await params;
  const data = FEATURE_DATA[slug];
  const featureName = data
    ? data.title
    : capitalizeWords(slug.replace("-", " "));

  // Fallback for generic features
  const hardWay = data?.hardWay || [
    {
      title: "Hire a Developer",
      description:
        "Pay thousands to a developer to build the custom integration.",
    },
    {
      title: "Maintenance",
      description: "Handle API updates and bugs manually as they occur.",
    },
    {
      title: "Server Management",
      description: "Setup backend servers to handle the integration logic.",
    },
  ];

  const easyWay = data?.easyWay || [
    {
      title: "Integrated by Default",
      description: "Nepdora has this feature built-in or ready to activate.",
    },
    {
      title: "No Code Required",
      description: "Configure everything from a simple user interface.",
    },
    {
      title: "Always Updated",
      description: "We handle all API changes and maintenance for you.",
    },
  ];

  const benefits = data?.benefits || [
    "Save thousands in development costs",
    "Launch in minutes instead of months",
    "Automatic updates and maintenance",
    "Dedicated support team",
    "No hidden fees",
    "Scale effortlessly",
  ];

  const stats = data?.stats || [
    { value: "1000+", label: "Businesses Using" },
    { value: "5min", label: "Setup Time" },
    { value: "0", label: "Lines of Code" },
    { value: "24/7", label: "Support" },
  ];

  const faqs = data?.faqs || [
    {
      q: "Is this feature available on all plans?",
      a: "Yes, this feature is available on all Nepdora plans. Some advanced features may require higher tiers.",
    },
    {
      q: "Can I get help with setup?",
      a: "Absolutely! Our support team is available 24/7 to help you with any questions.",
    },
    {
      q: "Is there any additional cost?",
      a: "The integration is included in your Nepdora plan. No hidden fees.",
    },
    {
      q: "How long does support take?",
      a: "Our average response time is under 2 minutes for chat support.",
    },
  ];

  const testimonial = data?.testimonial || {
    quote:
      "The integration was incredibly smooth. We were up and running in minutes, not weeks.",
    author: "Satisfied Customer",
    business: "Nepali Business",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {featureName} Integration
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              {data?.description ||
                `Everything you need to connect ${featureName} to your online presence.`}
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-8">
            {/* The Hard Way */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 -sm">
              <div className="mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-rose-500" />
                <h2 className="text-xl font-semibold text-slate-900">
                  The Hard Way
                </h2>
              </div>
              <div className="space-y-5">
                {hardWay.map((step, idx) => (
                  <div key={idx} className="relative flex gap-3">
                    {idx !== hardWay.length - 1 && (
                      <div className="absolute top-8 left-4 h-full w-px bg-slate-100" />
                    )}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl border border-rose-100 bg-rose-50 p-4">
                <p className="text-sm text-rose-700">
                  Requires technical expertise, weeks of development, and
                  ongoing maintenance costs.
                </p>
              </div>
            </div>

            {/* The Nepdora Way */}
            <div className="border-primary/20 relative rounded-2xl border-2 bg-white p-8 -sm">
              <div className="bg-primary absolute -top-3 right-6 rounded-full px-4 py-1 text-xs font-semibold text-white">
                Integrated by Default
              </div>
              <div className="mb-6 flex items-center gap-3">
                <Zap className="text-primary h-6 w-6" />
                <h2 className="text-xl font-semibold text-slate-900">
                  The Nepdora Way
                </h2>
              </div>
              <div className="space-y-6">
                {easyWay.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      {idx === 0 ? (
                        <Settings className="h-4 w-4" />
                      ) : idx === 1 ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <Rocket className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Zero Coding Required</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Active in 5 Minutes</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-primary rounded-xl p-5 text-white -md">
                  <p className="leading-relaxed font-medium text-white/90">
                    "With Nepdora, {featureName} is ready to use from day one.
                    Focus on your business, not the code."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - 4 columns */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center -sm transition-all hover:-md"
              >
                <div className="text-primary mb-1 text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - 2 columns grid */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why choose the <span className="text-primary">Nepdora way?</span>
            </h2>
            <p className="text-lg font-medium text-slate-500">
              Save time, money, and headaches with our pre-built integrations
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 -sm transition-all hover:-md"
              >
                <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center -sm">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <ThumbsUp className="h-6 w-6" />
              </div>
            </div>
            <p className="mb-6 text-xl leading-relaxed font-medium text-slate-700 italic">
              "{testimonial.quote}"
            </p>
            <div>
              <p className="font-semibold text-slate-900">
                {testimonial.author}
              </p>
              <p className="text-sm font-medium text-slate-500">
                {testimonial.business}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Detailed */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How to get started in{" "}
              <span className="text-primary">3 simple steps</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sign up for Nepdora",
                desc: "Create your free account and choose a template.",
                icon: Rocket,
              },
              {
                step: "2",
                title: "Navigate to Settings",
                desc: "Go to the integrations section in your dashboard.",
                icon: Settings,
              },
              {
                step: "3",
                title: "Enable & Configure",
                desc: `Toggle on ${featureName} and enter your credentials.`,
                icon: Zap,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center -sm transition-all hover:-md"
              >
                <div className="bg-primary absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold text-white -md">
                  {item.step}
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <item.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 -sm transition-all hover:-md"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center -sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white -sm">
                <Layout className="text-primary h-8 w-8" />
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ready to integrate {featureName}?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-lg font-medium text-slate-500">
                Start your free trial today and see how easy integration can be.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-website"
                  className="bg-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white -md transition-all hover:scale-105"
                >
                  Start Free Trial
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
