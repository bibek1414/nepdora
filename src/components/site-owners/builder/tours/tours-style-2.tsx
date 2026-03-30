"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowUpRight } from "lucide-react";
import { ToursTemplate2Data } from "@/types/owner-site/components/tours";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";

interface ToursStyle2Props {
  toursData: ToursTemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ToursTemplate2Data>) => void;
}

function HorizontalCard({ tour, theme }: { tour: any; theme: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E3DC] bg-white sm:h-[380px] sm:flex-row"
    >
      {/* Image — left 50% on desktop, top on mobile */}
      <div className="h-64 shrink-0 overflow-hidden sm:h-auto sm:w-1/2">
        <img
          src={
            tour.data["Main Image"] ||
            "https://images.unsplash.com/photo-1524492707947-503c5583c99b?q=80&w=800&auto=format&fit=crop"
          }
          alt={tour.data.name || tour.data.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content — right 50% */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          {/* Title + arrow */}
          <div className="mb-5 flex items-start justify-between">
            <h3
              className="pr-3 font-serif text-2xl leading-tight font-normal text-[#1A1A1A]"
              style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.text,
              }}
            >
              {tour.data.name || tour.data.title}
            </h3>
            <ArrowUpRight
              className="mt-1 shrink-0"
              size={24}
              style={{ color: theme.colors.primary }}
            />
          </div>

          {/* Description */}
          <p
            className="line-clamp-3 text-base leading-relaxed text-[#1A1A1A]/55"
            style={{ color: theme.colors.text, opacity: 0.6 }}
          >
            {tour.data.Description}
          </p>
        </div>

        {/* Duration & price — stacked, with divider line above */}
        <div className="mt-6 flex flex-col gap-3 border-t border-[#E8E3DC] pt-5">
          <div className="flex items-center gap-3 font-serif text-base text-[#1A1A1A]/70 italic">
            <Clock
              size={18}
              className="shrink-0"
              style={{ color: theme.colors.primary }}
            />
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>
              {tour.data.Duration || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 font-serif text-base text-[#1A1A1A]/70 italic">
            <Tag
              size={18}
              className="shrink-0"
              style={{ color: theme.colors.primary }}
            />
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>
              From Rs. {Number(tour.data.Price || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VerticalCard({ tour, theme }: { tour: any; theme: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E3DC] bg-white"
    >
      {/* Image — top, full width */}
      <div className="h-[280px] w-full overflow-hidden">
        <img
          src={
            tour.data["Main Image"] ||
            "https://images.unsplash.com/photo-1518635017498-87af5e43f697?q=80&w=800&auto=format&fit=crop"
          }
          alt={tour.data.name || tour.data.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Title + arrow */}
        <div className="mb-4 flex items-start justify-between">
          <h3
            className="pr-3 font-serif text-2xl leading-tight font-normal text-[#1A1A1A]"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {tour.data.name || tour.data.title}
          </h3>
          <ArrowUpRight
            className="mt-1 shrink-0"
            size={24}
            style={{ color: theme.colors.primary }}
          />
        </div>

        {/* Description */}
        <p
          className="line-clamp-3 flex-1 text-base leading-relaxed text-[#1A1A1A]/55"
          style={{ color: theme.colors.text, opacity: 0.6 }}
        >
          {tour.data.Description}
        </p>

        {/* Duration & price — side by side, with divider line above */}
        <div className="mt-6 flex items-center justify-between border-t border-[#E8E3DC] pt-5">
          <div className="flex items-center gap-3 font-serif text-base text-[#1A1A1A]/70 italic">
            <Clock
              size={18}
              className="shrink-0"
              style={{ color: theme.colors.primary }}
            />
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>
              {tour.data.Duration || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 font-serif text-base text-[#1A1A1A]/70 italic">
            <Tag
              size={18}
              className="shrink-0"
              style={{ color: theme.colors.primary }}
            />
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>
              Rs. {Number(tour.data.Price || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const ToursStyle2: React.FC<ToursStyle2Props> = ({
  toursData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#1A1A1A",
      primary: "#C97B63",
      primaryForeground: "#FFFFFF",
      secondary: "#2E5E4E",
      background: "#F5F3EF",
    },
    fonts: {
      body: "Inter",
      heading: "Inter",
    },
  };

  const { data, handleTextUpdate } = useBuilderLogic(toursData, onUpdate);

  const {
    data: collectionResponse,
    isLoading,
    error,
  } = useCollectionData(toursData.collectionSlug || "tours");

  const tours = collectionResponse?.results || [];

  return (
    <section
      className="py-20"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="mb-2 text-4xl leading-tight font-normal md:text-5xl"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
            isEditable={isEditable}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="flex h-40 items-center justify-center text-red-500">
            Failed to load tours.
          </div>
        ) : tours.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-gray-500 italic">
            No tours found in the collection.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Top row: first 2 tours as horizontal cards */}
            {tours.slice(0, 2).length > 0 && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {tours.slice(0, 2).map((tour: any) => (
                  <HorizontalCard key={tour.id} tour={tour} theme={theme} />
                ))}
              </div>
            )}

            {/* Bottom row: next 3 tours as vertical cards */}
            {tours.slice(2, 5).length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tours.slice(2, 5).map((tour: any) => (
                  <VerticalCard key={tour.id} tour={tour} theme={theme} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
