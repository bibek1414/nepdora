"use client";
import React from "react";
import { AboutUs1Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

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
  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
  } = useBuilderLogic(aboutUsData, onUpdate);

  // Handle stats updates
  const handleStatsUpdate =
    (statId: string, field: "value" | "label") => (value: string) => {
      handleArrayItemUpdate("stats", statId)({ [field]: value });
    };

  return (
    <section className="bg-background py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
            data.layout === "image-left" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Content Section */}
          <div
            className={`flex flex-col gap-6 items-start text-left ${
              data.layout === "image-left" ? "lg:col-start-2" : ""
            }`}
          >
            {/* Subtitle with accent */}
            {data.subtitle && (
              <div className="flex items-center gap-3">
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="p"
                  className="text-sm font-semibold tracking-wider uppercase text-primary"
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
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground"
              isEditable={isEditable}
              placeholder="Enter main title..."
            />

            {/* Description */}
            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-lg text-muted-foreground leading-relaxed sm:text-xl"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />

            {/* Stats Grid */}
            {data.stats && data.stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-8 border-t pt-8 sm:grid-cols-3 w-full">
                {data.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="group relative space-y-1 text-left"
                  >
                    <EditableText
                      value={stat.value}
                      onChange={handleStatsUpdate(stat.id, "value")}
                      as="p"
                      className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground"
                      isEditable={isEditable}
                      placeholder="Value"
                    />
                    <EditableText
                      value={stat.label}
                      onChange={handleStatsUpdate(stat.id, "label")}
                      as="p"
                      className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
                      isEditable={isEditable}
                      placeholder="Label"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div
            className={`relative w-full ${
              data.layout === "image-left" ? "lg:col-start-1" : ""
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt || data.title}
                onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                onAltChange={handleAltUpdate("imageAlt")}
                isEditable={isEditable}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                width={800}
                height={600}
                priority
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
                placeholder={{
                  width: 800,
                  height: 600,
                  text: "Upload your about us image",
                }}
              />
            </div>

            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-2xl bg-muted/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
