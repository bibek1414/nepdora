"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  HeroTemplate13Data,
  HeroButton,
} from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import {
  convertUnsplashUrl,
  optimizeCloudinaryUrl,
  uploadToCloudinary,
} from "@/utils/cloudinary";
import { toast } from "sonner";

interface HeroTemplate13Props {
  heroData: HeroTemplate13Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate13Data>) => void;
}

type CTAButtonVariant = "primary" | "white" | "outline";

const CTA_BUTTON_BASE =
  "group/cta relative inline-flex items-center justify-between rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

const CTA_BUTTON_VARIANTS: Record<CTAButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
  white: "bg-white text-slate-900 hover:bg-gray-50 focus:ring-gray-200",
  outline:
    "border border-white/30 text-white hover:bg-white/10 focus:ring-white/40",
};

const CTA_ARROW_BASE =
  "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover/cta:rotate-45";

const CTA_ARROW_VARIANTS: Record<CTAButtonVariant, string> = {
  primary:
    "bg-white text-primary group-hover/cta:rotate-45 transition-transform duration-300",
  white:
    "bg-primary text-white group-hover/cta:rotate-45 transition-transform duration-300",
  outline:
    "bg-white text-slate-900 group-hover/cta:rotate-45 transition-transform duration-300",
};

const DEFAULT_BUTTON: HeroButton = {
  id: "btn-1",
  text: "Book a Free Call",
  variant: "secondary",
  href: "#",
};

const createInitialData = (
  incoming: HeroTemplate13Data
): HeroTemplate13Data => ({
  ...incoming,
  buttons:
    incoming.buttons?.length && incoming.buttons[0]
      ? [{ ...incoming.buttons[0] }]
      : [{ ...DEFAULT_BUTTON }],
});

export const HeroTemplate13: React.FC<HeroTemplate13Props> = ({
  heroData,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const componentId = useId();
  const [data, setData] = useState<HeroTemplate13Data>(() =>
    createInitialData(heroData)
  );
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  useEffect(() => {
    setData(createInitialData(heroData));
  }, [heroData]);

  const defaultBackground = "https://picsum.photos/seed/office1/1920/1080";

  const resolvedBackground =
    data.backgroundImageUrl || heroData.backgroundImageUrl || defaultBackground;

  const backgroundImage = useMemo(() => {
    if (!resolvedBackground) return resolvedBackground;
    const converted = convertUnsplashUrl(resolvedBackground);
    return optimizeCloudinaryUrl(converted, {
      width: 1920,
      quality: "auto",
      format: "auto",
    });
  }, [resolvedBackground]);

  const handleTextUpdate =
    (field: keyof HeroTemplate13Data) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<HeroTemplate13Data>);
    };

  const handlePrimaryButtonUpdate = (text: string, href: string) => {
    const existingButton = data.buttons[0] || DEFAULT_BUTTON;
    const updatedButton = {
      ...existingButton,
      id: existingButton.id || DEFAULT_BUTTON.id,
      text,
      href,
    };
    const updatedData = { ...data, buttons: [updatedButton] };
    setData(updatedData);
    onUpdate?.({ buttons: [updatedButton] });
  };

  const handleBackgroundUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt || "Hero background image",
    };
    setData(updatedData);
    onUpdate?.({
      backgroundType: "image" as const,
      backgroundImageUrl: imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };

  const getButtonVariant = (variant?: string): CTAButtonVariant => {
    switch (variant) {
      case "outline":
        return "outline";
      case "secondary":
        return "white";
      default:
        return "primary";
    }
  };

  const titleContent =
    data.title ||
    "Navigate Business <br /> with <span class='font-serif font-normal italic'>Confidence</span>";

  const descriptionContent =
    data.description ||
    "Expert strategic consulting to drive sustainable growth, operational innovation, and lasting business transformation across industries and markets, maximizing impact.";

  const primaryButton = data.buttons[0] || DEFAULT_BUTTON;
  const buttonVariant = getButtonVariant(primaryButton.variant);
  const primaryButtonText =
    primaryButton.text ?? DEFAULT_BUTTON.text ?? "Button";
  const primaryButtonHref = primaryButton.href ?? DEFAULT_BUTTON.href ?? "#";

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingBackground(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-backgrounds",
        resourceType: "image",
      });

      handleBackgroundUpdate(imageUrl, `Background image: ${file.name}`);
      toast.success("Background image uploaded successfully!");
    } catch (error) {
      console.error("Background upload failed:", error);
      toast.error("Failed to upload background image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.section
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      {isEditable && (
        <div className="absolute top-6 right-4 z-30">
          <label
            htmlFor={`hero-13-background-upload-${componentId}`}
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
            id={`hero-13-background-upload-${componentId}`}
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
            disabled={isUploadingBackground}
          />
        </div>
      )}

      {isUploadingBackground && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm font-medium">Uploading background image...</p>
          </div>
        </div>
      )}

      {/* Background Image with Overlay */}
      <motion.div
        className="absolute inset-0"
        variants={fadeIn}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <EditableImage
          src={backgroundImage}
          alt={data.imageAlt || "Office meeting background"}
          onImageChange={handleBackgroundUpdate}
          onAltChange={handleAltUpdate}
          isEditable={isEditable}
          className="h-full w-full opacity-60"
          width={1920}
          height={1080}
          imageOptimization={{ width: 1920, quality: "auto", format: "auto" }}
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload hero background",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-6">
        <motion.div
          className="max-w-3xl text-white"
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <EditableText
            value={titleContent}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="mb-6 font-sans text-5xl leading-tight font-semibold md:text-7xl"
            isEditable={isEditable}
            placeholder="Enter hero title..."
            multiline
          />

          <EditableText
            value={descriptionContent}
            onChange={handleTextUpdate("description")}
            as="p"
            className="mb-10 max-w-xl text-lg leading-relaxed text-gray-200"
            isEditable={isEditable}
            placeholder="Enter hero description..."
            multiline
          />

          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <EditableLink
              key={primaryButton.id}
              text={primaryButtonText}
              href={primaryButtonHref}
              onChange={handlePrimaryButtonUpdate}
              isEditable={isEditable}
              siteUser={siteUser}
              className={`${CTA_BUTTON_BASE} ${CTA_BUTTON_VARIANTS[buttonVariant]}`}
              textPlaceholder="Button text..."
              hrefPlaceholder="Enter URL..."
            >
              <>
                <span className="mr-4">{primaryButtonText}</span>
                <span
                  className={`${CTA_ARROW_BASE} ${CTA_ARROW_VARIANTS[buttonVariant]}`}
                >
                  <ArrowUpRight size={16} />
                </span>
              </>
            </EditableLink>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
