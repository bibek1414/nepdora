"use client";

import React from "react";
import { OthersTemplate5Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface OthersTemplate5Props {
  othersData: OthersTemplate5Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate5Data>) => void;
}

export const OthersTemplate5: React.FC<OthersTemplate5Props> = ({
  othersData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Reference image uses a very dark teal/green for text: #052C2C
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#052C2C",
      primary: "#052C2C",
      background: "#FFFFFF",
    },
  };

  const { data, handleTextUpdate, getImageUrl } = useBuilderLogic(
    othersData,
    onUpdate
  );

  const handleFeatureUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate?.({ features: newFeatures });
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-24">
      {/* The Lime Green Background Block - Positioned absolutely to the right */}
      <div
        className="absolute top-0 right-0 hidden h-full w-1/3 lg:block"
        style={{ backgroundColor: theme.colors.background || "#D9FF5B" }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column: Content */}
          <div className="flex flex-col justify-start pt-4">
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                <EditableText
                  value={data.badge}
                  onChange={handleTextUpdate("badge")}
                  isEditable={isEditable}
                  className="text-sm font-medium text-slate-700"
                />
              </div>
            </div>

            {/* Heading */}
            <EditableText
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              as="h3"
              className="mb-14 text-4xl leading-[1.1] font-bold tracking-tight text-[#052C2C] md:text-5xl lg:text-6xl"
            />

            {/* Features List */}
            <div className="divide-y divide-gray-200">
              {data.features.map((feature, index) => (
                <div key={feature.id} className="py-8 first:pt-0">
                  <div className="flex items-start gap-6">
                    {/* Numbering */}
                    <span className="text-xl font-bold text-[#052C2C]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1">
                      <EditableText
                        value={feature.title}
                        onChange={val =>
                          handleFeatureUpdate(index, "title", val)
                        }
                        isEditable={isEditable}
                        as="h4"
                        className="mb-2 text-xl font-bold text-[#052C2C]"
                      />
                      <EditableText
                        value={feature.description}
                        onChange={val =>
                          handleFeatureUpdate(index, "description", val)
                        }
                        as="p"
                        isEditable={isEditable}
                        className="max-w-md text-[15px] leading-relaxed text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Final bottom line */}
              <div className="border-t border-gray-200" />
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative flex justify-end">
            {/* Image Container */}
            <div className="relative z-20 aspect-[4/5] w-full max-w-[500px] overflow-hidden shadow-2xl">
              <EditableImage
                src={getImageUrl(data.image.url)}
                alt={data.image.alt}
                isEditable={isEditable}
                onImageChange={(url, alt) =>
                  onUpdate?.({ image: { url, alt: alt || data.image.alt } })
                }
                className="h-160 w-full object-cover"
              />
              {/* Subtle overlay to match the "greenish" tint of the original image */}
              <div className="pointer-events-none absolute inset-0 bg-[#052C2C]/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
