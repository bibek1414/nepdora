"use client";
import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { HeroTemplate24Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

interface HeroTemplate24Props {
  heroData: HeroTemplate24Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate24Data>) => void;
  siteUser?: string;
}

export const HeroTemplate24: React.FC<HeroTemplate24Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const componentId = useId();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
    },
  };

  const {
    data,
    setData,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
  } = useBuilderLogic(heroData, onUpdate);

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingBackground(true);
    try {
      const url = await uploadToCloudinary(file, {
        folder: "hero-backgrounds",
        resourceType: "image",
      });
      const update = {
        imageUrl: url,
        imageAlt: file.name.split(".")[0] || data.imageAlt,
      };
      setData({ ...data, ...update });
      onUpdate?.(update);
      toast.success("Background updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
    }
  };

  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-gray-900 pt-20 sm:min-h-[600px] lg:h-screen">
      {isEditable && (
        <div className="absolute top-24 right-6 z-30">
          <label
            htmlFor={`hero-24-background-upload-${componentId}`}
            className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
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
            id={`hero-24-background-upload-${componentId}`}
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
            disabled={isUploadingBackground}
          />
        </div>
      )}

      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <EditableImage
          src={data.imageUrl}
          alt={data.imageAlt}
          onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-full w-full object-cover opacity-60"
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload hero image",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
      </motion.div>

      <div className="z-10 flex h-full flex-col justify-center px-4 text-center text-white sm:px-6 md:px-8">
        <motion.div
          className="mt-6 max-w-4xl sm:mt-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="mb-4 text-4xl leading-tight font-semibold tracking-tight wrap-break-word sm:mb-6 sm:text-5xl md:text-7xl lg:text-8xl">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="span"
              isEditable={isEditable}
              multiline
            />{" "}
            <span
              className="font-serif font-normal italic"
              style={{ color: theme.colors.primary }}
            >
              <EditableText
                value={data.spanText}
                onChange={handleTextUpdate("spanText")}
                as="span"
                isEditable={isEditable}
              />
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
};
