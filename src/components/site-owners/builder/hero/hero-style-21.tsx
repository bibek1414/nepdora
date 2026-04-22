"use client";

import React from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate21Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { cn } from "@/lib/utils";
import { ChevronRight, MapPin } from "lucide-react";

interface HeroTemplate21Props {
  heroData: HeroTemplate21Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate21Data>) => void;
}

export const HeroTemplate21: React.FC<HeroTemplate21Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, handleButtonUpdate, setData } =
    useBuilderLogic(heroData, onUpdate);

  return (
    <section className="mx-auto max-w-7xl px-12 py-20">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-16">
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 duration-700">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ backgroundColor: theme?.colors?.primary || "#3b82f6" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: theme?.colors?.primary || "#3b82f6" }}
              />
            </span>
            <EditableText
              value={data.status}
              as="p"
              onChange={handleTextUpdate("status")}
              isEditable={isEditable}
              className="text-sm"
            />
          </div>

          {/* Heading */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: theme?.fonts?.heading }}
            multiline
          />

          {/* Description */}
          <EditableText
            value={data.description}
            as="p"
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            className="max-w-[480px] text-lg leading-relaxed"
            style={{ fontFamily: theme?.fonts?.body }}
          />

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {data.buttons?.map((button, index) => (
              <EditableLink
                key={button.id || index}
                text={button.text}
                href={button.href || "#"}
                onChange={(newText, newHref) =>
                  handleButtonUpdate("buttons")(button.id, newText, newHref)
                }
                isEditable={isEditable}
                siteUser={siteUser}
                className={cn(
                  "h-12 rounded-full border px-8 py-4 text-sm transition-all duration-300"
                )}
                style={{
                  backgroundColor:
                    button.variant === "primary" ? theme?.colors?.primary : theme?.colors?.secondary,
                  color:
                    button.variant === "primary"
                      ? theme?.colors?.primaryForeground
                      : theme?.colors?.secondaryForeground,
                }}
              >
                {button.text}
                <ChevronRight className="h-4 w-4" />
              </EditableLink>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="group animate-in fade-in slide-in-from-right-4 relative delay-200 duration-1000">
          <EditableImage
            src={data.portraitUrl}
            alt={data.portraitAlt}
            onImageChange={handleTextUpdate("portraitUrl")}
            isEditable={isEditable}
            className="h-full w-full rounded-2xl object-cover"
          />

          {/* Location Tag */}
          <div className="bg-background/80 absolute bottom-6 left-6 z-40 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg backdrop-blur-md transition-transform duration-300 hover:translate-y-[-4px]">
            <MapPin className="h-4 w-4" />
            <EditableText
              value={data.location}
              onChange={handleTextUpdate("location")}
              isEditable={isEditable}
              as="p"
              className="z-40! text-xs"
            />
          </div>

          {/* Subtle decoration */}
          <div
            className="absolute -right-10 -bottom-10 -z-10 h-64 w-64 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: theme?.colors?.primary || "#3b82f6" }}
          />
        </div>
      </div>
    </section>
  );
};
