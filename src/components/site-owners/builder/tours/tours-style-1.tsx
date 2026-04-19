"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Tag,
  Compass,
} from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

import { ToursTemplate1Data } from "@/types/owner-site/components/tours";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";

interface ToursStyle1Props {
  toursData: ToursTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ToursTemplate1Data>) => void;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1 },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
  }),
};

export const ToursStyle1: React.FC<ToursStyle1Props> = ({
  toursData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#D37D64",
      primaryForeground: "#FFFFFF",
      secondary: "#2E5E4E",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Inter",
    },
  };

  const { data, handleTextUpdate, setData } = useBuilderLogic(
    toursData,
    onUpdate
  );

  const { data: collectionResponse,
    isLoading,
    error, refetch } = useCollectionData(toursData.collectionSlug || "tours");

  const tours = collectionResponse?.results || [];

  const next = () => {
    if (tours.length === 0) return;
    setDirection(1);
    setCurrentIndex(p => (p + 1) % tours.length);
  };
  const prev = () => {
    if (tours.length === 0) return;
    setDirection(-1);
    setCurrentIndex(p => (p - 1 + tours.length) % tours.length);
  };

  const currentTour = tours[currentIndex];

  return (
    <section className="px-6 py-20 md:px-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mr-10 mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-5xl leading-tight text-[#1A1A1A] md:text-6xl"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
            isEditable={isEditable}
          />
          <EditableLink
            text={data.buttonText}
            href={data.buttonLink?.url || "#"}
            target={data.buttonLink?.target || "_self"}
            onChange={(text, href) => {
              const updatedLink = {
                url: href,
                target: data.buttonLink?.target || "_self",
              };
              setData(prev => ({
                ...prev,
                buttonText: text,
                buttonLink: updatedLink,
              }));
              if (onUpdate) {
                onUpdate({
                  buttonText: text,
                  buttonLink: updatedLink,
                });
              }
            }}
            isEditable={isEditable}
            className="rounded-full text-[0.7rem] font-bold whitespace-nowrap text-white shadow-lg transition-all"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
          />
        </div>

        {/* Carousel wrapper */}
        <div className="relative h-[620px] overflow-hidden rounded-2xl bg-gray-50 shadow-2xl shadow-black/5">
          {isLoading ? (
            <div className="flex h-full w-full flex-col justify-center px-12 py-10">
              <Skeleton className="absolute inset-0 h-full w-full" />
            </div>
          ) : error ? (
            <div className="flex h-full w-full items-center justify-center text-red-500">
              Failed to load tours data.
            </div>
          ) : currentTour ? (
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 28 },
                  opacity: { duration: 0.3 },
                }}
                className="absolute inset-0 h-full w-full"
              >
                {/* Full-bleed background image */}
                <img
                  src={
                    currentTour.data["Main Image"] ||
                    "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={
                    currentTour.data.name ||
                    currentTour.data.title ||
                    "Tour image"
                  }
                  className="absolute inset-0 h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* White content card - right side */}
                <motion.div
                  key={`card-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute top-6 right-6 bottom-6 flex w-[90%] flex-col justify-center rounded-xl bg-white px-8 py-10 shadow-xl md:w-[520px] md:px-12"
                >
                  {/* Title + arrow */}
                  <div className="mb-6 flex items-start justify-between">
                    <h3
                      className="pr-6 text-4xl leading-tight text-[#1A1A1A]"
                      style={{
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.text,
                      }}
                    >
                      {currentTour.data.name || currentTour.data.title}
                    </h3>
                    <ArrowUpRight
                      className="mt-1 h-7 w-7 shrink-0"
                      style={{ color: theme.colors.primary }}
                    />
                  </div>

                  {/* Description */}
                  {currentTour.data.Description && (
                    <p
                      className="mb-8 font-sans text-base leading-relaxed text-[#1A1A1A] opacity-70"
                      style={{ color: theme.colors.text }}
                    >
                      {currentTour.data.Description}
                    </p>
                  )}

                  {/* Duration & Price - stacked */}
                  <div className="mb-8 flex flex-col gap-3.5">
                    {currentTour.data.Duration && (
                      <div className="flex items-center gap-3 text-lg">
                        <Clock
                          className="h-5 w-5 shrink-0"
                          style={{
                            color:
                              theme.colors.secondary || theme.colors.primary,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: theme.fonts.heading,
                            color: theme.colors.text,
                            fontStyle: "italic",
                          }}
                        >
                          {currentTour.data.Duration}
                        </span>
                      </div>
                    )}
                    {(currentTour.data.Price || currentTour.data.price) && (
                      <div className="flex items-center gap-3 text-lg">
                        <Tag
                          className="h-5 w-5 shrink-0"
                          style={{
                            color:
                              theme.colors.secondary || theme.colors.primary,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: theme.fonts.heading,
                            fontStyle: "italic",
                          }}
                        >
                          From Rs.{" "}
                          {Number(
                            currentTour.data.Price || currentTour.data.price
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sub image */}
                  <div className="hidden h-[180px] overflow-hidden rounded-lg shadow-inner md:block md:h-56">
                    <img
                      src={
                        currentTour.data["Sub Image"] ||
                        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={`${currentTour.data.name || "Tour"} scene`}
                      className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>

                {/* Nav buttons - bottom left of carousel */}
                <div className="absolute bottom-10 left-6 z-20 flex gap-4 md:left-10">
                  <button
                    onClick={prev}
                    className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-gray-50 active:scale-90 md:w-19"
                  >
                    <ChevronLeft className="h-5 w-8 md:w-10" />
                  </button>
                  <button
                    onClick={next}
                    className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-gray-50 active:scale-90 md:w-19"
                  >
                    <ChevronRight className="h-5 w-8 md:w-10" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={Compass}
            title="No Tours Found"
            description="Showcase your adventures and tour packages. Add tours in the admin dashboard."
            actionLabel={tours.length > 0 ? "Manage Tours" : "Add New Tours"}
            actionLink="/admin/collections/tours"
            isEditable={isEditable}
            isEmpty={tours.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
