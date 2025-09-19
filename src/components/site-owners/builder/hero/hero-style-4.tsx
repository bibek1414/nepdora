"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { HeroData } from "@/types/owner-site/components/hero";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface HeroTemplate4Props {
  heroData: HeroData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
}

export const HeroTemplate4: React.FC<HeroTemplate4Props> = ({
  heroData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(heroData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors, fallback to defaults if not available
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#111827",
      primary: "#1E40AF",
      secondary: "#FACC15",
      background: "#FFFFFF",
    },
  };

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle main image updates
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

  // Handle secondary image updates (for floor lamp)
  const handleSecondaryImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      secondaryImageUrl: imageUrl,
      secondaryImageAlt: altText || data.secondaryImageAlt || "Decorative item",
    };
    setData(updatedData);
    onUpdate?.({
      secondaryImageUrl: imageUrl,
      secondaryImageAlt: updatedData.secondaryImageAlt,
    });
  };

  // Handle button updates
  const handleButtonUpdate = (buttonId: string, text: string, href: string) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, text, href } : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #f8fafc 100%)`,
      }}
    >
      {/* Hero Section */}
      <main className="relative px-6 py-12 lg:px-12">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Main Title */}
              <div className="space-y-2">
                <EditableText
                  value={data.title}
                  onChange={handleTextUpdate("title")}
                  as="h1"
                  className="text-5xl leading-tight font-bold text-balance lg:text-7xl"
                  style={{ color: theme.colors.text }}
                  isEditable={isEditable}
                  placeholder="Enter main title..."
                />
                {/* Highlighted word - part of subtitle */}
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="div"
                  className="text-5xl leading-tight font-bold lg:text-7xl"
                  style={{ color: theme.colors.secondary }}
                  isEditable={isEditable}
                  placeholder="Highlighted text..."
                />
              </div>

              {/* Description */}
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="max-w-md text-lg leading-relaxed"
                style={{ color: "#6B7280" }}
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
              {/* CTA Button - Alternative approach */}
              {data.buttons.length > 0 && (
                <div className="pt-4">
                  <div className="group inline-flex items-center gap-2">
                    <EditableLink
                      text={data.buttons[0]?.text || "Shop Now"}
                      href={data.buttons[0]?.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate(
                          data.buttons[0]?.id || "1",
                          text,
                          href
                        )
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className="rounded-none px-8 py-3 font-semibold transition-colors"
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.text,
                      }}
                      textPlaceholder="Button text..."
                      hrefPlaceholder="Enter URL..."
                    />
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      style={{ color: theme.colors.text }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex space-x-12 pt-8">
              <div>
                <EditableText
                  value={data.statsNumber || "788+"}
                  onChange={handleTextUpdate("statsNumber")}
                  as="div"
                  className="text-3xl font-bold"
                  style={{ color: theme.colors.text }}
                  isEditable={isEditable}
                  placeholder="788+"
                />
                <EditableText
                  value={data.statsLabel || "Furniture &\nHome Equipment"}
                  onChange={handleTextUpdate("statsLabel")}
                  as="div"
                  className="text-sm whitespace-pre-line"
                  style={{ color: "#6B7280" }}
                  isEditable={isEditable}
                  placeholder="Stats description..."
                  multiline={true}
                />
              </div>
              <div>
                <EditableText
                  value="8k+"
                  onChange={() => {}} // Static for now
                  as="div"
                  className="text-3xl font-bold"
                  style={{ color: theme.colors.text }}
                  isEditable={false}
                />
                <div className="text-sm" style={{ color: "#6B7280" }}>
                  Happy Clients
                  <br />
                  More of this
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Chair Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Main Chair Image */}
              {data.showImage && (
                <EditableImage
                  src={data.imageUrl || "/api/placeholder/500/500"}
                  alt={data.imageAlt || "Modern furniture piece"}
                  onImageChange={handleImageUpdate}
                  isEditable={isEditable}
                  className="relative z-10 h-auto w-[500px]"
                  width={500}
                  height={500}
                  placeholder={{
                    width: 500,
                    height: 500,
                    text: "Upload main product image",
                  }}
                />
              )}

              {/* Floor Lamp - Secondary Image */}
              <div className="absolute top-0 right-0 z-5">
                <EditableImage
                  src={data.secondaryImageUrl || "/api/placeholder/128/200"}
                  alt={data.secondaryImageAlt || "Decorative floor lamp"}
                  onImageChange={handleSecondaryImageUpdate}
                  isEditable={isEditable}
                  className="h-auto w-32"
                  width={128}
                  height={200}
                  placeholder={{
                    width: 128,
                    height: 200,
                    text: "Accent item",
                  }}
                />
              </div>

              {/* Plant - Third decorative element */}
              <div className="absolute bottom-10 left-0 z-5">
                <EditableImage
                  src="/api/placeholder/80/120"
                  alt="Decorative plant"
                  onImageChange={() => {}} // Static for now
                  isEditable={false}
                  className="h-auto w-20"
                  width={80}
                  height={120}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
