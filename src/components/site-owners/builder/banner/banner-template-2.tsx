import React, { useState, useEffect } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

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

  const handleLinkUpdate = (index: number, href: string) => {
    const updatedImages = [...data.images];
    updatedImages[index] = { ...updatedImages[index], link: href };
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  // Get all active images
  const allActiveImages = data.images.filter(img => img.is_active !== false);

  // Auto-slide functionality
  useEffect(() => {
    if (allActiveImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % allActiveImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [allActiveImages.length]);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImageSrc = (img: any) => {
    if (typeof img === "string") return img;
    if (img instanceof File || img instanceof Blob)
      return URL.createObjectURL(img);
    return "/fallback.png";
  };

  // Return null when no slider content is available
  if (allActiveImages.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 md:h-96">
        <p className="text-gray-500">No slider images available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4">
        <Card className="group relative h-64 w-full overflow-hidden shadow-lg md:h-96">
          {/* Main Slider Content */}
          <div className="relative h-full w-full">
            {allActiveImages.map((image, imageIndex) => (
              <div
                key={`${image.id || imageIndex}-${imageIndex}`}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  imageIndex === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                {image.link ? (
                  isEditable ? (
                    <div className="block h-full w-full cursor-pointer">
                      <div className="relative h-full w-full">
                        <Image
                          src={getImageSrc(image.image)}
                          alt={image.image_alt_description || "Slider image"}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                          priority={imageIndex === 0}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 z-10">
                          <EditableLink
                            text="Edit Link"
                            href={image.link}
                            onChange={(text, href) =>
                              handleLinkUpdate(imageIndex, href)
                            }
                            isEditable={isEditable}
                            siteUser={siteUser}
                            className="rounded bg-black/50 px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={image.link}
                      className="block h-full w-full cursor-pointer"
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={getImageSrc(image.image)}
                          alt={image.image_alt_description || "Slider image"}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                          priority={imageIndex === 0}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>
                  )
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageSrc(image.image)}
                      alt={image.image_alt_description || "Slider image"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                      priority={imageIndex === 0}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Overlay gradient for better text readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Navigation Arrows */}
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
            </>
          )}

          {/* Dots Indicator */}
          {allActiveImages.length > 1 && (
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
          )}
        </Card>
      </div>
    </div>
  );
};
