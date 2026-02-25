"use client";

import React, { useState } from "react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroTemplate18Data } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HeroTemplate18Props {
  heroData: HeroTemplate18Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroTemplate18Data>) => void;
}

export const HeroTemplate18: React.FC<HeroTemplate18Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const componentId = React.useId();
  const defaultCollections = [
    {
      id: "men",
      title: "Men's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=774&auto=format&fit=crop",
      imageAlt: "Men's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
    {
      id: "women",
      title: "Women's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop",
      imageAlt: "Women's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
  ];

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#000000",
      primaryForeground: "#FFFFFF",
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
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsUploading(null);
      event.target.value = "";
    }
  };

  return (
    <div
      className="bg-background-light dark:bg-background-dark flex items-center justify-center py-6 sm:py-8 lg:py-12"
      data-component-id={componentId}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:gap-8 lg:px-8">
        {collections.map((collection, index) => {
          // Different backgrounds based on index to match the design (darker left, lighter right)
          const cardBgClass = index % 2 === 0 ? "bg-[#8A95A5]" : "bg-[#E6E6E6]";
          const textColorClass = index % 2 === 0 ? "text-white" : "text-black";
          const btnBorderClass =
            index % 2 === 0 ? "border-white" : "border-black";

          return (
            <div
              key={collection.id}
              className={`group relative h-[400px] w-full overflow-hidden rounded-[40px] ${cardBgClass} sm:h-[450px] lg:h-[500px]`}
            >
              {/* Product Image on the Background */}
              <div className="pointer-events-none absolute inset-0 h-full w-full">
                {/* The actual image */}
                <div
                  className="pointer-events-auto absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${collection.imageUrl})`,
                  }}
                />
              </div>

              {/* EditableImage for hover/upload overlay (positioned over the whole area) */}
              <div className="absolute inset-0 h-full w-full">
                <EditableImage
                  src={collection.imageUrl}
                  alt={collection.imageAlt}
                  onImageChange={(url, alt) =>
                    handleCollectionImageUpdate(collection.id, url, alt)
                  }
                  isEditable={isEditable}
                  className="absolute inset-0 h-full w-full object-cover opacity-0"
                  cloudinaryOptions={{
                    folder: "hero-collections",
                    resourceType: "image",
                  }}
                  imageOptimization={{
                    width: 800,
                    height: 800,
                    quality: "auto",
                    format: "auto",
                    crop: "fill",
                  }}
                  placeholder={{
                    width: 800,
                    height: 800,
                    text: `Collection ${index + 1}`,
                  }}
                />
              </div>

              {/* Manual upload button for collection image */}
              {isEditable && (
                <div className="absolute top-6 right-6 z-20">
                  <label
                    htmlFor={`collection-upload-${componentId}-${collection.id}`}
                    className={`cursor-pointer rounded-full border border-gray-300 bg-white/90 px-4 py-2 text-xs font-medium text-black shadow-sm backdrop-blur-sm transition hover:bg-white ${
                      isUploading === collection.id
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    {isUploading === collection.id ? (
                      <span className="flex items-center gap-2">
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

              {/* Upload Loading Overlay */}
              {isUploading === collection.id && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 text-black shadow-xl">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                    <p className="text-sm font-medium">Uploading image...</p>
                  </div>
                </div>
              )}

              {/* Content on the Left */}
              <div
                className={`relative z-10 flex h-full w-full max-w-[60%] flex-col justify-center p-8 sm:p-12 lg:p-16 ${textColorClass}`}
              >
                {/* Main Title */}
                <EditableText
                  value={collection.title}
                  onChange={value =>
                    handleCollectionUpdate(collection.id, "title", value)
                  }
                  as="h2"
                  className="mb-8 text-3xl leading-tight font-medium tracking-tight whitespace-pre-line sm:text-4xl lg:text-5xl"
                  isEditable={isEditable}
                  placeholder="Enter collection title..."
                  multiline={true}
                />

                {/* CTA Button */}
                <div className="mt-4">
                  <EditableLink
                    text={collection.buttonText}
                    href={collection.buttonHref}
                    onChange={(text, href) =>
                      handleCollectionButtonUpdate(collection.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    className={`rounded-full border border-solid px-8 py-3 text-sm font-medium transition-all hover:bg-black/5 ${btnBorderClass} ${textColorClass}`}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter URL..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
