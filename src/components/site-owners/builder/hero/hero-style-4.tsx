"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
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

  // Get theme colors with updated structure, fallback to defaults if not available
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
        fontFamily: theme.fonts.body,
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
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="Enter main title..."
                />
                {/* Highlighted word - part of subtitle */}
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="div"
                  className="text-5xl leading-tight font-bold lg:text-7xl"
                  style={{
                    color: theme.colors.secondary,
                    fontFamily: theme.fonts.heading,
                  }}
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
                style={{
                  color: "#6B7280",
                  fontFamily: theme.fonts.body,
                }}
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />

              {/* CTA Button */}
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
                      className="rounded-none px-6 py-3 font-semibold transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                        fontFamily: theme.fonts.body,
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
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="788+"
                />
                <EditableText
                  value={data.statsLabel || "Happy clients"}
                  onChange={handleTextUpdate("statsLabel")}
                  as="div"
                  className="text-sm whitespace-pre-line"
                  style={{
                    color: "#6B7280",
                    fontFamily: theme.fonts.body,
                  }}
                  isEditable={isEditable}
                  placeholder="Stats description..."
                  multiline={true}
                />
              </div>
              <div>
                <EditableText
                  value={data.statsNumber || "8k+"}
                  onChange={handleTextUpdate("statsNumber")}
                  as="div"
                  className="text-3xl font-bold"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                  isEditable={isEditable}
                  placeholder="8k+"
                />
                <EditableText
                  value={data.statsLabel || "Projects completed"}
                  onChange={handleTextUpdate("statsLabel")}
                  as="div"
                  className="text-sm whitespace-pre-line"
                  style={{
                    color: "#6B7280",
                    fontFamily: theme.fonts.body,
                  }}
                  isEditable={isEditable}
                  placeholder="Second stats description..."
                  multiline={true}
                />
              </div>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Background decoration */}

              {/* Main Product Image */}
              {data.showImage && (
                <EditableImage
                  src={data.imageUrl || "/api/placeholder/500/500"}
                  alt={data.imageAlt || "Modern furniture piece"}
                  onImageChange={handleImageUpdate}
                  isEditable={isEditable}
                  className="relative z-10 h-auto w-[500px] rounded-lg shadow-2xl"
                  width={500}
                  height={500}
                  placeholder={{
                    width: 500,
                    height: 500,
                    text: "Upload main product image",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
