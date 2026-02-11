"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import {
  HeroTemplate15Data,
  HeroButton,
} from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
interface HeroTemplate15Props {
  heroData: HeroTemplate15Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate15Data>) => void;
}

const DEFAULT_BUTTON: HeroButton = {
  id: "btn-1",
  text: "Shop The Look",
  variant: "primary",
  href: "#",
};

export const HeroTemplate15: React.FC<HeroTemplate15Props> = ({
  heroData,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const bannerRef = useRef<HTMLElement>(null);
  const componentId = useId();

  const {
    data,
    setData,
    handleTextUpdate,
    handleButtonUpdate,
    handleAltUpdate,
    getImageUrl,
  } = useBuilderLogic(
    {
      ...heroData,
      buttons:
        heroData.buttons?.length && heroData.buttons[0]
          ? [{ ...heroData.buttons[0] }]
          : [{ ...DEFAULT_BUTTON }],
    },
    onUpdate
  );
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };
  useEffect(() => {
    const element = bannerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  const primaryButton = data.buttons[0] || DEFAULT_BUTTON;
  const buttonText =
    primaryButton.text ?? DEFAULT_BUTTON.text ?? "Shop The Look";
  const buttonHref = primaryButton.href ?? DEFAULT_BUTTON.href ?? "#";

  const handlePrimaryButtonUpdate = (text: string, href: string) => {
    const existingButton = data.buttons[0] || DEFAULT_BUTTON;
    handleButtonUpdate("buttons")(
      existingButton.id || DEFAULT_BUTTON.id,
      text,
      href
    );
  };

  const handleBackgroundUpdate = (imageUrl: string, altText?: string) => {
    const update = {
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt || "Hero background image",
    };
    setData({ ...data, ...update });
    onUpdate?.(update);
  };

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingBackground(true);
    try {
      const url = await uploadToCloudinary(file, {
        folder: "hero-banners",
        resourceType: "image",
      });
      handleBackgroundUpdate(url, file.name);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
    }
  };

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop";

  return (
    <section
      ref={bannerRef}
      className="relative h-screen w-full overflow-hidden bg-gray-900"
    >
      {isEditable && (
        <div className="absolute top-6 right-4 z-30">
          <label
            htmlFor={`hero-15-background-upload-${componentId}`}
            className={`mr-12 cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
              isUploadingBackground ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isUploadingBackground ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Change Background"
            )}
          </label>
          <input
            id={`hero-15-background-upload-${componentId}`}
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
            disabled={isUploadingBackground}
          />
        </div>
      )}

      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 transition-transform duration-2000 ease-out"
        style={{ transform: isVisible ? "scale(1.05)" : "scale(1)" }}
      >
        <EditableImage
          src={getImageUrl(data.backgroundImageUrl || defaultImageUrl, {})}
          alt={data.imageAlt || "Featured Collection"}
          onImageChange={handleBackgroundUpdate}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-screen w-full"
        />
        {/* Dark Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container - Reset to Centered */}
      <div className="relative flex h-full w-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
        {/* Title & Subtitle with Fade Up Animation */}
        <div
          className={`transition-all delay-100 duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-gray-300 uppercase sm:mb-4 sm:text-sm sm:tracking-[0.3em]">
            <EditableText
              value={data.subtitle || "Exclusive Drop"}
              onChange={handleTextUpdate("subtitle")}
              as="span"
              isEditable={isEditable}
              placeholder="Exclusive Drop"
            />
          </p>
          <h2 className="mb-6 text-4xl font-light tracking-tight sm:mb-8 sm:text-6xl md:text-7xl lg:text-8xl">
            <EditableText
              value={data.title || "MIDNIGHT SERIES"}
              onChange={handleTextUpdate("title")}
              as="span"
              isEditable={isEditable}
              placeholder="MIDNIGHT SERIES"
            />
          </h2>
        </div>

        {/* Sliding Button Animation: Slides from Left (-translate-x) to Center (0) */}
        <div
          className={`transform transition-all delay-300 duration-1000 ease-out ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0 sm:-translate-x-32"
          }`}
        >
          <EditableLink
            text={buttonText}
            href={buttonHref}
            onChange={handlePrimaryButtonUpdate}
            isEditable={isEditable}
            siteUser={siteUser}
            textPlaceholder="Shop The Look"
            hrefPlaceholder="Enter URL..."
            style={{
              color: theme.colors.primaryForeground,
              backgroundColor: theme.colors.primary,
            }}
          >
            <>
              <span className="mr-2">{buttonText}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          </EditableLink>
        </div>
      </div>
    </section>
  );
};
