"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  OthersTemplate16Data,
  OthersProgramItem,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { cn, hexToRgba } from "@/lib/utils";

interface OthersTemplate16Props {
  othersData: OthersTemplate16Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate16Data>) => void;
}

export const OthersTemplate16: React.FC<OthersTemplate16Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);
  const { data: themeResponse } = useThemeQuery();
  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        background: "#FFFFFF",
        primary: "#3B82F6",
        primaryForeground: "#FFFFFF",
        secondary: "#F59E0B",
        text: "#0F172A",
      },
      fonts: { heading: "sans-serif" },
    } as any);

  const handleProgramUpdate = (idx: number, field: string, value: any) => {
    const newPrograms = [...(data.programs || [])];
    if (field === "image") {
      newPrograms[idx] = {
        ...newPrograms[idx],
        image: { ...newPrograms[idx].image, url: value },
      };
    } else {
      newPrograms[idx] = { ...newPrograms[idx], [field]: value };
    }
    onUpdate?.({ programs: newPrograms });
  };

  return (
    <section className="w-full py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ backgroundColor: hexToRgba(theme.colors.secondary, 0.1) }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <EditableText
              value={data.badge}
              onChange={handleTextUpdate("badge")}
              isEditable={isEditable}
              as="span"
              className="tracking-tight"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              as="h2"
              className="mx-auto max-w-3xl text-4xl leading-tight font-bold md:text-5xl"
              style={{
                fontFamily: theme.fonts.heading,
              }}
            />
          </motion.div>
        </div>

        {/* 3-column grid - vertical dividers on desktop */}
        <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-gray-300/70">
          {data.programs?.map((program: OthersProgramItem, index: number) => (
            <motion.div
              key={program.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn("flex flex-col py-10 md:px-8 md:py-0")}
            >
              {/* Title - fixed height so all columns align */}
              <div className="flex min-h-20 items-start">
                <EditableText
                  value={program.title}
                  onChange={(val: string) =>
                    handleProgramUpdate(index, "title", val)
                  }
                  isEditable={isEditable}
                  as="h3"
                  className="text-lg leading-snug font-bold"
                />
              </div>

              {/* Description - fixed min-height so image top aligns */}
              <div className="flex min-h-24 items-start">
                <EditableText
                  value={program.description}
                  onChange={(val: string) =>
                    handleProgramUpdate(index, "description", val)
                  }
                  isEditable={isEditable}
                  as="p"
                  multiline
                  className="text-[15px] leading-relaxed opacity-70"
                />
              </div>

              {/* Image - identical fixed height and full width */}
              <div className="aspect-3/2 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-transform duration-500 hover:scale-[1.02]">
                <EditableImage
                  src={program.image?.url}
                  alt={program.image?.alt || program.title}
                  onImageChange={(img: string) =>
                    handleProgramUpdate(index, "image", img)
                  }
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <div
            className="flex flex-col items-center gap-4 rounded-3xl px-4 py-3 sm:flex-row sm:rounded-full sm:pr-8"
            style={{ backgroundColor: hexToRgba(theme.colors.primary, 0.05) }}
          >
            <span
              className="shrink-0 rounded-full px-5 py-2 text-sm font-bold"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              <EditableText
                value={data.trustBadgeLabel}
                onChange={handleTextUpdate("trustBadgeLabel")}
                isEditable={isEditable}
                as="span"
              />
            </span>
            <EditableText
              value={data.trustBadgeText}
              onChange={handleTextUpdate("trustBadgeText")}
              isEditable={isEditable}
              as="p"
              className="text-center text-sm font-medium sm:text-left"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
