"use client";

import React from "react";
import { motion } from "framer-motion";
import { OthersTemplate10Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate10Props {
  othersData: OthersTemplate10Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate10Data>) => void;
}

export const OthersTemplate10: React.FC<OthersTemplate10Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleArrayItemUpdate, handleTextUpdate } = useBuilderLogic(
    othersData,
    onUpdate
  );

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const colors = theme?.colors || {
    primary: "#000000",
    primaryForeground: "#ffffff",
    secondary: "#f3f4f6",
  };

  const handleTipUpdate = (tipIndex: number, field: string, value: string) => {
    const newTips = [...(data.tips || [])];
    newTips[tipIndex] = { ...newTips[tipIndex], [field]: value };
    onUpdate?.({ tips: newTips });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <section className="w-full bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <EditableText
              value={data.label || "Expert advice"}
              onChange={handleTextUpdate("label")}
              isEditable={isEditable}
              as="span"
              className="inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold tracking-wide text-slate-800 uppercase"
            />
            <EditableText
              value={data.title || "Skincare tips that matter"}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              as="h2"
              multiline
              className="mt-6 font-bold tracking-tight text-slate-900"
            />
            <EditableText
              value={
                data.subtitle ||
                "Simple, science-backed habits to get the most from your routine."
              }
              onChange={handleTextUpdate("subtitle")}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-600"
              isEditable={isEditable}
              as="p"
              multiline
            />
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {data.tips?.map((tip, idx) => (
            <motion.div
              key={tip.id}
              variants={item}
              className="group relative flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-8 transition-all"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition-colors"
                style={{
                  fontFamily: theme?.fonts?.heading,
                }}
              >
                <EditableText
                  value={tip.icon || "🧪"}
                  onChange={val => handleTipUpdate(idx, "icon", val)}
                  isEditable={isEditable}
                  as="span"
                />
              </div>
              <div>
                <EditableText
                  value={tip.title || "Tip Title"}
                  onChange={val => handleTipUpdate(idx, "title", val)}
                  isEditable={isEditable}
                  className="font-bold text-slate-900 transition-colors"
                  as="h4"
                />
                <EditableText
                  value={
                    tip.description || "Tip description content goes here..."
                  }
                  onChange={val => handleTipUpdate(idx, "description", val)}
                  isEditable={isEditable}
                  multiline
                  className="mt-4 leading-relaxed text-slate-600 transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
