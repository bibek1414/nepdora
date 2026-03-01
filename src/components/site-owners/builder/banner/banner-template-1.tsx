import React, { useState } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

interface BannerTemplateProps {
  bannerData: BannerData;
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

  const [isUploading, setIsUploading] = useState(false);

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
      image: "/fallback/image-not-found.png",
      image_alt_description: "New banner image",
      link: "",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "banner-images",
        resourceType: "image",
      });

      handleImageUpdateLocal(0, imageUrl, `Banner image: ${file.name}`);
      toast.success("Banner image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload banner image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
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
            {isEditable && (
              <div className="absolute top-1 right-1 z-20 sm:top-2 sm:right-2">
                <label
                  htmlFor={`banner-upload-${componentId}`}
                  className={`cursor-pointer rounded border border-gray-300 bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white sm:rounded-lg sm:px-2 sm:py-1 sm:text-xs md:px-3 md:py-1.5 md:text-sm ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Loader2 className="h-2.5 w-2.5 animate-spin sm:h-3 sm:w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Uploading...</span>
                    </span>
                  ) : (
                    <span className="whitespace-nowrap">
                      <span className="hidden sm:inline">Change Image</span>
                      <span className="sm:hidden">Change</span>
                    </span>
                  )}
                </label>
                <input
                  id={`banner-upload-${componentId}`}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            )}

            {/* Upload Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-1.5 px-2 text-white sm:gap-2">
                  <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
                  <p className="text-xs font-medium sm:text-sm">
                    <span className="hidden sm:inline">
                      Uploading banner image...
                    </span>
                    <span className="sm:hidden">Uploading...</span>
                  </p>
                </div>
              </div>
            )}

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
                  cloudinaryOptions={{
                    folder: "banner-images",
                    resourceType: "image",
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
                  cloudinaryOptions={{
                    folder: "banner-images",
                    resourceType: "image",
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
