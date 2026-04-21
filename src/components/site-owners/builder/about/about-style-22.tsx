"use client";

import React from "react";
import { AboutUs22Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUs22Props {
  aboutUsData: AboutUs22Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs22Data>) => void;
}

export const AboutUsTemplate22: React.FC<AboutUs22Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate, setData } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  return (
    <section className="bg-background py-16 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:items-center lg:gap-24">
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col gap-6">
              <EditableText
                value={data.eyebrow}
                onChange={(val: string) => handleTextUpdate("eyebrow")(val)}
                isEditable={isEditable}
                className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
              />
              <EditableText
                value={data.title}
                onChange={(val: string) => handleTextUpdate("title")(val)}
                isEditable={isEditable}
                className="text-4xl font-normal leading-tight tracking-tight md:text-5xl lg:text-6xl"
                style={{ fontFamily: theme?.fonts?.heading }}
              />
            </div>

            <div className="flex flex-col gap-6 max-w-xl">
              <EditableText
                value={data.description1}
                onChange={(val: string) => handleTextUpdate("description1")(val)}
                isEditable={isEditable}
                className="text-xl leading-relaxed text-foreground/90"
                style={{ fontFamily: theme?.fonts?.body }}
              />
              <EditableText
                value={data.description2}
                onChange={(val: string) => handleTextUpdate("description2")(val)}
                isEditable={isEditable}
                className="text-lg leading-relaxed text-muted-foreground"
                style={{ fontFamily: theme?.fonts?.body }}
              />
              <EditableText
                value={data.description3}
                onChange={(val: string) => handleTextUpdate("description3")(val)}
                isEditable={isEditable}
                className="text-lg leading-relaxed text-muted-foreground"
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt}
                onImageChange={(val: string) => setData({ ...data, imageUrl: val })}
                isEditable={isEditable}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              />
            </div>
            
            {/* Elegant decoration */}
            <div 
              className="absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: theme?.colors?.primary || '#3b82f6' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
