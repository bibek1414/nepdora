"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate7Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HeroTemplate7Props {
  heroData: HeroTemplate7Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate7Data>) => void;
}

export const HeroTemplate7: React.FC<HeroTemplate7Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  // Generate unique component ID to prevent conflicts
  const componentId = React.useId();
  const defaultCollections = [
    {
      id: "women",
      title: "WOMEN'S COLLECTION",
      subtitle: "NEW COLLECTION",
      badge: "WOMEN",
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop",
      imageAlt: "Woman in yellow sportswear stretching on stairs",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
    {
      id: "men",
      title: "MEN'S COLLECTION",
      subtitle: "SAVE 50% OFF",
      badge: "MEN",
      imageUrl:
        "https://images.unsplash.com/photo-1683509231125-5c487afaa453?q=80&w=1364&auto=format&fit=crop",
      imageAlt: "Man in red t-shirt resting after a workout",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
  ];

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#FFFFFF",
      primaryForeground: "#000000",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#F3F4F6",
      backgroundDark: "#1F2937",
    },
    fonts: {
      body: "sans-serif",
      heading: "sans-serif",
    },
  };

  const { data, handleArrayItemUpdate } = useBuilderLogic(
    {
      ...heroData,
      collections: heroData.collections || defaultCollections,
    },
    onUpdate
  );

  const collections = data.collections || defaultCollections;

  // Handle collection updates
  const handleCollectionUpdate = (
    collectionId: string,
    field: string,
    value: string
  ) => {
    handleArrayItemUpdate(
      "collections" as any,
      collectionId
    )({
      [field]: value,
    });
  };

  // Handle collection image update
  const handleCollectionImageUpdate = (
    collectionId: string,
    imageUrl: string,
    altText?: string
  ) => {
    handleArrayItemUpdate(
      "collections" as any,
      collectionId
    )({
      imageUrl,
      imageAlt: altText,
    });
  };

  // Handle collection button update
  const handleCollectionButtonUpdate = (
    collectionId: string,
    text: string,
    href: string
  ) => {
    handleArrayItemUpdate(
      "collections" as any,
      collectionId
    )({
      buttonText: text,
      buttonHref: href,
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    collectionId: string
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

    setIsUploading(collectionId);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-collections",
        resourceType: "image",
      });

      handleCollectionImageUpdate(
        collectionId,
        imageUrl,
        `Collection image: ${file.name}`
      );
      toast.success("Collection image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(null);
      event.target.value = "";
    }
  };

  return (
    <div
      className="bg-background-light dark:bg-background-dark flex min-h-screen items-center justify-center p-4"
      data-component-id={componentId}
    >
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className="group relative h-auto w-full overflow-hidden"
          >
            {/* Collection Image */}
            <div className="relative h-full min-h-[600px] w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${collection.imageUrl})`,
                }}
              />

              {/* Hidden EditableImage for functionality only - no hover effects */}
              <EditableImage
                src={collection.imageUrl}
                alt={collection.imageAlt}
                onImageChange={(url, alt) =>
                  handleCollectionImageUpdate(collection.id, url, alt)
                }
                isEditable={false} // Disable hover effects
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                cloudinaryOptions={{
                  folder: "hero-collections",
                  resourceType: "image",
                }}
                imageOptimization={{
                  width: 800,
                  height: 600,
                  quality: "auto",
                  format: "auto",
                  crop: "fill",
                }}
                placeholder={{
                  width: 800,
                  height: 600,
                  text: `Collection ${index + 1}`,
                }}
              />

              {/* Manual upload button for collection image */}
              {isEditable && (
                <div className="absolute top-4 left-4 z-20">
                  <label
                    htmlFor={`collection-upload-${componentId}-${collection.id}`}
                    className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-3 py-1 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
                      isUploading === collection.id
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    {isUploading === collection.id ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      "Change Image"
                    )}
                  </label>
                  <input
                    id={`collection-upload-${componentId}-${collection.id}`}
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, collection.id)}
                    className="hidden"
                    disabled={isUploading === collection.id}
                  />
                </div>
              )}
            </div>

            {/* Upload Loading Overlay */}
            {isUploading === collection.id && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm font-medium">Uploading image...</p>
                </div>
              </div>
            )}

            {/* Content Overlay */}
            <div className="bg-opacity-10 absolute inset-0 flex flex-col justify-center bg-black/40 p-8 text-white">
              {/* Content */}
              <div className="relative z-10">
                {/* Subtitle */}
                <EditableText
                  value={collection.subtitle}
                  onChange={value =>
                    handleCollectionUpdate(collection.id, "subtitle", value)
                  }
                  as="p"
                  className="mb-2 tracking-wider"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />

                {/* Main Title */}
                <EditableText
                  value={collection.title}
                  onChange={value =>
                    handleCollectionUpdate(collection.id, "title", value)
                  }
                  as="h2"
                  className="mb-4 font-bold"
                  isEditable={isEditable}
                  placeholder="Enter collection title..."
                  multiline={true}
                />

                {/* CTA Button */}
                <EditableLink
                  text={collection.buttonText}
                  href={collection.buttonHref}
                  onChange={(text, href) =>
                    handleCollectionButtonUpdate(collection.id, text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="inline-block rounded-sm bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
