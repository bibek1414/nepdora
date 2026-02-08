"use client";

import React, { useState, useEffect } from "react";
import { OthersTemplate2Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { Globe, ChevronRight } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";

interface OthersTemplate2Props {
  othersData: OthersTemplate2Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate2Data>) => void;
}

export const OthersTemplate2: React.FC<OthersTemplate2Props> = ({
  othersData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();

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

  const {
    data,
    handleTextUpdate,
    handleButtonUpdate,
    getImageUrl,
    handleArrayItemUpdate,
  } = useBuilderLogic(othersData, onUpdate);

  const handleStatUpdate = (
    index: number,
    field: "value" | "label",
    value: string
  ) => {
    const newStats = [...data.statistics];
    newStats[index] = { ...newStats[index], [field]: value };
    onUpdate?.({ statistics: newStats });
  };

  // Default images for the gray areas
  const defaultLeftImage =
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2874&auto=format&fit=crop";
  const defaultRightImage =
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop";

  return (
    <section
      className="relative w-full overflow-hidden px-3 py-8 sm:px-6 sm:py-12 md:py-16 lg:px-8 lg:py-20"
      style={{
        backgroundColor:
          data.backgroundType === "color"
            ? data.backgroundColor
            : theme.colors.background,
        backgroundImage:
          data.backgroundType === "image"
            ? `url(${data.backgroundImageUrl})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column - Large Image */}
          <div className="lg:col-span-5">
            <div className="relative h-auto min-h-[300px] w-full sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
              <EditableImage
                src={getImageUrl(data.leftImage?.url || defaultLeftImage)}
                alt={data.leftImage?.alt || "Team collaboration"}
                isEditable={isEditable}
                onImageChange={(url, alt) =>
                  onUpdate?.({
                    leftImage: { url, alt: alt || data.leftImage.alt },
                  })
                }
                className="h-150 w-full rounded-2xl object-cover sm:rounded-3xl md:rounded-[2.5rem]"
                cloudinaryOptions={{
                  folder: "template-images",
                  resourceType: "image",
                }}
                disableImageChange={false}
                showAltEditor={isEditable}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:col-span-7">
            {/* Top Section: Text + Small Image */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {/* Text Content */}
              <div className="flex flex-col justify-center">
                {/* Icon */}
                <div className="mb-4 sm:mb-6">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20"
                    style={{ backgroundColor: "#84CC16" }}
                  >
                    <Globe
                      className="h-8 w-8 text-white sm:h-9 sm:w-9 md:h-10 md:w-10"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Heading */}
                <EditableText
                  value={data.heading || "Get our best offers quickly"}
                  onChange={handleTextUpdate("heading")}
                  isEditable={isEditable}
                  as="h2"
                  className="mb-3 text-xl leading-tight font-bold sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.primary,
                  }}
                />

                {/* Description */}
                <EditableText
                  value={
                    data.description ||
                    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy"
                  }
                  onChange={handleTextUpdate("description")}
                  isEditable={isEditable}
                  className="mb-6 text-xs text-gray-500 sm:mb-8 sm:text-sm md:text-base"
                />

                {/* Button */}
                {data.buttons.length > 0 && (
                  <div>
                    <EditableLink
                      text={data.buttons[0].text || "Contact us"}
                      href={data.buttons[0].href || "#"}
                      isEditable={isEditable}
                      siteUser={siteUser}
                      onChange={(text, href) =>
                        handleButtonUpdate("buttons")(
                          data.buttons[0].id,
                          text,
                          href
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all hover:bg-gray-50 sm:px-6 sm:py-2.5 sm:text-sm"
                      style={{
                        borderColor: "#E5E7EB",
                        color: theme.colors.primary,
                        backgroundColor: "white",
                      }}
                    >
                      {data.buttons[0].text || "Contact us"}
                      <ChevronRight className="h-4 w-4" />
                    </EditableLink>
                  </div>
                )}
              </div>

              {/* Right Small Image */}
              <div className="relative h-auto min-h-[250px] [clip-path:none] sm:min-h-[300px] md:[clip-path:polygon(0_0,100%_0,100%_100%,10%_100%)]">
                <EditableImage
                  src={getImageUrl(data.rightImage?.url || defaultRightImage)}
                  alt={data.rightImage?.alt || "Business meeting"}
                  isEditable={isEditable}
                  onImageChange={(url, alt) =>
                    onUpdate?.({
                      rightImage: { url, alt: alt || data.rightImage.alt },
                    })
                  }
                  className="h-85 w-full rounded-2xl object-cover sm:rounded-3xl md:rounded-[2.5rem]"
                  cloudinaryOptions={{
                    folder: "template-images",
                    resourceType: "image",
                  }}
                  disableImageChange={false}
                  showAltEditor={isEditable}
                />
              </div>
            </div>

            {/* Bottom Section: Statistics */}
            <div
              className="rounded-2xl px-4 py-6 shadow-sm sm:rounded-3xl sm:px-6 sm:py-8 md:rounded-[2.5rem] md:px-8 md:py-10"
              style={{ backgroundColor: "#84CC16" }}
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
                {data.statistics.map((stat, index) => (
                  <div key={stat.id} className="text-center">
                    <EditableText
                      value={
                        stat.value ||
                        (index === 0
                          ? "10k+"
                          : index === 1
                            ? "20+"
                            : index === 2
                              ? "5k+"
                              : "100+")
                      }
                      onChange={val => handleStatUpdate(index, "value", val)}
                      isEditable={isEditable}
                      as="h2"
                      className="mb-1 text-2xl leading-none font-bold sm:text-3xl md:text-4xl lg:text-5xl"
                      style={{ color: "#FFFFFF" }}
                    />
                    <EditableText
                      value={
                        stat.label ||
                        (index === 0
                          ? "Complete project"
                          : index === 1
                            ? "Team member"
                            : index === 2
                              ? "Winning award"
                              : "Complete project")
                      }
                      onChange={val => handleStatUpdate(index, "label", val)}
                      isEditable={isEditable}
                      as="p"
                      className="!text-[10px] font-medium sm:!text-xs md:text-sm"
                      style={{ color: "#FFFFFF", opacity: 0.9 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
