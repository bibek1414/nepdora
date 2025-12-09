"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ShoppingBag,
  Users,
  Globe,
  Clock,
  Layout,
  Layers,
  Sparkles,
} from "lucide-react";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import OrdersSkeleton from "./OrdersSkeleton";
import GlobalSalesSkeleton from "./GlobalSalesSkeleton";
import TemplateSkeleton from "./TemplateSkeleton";
import DomainSkeleton from "./DomainSkeleton";
import CrmSmallSkeleton from "./CrmSmallSkeleton";
import SetupSkeleton from "./SetupSkeleton";
import AIBuilderDemo from "./AIBuilderDemo";

const features = [
  // ROW 1: Large Cards
  {
    title: "Instant ROI Analytics",
    className: "md:col-span-2 md:row-span-2 bg-white",
    skeleton: <AnalyticsSkeleton />,
    icon: BarChart3,
  },
  // ROW 2: Small Cards (Aligned)
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
    title: "5-Minute Setup",
    className: "md:col-span-1 md:row-span-1 bg-white",
    skeleton: <SetupSkeleton />,
    icon: Clock,
  },
  // ROW 3: Large Cards
  {
    title: "Omnichannel Orders",
    className: "md:col-span-2 md:row-span-2 bg-white",
    skeleton: <OrdersSkeleton />,
    icon: ShoppingBag,
  },
  {
    title: "Global Payments & Logistics",
    className: "md:col-span-2 md:row-span-2 bg-white",
    skeleton: <GlobalSalesSkeleton />,
    icon: Globe,
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] border ${feature.className} ${feature.className.includes("bg-slate-900") ? "border-slate-800" : "border-slate-200"}`}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
