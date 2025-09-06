import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
interface HeroTemplate1Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate1: React.FC<HeroTemplate1Props> = ({
  heroData,
  siteUser,
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
  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };
  const getButtonClasses = (variant: string) => {
    const baseClasses =
      "inline-block px-6 py-3 rounded-lg font-medium transition-colors min-w-[120px] text-center";

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
      case "default":
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
      case "secondary":
        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
      case "outline":
        return `${baseClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
      case "ghost":
        return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
      case "link":
        return `${baseClasses} text-primary underline-offset-4 hover:underline px-0`;
      default:
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
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
                <EditableLink
                  key={button.id}
                  text={button.text || "Button text"}
                  href={button.href || "#"}
                  onChange={(text, href) =>
                    handleButtonUpdate(button.id, text, href)
                  }
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className={getButtonClasses(button.variant)}
                  textPlaceholder="Button text..."
                  hrefPlaceholder="Enter URL (e.g., about-us, contact)..."
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
