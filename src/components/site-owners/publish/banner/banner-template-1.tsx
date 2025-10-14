import React, { useState } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/publish/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import Image from "next/image";

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
      id: Date.now(), // Changed to number
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
