import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

interface HeroTemplate2Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate2: React.FC<HeroTemplate2Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState(heroData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle button text updates
  const handleButtonUpdate = (buttonId: string, text: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  // Handle slider image updates
  const handleSliderImageUpdate = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const updatedSliderImages = data.sliderImages.map((img, idx) =>
      idx === index ? { ...img, url: imageUrl, alt: altText || img.alt } : img
    );
    const updatedData = { ...data, sliderImages: updatedSliderImages };
    setData(updatedData);
    onUpdate?.({ sliderImages: updatedSliderImages });
  };

  const getBackgroundStyles = (): React.CSSProperties => {
    if (data.backgroundType === "image" && data.backgroundImageUrl) {
      const imageUrl = optimizeCloudinaryUrl(
        convertUnsplashUrl(data.backgroundImageUrl),
        { width: 1920, quality: "auto", format: "auto" }
      );
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (data.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${data.gradientFrom}, ${data.gradientTo})`,
      };
    }
    return { backgroundColor: data.backgroundColor };
  };

  const getLayoutClasses = () => {
    let classes = "flex-1 ";
    switch (data.layout) {
      case "text-left":
        classes += "text-left items-start";
        break;
      case "text-right":
        classes += "text-right items-end";
        break;
      default:
        classes += "text-center items-center";
        break;
    }
    return classes;
  };

  const getSliderImageUrl = (url: string) => {
    return optimizeCloudinaryUrl(convertUnsplashUrl(url), {
      width: 600,
      height: 400,
      quality: "auto",
      format: "auto",
      crop: "fill",
    });
  };

  const nextSlide = () => {
    if (data.sliderImages.length > 0) {
      setCurrentSlide(prev => (prev + 1) % data.sliderImages.length);
    }
  };

  const prevSlide = () => {
    if (data.sliderImages.length > 0) {
      setCurrentSlide(prev =>
        prev === 0 ? data.sliderImages.length - 1 : prev - 1
      );
    }
  };

  // Auto-slide effect
  React.useEffect(() => {
    if (data.showSlider && data.sliderImages.length > 1) {
      const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [data.showSlider, data.sliderImages.length]);

  return (
    <section
      className="relative flex min-h-[60vh] w-full items-end p-8 md:p-16"
      style={getBackgroundStyles()}
    >
      {/* Overlay */}
      {data.backgroundType === "image" && data.showOverlay && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: data.overlayColor,
            opacity: data.overlayOpacity,
          }}
        />
      )}

      <div
        className="relative z-10 container mx-auto flex max-w-7xl items-end gap-8"
        style={{ color: data.textColor }}
      >
        {/* Content */}
        <div className={`flex flex-col gap-4 ${getLayoutClasses()}`}>
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="text-4xl leading-tight font-bold drop-shadow-md md:text-6xl"
            isEditable={isEditable}
            placeholder="Enter your hero title..."
          />

          <EditableText
            value={data.subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="p"
            className="max-w-2xl text-lg drop-shadow-sm md:text-xl"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
          />

          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-md max-w-2xl opacity-90 drop-shadow-sm"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            {data.buttons.map(btn => (
              <Button
                key={btn.id}
                variant={btn.variant === "primary" ? "default" : btn.variant}
                size="lg"
                asChild
              >
                <a href={btn.href || "#"}>
                  <EditableText
                    value={btn.text}
                    onChange={value => handleButtonUpdate(btn.id, value)}
                    as="span"
                    isEditable={isEditable}
                    placeholder="Button text..."
                  />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Image Slider */}
        {data.showSlider && data.sliderImages.length > 0 && (
          <div className="relative hidden w-1/3 lg:block">
            <div className="relative overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {data.sliderImages.map((img, index) => (
                  <div
                    className="flex w-full flex-shrink-0 flex-grow-0 justify-center"
                    key={img.id}
                  >
                    <EditableImage
                      src={getSliderImageUrl(img.url)}
                      alt={img.alt}
                      onImageChange={(imageUrl, altText) =>
                        handleSliderImageUpdate(index, imageUrl, altText)
                      }
                      onAltChange={altText => {
                        const updatedSliderImages = data.sliderImages.map(
                          (sliderImg, idx) =>
                            idx === index
                              ? { ...sliderImg, alt: altText }
                              : sliderImg
                        );
                        const updatedData = {
                          ...data,
                          sliderImages: updatedSliderImages,
                        };
                        setData(updatedData);
                        onUpdate?.({ sliderImages: updatedSliderImages });
                      }}
                      isEditable={isEditable}
                      className="h-64 w-full object-cover"
                      width={600}
                      height={400}
                      cloudinaryOptions={{
                        folder: "hero-slider-images",
                        resourceType: "image",
                      }}
                      showAltEditor={isEditable}
                      placeholder={{
                        width: 600,
                        height: 400,
                        text: `Upload slide ${index + 1}`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            {data.sliderImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 absolute top-1/2 left-2 z-10 -translate-y-1/2 backdrop-blur-sm"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 absolute top-1/2 right-2 z-10 -translate-y-1/2 backdrop-blur-sm"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                  {data.sliderImages.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
