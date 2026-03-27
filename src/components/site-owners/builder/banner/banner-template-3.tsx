import React, { useState, useEffect } from "react";
import { BannerData, BannerTemplate3Data } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToS3 } from "@/utils/s3";
import { toast } from "sonner";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";

interface BannerTemplateProps {
  bannerData: BannerTemplate3Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate3: React.FC<BannerTemplateProps> = ({
  bannerData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data, setData, handleArrayItemUpdate } = useBuilderLogic(
    bannerData,
    onUpdate
  );

  const [isInitialized, setIsInitialized] = useState(false);

  const componentId = React.useId();

  const defaultImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  ];

  // Initialize with default images if no images are provided
  useEffect(() => {
    if (
      !isInitialized &&
      bannerData.images.length === 0 &&
      data.images.length === 0
    ) {
      const timestamp = Date.now();
      const defaultImageObjects = defaultImages.map((url, index) => ({
        id: timestamp + index * 1000, // Ensure unique IDs with spacing
        image: url,
        image_alt_description: `Banner image ${index + 1}`,
        link: "",
        is_active: true,
      }));
      setData({ ...data, images: defaultImageObjects });
      onUpdate?.({ images: defaultImageObjects });
      setIsInitialized(true);
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const imageIndex = data.images.length % defaultImages.length;
    const newImage = {
      id: Date.now(),
      image: defaultImages[imageIndex],
      image_alt_description: "Banner image",
      link: "",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };


  // Get all active images
  const activeImages = data.images.filter(img => img.is_active !== false);

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") {
      return image;
    }
    return URL.createObjectURL(image);
  };

  const handleBannerClick = (link: string) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  // Get display images - show up to 3 images
  const displayImages = activeImages.slice(0, 3);

  return (
    <div className="w-full space-y-2 sm:space-y-4">
      <div className="py-4 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            {displayImages.length > 0 ? (
              <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
                {displayImages.map((image, displayIndex) => {
                  // Since displayImages is a slice of activeImages, the index should match
                  // But we need to find the actual index in the full activeImages array
                  const actualIndex = activeImages.findIndex(
                    img =>
                      (img.id && image.id && img.id === image.id) ||
                      img.image === image.image
                  );

                  // Use the displayIndex as fallback if not found (shouldn't happen, but safety)
                  const safeIndex =
                    actualIndex >= 0 ? actualIndex : displayIndex;

                  return (
                    <div key={image.id || displayIndex} className="group relative">
                      <ImageEditOverlay
                        onImageSelect={(url) => handleImageUpdateLocal(safeIndex, url)}
                        imageWidth={800}
                        imageHeight={1000}
                        isEditable={isEditable}
                        label="Change"
                        folder="banner-images"
                        className="absolute top-2 right-2 z-20"
                      />


                      {image.link && !isEditable ? (
                        <button
                          onClick={() => handleBannerClick(image.link)}
                          className="block w-full cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
                          aria-label={`Navigate to ${image.image_alt_description}`}
                        >
                          <div className="overflow-hidden rounded-lg">
                            <EditableImage
                              src={getImageUrl(image.image)}
                              alt={
                                image.image_alt_description || "Banner image"
                              }
                              onImageChange={(imageUrl, altText) =>
                                handleImageUpdateLocal(
                                  safeIndex,
                                  imageUrl,
                                  altText
                                )
                              }
                              isEditable={isEditable}
                              className="w-full bg-white object-cover transition-opacity hover:opacity-75 max-sm:h-96 sm:h-[400px] lg:h-[500px]"
                              priority={displayIndex === 0}
                              s3Options={{
                                folder: "banner-images",
                              }}
                              showAltEditor={isEditable}
                              disableImageChange={true}
                            />
                          </div>
                        </button>
                      ) : (
                        <div className="w-full overflow-hidden rounded-lg">
                          <EditableImage
                            src={getImageUrl(image.image)}
                            alt={image.image_alt_description || "Banner image"}
                            onImageChange={(imageUrl, altText) =>
                              handleImageUpdateLocal(
                                safeIndex,
                                imageUrl,
                                altText
                              )
                            }
                            isEditable={isEditable}
                            className="w-full bg-white object-cover transition-opacity hover:opacity-75 max-sm:h-96 sm:h-[400px] lg:h-[500px]"
                            priority={displayIndex === 0}
                            s3Options={{
                              folder: "banner-images",
                            }}
                            showAltEditor={isEditable}
                            disableImageChange={true}
                          />
                        </div>
                      )}

                      {/* Editable link overlay for edit mode */}
                      {isEditable && (
                        <div className="absolute bottom-2 left-2 z-10 flex gap-2">
                          <EditableLink
                            text="Edit Link"
                            href={image.link || ""}
                            onChange={(text, href) =>
                              handleLinkUpdate(safeIndex, href)
                            }
                            isEditable={isEditable}
                            siteUser={siteUser}
                            className="rounded bg-black/50 px-2 py-1 text-xs text-white"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveImage(safeIndex)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 sm:h-96">
                <Button
                  onClick={handleAddImage}
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Banner Image
                </Button>
              </div>
            )}

            {isEditable &&
              activeImages.length > 0 &&
              activeImages.length < 3 && (
                <div className="mt-6 text-center">
                  <Button onClick={handleAddImage} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Image
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
