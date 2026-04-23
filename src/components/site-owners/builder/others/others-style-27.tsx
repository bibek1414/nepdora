"use client";

import React from "react";
import {
  OthersTemplate27Data,
  OthersTemplate27Item,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersStyle27Props {
  othersData: OthersTemplate27Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate27Data>) => void;
  siteUser?: string;
}

export const OthersStyle27: React.FC<OthersStyle27Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const handleItemUpdate = (
    id: string,
    field: keyof OthersTemplate27Item,
    val: string
  ) => {
    const updatedItems = othersData.items.map(item =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onUpdate?.({ items: updatedItems });
  };

  return (
    <div className="w-full bg-white">
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-8">
          {/* Header Row */}
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-6 flex items-center gap-4">
                <EditableText
                  as="p"
                  value={othersData.eyebrow}
                  onChange={val => onUpdate?.({ eyebrow: val })}
                  isEditable={isEditable}
                  className="block px-2 text-sm font-semibold tracking-wide"
                  style={{ fontFamily: theme?.fonts?.body }}
                />
              </div>
              <EditableText
                as="title"
                value={othersData.title}
                onChange={val => onUpdate?.({ title: val })}
                isEditable={isEditable}
                className="font-display text-3xl leading-tight tracking-tight text-balance text-gray-900 md:text-5xl"
                style={{ fontFamily: theme?.fonts?.heading }}
                multiline
              />
            </div>
            <div className="self-end lg:col-span-6 lg:col-start-7">
              <EditableText
                as="p"
                value={othersData.description}
                onChange={val => onUpdate?.({ description: val })}
                isEditable={isEditable}
                className="text-muted-foreground text-lg leading-relaxed font-medium text-pretty"
                style={{ fontFamily: theme?.fonts?.body }}
                multiline
              />
            </div>
          </div>

          {/* Grid Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {othersData.items.map(item => (
              <div
                key={item.id}
                className="hover:border-primary/40 rounded-xl border border-gray-200 bg-white p-8 transition-colors"
              >
                <EditableText
                  as="span"
                  value={item.number}
                  onChange={val => handleItemUpdate(item.id, "number", val)}
                  isEditable={isEditable}
                  className="font-display text-primary text-sm font-semibold"
                  style={{
                    color: theme?.colors?.primary,
                    fontFamily: theme?.fonts?.body,
                  }}
                />
                <EditableText
                  as="label"
                  value={item.title}
                  onChange={val => handleItemUpdate(item.id, "title", val)}
                  isEditable={isEditable}
                  className="font-display mt-3 text-2xl font-bold tracking-tight text-gray-900"
                  style={{ fontFamily: theme?.fonts?.heading }}
                />
                <EditableText
                  as="p"
                  value={item.description}
                  onChange={val =>
                    handleItemUpdate(item.id, "description", val)
                  }
                  isEditable={isEditable}
                  className="text-muted-foreground mt-4 text-sm leading-relaxed text-pretty"
                  style={{ fontFamily: theme?.fonts?.body }}
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
