import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface HeroTemplate1Props {
  heroData: HeroData;
}

export const HeroTemplate1: React.FC<HeroTemplate1Props> = ({ heroData }) => {
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
    switch (heroData.layout) {
      case "text-left":
        return "text-left items-start";
      case "text-right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  const getImageUrl = () => {
    if (!heroData.imageUrl) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(heroData.imageUrl), {
      width: 600,
      quality: "auto",
      format: "auto",
    });
  };

  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-20"
      style={{ ...getBackgroundStyles(), color: heroData.textColor }}
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

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className={`flex flex-col ${getLayoutClasses()} gap-6`}>
          {/* Hero Image */}
          {heroData.showImage && heroData.imageUrl && (
            <div className="mb-6">
              <img
                src={getImageUrl()}
                alt={heroData.imageAlt}
                className="mx-auto max-w-md rounded-lg shadow-lg"
                onError={e => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80";
                }}
              />
            </div>
          )}

          {/* Subtitle Badge */}
          {heroData.subtitle && (
            <Badge variant="secondary" className="w-fit">
              {heroData.subtitle}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl leading-tight font-bold drop-shadow-md md:text-6xl">
            {heroData.title}
          </h1>

          {/* Description */}
          {heroData.description && (
            <p className="max-w-2xl text-lg leading-relaxed opacity-90 drop-shadow-sm md:text-xl">
              {heroData.description}
            </p>
          )}

          {/* Buttons */}
          {heroData.buttons.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {heroData.buttons.map(button => (
                <Button
                  key={button.id}
                  variant={
                    button.variant === "primary" ? "default" : button.variant
                  }
                  size="lg"
                  className="min-w-[120px]"
                  asChild
                >
                  <a href={button.href || "#"}>{button.text}</a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
