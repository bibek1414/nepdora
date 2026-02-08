import React, { useState, useEffect } from "react";
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

  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const componentId = React.useId();

  const defaultImages = [
    "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
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

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
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

    setIsUploading(index);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "banner-images",
        resourceType: "image",
      });

      handleImageUpdateLocal(index, imageUrl, `Banner image: ${file.name}`);
      toast.success("Banner image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload banner image. Please try again.");
    } finally {
      setIsUploading(null);
      event.target.value = "";
    }
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
                    <div key={image.id || displayIndex} className="relative">
                      {/* Change Image Button - Only visible when editable */}
                      {isEditable && (
                        <div className="absolute top-2 right-2 z-20">
                          <label
                            htmlFor={`banner-upload-${componentId}-${displayIndex}`}
                            className={`cursor-pointer rounded border border-gray-300 bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white ${
                              isUploading === safeIndex
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          >
                            {isUploading === safeIndex ? (
                              <span className="flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="hidden sm:inline">
                                  Uploading...
                                </span>
                              </span>
                            ) : (
                              "Change"
                            )}
                          </label>
                          <input
                            id={`banner-upload-${componentId}-${displayIndex}`}
                            type="file"
                            accept="image/*"
                            onChange={e =>
                              handleBackgroundFileChange(e, safeIndex)
                            }
                            className="hidden"
                            disabled={isUploading === safeIndex}
                          />
                        </div>
                      )}

                      {/* Upload Loading Overlay */}
                      {isUploading === safeIndex && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-black/50">
                          <div className="flex flex-col items-center gap-2 text-white">
                            <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
                            <p className="text-xs font-medium sm:text-sm">
                              Uploading...
                            </p>
                          </div>
                        </div>
                      )}

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
                              cloudinaryOptions={{
                                folder: "banner-images",
                                resourceType: "image",
                              }}
                              showAltEditor={isEditable}
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
