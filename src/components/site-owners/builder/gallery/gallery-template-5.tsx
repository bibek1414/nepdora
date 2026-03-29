"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryTemplate5Data } from "@/types/owner-site/components/gallery";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface GalleryTemplate5Props {
  galleryData: GalleryTemplate5Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryTemplate5Data>) => void;
}

export const GalleryTemplate5: React.FC<GalleryTemplate5Props> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleTextUpdate } = useBuilderLogic(galleryData, onUpdate);
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const handleCategoryUpdate = (idx: number, field: string, value: string) => {
    const newCategories = [...data.categories];
    newCategories[idx] = { ...newCategories[idx], [field]: value };
    onUpdate?.({ categories: newCategories });
  };

  const handleActivityImageUpdate = (
    catIdx: number,
    actIdx: number,
    imageUrl: string
  ) => {
    const newCategories = [...data.categories];
    const newActivities = [...newCategories[catIdx].activities];
    newActivities[actIdx] = { ...newActivities[actIdx], image: imageUrl };
    newCategories[catIdx] = {
      ...newCategories[catIdx],
      activities: newActivities,
    };
    onUpdate?.({ categories: newCategories });
  };

  const handleActivityNameUpdate = (
    catIdx: number,
    actIdx: number,
    name: string
  ) => {
    const newCategories = [...data.categories];
    const newActivities = [...newCategories[catIdx].activities];
    newActivities[actIdx] = { ...newActivities[actIdx], name };
    newCategories[catIdx] = {
      ...newCategories[catIdx],
      activities: newActivities,
    };
    onUpdate?.({ categories: newCategories });
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex items-center justify-center border-b border-black/10 pb-8 text-center">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="h2"
            className="font-serif text-4xl leading-tight font-normal text-[#1A1A1A] md:text-5xl"
            style={{
              fontFamily: theme?.fonts?.heading,
            }}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.categories.map((category, idx) => (
            <ActivityCard
              key={category.id}
              category={category}
              isEditable={isEditable}
              onCategoryUpdate={(field, val) =>
                handleCategoryUpdate(idx, field, val)
              }
              onActivityImageUpdate={(actIdx, img) =>
                handleActivityImageUpdate(idx, actIdx, img)
              }
              onActivityNameUpdate={(actIdx, name) =>
                handleActivityNameUpdate(idx, actIdx, name)
              }
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

function NavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="z-10 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:bg-white/30"
      style={{
        border: "1.5px solid rgba(255,255,255,0.75)",
        backgroundColor: "rgba(255,255,255,0.18)",
      }}
    >
      {children}
    </button>
  );
}

function ActivityCard({
  category,
  isEditable,
  onCategoryUpdate,
  onActivityImageUpdate,
  onActivityNameUpdate,
  theme,
}: {
  category: any;
  isEditable: boolean;
  onCategoryUpdate: (field: string, val: string) => void;
  onActivityImageUpdate: (actIdx: number, img: string) => void;
  onActivityNameUpdate: (actIdx: number, name: string) => void;
  theme: any;
}) {
  const [current, setCurrent] = useState(0);
  const count = category.activities.length;
  const next = () => setCurrent(p => (p + 1) % count);
  const prev = () => setCurrent(p => (p - 1 + count) % count);
  const activity = category.activities[current];

  return (
    <div className="flex flex-col rounded-2xl border border-[#E8E3DC] bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image Container */}
      <div className="p-3 pb-0">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={activity.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <EditableImage
                src={activity.image}
                alt={activity.name}
                onImageChange={img => onActivityImageUpdate(current, img)}
                isEditable={isEditable}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Navigation Controls */}
          {count > 1 && (
            <div className="absolute inset-x-4 inset-y-0 flex items-center justify-between">
              <NavButton onClick={prev}>
                <ChevronLeft size={18} />
              </NavButton>
              <NavButton onClick={next}>
                <ChevronRight size={18} />
              </NavButton>
            </div>
          )}

          {/* Label */}
          <div className="absolute right-0 bottom-4 left-0 text-center">
            <EditableText
              value={activity.name}
              onChange={val => onActivityNameUpdate(current, val)}
              isEditable={isEditable}
              as="span"
              className="px-2 text-[0.7rem] font-medium tracking-wider text-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <EditableText
          value={category.title}
          onChange={val => onCategoryUpdate("title", val)}
          isEditable={isEditable}
          as="h3"
          className="mb-3 font-serif text-2xl leading-snug font-normal text-[#1A1A1A]"
          style={{ fontFamily: theme?.fonts?.heading }}
        />
        <EditableText
          value={category.description}
          onChange={val => onCategoryUpdate("description", val)}
          isEditable={isEditable}
          as="p"
          multiline
          className="text-sm leading-relaxed text-[#1A1A1A] opacity-55"
        />
      </div>
    </div>
  );
}
