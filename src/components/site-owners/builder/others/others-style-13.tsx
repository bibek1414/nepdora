"use client";

import React from "react";
import { OthersTemplate13Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate13Props {
  othersData: OthersTemplate13Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate13Data>) => void;
}

export const OthersTemplate13: React.FC<OthersTemplate13Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { handleTextUpdate } = useBuilderLogic(othersData, onUpdate);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const primaryColor = theme?.colors?.primary || "#10B981";

  const handleStatUpdate = (
    idx: number,
    field: "value" | "label",
    value: string
  ) => {
    const newStats = [...(othersData.stats || [])];
    newStats[idx] = { ...newStats[idx], [field]: value };
    onUpdate?.({ stats: newStats });
  };

  return (
    <section
      className="border-border border-y-2 py-12 md:py-16"
      style={{ backgroundColor: `${primaryColor}0D` }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {othersData.stats.map((stat, index) => (
            <div key={stat.id} className="text-center">
              <EditableText
                as="h1"
                className="mb-2 text-4xl font-bold md:text-5xl"
                style={{ color: primaryColor }}
                value={stat.value}
                onChange={newValue =>
                  handleStatUpdate(index, "value", newValue)
                }
                isEditable={isEditable}
              />
              <EditableText
                as="p"
                className="text-muted-foreground font-medium"
                value={stat.label}
                onChange={newValue =>
                  handleStatUpdate(index, "label", newValue)
                }
                isEditable={isEditable}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
