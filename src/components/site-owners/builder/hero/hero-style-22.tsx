"use client";
import React, { useState, useId } from "react";
import heroImg from "@/assets/hero-workspace.jpg";
import { ArrowDown, Loader2 } from "lucide-react";
import { HeroTemplate22Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { uploadToS3 } from "@/utils/s3";
import { toast } from "sonner";

interface HeroTemplate22Props {
  heroData: HeroTemplate22Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate22Data>) => void;
  siteUser?: string;
}

export const HeroTemplate22: React.FC<HeroTemplate22Props> = ({
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
      text: "#FFFFFF",
      primary: "#3B82F6",
      background: "#000000",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
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
      const url = await uploadToS3(file, "hero-backgrounds");
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

  // Helper to highlight the span word in the title
  const renderTitle = () => {
    const title = data.title;
    const spanText = data.spanText;
    if (!spanText || !title.includes(spanText)) return title;

    const parts = title.split(spanText);
    return (
      <>
        {parts[0]}
        <span className="neon-text">{spanText}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="section-padding bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
      {isEditable && (
        <div className="absolute top-6 right-6 z-30">
          <label
            htmlFor={`hero-22-background-upload-${componentId}`}
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
            id={`hero-22-background-upload-${componentId}`}
            type="file"
            accept="image/*"
            onChange={handleBackgroundFileChange}
            className="hidden"
            disabled={isUploadingBackground}
          />
        </div>
      )}

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <EditableImage
          src={data.imageUrl}
          alt={data.imageAlt}
          onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
          onAltChange={handleAltUpdate("imageAlt")}
          isEditable={isEditable}
          className="h-full w-full object-cover opacity-30"
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Upload hero image",
          }}
        />
        <div className="from-background/60 via-background/80 to-background absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <EditableText
          value={data.eyebrow}
          onChange={handleTextUpdate("eyebrow")}
          as="h1"
          className="text-primary mb-6 font-mono text-sm"
          style={{ color: theme.colors.primary }}
          isEditable={isEditable}
        />

        <div className="l mb-8 text-5xl">
          <div className="space-y-4">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              isEditable={isEditable}
            />
          </div>
        </div>

        <EditableText
          value={data.description}
          onChange={handleTextUpdate("description")}
          as="p"
          isEditable={isEditable}
          multiline
        />
      </div>
    </section>
  );
};
