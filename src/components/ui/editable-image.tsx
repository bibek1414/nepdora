"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Button as SOButton } from "@/components/ui/site-owners/button";
import { ImagePlus, Upload, Loader2, X, Info } from "lucide-react";
import { uploadToS3 } from "@/utils/s3";
import { DEFAULT_MAX_IMAGE_SIZE } from "@/utils/s3";
import { toast } from "sonner";
import { MediaLibraryDialog } from "@/components/ui/media-library-dialog";

interface EditableImageProps {
  src: string;
  alt: string;
  onImageChange?: (imageUrl: string, altText?: string) => void;
  onAltChange?: (altText: string) => void;
  isEditable?: boolean;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  s3Options?: {
    folder?: string;
  };
  uploadValidation?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[]; // MIME types
  };
  disableImageChange?: boolean;
  showAltEditor?: boolean;
  placeholder?: {
    width: number;
    height: number;
    text?: string;
  };
  showDimensionGuide?: boolean; // New prop to enable/disable dimension display
  dimensionGuideText?: string; // Custom text for dimension guide
  buttonPosition?:
    | "center"
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
  inputId?: string;
  style?: React.CSSProperties;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onImageChange,
  onAltChange,
  isEditable = false,
  className,
  width = 700,
  height = 500,
  priority = false,
  s3Options = {
    folder: "editable-images",
  },
  uploadValidation = {
    maxSize: DEFAULT_MAX_IMAGE_SIZE,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  disableImageChange,
  showAltEditor = false,
  placeholder,
  showDimensionGuide = true,
  dimensionGuideText,
  buttonPosition = "center",
  inputId,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAltEditing, setIsAltEditing] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [localAlt, setLocalAlt] = useState(alt);

  // Calculate aspect ratio
  const aspectRatio = (width / height).toFixed(2);
  const dimensionText = dimensionGuideText || `Size: ${width} × ${height}px`;

  // Handle image selection from library
  const handleImageSelect = (imageUrl: string) => {
    onImageChange?.(imageUrl, localAlt);
    setIsLibraryOpen(false);
  };

  // Handle image change click
  const handleImageClick = () => {
    if (!isEditable || isUploading || disableImageChange) return;
    setIsLibraryOpen(true);
  };

  // Handle alt text changes
  const handleAltBlur = () => {
    if (localAlt !== alt) {
      onAltChange?.(localAlt);
    }
    setIsAltEditing(false);
  };

  const handleAltKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  // Show placeholder only in editable mode if no src and placeholder is provided
  const showPlaceholder = !src && placeholder && isEditable;

  // Optimized image URL handling
  const optimizedSrc = React.useMemo(() => {
    if (!src || showPlaceholder) return src;
    return src;
  }, [src, showPlaceholder]);

  if (!isEditable && !src) {
    return null;
  }

  return (
    <div className="relative">
      {isEditable && (
        <MediaLibraryDialog
          open={isLibraryOpen}
          onOpenChange={setIsLibraryOpen}
          onSelect={handleImageSelect}
          folder={s3Options.folder}
        />
      )}

      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden",
          isEditable && "group cursor-pointer",
          className
        )}
        style={style}
        onClick={handleImageClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showPlaceholder ? (
          // Placeholder
          <div
            className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100"
            style={{
              width: placeholder.width,
              height: placeholder.height,
            }}
          >
            <div className="text-center text-gray-500">
              <ImagePlus className="mx-auto mb-2 h-12 w-12" />
              <p className="text-xs text-red-200">
                {placeholder.text || "Click to add image"}
              </p>
              {showDimensionGuide && <p className="mt">{dimensionText}</p>}
            </div>
          </div>
        ) : (
          // Actual Image
          <Image
            unoptimized
            src={
              optimizedSrc ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
            }
            alt={localAlt}
            width={width}
            height={height}
            className="h-full w-full object-cover"
            priority={priority}
          />
        )}

        {/* Upload Loading State */}
        {isUploading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Uploading image...</p>
            </div>
          </div>
        )}

        {/* Hover Overlay for Editable Images */}
        {isEditable &&
          !isUploading &&
          !showPlaceholder &&
          !disableImageChange && (
            <div
              className={cn(
                "absolute inset-0 z-10 flex transition-opacity",
                isHovered ? "opacity-100" : "opacity-0",
                buttonPosition === "center" &&
                  "flex-col items-center justify-center bg-black/60",
                buttonPosition === "top-right" &&
                  "items-start justify-end bg-black/40 p-4",
                buttonPosition === "top-left" &&
                  "items-start justify-start bg-black/40 p-4",
                buttonPosition === "bottom-right" &&
                  "items-end justify-end bg-black/40 p-4",
                buttonPosition === "bottom-left" &&
                  "items-end justify-start bg-black/40 p-4"
              )}
            >
              <div
                className={cn(
                  "flex flex-col gap-2",
                  (buttonPosition === "top-right" ||
                    buttonPosition === "bottom-right") &&
                    "items-end",
                  (buttonPosition === "top-left" ||
                    buttonPosition === "bottom-left") &&
                    "items-start",
                  buttonPosition === "center" && "items-center"
                )}
              >
                <SOButton
                  variant="default"
                  size="sm"
                  className="gap-2 shadow-xl"
                >
                  <ImagePlus className="h-4 w-4" /> Change Image
                </SOButton>

                {/* Dimension Guide on Hover */}
                {showDimensionGuide && (
                  <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-white/95 px-3 py-1.5 text-xs text-gray-800 shadow-xl">
                    <Info className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs">{dimensionText}</span>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Alt Text Editor */}
      {showAltEditor && isEditable && !showPlaceholder && (
        <div className="mt-2">
          {isAltEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={localAlt}
                onChange={e => setLocalAlt(e.target.value)}
                onBlur={handleAltBlur}
                onKeyDown={handleAltKeyDown}
                placeholder="Enter alt text..."
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAltEditing(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAltEditing(true)}
              className="text-xs text-gray-500 underline hover:text-gray-700"
            >
              Alt: {localAlt || "Click to add alt text"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
