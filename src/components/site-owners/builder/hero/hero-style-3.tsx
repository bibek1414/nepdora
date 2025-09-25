import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";

import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { is } from "zod/v4/locales";

interface HeroTemplate3Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
  siteUser?: string;
}

export const HeroTemplate3: React.FC<HeroTemplate3Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [data, setData] = useState(heroData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

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

  // Handle button text and href updates
  const handleButtonUpdate = (
    buttonId: string,
    text: string,
    href?: string
  ) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId
        ? { ...btn, text, ...(href !== undefined && { href }) }
        : btn
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
    // Use theme background color as default, or data.backgroundColor if specified
    return {
      backgroundColor: data.backgroundColor || theme.colors.background,
    };
  };

  const getImageUrl = () => {
    if (!data.imageUrl) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(data.imageUrl), {
      width: 600,
      quality: "auto",
      format: "auto",
    });
  };

  const textColor =
    data.backgroundType === "image" || data.backgroundColor === "#000000"
      ? "#FFFFFF"
      : theme.colors.text;

  return (
    <section className="relative w-full px-6 py-16 md:px-12 lg:px-20">
      {/* Overlay */}
      {data.backgroundType === "image" && data.showOverlay && (
        <div
          className="absolute inset-0 z-0 bg-black"
          style={{
            opacity: data.overlayOpacity || 0.5,
          }}
        />
      )}

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          {/* Subtitle Badge */}
          {data.subtitle && (
            <Badge
              variant="secondary"
              className="w-fit"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.secondaryForeground,
                fontFamily: theme.fonts.body,
              }}
            >
              <EditableText
                value={data.subtitle}
                onChange={handleTextUpdate("subtitle")}
                as="span"
                isEditable={isEditable}
                placeholder="Enter subtitle..."
              />
            </Badge>
          )}

          {/* Title */}
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h1"
            className="text-4xl leading-tight font-bold md:text-5xl"
            style={{ fontFamily: theme.fonts.heading }}
            isEditable={isEditable}
            placeholder="Enter your hero title..."
            multiline={true}
          />

          {/* Description */}
          {data.description && (
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="max-w-md text-lg opacity-90"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons with theme styling */}
          {data.buttons.length > 0 && (
            <div className="flex items-center gap-4">
              {data.buttons.map((button, index) => (
                <Button
                  key={button.id}
                  size="lg"
                  variant={index === 0 ? "default" : "outline"}
                  className="px-6 py-3"
                  asChild
                >
                  <EditableLink
                    text={button.text}
                    href={button.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate(button.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter button URL..."
                    className="flex items-center gap-2"
                  >
                    {index === 1 && <Play size={18} />}
                    <span>{button.text}</span>
                  </EditableLink>
                </Button>
              ))}
            </div>
          )}

          {/* Users Stats */}
          <div className="mt-4 flex items-center gap-3">
            <EditableText
              value="12k+"
              onChange={handleTextUpdate("subtitle")}
              as="span"
              className="font-medium"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
            />
            <EditableText
              value="Used by teams and professionals."
              onChange={handleTextUpdate("subtitle")}
              as="span"
              className="font-normal opacity-75"
              style={{ fontFamily: theme.fonts.body }}
              isEditable={isEditable}
              placeholder="Add stats description..."
            />
          </div>
        </div>

        {/* Right Side Image/Illustration */}
        <div className="relative flex justify-center">
          {data.showImage && data.imageUrl ? (
            <div className="relative w-full max-w-md">
              <div
                className="rounded-2xl border p-6 shadow-xl backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme.colors.background}1a`,
                  borderColor: `${theme.colors.primary}33`,
                }}
              >
                <EditableImage
                  src={getImageUrl()}
                  alt={data.imageAlt || "Hero image"}
                  onImageChange={handleImageUpdate}
                  onAltChange={handleAltUpdate}
                  isEditable={isEditable}
                  className="h-96 w-full rounded-lg object-contain"
                  width={500}
                  height={500}
                  cloudinaryOptions={{
                    folder: "hero-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 500,
                    height: 500,
                    text: "Upload hero image",
                  }}
                />

                {/* Balance Badge - Editable */}
                {data.showBalanceBadge !== false && (
                  <div
                    className="absolute top-4 right-4 rounded-lg px-4 py-2 text-sm"
                    style={{
                      backgroundColor: theme.colors.text,
                      color: theme.colors.background,
                    }}
                  >
                    <EditableText
                      value={data.balanceLabel || "My current balance"}
                      onChange={handleTextUpdate("balanceLabel")}
                      as="div"
                      isEditable={isEditable}
                      placeholder="Balance label..."
                      className="text-xs text-black"
                      style={{ fontFamily: theme.fonts.body }}
                    />
                    <EditableText
                      value={data.balanceAmount || "$90,438.40"}
                      onChange={handleTextUpdate("balanceAmount")}
                      as="span"
                      isEditable={isEditable}
                      placeholder="Balance amount..."
                      className="font-bold text-black"
                      style={{ fontFamily: theme.fonts.body }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-md">
              <div
                className="flex h-96 items-center justify-center rounded-2xl border p-6 shadow-xl backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme.colors.background}1a`,
                  borderColor: `${theme.colors.primary}33`,
                }}
              >
                <EditableImage
                  src=""
                  alt="Hero illustration"
                  onImageChange={handleImageUpdate}
                  onAltChange={handleAltUpdate}
                  isEditable={isEditable}
                  className="h-full w-full rounded-lg object-contain"
                  width={500}
                  height={500}
                  cloudinaryOptions={{
                    folder: "hero-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 500,
                    height: 500,
                    text: "Upload hero image",
                  }}
                />

                {/* Balance Badge - Editable */}
                {data.showBalanceBadge !== false && (
                  <div
                    className="absolute top-4 right-4 rounded-lg px-4 py-2 text-sm"
                    style={{
                      backgroundColor: theme.colors.text,
                      color: theme.colors.background,
                    }}
                  >
                    <EditableText
                      value={data.balanceLabel || "🇺🇸 My current balance"}
                      onChange={handleTextUpdate("balanceLabel")}
                      as="div"
                      isEditable={isEditable}
                      placeholder="Balance label..."
                      className="text-xs"
                      style={{ fontFamily: theme.fonts.body }}
                    />
                    <EditableText
                      value={data.balanceAmount || "$90,438.40"}
                      onChange={handleTextUpdate("balanceAmount")}
                      as="span"
                      isEditable={isEditable}
                      placeholder="Balance amount..."
                      className="font-bold"
                      style={{ fontFamily: theme.fonts.body }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
