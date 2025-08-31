"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload, Loader2, X } from "lucide-react";
import {
  uploadToCloudinary,
  optimizeCloudinaryUrl,
  convertUnsplashUrl,
  type CloudinaryUploadResponse,
} from "@/utils/cloudinary";
import { toast } from "sonner";

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
  cloudinaryOptions?: {
    folder?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    transformation?: string;
  };
  imageOptimization?: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "webp" | "jpg" | "png";
    crop?: "fill" | "fit" | "scale" | "crop";
  };
  uploadValidation?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[]; // MIME types
  };
  showAltEditor?: boolean;
  placeholder?: {
    width: number;
    height: number;
    text?: string;
  };
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
  cloudinaryOptions = {
    folder: "editable-images",
    resourceType: "image",
  },
  imageOptimization,
  uploadValidation = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  showAltEditor = false,
  placeholder,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAltEditing, setIsAltEditing] = useState(false);
  const [localAlt, setLocalAlt] = useState(alt);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and upload
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (
      uploadValidation.allowedTypes &&
      !uploadValidation.allowedTypes.includes(file.type)
    ) {
      toast.error(
        `Please select a valid image file (${uploadValidation.allowedTypes.join(
          ", "
        )})`
      );
      return;
    }

    // Validate file size
    if (uploadValidation.maxSize && file.size > uploadValidation.maxSize) {
      const maxSizeMB = uploadValidation.maxSize / (1024 * 1024);
      toast.error(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Cloudinary using your existing utility
      const imageUrl = await uploadToCloudinary(file, cloudinaryOptions);

      // Update with new image
      const newAlt = localAlt || file.name.split(".")[0];
      onImageChange?.(imageUrl, newAlt);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle image change click
  const handleImageClick = () => {
    if (!isEditable || isUploading) return;
    fileInputRef.current?.click();
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

  // Show placeholder if no src and placeholder is provided
  const showPlaceholder = !src && placeholder;

  // Optimize image URL if optimization options are provided
  const optimizedSrc = React.useMemo(() => {
    if (!src || showPlaceholder) return src;

    // Convert Unsplash URLs if needed
    let processedSrc = convertUnsplashUrl(src);

    // Apply Cloudinary optimizations if provided
    if (imageOptimization) {
      processedSrc = optimizeCloudinaryUrl(processedSrc, imageOptimization);
    }

    return processedSrc;
  }, [src, imageOptimization, showPlaceholder]);

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden",
          isEditable && "group cursor-pointer",
          className
        )}
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
              <p className="text-sm">
                {placeholder.text || "Click to add image"}
              </p>
            </div>
          </div>
        ) : (
          // Actual Image
          <Image
            src={optimizedSrc}
            alt={localAlt}
            width={width}
            height={height}
            className="h-auto w-full object-cover"
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
        {isEditable && !isUploading && !showPlaceholder && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center bg-black/50 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Button variant="secondary" className="gap-2">
              <ImagePlus className="h-4 w-4" /> Change Image
            </Button>
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

// Hook for managing editable image state
export const useEditableImage = (
  initialSrc: string,
  initialAlt: string = ""
) => {
  const [src, setSrc] = useState(initialSrc);
  const [alt, setAlt] = useState(initialAlt);
  const [isDirty, setIsDirty] = useState(false);

  const handleImageChange = React.useCallback(
    (newSrc: string, newAlt?: string) => {
      setSrc(newSrc);
      if (newAlt !== undefined) {
        setAlt(newAlt);
      }
      setIsDirty(true);
    },
    []
  );

  const handleAltChange = React.useCallback((newAlt: string) => {
    setAlt(newAlt);
    setIsDirty(true);
  }, []);

  const reset = React.useCallback(() => {
    setSrc(initialSrc);
    setAlt(initialAlt);
    setIsDirty(false);
  }, [initialSrc, initialAlt]);

  const markClean = React.useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    src,
    alt,
    onImageChange: handleImageChange,
    onAltChange: handleAltChange,
    isDirty,
    reset,
    markClean,
  };
};
