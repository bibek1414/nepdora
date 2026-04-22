"use client";

import React from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate22Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroTemplate22Props {
  heroData: HeroTemplate22Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate22Data>) => void;
}

export const HeroTemplate22: React.FC<HeroTemplate22Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, handleButtonUpdate, setData } =
    useBuilderLogic(heroData, onUpdate);

  const handleFeatureUpdate =
    (id: string, field: "title" | "subtitle") => (value: string) => {
      const updatedFeatures = data.features.map(feature =>
        feature.id === id ? { ...feature, [field]: value } : feature
      );
      setData({ ...data, features: updatedFeatures });
    };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-page mx-auto max-w-7xl px-8 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 lg:col-span-7 lg:pt-12">
            <div className="mb-8 flex items-center gap-2">
              <span className="h-[1px] w-6 bg-gray-400"></span>

              <EditableText
                value={data.eyebrow}
                as="span"
                onChange={handleTextUpdate("eyebrow")}
                isEditable={isEditable}
                className="text-sm font-medium"
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
            <EditableText
              value={data.title}
              as="title"
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              className="font-display text-5xl leading-[0.98] tracking-tight text-balance text-gray-950 sm:text-6xl md:text-7xl"
              style={{ fontFamily: theme?.fonts?.heading }}
              multiline
            />
            <EditableText
              value={data.description}
              as="p"
              onChange={handleTextUpdate("description")}
              isEditable={isEditable}
              className="mt-4 max-w-xl"
              style={{ fontFamily: theme?.fonts?.body }}
              multiline
            />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {data.buttons?.map((button, index) => (
                <div key={button.id || index} className="relative z-30">
                  <EditableLink
                    text={button.text}
                    href={button.href || "#"}
                    onChange={(newText, newHref) =>
                      handleButtonUpdate("buttons")(button.id, newText, newHref)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className={cn(
                      "inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200",
                      button.variant === "primary"
                        ? "shadow-sm hover:shadow-md"
                        : "border border-gray-300 hover:bg-gray-50/50"
                    )}
                    style={{
                      backgroundColor:
                        button.variant === "primary"
                          ? theme?.colors?.primary
                          : "white",
                      color:
                        button.variant === "primary"
                          ? theme?.colors?.primaryForeground
                          : " black",
                    }}
                  >
                    {button.text}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </EditableLink>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-right-4 delay-150 duration-700 lg:col-span-5">
            <div className="h-150 overflow-hidden rounded-xl">
              <EditableImage
                src={data.mainImageUrl}
                alt={data.mainImageAlt}
                onImageChange={handleTextUpdate("mainImageUrl")}
                isEditable={isEditable}
                className="h-150 w-full object-cover"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6">
              {data.features.map(feature => (
                <div key={feature.id}>
                  <EditableText
                    value={feature.title}
                    as="h4"
                    onChange={handleFeatureUpdate(feature.id, "title")}
                    isEditable={isEditable}
                    className="text-2xl"
                    style={{ fontFamily: theme?.fonts?.heading }}
                  />
                  <EditableText
                    value={feature.subtitle}
                    as="p"
                    onChange={handleFeatureUpdate(feature.id, "subtitle")}
                    isEditable={isEditable}
                    className="mt-1 text-sm text-gray-600"
                    style={{ fontFamily: theme?.fonts?.body }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
