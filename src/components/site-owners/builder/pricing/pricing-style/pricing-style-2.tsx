"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, DollarSign } from "lucide-react";
import { usePricings } from "@/hooks/owner-site/admin/use-pricing";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { EditableText } from "@/components/ui/editable-text";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useRouter } from "next/navigation";

interface PricingStyle2Props {
  data: PricingComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<PricingComponentData["data"]>) => void;
  onPricingClick?: (pricingId: number) => void;
}

export const PricingStyle2: React.FC<PricingStyle2Props> = ({
  data,
  isEditable = false,
  onUpdate,
  onPricingClick,
}) => {
  const router = useRouter();
  const {
    title = "Smart Solutions Transparent Pricing",
    tag = "[Pricing]",
    italicWord = "Pricing",
  } = data || {};

  const { data: pricingsData, isLoading, error } = usePricings();
  const { data: themeResponse } = useThemeQuery();

  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        primary: "#3B82F6",
      },
    } as any);

  const primaryColor = theme.colors.primary;

  const pricings = React.useMemo(() => {
    return [...(pricingsData?.results || [])].sort(
      (a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price))
    );
  }, [pricingsData?.results]);

  const handleTextUpdate = (field: keyof typeof data) => (value: string) => {
    onUpdate?.({ [field]: value });
  };

  const renderTitle = () => {
    if (!italicWord || !title.includes(italicWord)) {
      return title;
    }
    const parts = title.split(italicWord);
    return (
      <>
        {parts[0]}
        <span className="italic" style={{ color: primaryColor }}>
          {italicWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section id="pricing-2" className="py-40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <EditableText
            value={tag}
            onChange={handleTextUpdate("tag")}
            as="p"
            className="mb-2 text-sm font-medium tracking-wider uppercase"
            style={{ color: primaryColor }}
            isEditable={isEditable}
          />
          <div className="mb-8 text-3xl font-bold text-gray-900 md:text-5xl">
            <div className="space-y-4">
              <EditableText
                value={title}
                onChange={handleTextUpdate("title")}
                as="h2"
                isEditable={isEditable}
                placeholder="Enter title..."
              />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="py-20 text-center">Loading plans...</div>
        ) : pricings.length > 0 ? (
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {pricings.slice(0, 3).map((plan, index) => {
                const isMiddle = index === 1;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={isMiddle ? "relative z-10 md:scale-110" : ""}
                    onClick={() => !isEditable && onPricingClick?.(plan.id)}
                  >
                    <div
                      className={`relative flex h-full flex-col rounded-3xl backdrop-blur-lg ${
                        isMiddle
                          ? "text-white"
                          : "border border-gray-100 bg-white/50 text-[#231D4F]"
                      }`}
                      style={isMiddle ? { backgroundColor: primaryColor } : {}}
                    >
                      <div className="space-y-4 px-8 py-6 text-center">
                        <h3 className="text-2xl font-medium">{plan.name}</h3>
                        <p
                          className={`text-sm ${
                            isMiddle ? "text-white/80" : "text-[#848199]"
                          }`}
                        >
                          {plan.description}
                        </p>
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold">
                              Rs. {Number(plan.price).toLocaleString("en-IN")}
                            </span>
                            <span
                              className={`ml-1 text-base ${
                                isMiddle ? "text-white/80" : "text-[#848199]"
                              }`}
                            >
                              /month
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col space-y-6 px-8 py-4">
                        <ul className="flex-1 space-y-4">
                          {plan.features.map((feature: any, idx: number) => (
                            <li
                              key={feature.id ?? idx}
                              className="flex items-center gap-3"
                            >
                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                  isMiddle
                                    ? "bg-white/20"
                                    : "bg-[rgba(29,78,216,0.15)]"
                                }`}
                                style={
                                  !isMiddle
                                    ? { backgroundColor: `${primaryColor}26` }
                                    : {}
                                }
                              >
                                <Check
                                  className={`h-3 w-3 ${
                                    isMiddle ? "text-white" : ""
                                  }`}
                                  style={
                                    !isMiddle ? { color: primaryColor } : {}
                                  }
                                />
                              </div>
                              <span
                                className={`text-sm ${
                                  isMiddle ? "text-white" : "text-[#231D4F]"
                                }`}
                              >
                                {feature.feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full rounded-full px-4 py-2 font-medium transition-all ${
                            isMiddle
                              ? "bg-white text-gray-900 hover:bg-gray-100"
                              : "text-white hover:opacity-90"
                          }`}
                          style={
                            !isMiddle ? { backgroundColor: primaryColor } : {}
                          }
                          onClick={e => {
                            e.stopPropagation();
                            if (!isEditable) router.push("/contact");
                          }}
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          <BuilderEmptyState
            icon={DollarSign}
            title="No Pricing Plans Found"
            description="Create your pricing tables and plans in the admin dashboard."
            actionLabel="Manage Pricing"
            actionLink="/admin/pricing"
            isEditable={isEditable}
          />
        )}
      </div>
    </section>
  );
};
