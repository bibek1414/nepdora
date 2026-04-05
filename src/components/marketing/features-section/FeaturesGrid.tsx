import React from "react";
import {
  BarChart3,
  ShoppingBag,
  Users,
  Globe,
  Clock,
  Layout,
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
import NepalPaymentSkeleton from "./NepalPaymentSkeleton";
import SmsLogisticsSkeleton from "./SmsLogisticsSkeleton";
import SeoSkeleton from "./SeoSkeleton";
import PosSkeleton from "./PosSkeleton";
import { FeatureCard } from "./FeatureCard";

const features = [
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
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-xl">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Explore every feature
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            From payments to analytics — every tool your Nepali business needs, in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              idx={idx}
              className={`${feature.className} border-slate-200`}
            >
              <div className="relative flex-1 overflow-hidden">
                {feature.skeleton}
              </div>
              <div className="relative z-10 border-t border-slate-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <feature.icon size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900 md:text-sm">
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
