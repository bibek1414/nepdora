"use client";
import React, { useState } from "react";
import { AboutUs1Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";

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
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20 lg:gap-24 ${
            data.layout === "image-left" ? "md:grid-flow-col-dense" : ""
          }`}
        >
          {/* Content Section */}
          <div
            className={`space-y-6 ${
              data.layout === "image-left" ? "md:col-start-2" : ""
            }`}
          >
            {/* Subtitle with accent */}
            {data.subtitle && (
              <div className="flex items-center gap-3">
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="p"
                  className="text-sm font-semibold tracking-wider uppercase"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </div>
            )}

            {/* Main Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="text-foreground mb-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
              isEditable={isEditable}
              placeholder="Enter main title..."
            />

            {/* Description */}
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-muted-foreground text-base leading-relaxed sm:text-lg md:text-xl"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />

            {/* Stats Grid */}
            {data.stats && data.stats.length > 0 && (
              <div className="border-border mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-3">
                {data.stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="group relative space-y-1 text-left transition-opacity hover:opacity-90"
                  >
                    <EditableText
                      value={stat.value}
                      onChange={handleStatsUpdate(stat.id, "value")}
                      as="p"
                      className="text-foreground text-3xl leading-none font-bold sm:text-4xl md:text-5xl"
                      isEditable={isEditable}
                      placeholder="Value"
                    />
                    <EditableText
                      value={stat.label}
                      onChange={handleStatsUpdate(stat.id, "label")}
                      as="p"
                      className="text-muted-foreground text-xs font-medium tracking-wider uppercase sm:text-sm"
                      isEditable={isEditable}
                      placeholder="Label"
                    />
                    {index < data.stats.length - 1 && (
                      <div className="bg-border absolute top-0 -right-3 hidden h-full w-px sm:block" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div
            className={`relative ${
              data.layout === "image-left" ? "md:col-start-1" : ""
            }`}
          >
            <div className="hover:shadow-3xl relative aspect-4/3 w-full overflow-hidden rounded-2xl shadow-2xl transition-shadow duration-300">
              {/* Decorative gradient overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-transparent via-transparent to-black/5" />

              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt || data.title}
                onImageChange={handleImageUpdate}
                onAltChange={handleAltUpdate}
                isEditable={isEditable}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
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

            {/* Decorative element */}
            <div className="bg-primary/5 absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
