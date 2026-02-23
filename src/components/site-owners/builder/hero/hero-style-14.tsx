"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import {
  HeroTemplate14Data,
  HeroButton,
} from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { cn } from "@/lib/utils";

interface HeroTemplate14Props {
  heroData: HeroTemplate14Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate14Data>) => void;
}

const DEFAULT_BUTTON: HeroButton = {
  id: "btn-1",
  text: "Shop The Look",
  variant: "primary",
  href: "#",
};

export const HeroTemplate14: React.FC<HeroTemplate14Props> = ({
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
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
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-background font-body"
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
        className={cn(
          "absolute inset-0 transition-transform duration-[2000ms] ease-out",
          isVisible ? "scale-105" : "scale-100"
        )}
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container - Left Aligned */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start text-left max-w-4xl">
          {/* Title & Subtitle with Fade Up Animation */}
          <div
            className={`transition-all delay-100 duration-1000 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-gray-200 uppercase sm:text-base font-body">
              <EditableText
                value={data.subtitle || "Exclusive Drop"}
                onChange={handleTextUpdate("subtitle")}
                as="span"
                isEditable={isEditable}
                placeholder="Exclusive Drop"
              />
            </p>
            <h2 className="mb-8 text-5xl font-light tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl font-heading">
              <EditableText
                value={data.title || "MIDNIGHT SERIES"}
                onChange={handleTextUpdate("title")}
                as="span"
                isEditable={isEditable}
                placeholder="MIDNIGHT SERIES"
              />
            </h2>
          </div>

          {/* Sliding Button Animation */}
          <div
            className={`transform transition-all delay-300 duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
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
              className="inline-flex items-center px-8 py-4 text-base font-medium rounded-full shadow-lg hover:scale-105 transition-transform bg-primary text-primary-foreground font-body"
            >
              <>
                <span className="mr-2">{buttonText}</span>
                <ChevronRight className="h-5 w-5" />
              </>
            </EditableLink>
          </div>
        </div>
      </div>
    </section>
  );
};
