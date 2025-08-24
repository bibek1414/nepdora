import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface HeroTemplate2Props {
  heroData: HeroData;
}

export const HeroTemplate2: React.FC<HeroTemplate2Props> = ({ heroData }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const getBackgroundStyles = (): React.CSSProperties => {
    if (heroData.backgroundType === "image" && heroData.backgroundImageUrl) {
      const imageUrl = optimizeCloudinaryUrl(
        convertUnsplashUrl(heroData.backgroundImageUrl),
        { width: 1920, quality: "auto", format: "auto" }
      );
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (heroData.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${heroData.gradientFrom}, ${heroData.gradientTo})`,
      };
    }
    return { backgroundColor: heroData.backgroundColor };
  };

  const getLayoutClasses = () => {
    let classes = "flex-1 ";
    switch (heroData.layout) {
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
    if (heroData.sliderImages.length > 0) {
      setCurrentSlide(prev => (prev + 1) % heroData.sliderImages.length);
    }
  };

  const prevSlide = () => {
    if (heroData.sliderImages.length > 0) {
      setCurrentSlide(prev =>
        prev === 0 ? heroData.sliderImages.length - 1 : prev - 1
      );
    }
  };

  // Auto-slide effect
  React.useEffect(() => {
    if (heroData.showSlider && heroData.sliderImages.length > 1) {
      const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroData.showSlider, heroData.sliderImages.length]);

  return (
    <section
      className="relative flex min-h-[80vh] w-full items-end p-8 md:p-16"
      style={getBackgroundStyles()}
    >
      {/* Overlay */}
      {heroData.backgroundType === "image" && heroData.showOverlay && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: heroData.overlayColor,
            opacity: heroData.overlayOpacity,
          }}
        />
      )}

      <div
        className="relative z-10 container mx-auto flex max-w-7xl items-end gap-8"
        style={{ color: heroData.textColor }}
      >
        {/* Content */}
        <div className={`flex flex-col gap-4 ${getLayoutClasses()}`}>
          <h1 className="text-4xl leading-tight font-bold drop-shadow-md md:text-6xl">
            {heroData.title}
          </h1>

          <p className="max-w-2xl text-lg drop-shadow-sm md:text-xl">
            {heroData.subtitle}
          </p>

          {heroData.description && (
            <p className="text-md max-w-2xl opacity-90 drop-shadow-sm">
              {heroData.description}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            {heroData.buttons.map(btn => (
              <Button
                key={btn.id}
                variant={btn.variant === "primary" ? "default" : btn.variant}
                size="lg"
                asChild
              >
                <a href={btn.href || "#"}>{btn.text}</a>
              </Button>
            ))}
          </div>
        </div>

        {/* Image Slider */}
        {heroData.showSlider && heroData.sliderImages.length > 0 && (
          <div className="relative hidden w-1/3 lg:block">
            <div className="relative overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroData.sliderImages.map(img => (
                  <div
                    className="flex w-full flex-shrink-0 flex-grow-0 justify-center"
                    key={img.id}
                  >
                    <img
                      src={getSliderImageUrl(img.url)}
                      alt={img.alt}
                      className="h-64 w-full object-cover"
                      onError={e => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&q=80";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            {heroData.sliderImages.length > 1 && (
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
                  {heroData.sliderImages.map((_, index) => (
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
