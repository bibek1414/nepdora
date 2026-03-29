"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Gift, Sparkles } from "lucide-react";
import {
  BannerTemplate4Data,
  BannerData,
} from "@/types/owner-site/components/banner";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface BannerTemplateProps {
  bannerData: BannerTemplate4Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate4: React.FC<BannerTemplateProps> = ({
  bannerData,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const { data, setData } = useBuilderLogic(bannerData, onUpdate);
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const handleUpdateField = (
    card: "card1" | "card2",
    field: string,
    value: string
  ) => {
    const updatedCard = {
      ...data[card],
      [field]: value,
    };
    const updatedData = {
      ...data,
      [card]: updatedCard,
    };
    setData(updatedData);
  };

  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* New Arrivals Banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-100 to-rose-100 p-6 md:p-12"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <EditableText
                  value={data.card1.label}
                  onChange={(val: string) =>
                    handleUpdateField("card1", "label", val)
                  }
                  isEditable={isEditable}
                  as="span"
                  className="text-sm font-medium tracking-wider"
                />
              </div>
              <div className="space-y-4">
                <EditableText
                  value={data.card1.title}
                  onChange={(val: string) =>
                    handleUpdateField("card1", "title", val)
                  }
                  isEditable={isEditable}
                  as="h3"
                  className="text-2xl leading-tight font-bold md:text-3xl"
                />
                <EditableText
                  value={data.card1.description}
                  onChange={(val: string) =>
                    handleUpdateField("card1", "description", val)
                  }
                  isEditable={isEditable}
                  as="p"
                  className="text-muted-foreground max-w-xs text-sm md:text-base"
                />
              </div>
              <div className="flex items-center gap-4">
                <EditableLink
                  href={data.card1.link}
                  text={data.card1.buttonText}
                  onChange={(text, href) => {
                    const updatedCard = {
                      ...data.card1,
                      buttonText: text,
                      link: href,
                    };
                    const updatedData = {
                      ...data,
                      card1: updatedCard,
                    };
                    setData(updatedData);
                  }}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  siteUser={siteUser}
                >
                  {data.card1.buttonText}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </EditableLink>
              </div>
            </div>

            {/* Decorative Elements */}
          </motion.div>

          {/* Rewards Banner */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="from-beige-100 relative overflow-hidden rounded-3xl bg-linear-to-br to-amber-50 p-6 md:p-12"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <EditableText
                  value={data.card2.label}
                  onChange={(val: string) =>
                    handleUpdateField("card2", "label", val)
                  }
                  isEditable={isEditable}
                  as="span"
                  className="text-sm font-medium tracking-wider"
                />
              </div>
              <div className="space-y-4">
                <EditableText
                  value={data.card2.title}
                  onChange={(val: string) =>
                    handleUpdateField("card2", "title", val)
                  }
                  isEditable={isEditable}
                  as="h3"
                  className="text-2xl leading-tight font-bold md:text-3xl"
                />
                <EditableText
                  value={data.card2.description}
                  onChange={(val: string) =>
                    handleUpdateField("card2", "description", val)
                  }
                  isEditable={isEditable}
                  as="p"
                  className="text-muted-foreground max-w-xs text-sm md:text-base"
                />
              </div>
              <div className="flex items-center gap-4">
                <EditableLink
                  href={data.card2.link}
                  text={data.card2.buttonText}
                  onChange={(text, href) => {
                    const updatedCard = {
                      ...data.card2,
                      buttonText: text,
                      link: href,
                    };
                    const updatedData = {
                      ...data,
                      card2: updatedCard,
                    };
                    setData(updatedData);
                  }}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  siteUser={siteUser}
                >
                  {data.card2.buttonText}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </EditableLink>
              </div>
            </div>

            {/* Decorative Elements */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
