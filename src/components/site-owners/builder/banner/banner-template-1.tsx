import React, { useState } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
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
  const [data, setData] = useState(bannerData);
  const [isUploading, setIsUploading] = useState(false);

  const componentId = React.useId();

  const handleLinkUpdate = (index: number, href: string) => {
    const updatedImages = [...data.images];
    updatedImages[index] = { ...updatedImages[index], link: href };
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const handleImageUpdate = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const updatedImages = [...data.images];
    updatedImages[index] = {
      ...updatedImages[index],
      image: imageUrl,
      image_alt_description:
        altText || updatedImages[index].image_alt_description,
    };
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = data.images.filter((_, idx) => idx !== index);
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const handleAddImage = () => {
    const newImage = {
      id: Date.now(),
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=200&q=80&fit=crop",
      image_alt_description: "New banner image",
      link: "",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
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

      handleImageUpdate(0, imageUrl, `Banner image: ${file.name}`);
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
      <div className="flex h-20 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 md:h-24 lg:h-60">
        <p className="text-gray-500">No banner image available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-4">
        {activeImage ? (
          <div className="group relative h-20 overflow-hidden rounded-lg md:h-24 lg:h-80">
            {/* Change Background Button - Only visible when editable */}
            {isEditable && (
              <div className="absolute top-2 right-2 z-20">
                <label
                  htmlFor={`banner-upload-${componentId}`}
                  className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white md:px-4 md:py-2 md:text-sm ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin md:h-4 md:w-4" />
                      Uploading...
                    </span>
                  ) : (
                    "Change Image"
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
                <div className="flex flex-col items-center gap-2 text-white">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm font-medium">
                    Uploading banner image...
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
                    handleImageUpdate(0, imageUrl, altText)
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
                    handleImageUpdate(0, imageUrl, altText)
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
              <div className="absolute bottom-2 left-2 z-10 flex gap-2">
                <EditableLink
                  text="Edit Link"
                  href={activeImage.link || ""}
                  onChange={(text, href) => handleLinkUpdate(0, href)}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="rounded bg-black/50 px-2 py-1 text-xs text-white"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveImage(0)}
                  className="h-6 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 md:h-24 lg:h-60">
            <Button onClick={handleAddImage} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
