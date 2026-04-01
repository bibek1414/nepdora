"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Flower2,
  Puzzle,
  BookOpen,
  Utensils,
  LucideIcon,
} from "lucide-react";
import { OthersTemplate21Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { hexToRgba } from "@/lib/utils";

interface OthersTemplate21Props {
  othersData: OthersTemplate21Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate21Data>) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Flower2,
  Puzzle,
  BookOpen,
  Utensils,
  ChevronRight,
};

const FutureCard: React.FC<{
  card: any;
  index: number;
  dir: "left" | "right";
  isEditable: boolean;
  onUpdate: (updatedCard: any) => void;
  theme: any;
}> = ({ card, index, dir, isEditable, onUpdate, theme }) => {
  const Icon = ICON_MAP[card.icon] || Flower2;

  return (
    <motion.div
      initial={{ opacity: 0, x: dir === "left" ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-1 flex-col gap-5 rounded-2xl p-9 transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: card.bgColor.startsWith("#")
          ? hexToRgba(card.bgColor, 0.15)
          : card.bgColor,
      }}
    >
      {/* Icon box */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        <Icon size={22} style={{ color: card.iconColor }} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <EditableText
          as="h3"
          value={card.title}
          onChange={val => onUpdate({ ...card, title: val })}
          isEditable={isEditable}
          className="text-base font-bold text-gray-900"
          style={{ fontFamily: theme.fonts.heading }}
        />
        <EditableText
          as="p"
          value={card.description}
          onChange={val => onUpdate({ ...card, description: val })}
          isEditable={isEditable}
          className="text-sm leading-relaxed text-gray-500"
          multiline
        />
      </div>

      {/* Link */}
      <div className="mt-auto">
        <EditableLink
          text={card.buttonText}
          href={card.buttonLink}
          onChange={(text, href) =>
            onUpdate({ ...card, buttonText: text, buttonLink: href })
          }
          isEditable={isEditable}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border text-sm font-semibold text-gray-900 transition-opacity"
        >
          {card.buttonText} <ChevronRight size={14} />
        </EditableLink>
      </div>
    </motion.div>
  );
};

export const OthersTemplate21: React.FC<OthersTemplate21Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
    },
    fonts: { heading: "sans-serif", body: "sans-serif" },
  };

  const { data, handleTextUpdate, handleMultipleUpdate } = useBuilderLogic<OthersTemplate21Data>(
    othersData,
    onUpdate
  );

  const handleCardUpdate = (
    side: "leftCards" | "rightCards",
    index: number,
    updatedCard: any
  ) => {
    const newCards = [...(data[side] as any[])];
    newCards[index] = updatedCard;
    onUpdate?.({ [side]: newCards });
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-20">
        {/* Heading */}
        <div className="mb-14 flex justify-center text-center">
          <EditableText
            as="h2"
            value={data.heading}
            onChange={handleTextUpdate("heading")}
            isEditable={isEditable}
            className="mx-auto text-3xl leading-tight font-bold text-gray-900 md:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            multiline
          />
        </div>

        {/* 3-col layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px_1fr] lg:gap-5">
          {/* Left cards */}
          <div className="flex flex-col gap-5">
            {data.leftCards.map((card, i) => (
              <FutureCard
                key={card.id || i}
                card={card}
                index={i}
                dir="left"
                isEditable={isEditable}
                onUpdate={upd => handleCardUpdate("leftCards", i, upd)}
                theme={theme}
              />
            ))}
          </div>

          {/* Center image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex h-full w-full justify-center overflow-hidden rounded-2xl"
          >
            <EditableImage
              src={data.centerImage.url}
              alt={data.centerImage.alt}
              onImageChange={url =>
                onUpdate?.({
                  centerImage: { ...data.centerImage, url },
                })
              }
              isEditable={isEditable}
              className="h-full w-full cursor-pointer object-cover"
              style={{ minHeight: "400px" }}
            />
          </motion.div>

          {/* Right cards */}
          <div className="flex flex-col gap-5">
            {data.rightCards.map((card, i) => (
              <FutureCard
                key={card.id || i}
                card={card}
                index={i}
                dir="right"
                isEditable={isEditable}
                onUpdate={upd => handleCardUpdate("rightCards", i, upd)}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
