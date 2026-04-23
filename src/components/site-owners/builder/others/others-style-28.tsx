"use client";

import React from "react";
import { OthersTemplate28Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface OthersStyle28Props {
  othersData: OthersTemplate28Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate28Data>) => void;
}

export const OthersStyle28: React.FC<OthersStyle28Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  const handleItemUpdate = (
    id: string,
    field: "title" | "body" | "n",
    val: string
  ) => {
    const updatedItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onUpdate?.({ items: updatedItems });
  };

  return (
    <section className="bg-surface-warm border-hairline border-y">
      <div className="mx-auto max-w-7xl px-8 py-24 md:py-32">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <EditableText
              value={data.eyebrow}
              onChange={handleTextUpdate("eyebrow")}
              isEditable={isEditable}
              as="span"
              className="eyebrow text-muted-foreground text-sm font-medium tracking-wider"
              style={{ fontFamily: theme?.fonts?.body }}
            />
          </div>
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="title"
            className="text-3xl font-bold tracking-tight text-balance text-gray-950 md:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
            multiline
          />
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {data.items.map(item => (
            <div>
              <EditableText
                value={item.n}
                onChange={val => handleItemUpdate(item.id, "n", val)}
                isEditable={isEditable}
                as="label"
                className="mb-3 block text-xl font-medium"
                style={{ fontFamily: theme?.fonts?.body }}
              />
              <EditableText
                value={item.title}
                onChange={val => handleItemUpdate(item.id, "title", val)}
                isEditable={isEditable}
                as="label"
                className="font-display mb-3 text-2xl"
                style={{ fontFamily: theme?.fonts?.heading }}
              />
              <EditableText
                value={item.body}
                onChange={val => handleItemUpdate(item.id, "body", val)}
                isEditable={isEditable}
                as="p"
                className="text-muted-foreground text-pretty"
                style={{ fontFamily: theme?.fonts?.body }}
                multiline
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
