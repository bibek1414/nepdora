"use client";

import React from "react";
import { OthersTemplate23Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate23Props {
  othersData: OthersTemplate23Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate23Data>) => void;
}

export const OthersTemplate23: React.FC<OthersTemplate23Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const handleItemUpdate = (
    index: number,
    updates: Partial<(typeof othersData.items)[0]>
  ) => {
    const updatedItems = [...othersData.items];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    onUpdate?.({ items: updatedItems });
  };

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="max-w-2xl">
          <EditableText
            as="p"
            value={othersData.eyebrow}
            onChange={val => onUpdate?.({ eyebrow: val })}
            isEditable={isEditable}
            className="text-xs font-medium tracking-widest uppercase transition-colors duration-300"
            style={{
              fontFamily: theme?.fonts?.body,
            }}
          />
          <EditableText
            as="h2"
            value={othersData.title}
            onChange={val => onUpdate?.({ title: val })}
            isEditable={isEditable}
            className="text-foreground mt-6 text-3xl font-normal tracking-tight md:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
          />
        </div>

        <div className="mt-8 grid gap-12 md:grid-cols-3">
          {othersData.items.map((item, index) => (
            <div
              key={item.id || index}
              className="border-border border-t pt-8 transition-all duration-300"
            >
              <EditableText
                as="p"
                value={item.number}
                onChange={val => handleItemUpdate(index, { number: val })}
                isEditable={isEditable}
                className="text-xs font-medium"
                style={{
                  fontFamily: theme?.fonts?.body,
                }}
              />
              <EditableText
                as="h3"
                value={item.title}
                onChange={val => handleItemUpdate(index, { title: val })}
                isEditable={isEditable}
                className="mt-4 font-normal"
                style={{ fontFamily: theme?.fonts?.heading }}
              />
              <EditableText
                as="p"
                value={item.description}
                onChange={val => handleItemUpdate(index, { description: val })}
                isEditable={isEditable}
                className="mt-4"
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
