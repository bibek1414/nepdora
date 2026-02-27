"use client";

import React from "react";
import { HeroTemplate19Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface HeroTemplate19Props {
  heroData: HeroTemplate19Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate19Data>) => void;
}

export const HeroTemplate19: React.FC<HeroTemplate19Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
  };

  const { data, handleTextUpdate, handleButtonUpdate, getImageUrl } =
    useBuilderLogic(heroData, onUpdate);

  return (
    <section className="relative mx-auto flex max-w-7xl items-center bg-white py-8 md:py-16">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-10">
        {/* Text Area */}
        <div className="order-2 py-6 md:order-1 md:py-10">
          <h1 className="mb-4 text-3xl leading-tight font-bold md:mb-5 md:text-5xl lg:text-6xl">
            <EditableText
              value={data.titlePart1}
              onChange={handleTextUpdate("titlePart1")}
              isEditable={isEditable}
              as="h1"
              style={{ color: theme.colors.primary }}
            />
          </h1>

          <div className="mb-6 max-w-md text-sm leading-relaxed text-gray-600 md:mb-8 md:text-lg">
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              as="p"
              multiline
            />
          </div>

          <div className="flex gap-3 md:gap-4">
            {data.buttons.length > 0 && (
              <EditableLink
                text={data.buttons[0].text}
                href={data.buttons[0].href || "#"}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) =>
                  handleButtonUpdate("buttons")(data.buttons[0].id, text, href)
                }
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 md:w-auto md:px-8 md:text-base"
                style={{ backgroundColor: theme.colors.primary, color: "#fff" }}
              />
            )}
            {data.buttons.length > 1 && (
              <EditableLink
                text={data.buttons[1].text}
                href={data.buttons[1].href || "#"}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) =>
                  handleButtonUpdate("buttons")(data.buttons[1].id, text, href)
                }
                className="inline-flex w-full items-center justify-center rounded-full border-2 px-6 py-3 text-sm font-semibold transition-colors md:w-auto md:px-8 md:text-base"
                style={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                }}
              />
            )}
          </div>
        </div>

        {/* Image Area */}
        <div className="relative order-1 md:order-2">
          {/* Decorative Blur Circle */}
          <div
            className="absolute -top-16 -right-16 hidden h-80 w-80 rounded-full opacity-10 blur-3xl md:block"
            style={{ backgroundColor: theme.colors.secondary }}
          />

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm md:aspect-[4/5] md:rounded-3xl md:shadow-none">
            <EditableImage
              src={getImageUrl(data.imageUrl)}
              alt={data.imageAlt}
              isEditable={isEditable}
              onImageChange={(url, alt) =>
                onUpdate?.({ imageUrl: url, imageAlt: alt || data.imageAlt })
              }
              className="h-full w-full rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
