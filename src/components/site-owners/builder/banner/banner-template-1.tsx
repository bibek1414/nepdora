import React, { useState } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
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

  const handleTextUpdate = (field: keyof BannerData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<BannerData>);
  };

  const handleLinkUpdate = (index: number, href: string) => {
    const updatedImages = [...data.images];
    updatedImages[index] = { ...updatedImages[index], link: href };
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

  if (!activeImage) {
    return (
      <div className="flex h-20 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 md:h-24 lg:h-60">
        <p className="text-gray-500">No banner image available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
        <div className="relative h-20 overflow-hidden rounded-lg md:h-24 lg:h-150">
          {activeImage.link ? (
            <button
              onClick={handleBannerClick}
              className="block h-full w-full cursor-pointer transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
              aria-label={`Navigate to ${activeImage.image_alt_description}`}
            >
              <Image
                src={getImageUrl(activeImage.image)}
                alt={activeImage.image_alt_description || "Top banner"}
                fill
                className="object-cover"
                priority
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  const banner = target.closest(".w-full") as HTMLElement;
                  if (banner) {
                    banner.style.display = "none";
                  }
                }}
              />
            </button>
          ) : (
            <div className="h-full w-full">
              <Image
                src={getImageUrl(activeImage.image)}
                alt={activeImage.image_alt_description || "Top banner"}
                fill
                className="object-cover"
                priority
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  const banner = target.closest(".w-full") as HTMLElement;
                  if (banner) {
                    banner.style.display = "none";
                  }
                }}
              />
            </div>
          )}

          {/* Editable link overlay for edit mode */}
          {isEditable && (
            <div className="absolute bottom-2 left-2">
              <EditableLink
                text="Edit Link"
                href={activeImage.link || ""}
                onChange={(text, href) => handleLinkUpdate(0, href)}
                isEditable={isEditable}
                siteUser={siteUser}
                className="rounded bg-black/50 px-2 py-1 text-xs text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
