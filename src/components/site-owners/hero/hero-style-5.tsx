import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

interface HeroTemplate5Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate5: React.FC<HeroTemplate5Props> = ({
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

  // Handle secondary image update
  const handleSecondaryImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      secondaryImageUrl: imageUrl,
      secondaryImageAlt: altText || data.secondaryImageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      secondaryImageUrl: imageUrl,
      secondaryImageAlt: updatedData.secondaryImageAlt,
    });
  };

  // Handle badge updates
  const handleBadgeUpdate = (badgeIndex: number, text: string) => {
    const updatedBadges = [...(data.badges || [])];
    updatedBadges[badgeIndex] = { ...updatedBadges[badgeIndex], text };
    const updatedData = { ...data, badges: updatedBadges };
    setData(updatedData);
    onUpdate?.({ badges: updatedBadges });
  };

  // Handle stats updates
  const handleStatUpdate =
    (field: "statsNumber" | "statsLabel") => (value: string) => {
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

  const getOptimizedImageUrl = (url: string, width: number = 600) => {
    if (!url) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(url), {
      width,
      quality: "auto",
      format: "auto",
    });
  };

  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      {/* Left Image Section */}
      <div className="relative h-[500px] overflow-hidden rounded-2xl lg:h-auto">
        {data.showImage && data.imageUrl ? (
          <EditableImage
            src={getOptimizedImageUrl(data.imageUrl, 800)}
            alt={data.imageAlt || "Developer working"}
            onImageChange={handleImageUpdate}
            onAltChange={altText => {
              const updatedData = { ...data, imageAlt: altText };
              setData(updatedData);
              onUpdate?.({ imageAlt: altText });
            }}
            isEditable={isEditable}
            className="h-full w-full object-cover"
            cloudinaryOptions={{
              folder: "hero-images",
              resourceType: "image",
            }}
            showAltEditor={isEditable}
            placeholder={{
              width: 800,
              height: 500,
              text: "Upload main image",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            {isEditable && (
              <EditableImage
                src=""
                alt="Upload main image"
                onImageChange={handleImageUpdate}
                onAltChange={altText => {
                  const updatedData = { ...data, imageAlt: altText };
                  setData(updatedData);
                  onUpdate?.({ imageAlt: altText });
                }}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                cloudinaryOptions={{
                  folder: "hero-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 800,
                  height: 500,
                  text: "Upload main image",
                }}
              />
            )}
          </div>
        )}

        {/* Overlay Card */}
        <div className="absolute bottom-6 left-6 max-w-xs rounded-xl bg-black/50 p-6 text-white backdrop-blur-sm">
          {data.badges && data.badges[0] && (
            <button className="mb-3 rounded-full border border-white/30 bg-white/20 px-4 py-1 text-sm">
              <EditableText
                value={data.badges[0].text || "Build Products"}
                onChange={value => handleBadgeUpdate(0, value)}
                as="span"
                isEditable={isEditable}
                placeholder="Badge text..."
              />
            </button>
          )}
          <h2 className="text-lg leading-snug font-medium">
            <EditableText
              value={
                data.overlayTitle ||
                "Convert your innovative ideas into powerful products"
              }
              onChange={handleTextUpdate("overlayTitle")}
              as="span"
              isEditable={isEditable}
              placeholder="Overlay title..."
              multiline
            />
          </h2>
        </div>
      </div>

      {/* Right Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top Card */}
        <div className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          {data.badges && data.badges[1] && (
            <button className="mb-3 rounded-full border bg-gray-100 px-4 py-1 text-sm">
              <EditableText
                value={data.badges[1].text || "Faster Workflow"}
                onChange={value => handleBadgeUpdate(1, value)}
                as="span"
                isEditable={isEditable}
                placeholder="Badge text..."
              />
            </button>
          )}
          <h3 className="text-xl font-semibold text-gray-900">
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="span"
              isEditable={isEditable}
              placeholder="Main title..."
            />
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="span"
              isEditable={isEditable}
              placeholder="Description..."
              multiline
            />
          </p>
        </div>

        {/* Bottom Left Card */}
        <div className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm">
          {data.secondaryImageUrl ? (
            <EditableImage
              src={getOptimizedImageUrl(data.secondaryImageUrl, 300)}
              alt={data.secondaryImageAlt || "Platform stack"}
              onImageChange={handleSecondaryImageUpdate}
              onAltChange={altText => {
                const updatedData = { ...data, secondaryImageAlt: altText };
                setData(updatedData);
                onUpdate?.({ secondaryImageAlt: altText });
              }}
              isEditable={isEditable}
              className="rounded-lg"
              width={300}
              height={200}
              cloudinaryOptions={{
                folder: "hero-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
              placeholder={{
                width: 300,
                height: 200,
                text: "Upload secondary image",
              }}
            />
          ) : (
            <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
              {isEditable && (
                <EditableImage
                  src=""
                  alt="Upload secondary image"
                  onImageChange={handleSecondaryImageUpdate}
                  onAltChange={altText => {
                    const updatedData = { ...data, secondaryImageAlt: altText };
                    setData(updatedData);
                    onUpdate?.({ secondaryImageAlt: altText });
                  }}
                  isEditable={isEditable}
                  className="rounded-lg"
                  width={300}
                  height={200}
                  cloudinaryOptions={{
                    folder: "hero-images",
                    resourceType: "image",
                  }}
                  showAltEditor={isEditable}
                  placeholder={{
                    width: 300,
                    height: 200,
                    text: "Upload secondary image",
                  }}
                />
              )}
            </div>
          )}
          <h3 className="mt-4 text-lg font-semibold">
            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="span"
              isEditable={isEditable}
              placeholder="Subtitle..."
              multiline
            />
          </h3>
        </div>

        {/* Bottom Right Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-6 text-center shadow-sm">
          <h3 className="text-4xl font-bold text-gray-900">
            <EditableText
              value={data.statsNumber || "598+"}
              onChange={handleStatUpdate("statsNumber")}
              as="span"
              isEditable={isEditable}
              placeholder="598+"
            />
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            <EditableText
              value={
                data.statsLabel || "Apps built on the most secure platform"
              }
              onChange={handleStatUpdate("statsLabel")}
              as="span"
              isEditable={isEditable}
              placeholder="Stats description..."
              multiline
            />
          </p>
          {data.buttons.length > 0 && (
            <Button className="mt-4 rounded-full border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100">
              <EditableText
                value={data.buttons[0].text}
                onChange={value =>
                  handleButtonUpdate(data.buttons[0].id, value)
                }
                as="span"
                isEditable={isEditable}
                placeholder="Button text..."
              />
              {" →"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
