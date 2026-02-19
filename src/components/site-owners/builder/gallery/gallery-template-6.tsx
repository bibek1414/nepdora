import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  GalleryData,
  GalleryImage,
  defaultGalleryData,
} from "@/types/owner-site/components/gallery";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/cloudinary";

const TEMPLATE6_DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "gallery6-case-1",
    image: "https://picsum.photos/id/1033/400/600",
    image_alt_description: "Revive & Rise showcase",
    title: "Revive & Rise",
    description:
      "We step in to assess what’s holding you back, reshape your strategy, and breathe.",
    is_active: true,
  },
  {
    id: "gallery6-case-2",
    image: "https://picsum.photos/id/101/400/600",
    image_alt_description: "Scaling Made Simple showcase",
    title: "Scaling Made Simple",
    description:
      "We simplify the scaling process by identifying what’s working, removing what’s not, and building systems...",
    is_active: true,
  },
  {
    id: "gallery6-case-3",
    image: "https://picsum.photos/id/1031/400/600",
    image_alt_description: "Fast-Track Growth showcase",
    title: "Fast-Track Growth",
    description:
      "When time is critical and growth is essential, our focused strategies help you accelerate progress with...",
    is_active: true,
  },
  {
    id: "gallery6-case-4",
    image: "https://picsum.photos/id/1029/400/600",
    image_alt_description: "Future-Proofing showcase",
    title: "Future-Proofing",
    description:
      "We help organizations future-proof their operations with adaptable strategies, smart technologies.",
    is_active: true,
  },
];

const buildInitialData = (galleryData: GalleryData): GalleryData => {
  if (galleryData.template !== "gallery-6") {
    return galleryData;
  }

  const defaultTitles = defaultGalleryData.images.map(img => img.title);
  const usesGenericDefaults =
    galleryData.images.length === defaultGalleryData.images.length &&
    galleryData.images.every(
      (img, index) => img.title === defaultTitles[index]
    );

  if (galleryData.images.length === 0 || usesGenericDefaults) {
    return {
      ...galleryData,
      title: "How We Helped Clients Grow Smarter",
      subtitle:
        "Stories of transformation across industries, from revitalized brands to future-proof strategies.",
      images: TEMPLATE6_DEFAULT_IMAGES,
    };
  }

  return galleryData;
};

interface GalleryTemplateProps {
  galleryData: GalleryData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryData>) => void;
}

export const GalleryTemplate6: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, setData, handleTextUpdate, handleArrayItemUpdate } =
    useBuilderLogic(buildInitialData(galleryData), onUpdate);

  const [isAddingImage, setIsAddingImage] = useState(false);
  const componentId = React.useId();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(false);

  const handleImageTitleUpdate = (index: number, title: string) => {
    const imgId = data.images[index].id;
    handleArrayItemUpdate("images", imgId)({ title });
  };

  const handleImageDescriptionUpdate = (index: number, description: string) => {
    const imgId = data.images[index].id;
    handleArrayItemUpdate("images", imgId)({ description });
  };

  const handleImageUpdateLocal = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const imgId = data.images[index].id;
    handleArrayItemUpdate(
      "images",
      imgId
    )({
      image: imageUrl,
      image_alt_description: altText,
    });
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsAddingImage(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "gallery-images",
        resourceType: "image",
      });

      handleAddImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsAddingImage(false);
      event.target.value = "";
    }
  };

  const handleAddImage = (imageUrl?: string) => {
    const newImage: GalleryImage = {
      id: Date.now(),
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
      image_alt_description: "New gallery card",
      title: "New Case Study",
      description: "Add a short descriptor",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = data.images.filter((_, idx) => idx !== index);
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const getImageUrl = (image: string | File) =>
    typeof image === "string" ? image : URL.createObjectURL(image);

  const filteredImages = data.images.filter(image => image.is_active);

  const updateFadeVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const needsScroll = container.scrollWidth - 1 > container.clientWidth;
    const atEnd =
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 4;
    setShowRightFade(needsScroll && !atEnd);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = window.innerWidth >= 768 ? 374 : 324;
      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      requestAnimationFrame(updateFadeVisibility);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = window.innerWidth >= 768 ? 374 : 324;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      requestAnimationFrame(updateFadeVisibility);
    }
  };

  useEffect(() => {
    updateFadeVisibility();
    const handleResize = () => updateFadeVisibility();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateFadeVisibility]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.section
      className="overflow-hidden bg-white py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.12 }}
    >
      <div className="container mx-auto max-w-7xl px-[23px]">
        <motion.div
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
              <EditableText
                value={data.title || "How We Helped Clients Grow Smarter"}
                onChange={handleTextUpdate("title")}
                isEditable={isEditable}
                className="leading-tight"
              />
            </h2>
            <p className="text-sm text-gray-600 md:text-base">
              <EditableText
                value={
                  data.subtitle ||
                  "Stories of transformation across industries, from revitalized brands to future-proof strategies."
                }
                onChange={handleTextUpdate("subtitle")}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="rounded-full bg-gray-100 p-3 text-gray-700 transition-colors hover:bg-gray-200"
              type="button"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRight}
              className="rounded-full bg-gray-100 p-3 text-gray-700 transition-colors hover:bg-gray-200"
              type="button"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-white via-white/60 to-transparent transition-opacity duration-300"
            style={{ opacity: showRightFade ? 1 : 0 }}
          />
          <div
            ref={scrollContainerRef}
            onScroll={updateFadeVisibility}
            className="scrollbar-hide -mx-4 flex gap-6 overflow-x-auto px-4 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {filteredImages.map(image => {
              const actualIndex = data.images.findIndex(
                img => img.id === image.id
              );
              return (
                <motion.div
                  key={image.id}
                  className="group/card relative h-[450px] min-w-[300px] cursor-pointer overflow-hidden rounded-2xl md:min-w-[350px]"
                  variants={fadeInUp}
                  initial={false}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <div className="h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 group-hover/card:[&_img]:scale-110 hover:[&_img]:scale-110">
                    <EditableImage
                      src={getImageUrl(image.image)}
                      alt={image.image_alt_description}
                      onImageChange={(imageUrl, altText) =>
                        handleImageUpdateLocal(actualIndex, imageUrl, altText)
                      }
                      isEditable={isEditable}
                      className="h-full w-full"
                      width={800}
                      height={1000}
                      imageOptimization={{
                        width: 800,
                        height: 1000,
                        quality: "auto",
                        format: "auto",
                        crop: "fill",
                      }}
                      cloudinaryOptions={{
                        folder: "gallery-images",
                        resourceType: "image",
                      }}
                      disableImageChange={true}
                      showAltEditor={isEditable}
                      inputId={`gallery6-upload-${componentId}-${actualIndex}`}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60" />

                  {isEditable && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 transition-opacity group-hover/card:opacity-100">
                      <label
                        htmlFor={`gallery6-upload-${componentId}-${actualIndex}`}
                        className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                      >
                        Change
                      </label>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveImage(actualIndex);
                        }}
                        className="h-6 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="absolute inset-x-6 bottom-6 z-10">
                    <div className="translate-y-2 rounded-xl bg-white p-4 shadow-lg transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:scale-105 group-hover/card:shadow-xl">
                      <div className="flex flex-col gap-2">
                        <EditableText
                          value={image.title || "Case Study"}
                          onChange={newValue =>
                            handleImageTitleUpdate(actualIndex, newValue)
                          }
                          isEditable={isEditable}
                          className="font-semibold text-gray-900"
                        />
                        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover/card:max-h-40 group-hover/card:opacity-100">
                          {(image.description || isEditable) && (
                            <EditableText
                              value={image.description || ""}
                              onChange={newValue =>
                                handleImageDescriptionUpdate(
                                  actualIndex,
                                  newValue
                                )
                              }
                              isEditable={isEditable}
                              className="text-[11px] leading-relaxed text-gray-600"
                              placeholder="Add description"
                              multiline
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isEditable && (
              <div className="flex h-[450px] min-w-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 md:min-w-[350px]">
                <label
                  htmlFor={`gallery6-add-${componentId}`}
                  className="flex cursor-pointer flex-col items-center gap-2 text-gray-500"
                >
                  {isAddingImage ? (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Plus className="h-8 w-8" />
                      <span className="text-sm font-medium">
                        Add Case Study
                      </span>
                      <input
                        id={`gallery6-add-${componentId}`}
                        type="file"
                        accept="image/*"
                        onChange={event => handleImageFileChange(event)}
                        className="hidden"
                      />
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
