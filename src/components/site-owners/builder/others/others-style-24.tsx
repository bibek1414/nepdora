"use client";

import React from "react";
import { OthersTemplate24Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersStyle24Props {
  othersData: OthersTemplate24Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate24Data>) => void;
  siteUser?: string;
}

export const OthersStyle24: React.FC<OthersStyle24Props> = ({
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
      <section className="mx-auto max-w-5xl px-4 pt-20 pb-8 md:px-6 md:pt-28 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <EditableText
              as="p"
              value={othersData.label}
              onChange={(val: string) => onUpdate?.({ label: val })}
              isEditable={isEditable}
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: theme.colors.primary }}
            />
            <div className="mt-4">
              <EditableText
                as="title"
                value={othersData.name}
                onChange={(val: string) => onUpdate?.({ name: val })}
                isEditable={isEditable}
                className="text-foreground font-serif text-5xl leading-tight sm:text-6xl"
              />
            </div>
            <div className="mt-3 items-center">
              <EditableText
                as="p"
                value={othersData.title}
                onChange={(val: string) => onUpdate?.({ title: val })}
                isEditable={isEditable}
              />
              <EditableText
                as="p"
                value={othersData.location}
                onChange={(val: string) => onUpdate?.({ location: val })}
                isEditable={isEditable}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
        <EditableText
          as="p"
          value={othersData.bioTitle}
          onChange={(val: string) => onUpdate?.({ bioTitle: val })}
          isEditable={isEditable}
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: theme.colors.primary }}
        />
        <EditableText
          as="p"
          value={othersData.bio}
          onChange={(val: string) => onUpdate?.({ bio: val })}
          isEditable={isEditable}
          className="text-foreground/85 max-w-2xl text-base leading-relaxed whitespace-pre-wrap"
        />
      </section>
    </div>
  );
};
