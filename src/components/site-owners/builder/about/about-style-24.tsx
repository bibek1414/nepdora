"use client";

import React from "react";
import { AboutUs24Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUs24Props {
  aboutUsData: AboutUs24Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs24Data>) => void;
}

/**
 * @beautifulMention: About Style 24
 * A clean, editorial "Our story" layout with an image on the left.
 * Follows the modern "Northbound" aesthetic with a decorative eyebrow line.
 */
export const AboutUsTemplate24: React.FC<AboutUs24Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, handleImageUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Image Column */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-lg shadow-sm">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                isEditable={isEditable}
                className="h-150 w-full object-cover"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-4">
              <EditableText
                value={data.eyebrow}
                onChange={handleTextUpdate("eyebrow")}
                isEditable={isEditable}
                as="span"
                className="text-sm font-semibold tracking-wide text-gray-500"
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
              style={{
                fontFamily: theme?.fonts?.heading,
              }}
              multiline
            />

            <div className="mt-8 space-y-6">
              <EditableText
                value={data.description1}
                onChange={handleTextUpdate("description1")}
                isEditable={isEditable}
                as="p"
                className="text-lg leading-relaxed text-pretty text-gray-600"
                style={{
                  fontFamily: theme?.fonts?.body,
                }}
                multiline
              />
              <EditableText
                value={data.description2}
                onChange={handleTextUpdate("description2")}
                isEditable={isEditable}
                as="p"
                className="text-lg leading-relaxed text-pretty text-gray-600"
                style={{
                  fontFamily: theme?.fonts?.body,
                }}
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
