"use client";

import React, { useState } from "react";
import {
  OthersTemplate29Data,
  OthersTemplate29Item,
} from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { hexToRgba } from "@/lib/utils";

interface OthersStyle29Props {
  othersData: OthersTemplate29Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate29Data>) => void;
}

const OthersCard29: React.FC<{
  item: OthersTemplate29Item;
  isEditable: boolean;
  onUpdate: (field: "title" | "description" | "image", val: string) => void;
  theme: any;
}> = ({ item, isEditable, onUpdate, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative aspect-3/4 overflow-hidden rounded-lg transition-all duration-300 ${
        isEditable ? "cursor-default" : "cursor-pointer"
      }`}
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
    >
      <div className="absolute inset-0 h-full w-full">
        <EditableImage
          src={item.image}
          alt={item.title}
          onImageChange={(val: string) => onUpdate("image", val)}
          isEditable={isEditable}
          className={`h-[380px] w-full object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${theme?.colors?.primary || "#000"} 0%, ${hexToRgba(
            theme?.colors?.primary || "#000",
            0.4
          )} 50%, transparent 100%)`,
        }}
      />

      <div className="absolute right-0 bottom-0 left-0 z-10 p-6">
        <EditableText
          value={item.title}
          onChange={val => onUpdate("title", val)}
          isEditable={isEditable}
          as="label"
          className="mb-2 text-xl font-medium text-white"
          style={{ fontFamily: theme?.fonts?.heading }}
        />
        <EditableText
          value={item.description}
          onChange={val => onUpdate("description", val)}
          isEditable={isEditable}
          as="p"
          className="text-sm leading-relaxed text-white/70"
          style={{ fontFamily: theme?.fonts?.body }}
          multiline
        />
      </div>
    </div>
  );
};

export const OthersStyle29: React.FC<OthersStyle29Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data, handleTextUpdate } = useBuilderLogic(othersData, onUpdate);

  const handleItemUpdate = (
    id: string,
    field: "title" | "description" | "image",
    val: string
  ) => {
    const updatedItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onUpdate?.({ items: updatedItems });
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-8 py-20 lg:py-28">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div style={{ backgroundColor: theme?.colors?.primary }} />
            <EditableText
              value={data.eyebrow}
              onChange={handleTextUpdate("eyebrow")}
              isEditable={isEditable}
              as="span"
              className="text-sm font-medium tracking-wider"
              style={{
                fontFamily: theme?.fonts?.body,
                color: theme?.colors?.primary,
              }}
            />
          </div>
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="title"
            className="mb-4 text-3xl font-bold tracking-tight text-gray-950 md:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
            multiline
          />
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            isEditable={isEditable}
            as="p"
            className="max-w-2xl text-lg text-gray-600"
            style={{ fontFamily: theme?.fonts?.body }}
            multiline
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data.items.map(item => (
            <OthersCard29
              key={item.id}
              item={item}
              isEditable={isEditable}
              onUpdate={(field, val) => handleItemUpdate(item.id, field, val)}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
