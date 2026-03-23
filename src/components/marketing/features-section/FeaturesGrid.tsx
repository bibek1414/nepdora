import React from "react";
import {
  BarChart3,
  ShoppingBag,
  Users,
  Globe,
  Clock,
  Layout,
  Sparkles,
  Wallet,
  MessageSquare,
  Search,
} from "lucide-react";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import OrdersSkeleton from "./OrdersSkeleton";
import GlobalSalesSkeleton from "./GlobalSalesSkeleton";
import TemplateSkeleton from "./TemplateSkeleton";
import DomainSkeleton from "./DomainSkeleton";
import CrmSmallSkeleton from "./CrmSmallSkeleton";
import SetupSkeleton from "./SetupSkeleton";
import AIBuilderDemo from "./AIBuilderDemo";
import NepalPaymentSkeleton from "./NepalPaymentSkeleton";
import SmsLogisticsSkeleton from "./SmsLogisticsSkeleton";
import SeoSkeleton from "./SeoSkeleton";
import PosSkeleton from "./PosSkeleton";
import { FeatureCard } from "./FeatureCard";

const features = [
  // ROW 1
  {
    title: "Instant ROI Analytics",
    className: "md:col-span-2 md:row-span-2 bg-white",
    skeleton: <AnalyticsSkeleton />,
    icon: BarChart3,
  },
  {
    title: "eSewa & Khalti",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <NepalPaymentSkeleton />,
    icon: Wallet,
  },
  {
    title: "5-Minute Setup",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <SetupSkeleton />,
    icon: Clock,
  },

  // ROW 2
  {
    title: "100+ Templates",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <TemplateSkeleton />,
    icon: Layout,
  },
  {
    title: "Custom Domain",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <DomainSkeleton />,
    icon: Globe,
  },
  {
    title: "Mini CRM",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <CrmSmallSkeleton />,
    icon: Users,
  },
  {
    title: "SMS & Logistics",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <SmsLogisticsSkeleton />,
    icon: MessageSquare,
  },

  // ROW 3
  {
    title: "Omnichannel Orders",
    className: "md:col-span-2 md:row-span-2 bg-white",
    skeleton: <OrdersSkeleton />,
    icon: ShoppingBag,
  },
  {
    title: "SEO & Marketing",
    className: "md:col-span-2 md:row-span-1 bg-white",
    skeleton: <SeoSkeleton />,
    icon: Search,
  },
  {
    title: "Global Payments & Logistics",
    className: "md:col-span-2 md:row-span-1 bg-white",
    skeleton: <GlobalSalesSkeleton />,
    icon: Globe,
  },

  {
    title: "Payment History",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <NepalPaymentSkeleton />,
    icon: Wallet,
  },
  {
    title: "POS System",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <PosSkeleton />,
    icon: ShoppingBag,
  },

  {
    title: "AI Website Builder",
    description: "Describe your dream website and watch it come to life.",
    className: "md:col-span-4 md:row-span-4 bg-white",
    skeleton: <AIBuilderDemo />,
    icon: Sparkles,
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to scale
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Enterprise-grade features built for Nepali businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:auto-rows-[200px] md:grid-cols-4">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title} // Changed to title for better key uniqueness
              idx={idx}
              className={`${feature.className} ${feature.className.includes("bg-slate-900") ? "border-slate-800" : "border-slate-200"}`}
            >
              {/* Animation/Skeleton Area */}
              <div className="relative flex-1 overflow-hidden">
                {feature.skeleton}
              </div>

              {/* Text Content */}
              <div
                className={`relative z-10 border-t p-5 ${feature.className.includes("bg-slate-900") ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white"}`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <feature.icon
                    size={18}
                    className={
                      feature.className.includes("bg-slate-900")
                        ? "text-indigo-400"
                        : "text-indigo-600"
                    }
                  />
                  <h3
                    className={`text-sm font-bold md:text-base ${feature.className.includes("bg-slate-900") ? "text-white" : "text-slate-900"}`}
                  >
                    {feature.title}
                  </h3>
                </div>
              </div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
