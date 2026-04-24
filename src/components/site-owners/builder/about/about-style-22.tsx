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

  const { data, handleTextUpdate, handleImageUpdate } = useBuilderLogic(
    aboutUsData,
    onUpdate
  );

  return (
    <div className="bg-white">
      {/* Section 1: Introduction */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-20 pb-12 md:grid-cols-[1.2fr_1fr] md:items-end md:pt-28">
        <div>
          <EditableText
            value={data.eyebrow}
            onChange={handleTextUpdate("eyebrow")}
            isEditable={isEditable}
            as="span"
            className="tracking-[0.2em] uppercase"
            style={{ color: theme?.colors?.primary }}
          />
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="title"
            className="mt-4 font-serif text-5xl leading-[1.05] text-gray-950 sm:text-6xl md:text-7xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            as="p"
            className="mt-6"
            style={{ fontFamily: theme?.fonts?.body }}
          />
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl">
          <EditableImage
            src={data.portraitImageUrl}
            alt={data.portraitImageAlt}
            onImageChange={handleImageUpdate("portraitImageUrl", "portraitImageAlt")}
            isEditable={isEditable}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Section 2: Wide Image */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="aspect-video w-full overflow-hidden rounded-2xl">
          <EditableImage
            src={data.aboutImageUrl}
            alt={data.aboutImageAlt}
            onImageChange={handleImageUpdate("aboutImageUrl", "aboutImageAlt")}
            isEditable={isEditable}
            className="h-150 w-full object-cover"
          />
        </div>
      </section>

      {/* Section 3: Bio Details */}
      <section className="mx-auto max-w-2xl px-6 py-12">
        <div className="space-y-8 text-base leading-relaxed text-gray-800">
          <EditableText
            value={data.bioParagraph1}
            onChange={handleTextUpdate("bioParagraph1")}
            isEditable={isEditable}
            as="p"
            style={{ fontFamily: theme?.fonts?.body }}
          />
          <EditableText
            value={data.bioParagraph2}
            onChange={handleTextUpdate("bioParagraph2")}
            isEditable={isEditable}
            as="p"
            style={{ fontFamily: theme?.fonts?.body }}
          />
          <EditableText
            value={data.bioParagraph3}
            onChange={handleTextUpdate("bioParagraph3")}
            isEditable={isEditable}
            as="p"
            style={{ fontFamily: theme?.fonts?.body }}
          />
        </div>
      </section>
    </div>
  );
};
