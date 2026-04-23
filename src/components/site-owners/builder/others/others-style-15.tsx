"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Clock,
  Award,
  HeartHandshake,
  Globe,
  HelpCircle,
  Compass,
  Layers,
  Leaf,
  ClipboardCheck,
  Building2
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  OthersTemplate15Data,
  OthersFeature15,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate15Props {
  othersData: OthersTemplate15Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate15Data>) => void;
}

const iconMap: Record<string, any> = {
  Shield,
  Users,
  Clock,
  Award,
  HeartHandshake,
  Globe,
  HelpCircle,
  Compass,
  Layers,
  Leaf,
  ClipboardCheck,
  Building2
};

export const OthersTemplate15: React.FC<OthersTemplate15Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const colors = theme?.colors || {
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#64748b",
  };

  const handleStatUpdate = (index: number, field: string, value: string) => {
    const newStats = [...(data.trustBadges || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    onUpdate?.({ trustBadges: newStats });
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const newFeatures = [...(data.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate?.({ features: newFeatures });
  };

  return (
    <section className="bg-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary r mb-3 text-sm font-semibold"
                style={{
                  color: colors.primary,
                  borderColor: `${colors.primary}33`,
                }}
              >
                <EditableText
                  value={data.badge}
                  onChange={handleTextUpdate("badge")}
                  isEditable={isEditable}
                  as="p"
                />
              </Badge>
            </div>
            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              as="h2"
              className="mb-4 text-3xl font-bold md:text-4xl"
              style={{ fontFamily: theme?.fonts?.heading }}
            />
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              as="p"
              multiline
              className="text-muted-foreground"
            />
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-4 lg:justify-end"
          >
            {data.trustBadges?.map((stat, index) => (
              <Card key={stat.id} className="rounded-lg px-6 py-4 text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  <EditableText
                    value={stat.value}
                    onChange={val => handleStatUpdate(index, "value", val)}
                    isEditable={isEditable}
                    as="h3"
                  />
                </div>
                <div className="text-muted-foreground text-xs">
                  <EditableText
                    value={stat.label}
                    onChange={val => handleStatUpdate(index, "label", val)}
                    isEditable={isEditable}
                    as="p"
                  />
                </div>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.features?.map((feature: OthersFeature15, index: number) => {
            const IconComponent = iconMap[feature.icon] || HelpCircle;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full transition-all duration-300">
                  <CardHeader>
                    <div
                      className="bg-primary/10 group-hover:bg-primary mb-0 flex h-12 w-12 items-center justify-center rounded-lg transition-colors"
                      style={{
                        backgroundColor: `${colors.primary}1A`,
                      }}
                    >
                      <IconComponent
                        className="text-primary group-hover:text-primary-foreground h-5 w-5 transition-colors"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <CardTitle className="pt-4 text-lg">
                      <EditableText
                        value={feature.title}
                        onChange={val =>
                          handleFeatureUpdate(index, "title", val)
                        }
                        isEditable={isEditable}
                        as="h5"
                        style={{ fontFamily: theme?.fonts?.heading }}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      <EditableText
                        value={feature.description}
                        onChange={val =>
                          handleFeatureUpdate(index, "description", val)
                        }
                        isEditable={isEditable}
                        as="p"
                        multiline
                      />
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
