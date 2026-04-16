"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Utensils,
  Users,
  Droplets,
  Baby,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HeroTemplate19Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Users,
  Droplets,
  Baby,
};

interface HeroTemplate19Props {
  heroData: HeroTemplate19Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate19Data>) => void;
  siteUser?: string;
}

export const HeroTemplate19: React.FC<HeroTemplate19Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
    },
  };

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(heroData, onUpdate);

  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progressKey, setProgressKey] = useState(0);

  const slides = data.slides || [];
  const AUTOPLAY_DURATION = data.autoplayDuration || 5000;

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
      setProgressKey(k => k + 1);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [isAutoPlaying, progressKey, slides.length, AUTOPLAY_DURATION]);

  const goTo = (index: number) => {
    setIsAutoPlaying(false);
    setCurrent(index);
    setProgressKey(k => k + 1);
  };

  const goNext = () => goTo((current + 1) % slides.length);
  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-black text-white select-none md:h-[780px]">
      {/* Background - crossfade */}
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={current}
          src={slides[current].image}
          alt={slides[current].imageAlt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.45]"
          style={{ willChange: "opacity" }}
        />
      </AnimatePresence>

      {/* Slide BG Editor Overlay */}
      {isEditable && (
        <ImageEditOverlay
          isEditable={isEditable}
          onImageSelect={url =>
            handleArrayItemUpdate("slides", slides[current].id)({ image: url })
          }
          imageWidth={1920}
          imageHeight={1080}
          label="Change Slide BG"
          className="absolute top-8 right-10 z-30"
        />
      )}

      {/* Nav Arrows */}
      <button
        onClick={goPrev}
        className="absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 md:left-6 md:h-14 md:w-14"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={goNext}
        className="absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 md:right-6 md:h-14 md:w-14"
      >
        <ChevronRight size={20} />
      </button>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex h-[calc(100%-130px)] max-w-7xl items-center px-6 sm:px-12 md:px-24">
        <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
          {/* Left - badge + title */}
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
              <EditableText
                value={slides[current].badge}
                onChange={val =>
                  handleArrayItemUpdate(
                    "slides",
                    slides[current].id
                  )({ badge: val })
                }
                isEditable={isEditable}
                as="span"
              />
            </div>
            <div className="text-3xl leading-tight font-black tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
              <EditableText
                value={slides[current].title}
                onChange={val =>
                  handleArrayItemUpdate(
                    "slides",
                    slides[current].id
                  )({ title: val })
                }
                isEditable={isEditable}
                as="h1"
                multiline
              />
            </div>
          </div>

          {/* Right - description + button */}
          <div className="flex flex-col items-start gap-6 md:gap-8 md:pl-8">
            <div className="text-base leading-relaxed text-white/80 md:text-lg">
              <EditableText
                value={slides[current].description}
                onChange={val =>
                  handleArrayItemUpdate(
                    "slides",
                    slides[current].id
                  )({ description: val })
                }
                isEditable={isEditable}
                as="p"
                multiline
              />
            </div>
            <div className="flex items-center gap-3">
              <EditableLink
                text={data.primaryButtonText}
                href={data.primaryButtonHref}
                isEditable={isEditable}
                siteUser={siteUser}
                onChange={(text, href) => {
                  handleTextUpdate("primaryButtonText")(text);
                  handleTextUpdate("primaryButtonHref")(href);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-full px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              >
                {data.primaryButtonText} <ArrowUpRight size={18} />
              </EditableLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tabs */}
      <div className="absolute bottom-0 left-0 z-20 w-full">
        {/* Subtle gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-8 sm:px-12 md:px-24">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {slides.map((slide, index) => {
              const Icon = ICON_MAP[slide.iconName] || Users;
              const isActive = current === index;
              return (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  className="group flex cursor-pointer flex-col gap-4 text-left"
                >
                  {/* Icon + label row */}
                  <div
                    className={`flex items-center gap-3 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-60"}`}
                  >
                    <Icon size={22} strokeWidth={1.5} />
                    <EditableText
                      value={slide.label}
                      onChange={val =>
                        handleArrayItemUpdate(
                          "slides",
                          slide.id
                        )({
                          label: val,
                        })
                      }
                      isEditable={isEditable}
                      as="span"
                      className="cursor-pointer text-sm font-semibold md:text-base"
                    />
                  </div>

                  {/* Progress track */}
                  <div className="relative h-[2px] w-full overflow-hidden bg-white/20">
                    {isActive && (
                      <motion.div
                        key={`${index}-${progressKey}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: isAutoPlaying
                            ? AUTOPLAY_DURATION / 1000
                            : 0.3,
                          ease: "linear",
                        }}
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ willChange: "width" }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
