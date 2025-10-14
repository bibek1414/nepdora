"use client";
import React, { useState } from "react";
import { AboutUs1Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate1Props {
  aboutUsData: AboutUs1Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs1Data>) => void;
}

export function AboutUsTemplate1({
  aboutUsData,
  isEditable = false,
  onUpdate,
}: AboutUsTemplate1Props) {
  const [data, setData] = useState(aboutUsData);
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
  const handleTextUpdate = (field: keyof AboutUs1Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs1Data>);
  };

  // Handle stats updates
  const handleStatsUpdate =
    (statId: string, field: "value" | "label") => (value: string) => {
      const updatedStats = data.stats.map(stat =>
        stat.id === statId ? { ...stat, [field]: value } : stat
      );
      const updatedData = { ...data, stats: updatedStats };
      setData(updatedData);
      onUpdate?.({ stats: updatedStats });
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

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div
          className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16 ${
            data.layout === "image-left" ? "md:grid-flow-col-dense" : ""
          }`}
        >
          {/* Content Section */}
          <div
            className={`${data.layout === "image-left" ? "md:col-start-2" : ""}`}
          >
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
              className="text-foreground mb-3 text-3xl font-bold md:text-4xl"
              isEditable={isEditable}
              placeholder="Enter main title..."
            />

            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="p"
              style={{
                color: theme.colors.secondary,
                fontFamily: theme.fonts.heading,
              }}
              className="text-primary mb-4 text-lg font-semibold"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
            />

            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-muted-foreground leading-relaxed"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {data.stats.map(stat => (
                <div key={stat.id} className="text-left">
                  <EditableText
                    value={stat.value}
                    onChange={handleStatsUpdate(stat.id, "value")}
                    as="p"
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.heading,
                    }}
                    className="text-primary text-4xl font-bold"
                    isEditable={isEditable}
                    placeholder="Value"
                  />
                  <EditableText
                    value={stat.label}
                    onChange={handleStatsUpdate(stat.id, "label")}
                    as="p"
                    className="text-muted-foreground text-sm tracking-wider uppercase"
                    isEditable={isEditable}
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div
            className={`${data.layout === "image-left" ? "md:col-start-1" : ""}`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt || data.title}
                onImageChange={handleImageUpdate}
                onAltChange={handleAltUpdate}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={600}
                height={450}
                priority
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 600,
                  height: 450,
                  text: "Upload your about us image",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
