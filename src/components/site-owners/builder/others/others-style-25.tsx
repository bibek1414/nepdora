"use client";

import React from "react";
import { OthersTemplate25Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersStyle25Props {
  othersData: OthersTemplate25Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate25Data>) => void;
  siteUser?: string;
}

export const OthersStyle25: React.FC<OthersStyle25Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
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

  return (
    <div className="bg-background w-full">
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
        <div>
          <EditableText
            as="p"
            value={othersData.languageTitle}
            onChange={(val: string) => onUpdate?.({ languageTitle: val })}
            isEditable={isEditable}
            className="mb-2 text-xs tracking-[0.2em] uppercase"
            style={{ color: theme.colors.primary }}
          />
          <EditableText
            as="p"
            value={othersData.languages}
            onChange={(val: string) => onUpdate?.({ languages: val })}
            isEditable={isEditable}
            className="text-base leading-relaxed whitespace-pre-wrap"
            multiline
          />
        </div>
      </section>
    </div>
  );
};
