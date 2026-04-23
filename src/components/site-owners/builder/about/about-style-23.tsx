"use client";

import React from "react";
import { AboutUs23Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUs23Props {
  aboutUsData: AboutUs23Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs23Data>) => void;
}

/**
 * @beautifulMention: About Style 23
 * A clean, editorial header section with an eyebrow line.
 * Follows the minimalist "Northbound" design aesthetic.
 */
export const AboutUsTemplate23: React.FC<AboutUs23Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(aboutUsData, onUpdate);

  return (
    <section className="border-b border-gray-200 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-8 py-20 md:py-32">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px w-6 bg-gray-400" />
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="span"
            className="text-sm font-medium tracking-widest text-gray-500"
            style={{
              fontFamily: theme?.fonts?.body,
            }}
          />
        </div>

        <EditableText
          value={data.title}
          onChange={handleTextUpdate("title")}
          isEditable={isEditable}
          as="title"
          className="font-display max-w-4xl text-4xl leading-[1.1] font-bold tracking-tight text-balance text-gray-950 md:text-6xl"
          style={{
            fontFamily: theme?.fonts?.heading,
          }}
        />

        <EditableText
          value={data.description}
          onChange={handleTextUpdate("description")}
          isEditable={isEditable}
          as="p"
          className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl"
          style={{
            fontFamily: theme?.fonts?.body,
          }}
          multiline
        />
      </div>
    </section>
  );
};
