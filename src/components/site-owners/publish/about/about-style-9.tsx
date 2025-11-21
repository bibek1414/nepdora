"use client";

import React, { useId, useRef, useState } from "react";
import Image from "next/image";
import { Play, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { AboutUs9Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate9Props {
  aboutUsData: AboutUs9Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs9Data>) => void;
}

const hexToRgba = (hex: string, alpha = 1) => {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) {
    return hex;
  }

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const AboutUsTemplate9: React.FC<AboutUsTemplate9Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(aboutUsData);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: themeResponse } = useThemeQuery();

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

  type TextFieldKeys =
    | "eyebrow"
    | "title"
    | "descriptionPrimary"
    | "descriptionSecondary";

  const handleTextUpdate =
    (field: TextFieldKeys) =>
    (value: string): void => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<AboutUs9Data>);
    };

  const handleButtonUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      buttonText: text,
      buttonLink: href,
    };
    setData(updatedData);
    onUpdate?.({
      buttonText: text,
      buttonLink: href,
    });
  };

  const triggerMediaUpload = () => {
    if (!isEditable || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        `Please upload a ${isVideo ? "video" : "photo"} under ${
          isVideo ? "50MB" : "5MB"
        }.`
      );
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file, {
        folder: "about-us-media",
        resourceType: isVideo ? "video" : "image",
      });

      const updatedMedia: AboutUs9Data["media"] = {
        type: isVideo ? "video" : "image",
        url: uploadedUrl,
        alt: file.name ?? data.media.alt,
      };

      const updatedData = { ...data, media: updatedMedia };
      setData(updatedData);
      onUpdate?.({ media: updatedMedia });

      toast.success(
        `${isVideo ? "Video" : "Image"} uploaded successfully. Publishing...`
      );
    } catch (error) {
      console.error("Media upload failed:", error);
      toast.error("We couldn’t upload that file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const renderMediaContent = () => {
    if (data.media.type === "video") {
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center"
          style={{ backgroundColor: hexToRgba(theme.colors.primary, 0.05) }}
        >
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full shadow-xl"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
          >
            <Play className="h-10 w-10 fill-current" />
          </div>
          <p
            className="mt-4 text-xs font-medium"
            style={{ color: hexToRgba(theme.colors.text, 0.7) }}
          >
            Video preview unavailable · Click play
          </p>
        </div>
      );
    }

    if (!data.media.url) {
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center text-center"
          style={{
            backgroundColor: hexToRgba(theme.colors.primary, 0.05),
            color: hexToRgba(theme.colors.text, 0.7),
          }}
        >
          <span className="text-sm font-medium">Click to upload media</span>
          <span className="mt-2 text-xs opacity-75">
            Supports JPG, PNG, MP4
          </span>
        </div>
      );
    }

    return (
      <Image
        src={data.media.url || "/placeholder.svg"}
        alt={data.media.alt || "About media"}
        fill
        sizes="(min-width: 1024px) 320px, 80vw"
        className="object-cover"
        priority
      />
    );
  };

  return (
    <section
      className="px-6 py-20 lg:px-20"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative flex h-full items-center justify-center">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 500 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 150 50 Q 100 150 150 250"
              stroke={theme.colors.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 300 350 Q 400 450 300 550"
              stroke={theme.colors.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="relative rounded-[32px] border-4 border-gray-200 bg-gray-100 shadow-xl">
              <div className="relative h-72 w-64 overflow-hidden rounded-[28px]">
                {renderMediaContent()}

                {isUploading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 text-white">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Uploading media…
                    </span>
                  </div>
                )}

                {isEditable && (
                  <>
                    <button
                      type="button"
                      onClick={triggerMediaUpload}
                      disabled={isUploading}
                      className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-md transition hover:shadow-lg disabled:opacity-60"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          <span>Change media</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      id={uploadInputId}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleMediaUpload}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:pl-8">
          <div>
            <EditableText
              value={data.eyebrow}
              onChange={handleTextUpdate("eyebrow")}
              as="p"
              className="mb-3 text-xs font-bold tracking-[0.3em] uppercase"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
              isEditable={isEditable}
              placeholder="About Funder"
            />
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="text-4xl leading-tight font-bold sm:text-5xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
              }}
              isEditable={isEditable}
              placeholder="Add a headline..."
              multiline
            />
          </div>

          <div className="space-y-5 text-base leading-relaxed text-gray-600">
            <EditableText
              value={data.descriptionPrimary}
              onChange={handleTextUpdate("descriptionPrimary")}
              as="p"
              className="text-gray-600"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
              isEditable={isEditable}
              placeholder="Add a description..."
              multiline
            />
            <EditableText
              value={data.descriptionSecondary}
              onChange={handleTextUpdate("descriptionSecondary")}
              as="p"
              className="text-gray-600"
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
              isEditable={isEditable}
              placeholder="Add additional copy..."
              multiline
            />
          </div>

          <EditableLink
            text={data.buttonText}
            href={data.buttonLink}
            onChange={handleButtonUpdate}
            className="flex w-fit items-center gap-2 rounded-lg px-8 py-4 shadow-md transition hover:opacity-90 hover:shadow-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
              fontFamily: theme.fonts.heading,
            }}
            textPlaceholder="Read More"
            hrefPlaceholder="#"
            isEditable={isEditable}
          >
            {data.buttonText}
            <span className="text-lg">→</span>
          </EditableLink>
        </div>
      </div>
    </section>
  );
};
