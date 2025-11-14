import React, { useState, useEffect } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

interface BannerTemplateProps {
  bannerData: BannerData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate2: React.FC<BannerTemplateProps> = ({
  bannerData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

    // Adjust current slide if needed
    if (currentSlide >= updatedImages.length && updatedImages.length > 0) {
      setCurrentSlide(updatedImages.length - 1);
    }
  };

  const handleAddImage = () => {
    const newImage = {
      id: Date.now(),
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&q=80&fit=crop",
      image_alt_description: "New slider image",
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
        folder: "banner-slider-images",
        resourceType: "image",
      });

      handleImageUpdate(currentSlide, imageUrl, `Slider image: ${file.name}`);
      toast.success("Slider image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload slider image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // Get all active images
  const allActiveImages = data.images.filter(img => img.is_active !== false);

  // Auto-slide functionality
  useEffect(() => {
    if (allActiveImages.length <= 1 || isEditable) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % allActiveImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allActiveImages.length, isEditable]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % allActiveImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + allActiveImages.length) % allActiveImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getImageSrc = (img: unknown) => {
    if (typeof img === "string") return img;
    if (img instanceof File || img instanceof Blob)
      return URL.createObjectURL(img);
    return "/fallback.png";
  };

  if (allActiveImages.length === 0 && !isEditable) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 md:h-96">
        <p className="text-gray-500">No slider images available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="mx-auto max-w-7xl px-4">
        {allActiveImages.length > 0 ? (
          <Card className="group relative aspect-[3/1] w-full overflow-hidden py-0 md:aspect-[4/1]">
            {/* Change Image Button - Only visible when editable */}
            {isEditable && (
              <div className="absolute top-2 right-2 z-20">
                <label
                  htmlFor={`slider-upload-${componentId}`}
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
                    "Change Current Image"
                  )}
                </label>
                <input
                  id={`slider-upload-${componentId}`}
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
                    Uploading slider image...
                  </p>
                </div>
              </div>
            )}

            <div className="relative h-full w-full">
              {allActiveImages.map((image, imageIndex) => (
                <div
                  key={`${image.id || imageIndex}-${imageIndex}`}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    imageIndex === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <EditableImage
                    src={getImageSrc(image.image)}
                    alt={image.image_alt_description || "Slider image"}
                    onImageChange={(imageUrl, altText) =>
                      handleImageUpdate(imageIndex, imageUrl, altText)
                    }
                    isEditable={isEditable}
                    className="h-auto w-full object-contain"
                    priority={imageIndex === 0}
                    cloudinaryOptions={{
                      folder: "banner-slider-images",
                      resourceType: "image",
                    }}
                    disableImageChange={true}
                    showAltEditor={isEditable && imageIndex === currentSlide}
                  />

                  {isEditable && imageIndex === currentSlide && (
                    <div className="absolute bottom-2 left-2 z-10 flex gap-2">
                      {image.link !== undefined && (
                        <EditableLink
                          text="Edit Link"
                          href={image.link || ""}
                          onChange={(text, href) =>
                            handleLinkUpdate(imageIndex, href)
                          }
                          isEditable={isEditable}
                          siteUser={siteUser}
                          className="rounded bg-black/50 px-2 py-1 text-xs text-white"
                        />
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(imageIndex)}
                        className="h-6 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {allActiveImages.length > 1 && (
              <>
                <Button
                  onClick={prevSlide}
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-2 z-10 h-8 w-8 -translate-y-1/2 transform rounded-full bg-white/90 text-gray-800 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 hover:bg-white md:left-4 md:h-10 md:w-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  onClick={nextSlide}
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 z-10 h-8 w-8 -translate-y-1/2 transform rounded-full bg-white/90 text-gray-800 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 hover:bg-white md:right-4 md:h-10 md:w-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>

                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2 md:bottom-4">
                  {allActiveImages.map((_, index) => (
                    <Button
                      key={index}
                      onClick={() => goToSlide(index)}
                      variant="ghost"
                      size="sm"
                      className={`h-2 w-2 rounded-full p-0 transition-all duration-200 md:h-3 md:w-3 ${
                        index === currentSlide
                          ? "bg-white shadow-lg"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </Card>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 md:h-96">
            <Button onClick={handleAddImage} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Slider Image
            </Button>
          </div>
        )}
      </div>

      {isEditable && allActiveImages.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Button onClick={handleAddImage} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Slide
          </Button>
        </div>
      )}
    </div>
  );
};
