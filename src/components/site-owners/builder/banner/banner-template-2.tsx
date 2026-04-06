import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BannerData,
  BannerTemplate2Data,
} from "@/types/owner-site/components/banner";
import { EditableLink } from "@/components/ui/editable-link";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BannerItemControls } from "./banner-item-controls";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

interface BannerTemplateProps {
  bannerData: BannerTemplate2Data;
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
  const { data, setData, handleArrayItemUpdate } = useBuilderLogic(
    bannerData,
    onUpdate
  );

  const pathname = usePathname();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeImages = data.images.filter(img => img.is_active !== false);

  useEffect(() => {
    if (isEditable || activeImages.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isEditable, activeImages.length]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleImageUpdateLocal = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const imgId = activeImages[index].id;
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

  const handleTextUpdate = (
    index: number,
    field: "badge" | "title" | "subtitle",
    value: string
  ) => {
    const imgId = activeImages[index].id;
    if (imgId !== undefined) {
      handleArrayItemUpdate("images", imgId)({ [field]: value });
    }
  };

  const handleRemoveImage = (index: number) => {
    const imgId = activeImages[index].id;
    const updatedImages = data.images.filter(img => img.id !== imgId);
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
    if (currentIndex >= updatedImages.length && updatedImages.length > 0) {
      setCurrentIndex(updatedImages.length - 1);
    }
  };

  const handleAddImage = () => {
    const newImage = {
      id: Date.now(),
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      image_alt_description: "New banner image",
      link: "#",
      badge: "New Offer",
      title: "Limited Time!",
      subtitle: "Check out our latest collection.",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
    setCurrentIndex(updatedImages.length - 1);
  };

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") {
      return image;
    }
    return URL.createObjectURL(image);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  if (activeImages.length === 0 && !isEditable) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 sm:h-40 md:h-48 lg:h-60">
        <p className="px-2 text-xs text-gray-500 sm:text-sm">
          No banner image available
        </p>
      </div>
    );
  }

  const currentSlide = activeImages[currentIndex];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="relative h-[400px] w-full overflow-hidden rounded-4xl bg-gray-100 shadow-md md:h-[480px]">
        {activeImages.length > 0 ? (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide?.id || currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0"
            >
              <div className="relative h-full w-full">
                {currentSlide.link && !isEditable ? (
                  <Link
                    href={generateLinkHref(
                      currentSlide.link,
                      siteUser,
                      pathname,
                      isEditable,
                      false
                    )}
                    className="block h-full w-full cursor-pointer transition-transform hover:scale-[1.01]"
                  >
                    <EditableImage
                      src={getImageUrl(currentSlide.image)}
                      alt={currentSlide.image_alt_description || "Banner"}
                      onImageChange={(url, alt) =>
                        handleImageUpdateLocal(currentIndex, url, alt)
                      }
                      className="h-full w-full object-cover"
                      priority
                      s3Options={{ folder: "banner-images" }}
                    />

                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="max-w-2xl"
                      >
                        <div className="mb-6">
                          <EditableText
                            value={currentSlide.badge || "Offer"}
                            onChange={val =>
                              handleTextUpdate(currentIndex, "badge", val)
                            }
                            isEditable={isEditable}
                            as="p"
                            className="inline-block rounded-lg bg-white px-4 py-1.5 text-sm font-bold text-black shadow-sm"
                            style={{ color: "black", backgroundColor: "white" }}
                          />
                        </div>

                        <EditableText
                          value={currentSlide.title || "Headline"}
                          onChange={val =>
                            handleTextUpdate(currentIndex, "title", val)
                          }
                          isEditable={isEditable}
                          as="h1"
                          className="mb-4 text-5xl leading-none font-bold tracking-tight text-white drop-shadow-md md:text-6xl lg:text-7xl"
                          useHeadingFont
                        />

                        <EditableText
                          value={currentSlide.subtitle || "Description"}
                          onChange={val =>
                            handleTextUpdate(currentIndex, "subtitle", val)
                          }
                          isEditable={isEditable}
                          as="p"
                          className="text-white"
                          multiline
                        />
                      </motion.div>
                    </div>
                  </Link>
                ) : (
                  <>
                    <EditableImage
                      src={getImageUrl(currentSlide.image)}
                      alt={currentSlide.image_alt_description || "Banner"}
                      onImageChange={(url, alt) =>
                        handleImageUpdateLocal(currentIndex, url, alt)
                      }
                      className="h-full w-full object-cover"
                      priority
                      s3Options={{ folder: "banner-images" }}
                    />

                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="max-w-2xl"
                      >
                        <div className="mb-6">
                          <EditableText
                            value={currentSlide.badge || "Offer"}
                            onChange={val =>
                              handleTextUpdate(currentIndex, "badge", val)
                            }
                            isEditable={isEditable}
                            as="p"
                            className="inline-block rounded-lg bg-white px-4 py-1.5 text-sm font-bold text-black shadow-sm"
                            style={{ color: "black", backgroundColor: "white" }}
                          />
                        </div>

                        <EditableText
                          value={currentSlide.title || "Headline"}
                          onChange={val =>
                            handleTextUpdate(currentIndex, "title", val)
                          }
                          isEditable={isEditable}
                          as="h1"
                          className="mb-4 text-5xl leading-none font-bold tracking-tight text-white drop-shadow-md md:text-6xl lg:text-7xl"
                          useHeadingFont
                        />

                        <EditableText
                          value={currentSlide.subtitle || "Description"}
                          onChange={val =>
                            handleTextUpdate(currentIndex, "subtitle", val)
                          }
                          isEditable={isEditable}
                          as="p"
                          className="text-white"
                          multiline
                        />
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-gray-300">
            <Button onClick={handleAddImage} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Slide
            </Button>
          </div>
        )}

        {/* Global Controls Overlay for current picture in edit mode */}
        <BannerItemControls
          link={currentSlide?.link || ""}
          onLinkUpdate={(text, href) => handleArrayItemUpdate("images", currentSlide.id!)({ link: href })}
          onRemove={() => handleRemoveImage(currentIndex)}
          isEditable={isEditable}
          siteUser={siteUser}
          className="top-4 left-4"
        />

        {/* Global Edit Overlay for current picture */}
        {isEditable && currentSlide && (
          <ImageEditOverlay
            onImageSelect={url => handleImageUpdateLocal(currentIndex, url)}
            imageWidth={1920}
            imageHeight={600}
            isEditable={isEditable}
            label="Change Background"
            folder="banner-images"
            className="absolute top-4 right-4 z-30"
          />
        )}

        {/* Pagination Dots */}
        {activeImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-2.5 rounded-full bg-white/80 px-4 py-2.5 shadow-md backdrop-blur-sm">
            {activeImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-black"
                    : "w-2.5 bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {isEditable && activeImages.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleAddImage}
            variant="outline"
            size="sm"
            className="gap-2 rounded-full px-6"
          >
            <Plus className="h-4 w-4" />
            Add Another Slide
          </Button>
        </div>
      )}
    </div>
  );
};
