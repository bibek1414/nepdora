"use client";

import React from "react";
import { OthersTemplate5Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { Button } from "@/components/ui/button"; // Swapped to your Button
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface OthersTemplate5Props {
  othersData: OthersTemplate5Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate5Data>) => void;
}

export const OthersTemplate5: React.FC<OthersTemplate5Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#4B5563",
      primary: "#0F172A",
      secondary: "#3B82F6",
      background: "#FFFFFF",
    },
  };

  const handleUpdate =
    (field: keyof OthersTemplate5Data) => (value: string) => {
      onUpdate?.({ [field]: value });
    };

  const handleFeatureUpdate = (index: number) => (value: string) => {
    const newFeatures = [...(othersData.features || [])];
    newFeatures[index] = value;
    onUpdate?.({ features: newFeatures });
  };

  const isReverse = othersData.imagePosition === "right";

  return (
    <section className="py-8 transition-colors duration-300">
      <EditableText
        value={othersData.heading}
        onChange={handleUpdate("heading")}
        isEditable={isEditable}
        multiline
        as="h3"
        className="mb-10 text-center"
      />
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div
            className={`group relative overflow-hidden rounded-2xl ${isReverse ? "md:order-2" : "md:order-1"}`}
          >
            <EditableImage
              src={othersData.image.url}
              alt={othersData.image.alt}
              onImageChange={url => {
                if (url) onUpdate?.({ image: { ...othersData.image, url } });
              }}
              onAltChange={alt => {
                onUpdate?.({ image: { ...othersData.image, alt } });
              }}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              isEditable={isEditable}
            />
          </div>

          <div className={`${isReverse ? "md:order-1" : "md:order-2"}`}>
            {/* Heading */}

            {/* Description */}
            <div className="mb-3 text-lg leading-relaxed opacity-80">
              <EditableText
                value={othersData.description}
                onChange={handleUpdate("description")}
                isEditable={isEditable}
                multiline
                as="span"
                className="text-gray-600"
              />
            </div>

            {/* Features List (Specific to Template 5) */}
            <div className="mb-10 space-y-4">
              {(othersData.features || []).map(
                (feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0"
                      style={{ color: theme.colors.secondary }}
                    />
                    <EditableText
                      value={feature}
                      as="span"
                      onChange={handleFeatureUpdate(index)}
                      isEditable={isEditable}
                    />
                  </div>
                )
              )}
            </div>

            {/* CTA Button - Using your Button style */}

            <EditableLink
              text={othersData.buttonText || "Learn More"}
              href={othersData.buttonLink || "#"}
              style={{
                color: theme.colors.text,
                backgroundColor: theme.colors.primary,
              }}
              isEditable={isEditable}
              onChange={(text, href) => {
                if (text !== undefined) onUpdate?.({ buttonText: text });
                if (href !== undefined) onUpdate?.({ buttonLink: href });
              }}
            >
              <div className="flex items-center">
                {othersData.buttonText || "Learn More"}
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </EditableLink>
          </div>
        </div>
      </div>
    </section>
  );
};
