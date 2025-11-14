import React from "react";
import {
  Globe,
  Zap,
  Shield,
  BarChart3,
  ShoppingCart,
  Users,
  MessageSquare,
  Truck,
  Palette,
  CreditCard,
  Smartphone,
  Settings,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Palette />,
      title: "100+ Stunning Templates",
      description:
        "Either choose from our beautiful templates or let AI  design for you.",
    },
    {
      icon: <ShoppingCart />,
      title: "Complete E-commerce",
      description:
        "Full online store with product management, inventory tracking, payment processing, and order fulfillment.",
    },
    {
      icon: <Users />,
      title: "Mini CRM System",
      description:
        "Manage customer relationships, track leads with our built-in CRM tools.",
    },

    {
      icon: <Globe />,
      title: "Custom Domain",
      description: "Connect your own domain and get it live within 5 minutes.",
    },
    {
      icon: <Truck />,
      title: "Logistics Integration",
      description:
        "Send and Track your order directly integrated with your preferred logistics provider.",
    },
    {
      icon: <Zap />,
      title: "5-Minute Setup",
      description:
        "Get your business online in just 5 minutes with our streamlined onboarding process.",
    },

    {
      icon: <BarChart3 />,
      title: "Analytics Dashboard",
      description:
        "Track your business performance with detailed analytics, sales reports, and customer insights.",
    },
    {
      icon: <CreditCard />,
      title: "Payment Processing",
      description:
        "Accept payments from customers worldwide with support for all major payment methods.",
    },
  ];

  return (
    <section id="features" className="bg-background pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 text-center text-3xl font-extrabold text-black md:text-5xl">
          Features: Your Business Deserve
        </div>
        <p className="text-center">
          We deliver what we promise, no less, no more
        </p>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  // Helper to build className string
  const buildClassName = (...classes: (string | boolean)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div
      className={buildClassName(
        "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
        (index === 0 || index === 4 || index === 8) &&
          "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      {index >= 4 && index < 8 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      {index >= 8 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-md relative z-10 px-10 font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
        <span className="inline-block text-black transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
