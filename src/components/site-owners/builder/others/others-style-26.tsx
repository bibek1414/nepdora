"use client";

import React from "react";
import { OthersTemplate26Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersStyle26Props {
  othersData: OthersTemplate26Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate26Data>) => void;
  siteUser?: string;
}

export const OthersStyle26: React.FC<OthersStyle26Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const handleStatUpdate = (
    id: string,
    field: "value" | "label",
    val: string
  ) => {
    const updatedStats = othersData.stats.map(s =>
      s.id === id ? { ...s, [field]: val } : s
    );
    onUpdate?.({ stats: updatedStats });
  };

  return (
    <div className="w-full bg-white">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Image Column */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-lg">
                <EditableImage
                  src={othersData.image.url}
                  alt={othersData.image.alt}
                  onImageChange={url =>
                    onUpdate?.({ image: { ...othersData.image, url } })
                  }
                  isEditable={isEditable}
                  className="h-100 w-full object-cover"
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-gray-400"></span>
                <EditableText
                  as="p"
                  value={othersData.eyebrow}
                  onChange={val => onUpdate?.({ eyebrow: val })}
                  isEditable={isEditable}
                  className="block text-sm font-semibold tracking-wide"
                  style={{ fontFamily: theme?.fonts?.body }}
                />
              </div>

              <EditableText
                as="title"
                value={othersData.title}
                onChange={val => onUpdate?.({ title: val })}
                isEditable={isEditable}
                className="text-3xl leading-tight font-bold tracking-tight text-gray-900 md:text-4xl"
                style={{ fontFamily: theme?.fonts?.heading }}
                multiline
              />

              <EditableText
                as="p"
                value={othersData.description}
                onChange={val => onUpdate?.({ description: val })}
                isEditable={isEditable}
                className="mt-6 text-lg leading-relaxed font-medium text-gray-500"
                style={{ fontFamily: theme?.fonts?.body }}
                multiline
              />

              <div className="mt-10 grid grid-cols-2 gap-8">
                {othersData.stats.map(s => (
                  <div key={s.id}>
                    <EditableText
                      as="title"
                      value={s.value}
                      onChange={val => handleStatUpdate(s.id, "value", val)}
                      isEditable={isEditable}
                      className="text-3xl font-bold tracking-tight md:text-4xl"
                      style={{
                        color: theme?.colors?.primary,
                        fontFamily: theme?.fonts?.heading,
                      }}
                    />
                    <EditableText
                      as="p"
                      value={s.label}
                      onChange={val => handleStatUpdate(s.id, "label", val)}
                      isEditable={isEditable}
                      className="mt-2 text-sm font-medium text-gray-500"
                      style={{ fontFamily: theme?.fonts?.body }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
