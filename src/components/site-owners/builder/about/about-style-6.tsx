"use client";

import React from "react";
import { Coffee, Heart, Zap, Box, Lightbulb } from "lucide-react";
import { AboutUs6Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface AboutUsTemplate6Props {
  aboutUsData: AboutUs6Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs6Data>) => void;
  siteUser?: string;
}

export const AboutUsTemplate6: React.FC<AboutUsTemplate6Props> = ({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#FFFFFF",
      primary: "#EF4444",
      primaryForeground: "#FFFFFF",
      secondary: "#9CA3AF",
      secondaryForeground: "#1F2937",
      background: "#111827",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  // Handle stat updates
  const handleStatUpdate =
    (index: number, field: "value" | "label") => (value: string) => {
      const statId = data.stats[index].id;
      handleArrayItemUpdate("stats", statId)({ [field]: value });
    };

  // Handle button link updates
  const handleButtonLinkUpdate = (text: string, href: string) => {
    const update = {
      buttonText: text,
      buttonLink: href,
    };
    onUpdate?.(update);
  };

  // Get icon component based on name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart size={24} />;
      case "Zap":
        return <Zap size={24} className="-rotate-45" />;
      case "Box":
        return <Box size={24} />;
      case "Lightbulb":
        return <Lightbulb size={24} />;
      default:
        return <Coffee size={24} />;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 text-left">
          <div
            className="mb-4 inline-block rounded-xl p-3"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Coffee className="text-white" size={24} />
          </div>
          <EditableText
            value={data.headline}
            onChange={handleTextUpdate("headline")}
            as="h1"
            className="text-3xl leading-tight font-bold text-foreground md:text-4xl lg:text-5xl max-w-4xl"
            isEditable={isEditable}
            placeholder="Brewhaus is where flavor meets craft. From bean to cup, we focus on quality, speed, and simplicity — perfect for busy mornings or laid-back afternoons."
            multiline={true}
          />
        </header>

        {/* Buttons */}
        <div className="mb-16 flex items-center justify-start space-x-4">
          <EditableLink
            text={data.buttonText}
            href={data.buttonLink}
            onChange={handleButtonLinkUpdate}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
            className="rounded-full px-8 py-3 font-medium transition-colors hover:opacity-90"
            isEditable={isEditable}
            textPlaceholder="Our News"
            hrefPlaceholder="#news"
            siteUser={siteUser}
          >
            {data.buttonText || "Our News"}
          </EditableLink>
        </div>

        {/* Stats & Images Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            {/* Stat Card 1 */}
            <div
              className="flex h-full flex-col justify-between rounded-xl p-8 shadow-sm"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              <div className="flex justify-end opacity-50">
                {getIconComponent(data.stats[0].topIcon)}
              </div>
              <div className="my-auto text-left">
                <EditableText
                  value={data.stats[0].value}
                  onChange={handleStatUpdate(0, "value")}
                  as="p"
                  className="text-5xl font-bold"
                  isEditable={isEditable}
                  placeholder="10K+"
                />
                <EditableText
                  value={data.stats[0].label}
                  onChange={handleStatUpdate(0, "label")}
                  as="p"
                  className="mt-2 text-lg font-medium opacity-90"
                  isEditable={isEditable}
                  placeholder="Happy Customers"
                />
              </div>
              <div className="flex justify-start opacity-50">
                {getIconComponent(data.stats[0].bottomIcon)}
              </div>
            </div>

            {/* Image 1 */}
            <div className="h-full overflow-hidden rounded-xl shadow-md">
              <EditableImage
                src={data.image1Url}
                alt={data.image1Alt}
                onImageChange={handleImageUpdate("image1Url", "image1Alt")}
                onAltChange={handleAltUpdate("image1Alt")}
                isEditable={isEditable}
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                width={600}
                height={800}
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 600,
                  height: 800,
                  text: "Upload image 1",
                }}
              />
            </div>
          </div>

          {/* Center Image */}
          <div className="col-span-1 overflow-hidden rounded-xl md:col-span-2 lg:col-span-1 shadow-md">
            <EditableImage
              src={data.centerImageUrl}
              alt={data.centerImageAlt}
              onImageChange={handleImageUpdate(
                "centerImageUrl",
                "centerImageAlt"
              )}
              onAltChange={handleAltUpdate("centerImageAlt")}
              isEditable={isEditable}
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
              width={600}
              height={800}
              cloudinaryOptions={{
                folder: "about-us-images",
                resourceType: "image",
              }}
              showAltEditor={isEditable}
              placeholder={{
                width: 600,
                height: 800,
                text: "Upload center image",
              }}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            {/* Stat Card 2 */}
            <div
              className="flex h-full flex-col justify-between rounded-xl p-8 shadow-sm"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              <div className="flex justify-end opacity-50">
                {getIconComponent(data.stats[1].topIcon)}
              </div>
              <div className="my-auto text-left">
                <EditableText
                  value={data.stats[1].value}
                  onChange={handleStatUpdate(1, "value")}
                  as="p"
                  className="text-5xl font-bold"
                  isEditable={isEditable}
                  placeholder="20"
                />
                <EditableText
                  value={data.stats[1].label}
                  onChange={handleStatUpdate(1, "label")}
                  as="p"
                  className="mt-2 text-lg font-medium opacity-90"
                  isEditable={isEditable}
                  placeholder="Products"
                />
              </div>
              <div className="flex justify-start opacity-50">
                {getIconComponent(data.stats[1].bottomIcon)}
              </div>
            </div>

            {/* Image 2 */}
            <div className="h-full overflow-hidden rounded-xl shadow-md">
              <EditableImage
                src={data.image2Url}
                alt={data.image2Alt}
                onImageChange={handleImageUpdate("image2Url", "image2Alt")}
                onAltChange={handleAltUpdate("image2Alt")}
                isEditable={isEditable}
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                width={600}
                height={800}
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 600,
                  height: 800,
                  text: "Upload image 2",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
