"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { HeroTemplate12Data } from "@/types/owner-site/components/hero";

interface HeroTemplate12Props {
  heroData: HeroTemplate12Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate12Data>) => void;
}

export const HeroTemplate12: React.FC<HeroTemplate12Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();
  const [heroIndex, setHeroIndex] = useState(0);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#FFFFFF",
      primaryForeground: "#000000",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#000000",
    },
    fonts: {
      body: "sans-serif",
      heading: "sans-serif",
    },
  };

  const { data, setData, handleArrayItemUpdate } = useBuilderLogic(
    heroData,
    onUpdate
  );

  const heroSlides = data.slides && data.slides.length > 0 ? data.slides : [];

  useEffect(() => {
    if (isEditable || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length, isEditable]);

  // Handle slide text updates
  const handleSlideUpdate =
    (slideId: string, field: string) => (value: string) => {
      handleArrayItemUpdate("slides", slideId)({ [field]: value });
    };

  const handleSlideImageUpdate = (
    imageUrl: string,
    altText?: string,
    index?: number
  ) => {
    if (index !== undefined && index < heroSlides.length) {
      handleArrayItemUpdate(
        "slides",
        heroSlides[index].id
      )({
        url: imageUrl,
        alt: altText || heroSlides[index].alt,
      });
    } else {
      // Add new slide
      const newSlide = {
        id: `slide-${Date.now()}`,
        url: imageUrl,
        alt: altText || "Slider image",
        subtitle: "New Subtitle",
        title: "New Title",
        description: "New Description",
        color: "from-navy-950/90",
        buttonText: "Shop Now",
        buttonHref: "#",
      };
      const updatedData = {
        ...data,
        slides: [...(data.slides || []), newSlide],
      };
      setData(updatedData);
      onUpdate?.({ slides: updatedData.slides });
    }
  };

  const addSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "New slide",
      subtitle: "New Subtitle",
      title: "New Title",
      description: "New Description",
      color: "from-navy-950/90",
      buttonText: "Shop Now",
      buttonHref: "#",
    };
    const updatedSlides = [...heroSlides, newSlide];
    const updatedData = { ...data, slides: updatedSlides };
    setData(updatedData);
    onUpdate?.({ slides: updatedSlides });
  };

  const removeSlide = (index: number) => {
    if (heroSlides.length <= 1) {
      toast.error("At least one slide is required");
      return;
    }
    const updatedSlides = heroSlides.filter((_, i) => i !== index);
    const updatedData = { ...data, slides: updatedSlides };
    setData(updatedData);
    onUpdate?.({ slides: updatedSlides });

    if (heroIndex >= updatedSlides.length) {
      setHeroIndex(Math.max(0, updatedSlides.length - 1));
    }
  };

  if (heroSlides.length === 0) return null;

  const currentSlide = heroSlides[heroIndex];

  return (
    <div
      className="relative h-[70vh] overflow-hidden"
      data-component-id={componentId}
    >
      {isEditable && (
        <div className="absolute top-6 right-4 z-30 flex gap-2">
          <button
            onClick={addSlide}
            className="rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            Add Slide
          </button>
          <button
            onClick={() => removeSlide(heroIndex)}
            className="rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            Remove Current Slide
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image Container */}
          <div className="group absolute inset-0 h-full w-full">
            <div
              className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentSlide.url})` }}
            />

            <EditableImage
              key={`slide-${componentId}-${heroIndex}-${currentSlide.url}`}
              src={currentSlide.url}
              alt={currentSlide.alt}
              onImageChange={(url, alt) =>
                handleSlideImageUpdate(url, alt, heroIndex)
              }
              isEditable={isEditable}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
              s3Options={{
                folder: "hero-slides",
              }}
              placeholder={{
                width: 1920,
                height: 1080,
                text: `Slide ${heroIndex + 1}`,
              }}
              disableImageChange={true}
            />

            <ImageEditOverlay
              onImageSelect={url =>
                handleSlideImageUpdate(url, undefined, heroIndex)
              }
              imageWidth={1920}
              imageHeight={1080}
              isEditable={isEditable}
              label="Change Background"
              folder="hero-slides"
              className="absolute top-4 left-4 z-40"
            />
          </div>

          {/* Gradient Overlay based on currentSlide.color */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentSlide.color || "from-black/90"} flex items-center via-transparent to-transparent`}
          >
            <div className="z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-xl pt-10 text-white"
              >
                <div className="mb-6 inline-block w-full">
                  <div className="inline-block w-auto rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
                    <EditableText
                      value={currentSlide.subtitle}
                      onChange={handleSlideUpdate(currentSlide.id, "subtitle")}
                      isEditable={isEditable}
                      as="span"
                      className="text-xs font-bold tracking-wider text-white uppercase"
                      placeholder="Subtitle"
                    />
                  </div>
                </div>

                <EditableText
                  value={currentSlide.title}
                  onChange={handleSlideUpdate(currentSlide.id, "title")}
                  isEditable={isEditable}
                  multiline
                  as="h1"
                  className="mb-6 text-4xl leading-none font-extrabold tracking-tight shadow-sm md:text-6xl lg:text-7xl"
                  placeholder="Hero Title"
                />

                <EditableText
                  value={currentSlide.description}
                  onChange={handleSlideUpdate(currentSlide.id, "description")}
                  isEditable={isEditable}
                  multiline
                  as="p"
                  className="mb-8 max-w-md text-lg leading-relaxed font-light text-white/90 md:text-xl"
                  placeholder="Hero Description"
                />

                <EditableLink
                  text={currentSlide.buttonText}
                  href={currentSlide.buttonHref}
                  onChange={(text, href) => {
                    handleSlideUpdate(currentSlide.id, "buttonText")(text);
                    handleSlideUpdate(currentSlide.id, "buttonHref")(href);
                  }}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                  className="inline-flex items-center rounded-full px-8 py-4 font-bold shadow-xl transition-all hover:scale-105"
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Button link..."
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-0 bottom-8 left-0 z-20 flex justify-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setHeroIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === heroIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
