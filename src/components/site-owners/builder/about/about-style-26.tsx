"use client";

import React from "react";
import { AboutUs26Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { color } from "framer-motion";

interface AboutUs26Props {
  aboutUsData: AboutUs26Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs26Data>) => void;
}

/**
 * @beautifulMention: About Style 26
 * A clean, editorial header section with an eyebrow line.
 * Follows the minimalist "Northbound" design aesthetic.
 */
export const AboutUsTemplate26: React.FC<AboutUs26Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section
      className="border-b border-gray-200"
      style={{
        background: theme?.colors.primary,
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-10 md:py-20">
        <EditableText
          value={data.eyebrow}
          onChange={handleTextUpdate("eyebrow")}
          isEditable={isEditable}
          as="p"
          className="px-1"
          style={{
            fontFamily: theme?.fonts?.body,
            color: theme?.colors?.primaryForeground,
          }}
        />

        <EditableText
          value={data.title}
          onChange={handleTextUpdate("title")}
          isEditable={isEditable}
          as="title"
          className="font-display mt-3 max-w-4xl text-4xl leading-[1.1] font-bold tracking-tight text-balance md:text-6xl"
          style={{
            fontFamily: theme?.fonts?.heading,
            color: theme?.colors?.primaryForeground,
          }}
        />

        <EditableText
          value={data.description}
          onChange={handleTextUpdate("description")}
          isEditable={isEditable}
          as="p"
          className="mt-8 max-w-2xl px-1"
          style={{
            fontFamily: theme?.fonts?.body,
            color: theme?.colors?.primaryForeground,
          }}
          multiline
        />
      </div>
    </section>
  );
};
