import React, { useState, useEffect } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface BannerTemplateProps {
  bannerData: BannerData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate4: React.FC<BannerTemplateProps> = ({
  bannerData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [data, setData] = useState(bannerData);
  const [isPlaying, setIsPlaying] = useState(true);

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

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying || data.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % data.images.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [data.images.length, isPlaying]);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % data.images.length);
    setIsPlaying(false); // Pause auto-play when manually navigating
    setTimeout(() => setIsPlaying(true), 5000); // Resume after 5 seconds
  };

  const prevImage = () => {
    setCurrentImageIndex(
      prev => (prev - 1 + data.images.length) % data.images.length
    );
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 5000);
  };

  const currentImage = data.images[currentImageIndex];

  if (!currentImage) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">No banner images available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Banner Card */}
      <Card className="group relative overflow-hidden shadow-lg">
        <div className="relative h-64 w-full md:h-80 lg:h-96">
          {/* Main Image */}
          <div className="absolute inset-0">
            <Image
              src={
                typeof currentImage?.image === "string"
                  ? currentImage.image
                  : URL.createObjectURL(currentImage.image)
              }
              alt={currentImage?.image_alt_description || ""}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end p-6">
            <div className="w-full text-white">
              <EditableText
                value={data.title || `Featured Banner ${currentImageIndex + 1}`}
                onChange={handleTextUpdate("title")}
                as="h2"
                className="mb-2 text-2xl font-bold md:text-3xl"
                isEditable={isEditable}
                placeholder="Enter banner title..."
              />
              {data.subtitle && (
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="p"
                  className="mb-3 text-sm opacity-90 md:text-base"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              )}
              {currentImage.link && (
                <EditableLink
                  text="View Details"
                  href={currentImage.link}
                  onChange={(text, href) =>
                    handleLinkUpdate(currentImageIndex, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                />
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {data.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 text-gray-800 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white"
                onClick={prevImage}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 text-gray-800 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white"
                onClick={nextImage}
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </>
          )}

          {/* Play/Pause Indicator */}
          <div className="absolute top-4 right-4">
            <div
              className={`h-2 w-2 rounded-full ${
                isPlaying ? "bg-green-500" : "bg-yellow-500"
              }`}
              title={isPlaying ? "Auto-playing" : "Paused"}
            />
          </div>
        </div>
      </Card>

      {/* Thumbnail Navigation */}
      {data.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {data.images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`group relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                index === currentImageIndex
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300"
              }`}
            >
              <div className="relative h-16 w-24 md:h-20 md:w-32">
                <Image
                  src={
                    typeof image.image === "string"
                      ? image.image
                      : URL.createObjectURL(image.image)
                  }
                  alt={image.image_alt_description || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 96px, 128px"
                />
                {index !== currentImageIndex && (
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10" />
                )}

                {/* Thumbnail Index */}
                <div className="absolute right-1 bottom-1 rounded bg-black/50 px-1 text-xs text-white">
                  {index + 1}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isPlaying && data.images.length > 1 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{
              width: `${((currentImageIndex + 1) / data.images.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};
