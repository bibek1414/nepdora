"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Plane,
  GraduationCap,
  CheckCircle,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  OthersTemplate14Data,
  OthersProcessStep,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate14Props {
  othersData: OthersTemplate14Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate14Data>) => void;
}

const iconMap: Record<string, any> = {
  MessageSquare,
  Search,
  FileText,
  CheckCircle,
  Plane,
  GraduationCap,
};

export const OthersTemplate14: React.FC<OthersTemplate14Props> = ({
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

  const handleStepUpdate = (index: number, field: string, value: string) => {
    const newSteps = [...(data.steps || [])];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onUpdate?.({ steps: newSteps });
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              as="h2"
              className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
              style={{ fontFamily: theme?.fonts?.heading }}
            />
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              as="p"
              multiline
              className="mx-auto max-w-2xl text-lg text-slate-600"
            />
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.steps?.map((step: OthersProcessStep, index: number) => {
            const IconComponent = iconMap[step.icon] || HelpCircle;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <Card className="hover:border-primary/50 h-full border-slate-100 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="relative p-6 pt-10">
                    {/* Step Number Badge */}
                    <div
                      className="absolute -top-3 -left-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.primaryForeground,
                      }}
                    >
                      <EditableText
                        value={step.number}
                        onChange={(val: string) =>
                          handleStepUpdate(index, "number", val)
                        }
                        isEditable={isEditable}
                        as="span"
                        className="absolute left-3 z-20"
                      />
                    </div>

                    {/* Icon */}
                    <div
                      className="group-hover:bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-colors duration-300"
                      style={{ color: colors.primary }}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="mb-2">
                      <EditableText
                        value={step.title}
                        onChange={(val: string) =>
                          handleStepUpdate(index, "title", val)
                        }
                        isEditable={isEditable}
                        as="h3"
                        className="text-lg font-bold text-slate-900"
                        style={{ fontFamily: theme?.fonts?.heading }}
                      />
                    </div>
                    <div>
                      <EditableText
                        value={step.description}
                        onChange={(val: string) =>
                          handleStepUpdate(index, "description", val)
                        }
                        isEditable={isEditable}
                        as="p"
                        multiline
                        className="text-sm leading-relaxed text-slate-600"
                      />
                    </div>
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
