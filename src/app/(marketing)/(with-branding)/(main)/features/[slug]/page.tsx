import React from "react";
import { Metadata } from "next";
import { capitalizeWords } from "@/lib/string-utils";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Settings,
  ShieldCheck,
  Rocket,
} from "lucide-react";
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
  },
  sms: {
    title: "SMS Integration",
    description: "Automated SMS notifications for orders and account alerts.",
    hardWay: [
      {
        title: "Provider Research",
        description:
          "Find and compare verschiedene SMS gateway providers in Nepal.",
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
  },
};

// Add common aliases/typos
FEATURE_DATA["esewa-integartion"] = FEATURE_DATA["esewa-integration"];
FEATURE_DATA["pathao"] = FEATURE_DATA["pathao-parcel"];
FEATURE_DATA["pathao-parcel"] = FEATURE_DATA["pathao-parcel"];

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

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.nepdora.com/features/${slug}`,
    },
  };
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

  return (
    <div className="bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            {featureName} Integration
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {data?.description ||
              `Everything you need to connect ${featureName} to your online presence.`}
          </p>
        </div>

        <div className="mx-auto mb-20 grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* The Hard Way */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3 text-slate-500">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold tracking-wider">The Hard Way</h2>
            </div>
            <div className="space-y-6">
              {hardWay.map((step, idx) => (
                <div key={idx} className="relative flex gap-4">
                  {idx !== hardWay.length - 1 && (
                    <div className="absolute top-10 left-4 h-full w-px bg-slate-100" />
                  )}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 font-medium text-slate-400 italic">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{step.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-700 italic">
                Requires technical expertise, weeks of development, and ongoing
                maintenance costs.
              </p>
            </div>
          </div>

          {/* The Nepdora Way */}
          <div className="border-primary/20 shadow-primary/5 relative overflow-hidden rounded-3xl border-2 bg-white p-8 shadow-xl">
            <div className="bg-primary absolute top-0 right-0 rounded-bl-3xl px-6 py-2 text-xs font-bold tracking-tighter text-white">
              Integrated by Default
            </div>
            <div className="text-primary mb-8 flex items-center gap-3">
              <Zap className="fill-primary h-6 w-6" />
              <h2 className="text-xl font-bold tracking-wider">
                The Nepdora Way
              </h2>
            </div>
            <div className="space-y-8">
              {easyWay.map((step, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl">
                    {idx === 0 ? (
                      <Settings className="h-5 w-5" />
                    ) : idx === 1 ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <Rocket className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h4>
                    <p className="leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Zero Coding Required</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Active in 5 Minutes</span>
              </div>
            </div>

            <div className="mt-10">
              <div className="bg-primary shadow-primary/20 rounded-2xl p-6 text-white shadow-lg">
                <p className="leading-relaxed font-semibold italic">
                  "With Nepdora, {featureName} is ready to use from day one.
                  Focus on your business, not the code."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-auto mb-20 max-w-4xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <h2 className="mb-10 text-3xl font-bold">
            Why settle for manual setup?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-bold">Instant Scale</h3>
              <p className="text-sm text-slate-500">
                Go from idea to integrated store in minutes, not months.
              </p>
            </div>
            <div>
              <div className="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-bold">Secure & Reliable</h3>
              <p className="text-sm text-slate-500">
                Enterprise-grade security on every transaction and sync.
              </p>
            </div>
            <div>
              <div className="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-bold">Auto-Updates</h3>
              <p className="text-sm text-slate-500">
                Worry-free maintenance as we handle all API upgrades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
