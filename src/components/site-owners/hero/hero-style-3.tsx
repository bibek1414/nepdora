import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

interface HeroTemplate3Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate3: React.FC<HeroTemplate3Props> = ({
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
      className="relative w-full px-6 py-16 md:px-12 lg:px-20"
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

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          {/* Subtitle Badge */}
          {data.subtitle && (
            <Badge variant="secondary" className="w-fit">
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
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          )}

          {/* Buttons */}
          {data.buttons.length > 0 && (
            <div className="flex items-center gap-4">
              {data.buttons.map((button, index) => (
                <Button
                  key={button.id}
                  variant={
                    index === 0
                      ? "default"
                      : button.variant === "primary"
                        ? "default"
                        : button.variant === "outline"
                          ? "outline"
                          : "secondary"
                  }
                  size="lg"
                  className={
                    index === 0
                      ? "rounded-full px-6 py-3"
                      : "rounded-full border px-6 py-3"
                  }
                  asChild
                >
                  <a
                    href={button.href || "#"}
                    className="flex items-center gap-2"
                  >
                    {index === 1 && <Play size={18} />}
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

          {/* Users Stats */}
          <div className="mt-4 flex items-center gap-3">
            <EditableText
              value="12k+"
              onChange={() => {}} // You might want to make this editable too
              as="span"
              className="font-medium"
              isEditable={false}
            />
            <EditableText
              value="Used by teams and professionals."
              onChange={handleTextUpdate("subtitle")}
              as="span"
              className="font-normal opacity-75"
              isEditable={isEditable}
              placeholder="Add stats description..."
            />
          </div>

          {/* Company Logos - Placeholder */}
          <div className="mt-8 flex flex-wrap items-center gap-8 opacity-50">
            <div className="h-8 w-20 rounded bg-current opacity-20"></div>
            <div className="h-8 w-20 rounded bg-current opacity-20"></div>
            <div className="h-8 w-20 rounded bg-current opacity-20"></div>
            <div className="h-8 w-20 rounded bg-current opacity-20"></div>
            <div className="h-8 w-20 rounded bg-current opacity-20"></div>
          </div>
        </div>

        {/* Right Side Image/Illustration */}
        <div className="relative flex justify-center">
          {data.showImage && data.imageUrl ? (
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl border bg-gray-50/10 p-6 shadow-xl backdrop-blur-sm">
                <EditableImage
                  src={getImageUrl()}
                  alt={data.imageAlt}
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
                  <div className="absolute top-4 right-4 rounded-lg bg-black px-4 py-2 text-sm text-white">
                    <EditableText
                      value={data.balanceLabel || "🇺🇸 My current balance"}
                      onChange={handleTextUpdate("balanceLabel")}
                      as="div"
                      isEditable={isEditable}
                      placeholder="Balance label..."
                      className="text-xs"
                    />
                    <EditableText
                      value={data.balanceAmount || "$90,438.40"}
                      onChange={handleTextUpdate("balanceAmount")}
                      as="span"
                      isEditable={isEditable}
                      placeholder="Balance amount..."
                      className="font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-md">
              <div className="flex h-96 items-center justify-center rounded-2xl border bg-gray-50/10 p-6 shadow-xl backdrop-blur-sm">
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
                  <div className="absolute top-4 right-4 rounded-lg bg-black px-4 py-2 text-sm text-white">
                    <EditableText
                      value={data.balanceLabel || "🇺🇸 My current balance"}
                      onChange={handleTextUpdate("balanceLabel")}
                      as="div"
                      isEditable={isEditable}
                      placeholder="Balance label..."
                      className="text-xs"
                    />
                    <EditableText
                      value={data.balanceAmount || "$90,438.40"}
                      onChange={handleTextUpdate("balanceAmount")}
                      as="span"
                      isEditable={isEditable}
                      placeholder="Balance amount..."
                      className="font-bold"
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
