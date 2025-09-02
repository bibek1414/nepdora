import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

interface HeroTemplate1Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate1: React.FC<HeroTemplate1Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(heroData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
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
    switch (data.layout) {
      case "text-left":
        return "text-left items-start";
      case "text-right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  const getImageUrl = () => {
    if (!data.imageUrl) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(data.imageUrl), {
      width: 600,
      quality: "auto",
      format: "auto",
    });
  };

  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-20"
      style={{ ...getBackgroundStyles(), color: data.textColor }}
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

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className={`flex flex-col ${getLayoutClasses()} gap-6`}>
          {/* Hero Image */}
          {data.showImage && data.imageUrl && (
            <div className="mb-6">
              <EditableImage
                src={getImageUrl()}
                alt={data.imageAlt}
                onImageChange={handleImageUpdate}
                onAltChange={handleAltUpdate}
                isEditable={isEditable}
                className="mx-auto max-w-md rounded-lg"
                width={600}
                height={400}
                cloudinaryOptions={{
                  folder: "hero-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 600,
                  height: 400,
                  text: "Upload hero image",
                }}
              />
            </div>
          )}

          {/* Subtitle Badge */}
          {data.subtitle && (
            <div className="w-fit">
              <Badge variant="secondary">
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </Badge>
            </div>
          )}

          {/* Title */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="drop- text-4xl leading-tight font-bold md:text-6xl"
            isEditable={isEditable}
            placeholder="Enter your hero title..."
          />

          {/* Description */}
          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="drop- max-w-2xl text-lg leading-relaxed opacity-90 md:text-xl"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons */}
          {data.buttons.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {data.buttons.map(button => (
                <Button
                  key={button.id}
                  variant={
                    button.variant === "primary" ? "default" : button.variant
                  }
                  size="lg"
                  className="min-w-[120px]"
                  asChild
                >
                  <a href={button.href || "#"}>
                    <EditableText
                      value={button.text}
                      onChange={value => handleButtonUpdate(button.id, value)}
                      as="span"
                      isEditable={isEditable}
                      placeholder="Button text..."
                    />
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
