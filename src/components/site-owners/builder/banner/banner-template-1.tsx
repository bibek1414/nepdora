import React, { useState } from "react";
import { BannerData, BannerTemplate1Data } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToS3 } from "@/utils/s3";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface BannerTemplateProps {
  bannerData: BannerTemplate1Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate1: React.FC<BannerTemplateProps> = ({
  bannerData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data, setData, handleArrayItemUpdate } = useBuilderLogic(
    bannerData,
    onUpdate
  );


  const componentId = React.useId();

  const handleLinkUpdate = (index: number, href: string) => {
    const imgId = data.images[index].id;
    if (imgId !== undefined) {
      handleArrayItemUpdate("images", imgId)({ link: href });
    }
  };

  const handleImageUpdateLocal = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const imgId = data.images[index].id;
    if (imgId !== undefined) {
      handleArrayItemUpdate(
        "images",
        imgId
      )({
        image: imageUrl,
        image_alt_description: altText,
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = data.images.filter((_, idx) => idx !== index);
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const handleAddImage = () => {
    const newImage = {
      id: Date.now(),
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      image_alt_description: "New banner image",
      link: "",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };


  // Get first active image
  const activeImage =
    data.images.find(img => img.is_active !== false) || data.images[0];

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") {
      return image;
    }
    return URL.createObjectURL(image);
  };

  const handleBannerClick = () => {
    if (activeImage?.link) {
      window.open(activeImage.link, "_blank", "noopener,noreferrer");
    }
  };

  if (!activeImage && !isEditable) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 sm:h-40 md:h-48 lg:h-60">
        <p className="px-2 text-xs text-gray-500 sm:text-sm">
          No banner image available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 sm:space-y-4">
      <div className="mx-auto mt-4 max-w-7xl px-2 sm:mt-10 sm:px-4 md:px-6 lg:px-4">
        {activeImage ? (
          <div className="group relative h-32 overflow-hidden rounded-lg sm:h-40 md:h-48 lg:h-80">
            {/* Change Background Button - Only visible when editable */}
              <ImageEditOverlay
                onImageSelect={(url) => handleImageUpdateLocal(0, url)}
                imageWidth={1920}
                imageHeight={400}
                isEditable={isEditable}
                label="Change Image"
                folder="banner-images"
                className="absolute top-2 right-2 z-20"
              />


            {activeImage.link && !isEditable ? (
              <button
                onClick={handleBannerClick}
                className="block h-full w-full cursor-pointer transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
                aria-label={`Navigate to ${activeImage.image_alt_description}`}
              >
                <EditableImage
                  src={getImageUrl(activeImage.image)}
                  alt={activeImage.image_alt_description || "Top banner"}
                  onImageChange={(imageUrl, altText) =>
                    handleImageUpdateLocal(0, imageUrl, altText)
                  }
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  priority
                  s3Options={{
                    folder: "banner-images",
                  }}
                  showAltEditor={isEditable}
                />
              </button>
            ) : (
              <div className="h-full w-full">
                <EditableImage
                  src={getImageUrl(activeImage.image)}
                  alt={activeImage.image_alt_description || "Top banner"}
                  onImageChange={(imageUrl, altText) =>
                    handleImageUpdateLocal(0, imageUrl, altText)
                  }
                  isEditable={isEditable}
                  className="h-full w-full object-cover"
                  priority
                  s3Options={{
                    folder: "banner-images",
                  }}
                  showAltEditor={isEditable}
                />
              </div>
            )}

            {/* Editable link overlay for edit mode */}
            {isEditable && (
              <div className="absolute bottom-1 left-1 z-10 flex gap-1 sm:bottom-2 sm:left-2 sm:gap-2">
                <EditableLink
                  text="Edit Link"
                  href={activeImage.link || ""}
                  onChange={(text, href) => handleLinkUpdate(0, href)}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:py-1 sm:text-xs"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveImage(0)}
                  className="h-5 w-5 p-0 sm:h-6 sm:w-6 sm:px-2"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 sm:h-40 md:h-48 lg:h-60">
            <Button
              onClick={handleAddImage}
              variant="outline"
              className="text-xs sm:text-sm"
            >
              <Plus className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add Banner Image</span>
              <span className="sm:hidden">Add Image</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
