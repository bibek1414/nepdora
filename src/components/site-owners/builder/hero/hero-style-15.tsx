"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  HeroTemplate15Data,
  HeroButton,
} from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

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
  const bannerRef = useRef<HTMLElement>(null);
  const uploadId = React.useId().replace(/:/g, "-");

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleButtonUpdate,
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
    handleImageUpdate("backgroundImageUrl", "imageAlt")(imageUrl, altText);
  };

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop";

  return (
    <section
      ref={bannerRef}
      className="relative h-screen w-full overflow-hidden bg-gray-900"
    >
      {/* Background Image with Zoom Effect - matches reference structure exactly */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(data.backgroundImageUrl || defaultImageUrl, {
            width: 2576,
          })}
          alt={data.imageAlt || "Featured Collection"}
          className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out"
          style={{ transform: isVisible ? "scale(1.05)" : "scale(1)" }}
        />
        {/* Editable overlay - when in edit mode, click to change image */}
        {isEditable && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() =>
              document.getElementById(`hero-15-upload-${uploadId}`)?.click()
            }
          >
            <input
              id={`hero-15-upload-${uploadId}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadToCloudinary(file, {
                    folder: "hero-banners",
                    resourceType: "image",
                  });
                  handleBackgroundUpdate(url, file.name);
                  toast.success("Image uploaded successfully!");
                } catch {
                  toast.error("Failed to upload image. Please try again.");
                }
                e.target.value = "";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/40">
              <span className="rounded-md border border-white/50 bg-white/20 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100">
                Click to change image
              </span>
            </div>
          </div>
        )}
        {/* Dark Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
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
            className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-3 text-xs font-bold tracking-widest text-black uppercase transition-all hover:border-black hover:bg-black hover:text-white sm:gap-4 sm:px-10 sm:py-4 sm:text-sm"
            textPlaceholder="Shop The Look"
            hrefPlaceholder="Enter URL..."
          >
            <>
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </>
          </EditableLink>
        </div>
      </div>
    </section>
  );
};
